/**
 * Session strategy: short-lived signed JWT access token + long-lived opaque
 * refresh token, both delivered as httpOnly cookies (never exposed to JS,
 * so an XSS bug can't just read localStorage and exfiltrate the session).
 *
 * Access token: stateless JWT, verified on every request, ~15 min TTL.
 * Refresh token: random 384-bit value, stored ONLY as a SHA-256 hash in the
 * `refresh_tokens` table, rotated (old one revoked, new one issued) on every
 * use ("refresh token rotation"). This lets you detect token theft: if a
 * revoked refresh token is ever presented again, it's a signal the token was
 * stolen and replayed, and every session for that user can be revoked.
 */
const jwt = require('jsonwebtoken');
const { randomToken, sha256Hex } = require('./crypto');
const pool = require('../db/pool');

const ACCESS_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';

function accessTokenTTLSeconds() {
  const ttl = process.env.JWT_ACCESS_TTL || '15m';
  return ttl;
}

function refreshTokenTTLDays() {
  return Number(process.env.JWT_REFRESH_TTL_DAYS || 30);
}

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      type: 'access',
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: accessTokenTTLSeconds() }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

/** Issues a new refresh token, persists its hash, and returns the RAW token (only time it exists in cleartext). */
async function issueRefreshToken(userId, { userAgent, ipAddress, replacesTokenId = null } = {}) {
  const raw = randomToken(48);
  const tokenHash = sha256Hex(raw);
  const expiresAt = new Date(Date.now() + refreshTokenTTLDays() * 24 * 60 * 60 * 1000);

  const { rows } = await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, user_agent, ip_address, expires_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [userId, tokenHash, userAgent || null, ipAddress || null, expiresAt]
  );

  if (replacesTokenId) {
    await pool.query(
      `UPDATE refresh_tokens SET revoked_at = now(), replaced_by = $1 WHERE id = $2`,
      [rows[0].id, replacesTokenId]
    );
  }

  return raw;
}

/**
 * Validates a presented refresh token against the DB.
 * Returns { valid, userId, tokenRow } — never throws for "just invalid", only for real errors.
 * If a REVOKED token is presented (already rotated away), that's treated as a
 * possible theft/replay signal and ALL of that user's sessions are revoked.
 */
async function consumeRefreshToken(rawToken) {
  const tokenHash = sha256Hex(rawToken);
  const { rows } = await pool.query(
    `SELECT id, user_id, expires_at, revoked_at FROM refresh_tokens WHERE token_hash = $1`,
    [tokenHash]
  );

  if (rows.length === 0) {
    return { valid: false, reason: 'not_found' };
  }
  const row = rows[0];

  if (row.revoked_at) {
    // Replay of an already-rotated token: nuke every session for this user as a precaution.
    await pool.query(
      `UPDATE refresh_tokens SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL`,
      [row.user_id]
    );
    return { valid: false, reason: 'reused_revoked_token', userId: row.user_id };
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    return { valid: false, reason: 'expired' };
  }

  return { valid: true, userId: row.user_id, tokenRow: row };
}

async function revokeRefreshToken(rawToken) {
  const tokenHash = sha256Hex(rawToken);
  await pool.query(
    `UPDATE refresh_tokens SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL`,
    [tokenHash]
  );
}

async function revokeAllUserSessions(userId) {
  await pool.query(
    `UPDATE refresh_tokens SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL`,
    [userId]
  );
}

/** Shared cookie options. `secure` is forced on outside development. */
function baseCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax', // 'lax' allows the OAuth redirect flow to still carry cookies; combined with CSRF tokens for state-changing routes
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/',
  };
}

function setAuthCookies(res, { accessToken, refreshToken }) {
  res.cookie(ACCESS_COOKIE, accessToken, {
    ...baseCookieOptions(),
    maxAge: 15 * 60 * 1000, // mirrors JWT_ACCESS_TTL default; cookie expiry is just cleanup, JWT exp is the real enforcement
  });
  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...baseCookieOptions(),
    maxAge: refreshTokenTTLDays() * 24 * 60 * 60 * 1000,
    path: '/api/auth', // refresh cookie only ever needs to be sent to auth endpoints
  });
}

function clearAuthCookies(res) {
  res.clearCookie(ACCESS_COOKIE, baseCookieOptions());
  res.clearCookie(REFRESH_COOKIE, { ...baseCookieOptions(), path: '/api/auth' });
}

module.exports = {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  signAccessToken,
  verifyAccessToken,
  issueRefreshToken,
  consumeRefreshToken,
  revokeRefreshToken,
  revokeAllUserSessions,
  setAuthCookies,
  clearAuthCookies,
};
