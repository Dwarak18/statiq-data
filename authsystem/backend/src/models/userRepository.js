/**
 * All reads/writes of user PII go through here, so encryption/decryption and
 * hashing happen in exactly one place instead of being sprinkled through routes.
 */
const pool = require('../db/pool');
const { encryptPII, decryptPII, normalizeEmail, hmacLookup } = require('../utils/crypto');

/** Strips internal-only fields and decrypts PII before handing a user object to a route/response. */
function toPublicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: decryptPII(row.email_encrypted),
    displayName: row.display_name_encrypted ? decryptPII(row.display_name_encrypted) : null,
    role: row.role,
    provider: row.provider,
    isEmailVerified: row.is_email_verified,
    subscriptionTier: row.subscription_tier || 'free',
    subscriptionStatus: row.subscription_status || 'active',
    subscriptionExpiresAt: row.subscription_expires_at || null,
    monthlyPdfCount: row.monthly_pdf_count || 0,
    pdfCountResetAt: row.pdf_count_reset_at || null,
    createdAt: row.created_at,
  };
}

async function findByEmail(email) {
  const emailHash = hmacLookup(normalizeEmail(email));
  const { rows } = await pool.query('SELECT * FROM users WHERE email_hash = $1', [emailHash]);
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0] || null;
}

async function findByProviderAccount(provider, providerAccountId) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE provider = $1 AND provider_account_id = $2',
    [provider, providerAccountId]
  );
  return rows[0] || null;
}

async function createLocalUser({ email, displayName, passwordHash }) {
  const normalized = normalizeEmail(email);
  const emailEncrypted = encryptPII(normalized);
  const emailHash = hmacLookup(normalized);
  const displayNameEncrypted = displayName ? encryptPII(displayName) : null;
  const emailLast4 = normalized.slice(-4);

  const { rows } = await pool.query(
    `INSERT INTO users (email_encrypted, email_hash, email_last4, display_name_encrypted, password_hash, provider)
     VALUES ($1, $2, $3, $4, $5, 'local')
     RETURNING *`,
    [emailEncrypted, emailHash, emailLast4, displayNameEncrypted, passwordHash]
  );
  return rows[0];
}

async function createOAuthUser({ email, displayName, provider, providerAccountId }) {
  const normalized = normalizeEmail(email);
  const emailEncrypted = encryptPII(normalized);
  const emailHash = hmacLookup(normalized);
  const displayNameEncrypted = displayName ? encryptPII(displayName) : null;
  const emailLast4 = normalized.slice(-4);

  const { rows } = await pool.query(
    `INSERT INTO users (email_encrypted, email_hash, email_last4, display_name_encrypted, provider, provider_account_id, is_email_verified)
     VALUES ($1, $2, $3, $4, $5, $6, TRUE)
     RETURNING *`,
    [emailEncrypted, emailHash, emailLast4, displayNameEncrypted, provider, providerAccountId]
  );
  return rows[0];
}

async function recordFailedLogin(userId) {
  // Lock the account for 15 minutes after 5 consecutive failures (basic brute-force mitigation;
  // pair this with rate limiting at the network layer, which is applied separately).
  await pool.query(
    `UPDATE users
     SET failed_login_attempts = failed_login_attempts + 1,
         locked_until = CASE WHEN failed_login_attempts + 1 >= 5
                              THEN now() + interval '15 minutes'
                              ELSE locked_until END
     WHERE id = $1`,
    [userId]
  );
}

async function resetFailedLogins(userId) {
  await pool.query(
    `UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = $1`,
    [userId]
  );
}

async function setRole(userId, role) {
  const { rows } = await pool.query(
    `UPDATE users SET role = $1 WHERE id = $2 RETURNING *`,
    [role, userId]
  );
  return rows[0] || null;
}

module.exports = {
  toPublicUser,
  findByEmail,
  findById,
  findByProviderAccount,
  createLocalUser,
  createOAuthUser,
  recordFailedLogin,
  resetFailedLogins,
  setRole,
};
