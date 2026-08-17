const rateLimit = require('express-rate-limit');

/** Tight limit on the auth endpoints attackers care most about (login, signup). */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 attempts / 15 min / IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'too_many_requests', message: 'Too many attempts. Please try again later.' },
});

/** Looser general API limit as a backstop. */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, generalLimiter };
