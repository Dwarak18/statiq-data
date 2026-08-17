/**
 * Stateless OAuth CSRF state store using a signed, short-lived httpOnly cookie.
 *
 * passport-oauth2's default state store writes the generated `state` value
 * into req.session, which requires express-session. This project deliberately
 * avoids express-session (sessions are replaced by JWT/refresh-token cookies).
 *
 * This store instead:
 *   1. On `store()`: HMAC-signs the state string and sets an httpOnly cookie.
 *   2. On `verify()`: reads the cookie, re-derives the HMAC, timing-safe
 *      compares, then clears the cookie.
 *
 * Security properties:
 *   - httpOnly + SameSite=Lax prevents JS read and most CSRF vectors.
 *   - The HMAC signature (keyed with JWT_ACCESS_SECRET) prevents forgery.
 *   - crypto.timingSafeEqual prevents timing-oracle attacks on the signature.
 *   - The cookie is single-use: cleared immediately after a successful verify.
 *   - 10-minute TTL matches a typical OAuth round-trip with headroom.
 */
const crypto = require('crypto');

const OAUTH_STATE_COOKIE = 'oauth_state';
const TTL_MS = 10 * 60 * 1000; // 10 minutes

function sign(state) {
  return crypto
    .createHmac('sha256', process.env.JWT_ACCESS_SECRET)
    .update(state)
    .digest('base64url');
}

class CookieStateStore {
  /**
   * Called by passport-oauth2 before redirecting to the provider.
   * Receives the generated random `state` string and must persist it somehow.
   */
  store(req, state, meta, callback) {
    const sig = sign(state);
    const cookieValue = `${state}.${sig}`;

    // passport-oauth2 calls store() before the response has been sent, so
    // req.res is the live response object we can write cookies to.
    const res = req.res;
    res.cookie(OAUTH_STATE_COOKIE, cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: process.env.COOKIE_DOMAIN || undefined,
      path: '/',
      maxAge: TTL_MS,
    });

    callback(null);
  }

  /**
   * Called by passport-oauth2 on the callback route.
   * Must verify that `providedState` (from the provider query param) matches
   * what we stored, then signal success or failure via callback.
   *
   * callback(err, ok, info)
   *   err      – unexpected internal error
   *   ok       – boolean; false triggers a 401 from passport
   *   info     – object with { message } for logging
   */
  verify(req, providedState, meta, callback) {
    const cookieValue = req.cookies && req.cookies[OAUTH_STATE_COOKIE];

    if (!cookieValue) {
      return callback(null, false, { message: 'OAuth state cookie is missing. The request may have expired or been tampered with.' });
    }

    // Cookie format: "<state>.<base64url-sig>"
    const dotIdx = cookieValue.lastIndexOf('.');
    if (dotIdx < 1) {
      return callback(null, false, { message: 'OAuth state cookie is malformed.' });
    }

    const storedState = cookieValue.slice(0, dotIdx);
    const storedSig   = cookieValue.slice(dotIdx + 1);
    const expectedSig = sign(storedState);

    // Timing-safe comparison of the HMAC signatures.
    let sigValid = false;
    try {
      const a = Buffer.from(storedSig,   'base64url');
      const b = Buffer.from(expectedSig, 'base64url');
      sigValid = a.length === b.length && crypto.timingSafeEqual(a, b);
    } catch {
      sigValid = false;
    }

    if (!sigValid) {
      return callback(null, false, { message: 'OAuth state signature is invalid.' });
    }

    if (storedState !== providedState) {
      return callback(null, false, { message: 'OAuth state parameter mismatch.' });
    }

    // State is valid and consumed — clear the cookie immediately.
    req.res.clearCookie(OAUTH_STATE_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: process.env.COOKIE_DOMAIN || undefined,
      path: '/',
    });

    callback(null, true);
  }
}

module.exports = { CookieStateStore };
