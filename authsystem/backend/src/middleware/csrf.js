/**
 * Double-submit cookie CSRF protection.
 *
 * Because auth state lives in httpOnly cookies (immune to JS reads, but the
 * browser still attaches them automatically to any cross-site request),
 * SameSite=Lax alone is good but not sufficient defense-in-depth for
 * state-changing routes. We issue a non-httpOnly `csrf_token` cookie the
 * frontend JS CAN read, and require it to be echoed back in an
 * `X-CSRF-Token` header on POST/PUT/PATCH/DELETE. A cross-site attacker can
 * make the browser send cookies, but can't read the csrf cookie's value to
 * put it in the header (same-origin policy), so the request fails.
 */
const crypto = require('crypto');

const CSRF_COOKIE = 'csrf_token';

function issueCsrfCookie(req, res) {
  const token = crypto.randomBytes(32).toString('base64url');
  res.cookie(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/',
  });
  return token;
}

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function verifyCsrf(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();

  const cookieToken = req.cookies ? req.cookies[CSRF_COOKIE] : null;
  const headerToken = req.get('X-CSRF-Token');

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ error: 'csrf_validation_failed', message: 'Missing or invalid CSRF token.' });
  }
  return next();
}

module.exports = { CSRF_COOKIE, issueCsrfCookie, verifyCsrf };
