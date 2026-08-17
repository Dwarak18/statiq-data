/**
 * STATIQONE Global Insurance Intelligence - News Routes
 * Endpoints:
 *   - GET  /api/news               (or /api/news/insurance): Filtered news feed with tier-gating
 *   - GET  /api/news/sources       : Status of all 4 feeds & last refreshed timestamp
 *   - POST /api/news/refresh       : Admin/system trigger for immediate multi-feed aggregation
 */

const express = require('express');
const router = express.Router();
const newsService = require('../services/newsService');
const { verifyAccessToken, ACCESS_COOKIE } = require('../utils/tokens');

// Optional auth extractor (does not reject if unauthenticated, sets req.user if token present)
function optionalAuth(req, res, next) {
  let token = req.cookies ? req.cookies[ACCESS_COOKIE] : null;
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      token = parts[1];
    }
  }

  if (token) {
    try {
      const payload = verifyAccessToken(token);
      req.user = {
        id: payload.sub,
        role: payload.role || 'user',
        tier: payload.tier || payload.subscriptionTier || 'free',
      };
    } catch (err) {
      // Ignored for public routes; falls back to free tier
      req.user = null;
    }
  }
  next();
}

/**
 * GET /api/news & GET /api/news/insurance
 * Query Parameters:
 *   - region: 'all' | 'USA' | 'Europe' | 'Asia' | 'Global'
 *   - source: 'all' | 'IJ' | 'RN' | 'TI' | 'BI'
 *   - search: string keyword
 *   - limit: integer (default 20, max 100)
 *   - offset: integer (default 0)
 *   - page: integer (default 1)
 */
async function handleGetNews(req, res, next) {
  try {
    const { region = 'all', source = 'all', search = '', limit = 20, offset = 0, page = 1 } = req.query;

    const userTier = req.user ? (req.user.tier || (req.user.role === 'admin' ? 'annual' : 'free')) : 'free';
    const userRole = req.user ? req.user.role : 'user';

    const result = await newsService.getNewsArticles({
      region,
      source,
      search,
      limit,
      offset,
      page,
      userTier,
      userRole,
    });

    return res.json(result);
  } catch (err) {
    next(err);
  }
}

router.get('/', optionalAuth, handleGetNews);
router.get('/insurance', optionalAuth, handleGetNews);

/**
 * GET /api/news/sources
 * Returns health, status, article count, and last refreshed timestamp of each feed.
 */
router.get('/sources', (req, res) => {
  try {
    const status = newsService.getSourcesStatus();
    return res.json(status);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/news/refresh
 * Triggers manual immediate multi-feed aggregation.
 */
router.post('/refresh', async (req, res, next) => {
  try {
    const refreshResult = await newsService.fetchAndCacheAllFeeds();
    return res.json(refreshResult);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
