/**
 * STATIQONE PDF Report API Routes
 * Endpoints for Requirement R3 (AI-Analysed PDF Report Generation):
 * - POST /api/reports/generate : Generates binary PDF stream with tier/quota checks
 * - GET  /api/reports/quota    : Returns user subscription tier and remaining PDF quota
 * - GET  /api/reports/history  : Returns user report generation history
 * - GET  /api/reports/sample   : Generates sample watermarked report for preview
 */

const express = require('express');
const router = express.Router();
const reportService = require('../services/reportService');
let userRepository = null;
try {
  userRepository = require('../models/userRepository');
} catch (err) {
  // Graceful fallback when DB is not configured
}

let verifyAccessToken = null;
let ACCESS_COOKIE = 'access_token';
try {
  const tokens = require('../utils/tokens');
  verifyAccessToken = tokens.verifyAccessToken;
  ACCESS_COOKIE = tokens.ACCESS_COOKIE || 'access_token';
} catch (err) {
  const jwt = require('jsonwebtoken');
  verifyAccessToken = (t) => jwt.verify(t, process.env.JWT_ACCESS_SECRET || 'test_secret');
}

/**
 * Authentication extractor middleware that checks httpOnly cookie or Authorization Bearer header.
 */
async function extractUser(req, res, next) {
  // If req.user is already set by upstream middleware, preserve it
  if (req.user && req.user.id) {
    return next();
  }

  let token = req.cookies ? req.cookies[ACCESS_COOKIE] : null;

  if (!token && req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      token = parts[1];
    }
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = verifyAccessToken ? verifyAccessToken(token) : null;
    if (!payload) {
      req.user = null;
      return next();
    }
    const dbUser = userRepository ? await userRepository.findById(payload.sub).catch(() => null) : null;

    req.user = {
      id: payload.sub,
      role: dbUser?.role || payload.role || 'user',
      email: dbUser?.email_encrypted && userRepository ? userRepository.toPublicUser(dbUser)?.email : 'subscriber@statiqone.com',
      displayName: dbUser?.display_name_encrypted && userRepository ? userRepository.toPublicUser(dbUser)?.displayName : 'Institutional User',
      subscriptionTier: dbUser?.subscription_tier || (payload.role === 'admin' ? 'annual' : 'free'),
      monthlyPdfCount: dbUser?.monthly_pdf_count || 0,
    };
    return next();
  } catch (err) {
    req.user = null;
    return next();
  }
}

/**
 * Authentication Guard for mutating report generation
 */
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: 'not_authenticated',
      message: 'Authentication is required to generate institutional PDF reports.',
      upgradeUrl: '/login',
    });
  }
  next();
}

router.use(extractUser);

/**
 * GET /api/reports/quota
 * Returns remaining monthly PDF report count and subscription tier.
 */
router.get('/quota', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.json({
        tier: 'free',
        monthlyQuota: 0,
        usedThisMonth: 0,
        remaining: 0,
        isUnlimited: false,
        canGenerate: false,
        upgradeUrl: '/pricing',
        reason: 'Please log in with an Institutional subscription to generate reports.',
      });
    }

    const quota = await reportService.getUserReportQuota(req.user);
    return res.json({
      ...quota,
      user: {
        id: req.user.id,
        email: req.user.email,
        displayName: req.user.displayName,
      },
      upgradeUrl: '/pricing',
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * POST /api/reports/generate
 * Generates institutional binary PDF stream.
 * Checks user tier & quota (Monthly: 5/month, Annual: unlimited, Free: 403 Upgrade CTA).
 */
router.post('/generate', requireAuth, async (req, res, next) => {
  try {
    const { reportType = 'full_market', customTitle, focus } = req.body || {};

    // 1. Enforce Tier & Quota
    try {
      await reportService.enforceAndConsumeQuota(req.user);
    } catch (quotaErr) {
      return res.status(403).json({
        error: 'quota_exceeded',
        message: quotaErr.message || 'PDF report quota exceeded. Please upgrade your subscription tier.',
        quota: quotaErr.quota || (await reportService.getUserReportQuota(req.user)),
        upgradeUrl: '/pricing',
      });
    }

    // 2. Generate Institutional PDF
    const result = await reportService.generateInstitutionalPdf({
      reportType,
      user: req.user,
      customOptions: { customTitle, focus },
    });

    const filename = `STATIQONE_Market_Report_${reportType}_${Date.now()}.pdf`;

    // 3. Set Binary Stream Headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', result.buffer.length);
    res.setHeader('X-Document-Id', result.documentId);
    res.setHeader('X-Generation-Ms', String(result.generationMs));

    return res.send(result.buffer);
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /api/reports/history
 * Returns user's generated PDF reports history.
 */
router.get('/history', requireAuth, async (req, res, next) => {
  try {
    const history = await reportService.getUserReportHistory(req.user.id);
    return res.json({
      success: true,
      history,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /api/reports/sample
 * Generates a sample institutional PDF for unauthenticated preview.
 */
router.get('/sample', async (req, res, next) => {
  try {
    const sampleUser = {
      id: 'usr_sample_preview',
      displayName: 'Sample Institutional Preview',
      email: 'preview@statiqone.com',
      subscriptionTier: 'annual',
    };

    const result = await reportService.generateInstitutionalPdf({
      reportType: 'full_market',
      user: sampleUser,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="STATIQONE_Sample_Market_Report.pdf"`);
    res.setHeader('Content-Length', result.buffer.length);

    return res.send(result.buffer);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
