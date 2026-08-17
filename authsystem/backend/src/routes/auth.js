const express = require('express');
const passport = require('passport');
const validator = require('validator');

const userRepository = require('../models/userRepository');
const { hashPassword, verifyPassword, validatePasswordStrength } = require('../utils/password');
const {
  signAccessToken,
  issueRefreshToken,
  consumeRefreshToken,
  revokeRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  REFRESH_COOKIE,
} = require('../utils/tokens');
const { requireAuth } = require('../middleware/auth');
const { issueCsrfCookie } = require('../middleware/csrf');

const router = express.Router();

function clientMeta(req) {
  return { userAgent: req.get('User-Agent'), ipAddress: req.ip };
}

async function issueSessionForUser(req, res, user) {
  const accessToken = signAccessToken(user);
  const refreshToken = await issueRefreshToken(user.id, clientMeta(req));
  setAuthCookies(res, { accessToken, refreshToken });
  issueCsrfCookie(req, res);
}

/* ------------------------------------------------------------------ */
/* Signup                                                              */
/* ------------------------------------------------------------------ */
router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, displayName } = req.body || {};

    if (!email || typeof email !== 'string' || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'invalid_email', message: 'A valid email address is required.' });
    }
    const passwordErrors = validatePasswordStrength(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ error: 'weak_password', message: passwordErrors.join(' ') });
    }
    if (displayName !== undefined && (typeof displayName !== 'string' || displayName.length > 100)) {
      return res.status(400).json({ error: 'invalid_display_name', message: 'Display name must be a string under 100 characters.' });
    }

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      // Deliberately generic message: don't confirm/deny account existence to an
      // unauthenticated caller beyond what's necessary (mitigates user enumeration).
      return res.status(409).json({ error: 'account_exists', message: 'Could not create account with the provided details.' });
    }

    const passwordHash = await hashPassword(password);
    const user = await userRepository.createLocalUser({
      email,
      displayName: displayName ? displayName.trim() : null,
      passwordHash,
    });

    await issueSessionForUser(req, res, user);
    return res.status(201).json({ user: userRepository.toPublicUser(user) });
  } catch (err) {
    return next(err);
  }
});

/* ------------------------------------------------------------------ */
/* Login                                                               */
/* ------------------------------------------------------------------ */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'invalid_request', message: 'Email and password are required.' });
    }

    const user = await userRepository.findByEmail(email);

    // Generic "invalid credentials" response regardless of which check fails,
    // to avoid leaking whether an email is registered (user enumeration).
    const genericFail = () => res.status(401).json({ error: 'invalid_credentials', message: 'Incorrect email or password.' });

    if (!user || !user.password_hash) {
      // Still run a hash verify against a dummy value to keep response timing
      // similar whether or not the account exists (mitigates timing-based enumeration).
      await verifyPassword('$argon2id$v=19$m=19456,t=2,p=1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', password);
      return genericFail();
    }

    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return res.status(423).json({ error: 'account_locked', message: 'Too many failed attempts. Try again later.' });
    }

    const validPassword = await verifyPassword(user.password_hash, password);
    if (!validPassword) {
      await userRepository.recordFailedLogin(user.id);
      return genericFail();
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'account_disabled', message: 'This account has been disabled.' });
    }

    await userRepository.resetFailedLogins(user.id);
    await issueSessionForUser(req, res, user);
    return res.json({ user: userRepository.toPublicUser(user) });
  } catch (err) {
    return next(err);
  }
});

/* ------------------------------------------------------------------ */
/* Refresh — rotates the refresh token and issues a new access token   */
/* ------------------------------------------------------------------ */
router.post('/refresh', async (req, res, next) => {
  try {
    const raw = req.cookies ? req.cookies[REFRESH_COOKIE] : null;
    if (!raw) {
      return res.status(401).json({ error: 'no_refresh_token', message: 'No refresh token present.' });
    }

    const result = await consumeRefreshToken(raw);
    if (!result.valid) {
      clearAuthCookies(res);
      return res.status(401).json({ error: 'invalid_refresh_token', message: 'Session expired, please log in again.' });
    }

    const user = await userRepository.findById(result.userId);
    if (!user || !user.is_active) {
      clearAuthCookies(res);
      return res.status(401).json({ error: 'account_inactive' });
    }

    const accessToken = signAccessToken(user);
    const newRefreshToken = await issueRefreshToken(user.id, {
      ...clientMeta(req),
      replacesTokenId: result.tokenRow.id,
    });
    setAuthCookies(res, { accessToken, refreshToken: newRefreshToken });

    return res.json({ user: userRepository.toPublicUser(user) });
  } catch (err) {
    return next(err);
  }
});

/* ------------------------------------------------------------------ */
/* Logout                                                              */
/* ------------------------------------------------------------------ */
router.post('/logout', async (req, res, next) => {
  try {
    const raw = req.cookies ? req.cookies[REFRESH_COOKIE] : null;
    if (raw) {
      await revokeRefreshToken(raw);
    }
    clearAuthCookies(res);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

/* ------------------------------------------------------------------ */
/* Current user                                                        */
/* ------------------------------------------------------------------ */
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'not_found' });
    return res.json({ user: userRepository.toPublicUser(user) });
  } catch (err) {
    return next(err);
  }
});

function getAppOrigin(req) {
  return process.env.APP_ORIGIN || (req ? `${req.protocol}://${req.get('host')}` : 'http://localhost:3000');
}

/* ------------------------------------------------------------------ */
/* Google OAuth 2.0                                                    */
/* ------------------------------------------------------------------ */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', (req, res, next) => {
  const origin = getAppOrigin(req);
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${origin}/login?error=google_auth_failed`,
  })(req, res, async (err) => {
    if (err) return next(err);
    try {
      await issueSessionForUser(req, res, req.user); // req.user was set by passport strategy done(null, user)
      return res.redirect(`${origin}/dashboard`);
    } catch (err) {
      return next(err);
    }
  });
});

/* ------------------------------------------------------------------ */
/* Microsoft OAuth 2.0                                                 */
/* ------------------------------------------------------------------ */
router.get('/microsoft', passport.authenticate('microsoft'));

router.get('/microsoft/callback', (req, res, next) => {
  const origin = getAppOrigin(req);
  passport.authenticate('microsoft', {
    session: false,
    failureRedirect: `${origin}/login?error=microsoft_auth_failed`,
  })(req, res, async (err) => {
    if (err) return next(err);
    try {
      await issueSessionForUser(req, res, req.user);
      return res.redirect(`${origin}/dashboard`);
    } catch (err) {
      return next(err);
    }
  });
});

// Surface the EMAIL_ALREADY_REGISTERED case (and other OAuth errors) as a redirect
// with an error code the frontend can render, instead of a raw 500.
router.use((err, req, res, next) => {
  const origin = getAppOrigin(req);
  if (err && err.code === 'EMAIL_ALREADY_REGISTERED') {
    return res.redirect(`${origin}/login?error=email_already_registered`);
  }
  if (err && (err.name === 'TokenError' || err.name === 'InternalOAuthError' || err.name === 'AuthenticationError')) {
    return res.redirect(`${origin}/login?error=oauth_error`);
  }
  return next(err);
});

module.exports = router;
