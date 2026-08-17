require('dotenv').config();

const REQUIRED_ENV = [
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'PII_ENCRYPTION_KEY',
  'PII_HMAC_KEY',
];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  console.error('Copy backend/.env.example to backend/.env and fill it in.');
  process.exit(1);
}

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

const { configurePassport } = require('./config/passport');
const { generalLimiter, authLimiter } = require('./middleware/rateLimit');
const { verifyCsrf, issueCsrfCookie } = require('./middleware/csrf');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payments');
const stockRoutes = require('./routes/stocks');
const newsRoutes = require('./routes/news');
const reportRoutes = require('./routes/reports');
const healthRoutes = require('./routes/health');

const app = express();

// Trust the first proxy hop (needed for correct req.ip / rate limiting behind a load balancer).
app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginResourcePolicy: { policy: 'same-site' },
  })
);

app.use(
  cors({
    origin: process.env.APP_ORIGIN || true,
    credentials: true, // required so the browser sends/receives the httpOnly auth cookies
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'Authorization'],
  })
);

app.use(express.json({ limit: '32kb' })); // small body limit; auth payloads are tiny
app.use(express.urlencoded({ extended: true, limit: '64kb' })); // support URL-encoded form POSTs (e.g. CCAvenue callback)
app.use(cookieParser());

// Mount session middleware before passport to support state: true in OAuth 2.0 flows
app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.JWT_ACCESS_SECRET || 'statiqone-oauth-transient-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000, // 10 minutes (transient state for OAuth handshake)
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
configurePassport();

app.use(generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);

// Health inspection endpoint (performs database connectivity and latency checks)
app.use('/api/health', healthRoutes);

// Mount paymentRoutes before verifyCsrf so external callbacks (e.g. /api/payments/ccavenue/callback, webhooks) bypass CSRF checking cleanly.
// Sensitive endpoints requiring user session/auth enforce requirePaymentAuth token verification.
app.use('/api/payments', paymentRoutes);

// CSRF check applies to all state-changing API routes except OAuth redirect
// entry points and payment callbacks/webhooks.
app.use('/api', verifyCsrf);

// The frontend calls this once on load (e.g. when the login/signup page mounts) to
// obtain a CSRF cookie+token pair BEFORE the user has any session, so the very
// first POST /api/auth/signup or /login request already carries a valid X-CSRF-Token.
app.get('/api/csrf-token', (req, res) => {
  const token = issueCsrfCookie(req, res);
  res.json({ csrfToken: token });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/reports', reportRoutes);

// 404 handler
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'not_found' });
});

// Centralized error handler — never leak stack traces / internals to the client.
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: 'internal_error',
    message: status === 500 ? 'Something went wrong.' : err.message,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Auth backend listening on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});
