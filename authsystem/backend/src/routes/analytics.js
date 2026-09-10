/**
 * Read-only analytics views assembled from the existing market data service.
 * Expensive ingestion remains owned by stockService's cache/sync layer; this
 * route only shapes bounded data for the dashboard.
 */

const express = require('express');
const router = express.Router();
const stockService = require('../services/stockService');

router.get('/overview', async (req, res, next) => {
  try {
    const [screener, movers, sectors] = await Promise.all([
      stockService.getScreenerQuotes({
        exchange: req.query.exchange || 'all',
        limit: 100,
        page: 1,
        sortBy: 'marketCap',
        sortOrder: 'desc',
      }),
      stockService.getMarketMovers(),
      stockService.getAvailableSectors(),
    ]);

    const quotes = screener.data || [];
    const totalMarketCap = quotes.reduce((sum, quote) => sum + Number(quote.marketCap || 0), 0);
    const averageChange =
      quotes.length > 0
        ? quotes.reduce((sum, quote) => sum + Number(quote.changePercent || 0), 0) / quotes.length
        : 0;

    res.json({
      success: true,
      generatedAt: new Date().toISOString(),
      marketStatus: screener.marketStatus,
      summary: {
        trackedSymbols: screener.pagination?.total || quotes.length,
        totalMarketCap,
        averageChangePercent: Number(averageChange.toFixed(2)),
        sectorCount: sectors.data?.length || 0,
      },
      sectors: sectors.data || [],
      movers: {
        topGainers: movers.topGainers || [],
        topLosers: movers.topLosers || [],
        mostActive: movers.mostActive || [],
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
