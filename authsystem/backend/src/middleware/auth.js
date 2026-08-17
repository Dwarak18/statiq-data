const { verifyAccessToken, ACCESS_COOKIE } = require('../utils/tokens');
const userRepository = require('../models/userRepository');

/**
 * Verifies the access token cookie and attaches `req.user` ({ id, role }).
 * Does NOT hit the database on every request (that's the point of a stateless
 * JWT) — routes that need fresh user data call userRepository themselves.
 */
async function requireAuth(req, res, next) {
  const token = req.cookies ? req.cookies[ACCESS_COOKIE] : null;
  if (!token) {
    return res.status(401).json({ error: 'not_authenticated', message: 'Login required.' });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'token_expired', message: 'Access token expired. Refresh your session.' });
    }
    return res.status(401).json({ error: 'invalid_token', message: 'Invalid access token.' });
  }
}

/**
 * Role-gate factory. Usage: router.get('/admin/x', requireAuth, requireRole('admin'), handler)
 * Always compose AFTER requireAuth so req.user is populated.
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'not_authenticated', message: 'Login required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'forbidden', message: 'You do not have permission to access this resource.' });
    }
    return next();
  };
}

/**
 * Defense-in-depth: re-checks the user's role/active status against the DB
 * instead of trusting the JWT claim. Use on the most sensitive admin routes
 * (e.g. anything that mutates other users), since a JWT issued before a role
 * downgrade is still "valid" for its remaining TTL otherwise.
 */
function requireFreshRole(...allowedRoles) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'not_authenticated' });
    }
    const dbUser = await userRepository.findById(req.user.id);
    if (!dbUser || !dbUser.is_active) {
      return res.status(401).json({ error: 'account_inactive' });
    }
    if (!allowedRoles.includes(dbUser.role)) {
      return res.status(403).json({ error: 'forbidden' });
    }
    req.user.role = dbUser.role; // sync in case it drifted from the JWT claim
    return next();
  };
}

module.exports = { requireAuth, requireRole, requireFreshRole };
