/**
 * STATIQONE Stock Screener & Market Intelligence API Routes
 * Endpoints for live multi-market screener, movers, detail, and cache control.
 */

const express = require('express');
const router = express.Router();
const stockService = require('../services/stockService');

/**
 * GET /api/stocks/screener
 * Query params:
 *   - exchange: 'all' | 'NASDAQ' | 'NSE'
 *   - sector: string or comma-separated list
 *   - minMarketCap, maxMarketCap: number
 *   - minPE, maxPE: number
 *   - minChange, maxChange: number
 *   - minVolume: number
 *   - search: string
 *   - sortBy: 'marketCap' | 'changePercent' | 'peRatio' | 'price' | 'volume' | 'symbol' | 'name'
 *   - sortOrder: 'asc' | 'desc'
 *   - page: number
 *   - limit: number
 */
router.get('/screener', async (req, res, next) => {
  try {
    const result = await stockService.getScreenerQuotes(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/stocks/movers
 * Returns top gainers, top losers, and most active stocks across markets.
 */
router.get('/movers', async (req, res, next) => {
  try {
    const result = await stockService.getMarketMovers();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/stocks/sectors
 * Returns distinct sectors and stock counts.
 */
router.get('/sectors', async (req, res, next) => {
  try {
    const result = await stockService.getAvailableSectors();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/stocks/refresh
 * Forces immediate cache re-synchronization with live markets.
 */
router.post('/refresh', async (req, res, next) => {
  try {
    await stockService.syncQuotesFromLive(true);
    const result = await stockService.getScreenerQuotes(req.query);
    res.json({
      success: true,
      message: 'Market cache refreshed successfully',
      marketStatus: result.marketStatus,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/stocks/:symbol
 * Detailed quote, profile, valuation category, and 24-point intraday sparkline.
 */
router.get('/:symbol', async (req, res, next) => {
  try {
    const result = await stockService.getStockDetail(req.params.symbol);
    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.error || 'Symbol not found',
      });
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
