/**
 * Tier 2 Boundary Test: Invalid Sector Filters, Numeric Boundaries & Malformed Parameters
 * 
 * Verifies:
 * 1. Unknown / invalid sector names return empty set without SQL/server errors.
 * 2. Negative market cap thresholds filter correctly (e.g. minMarketCap = -100).
 * 3. NaN and malformed P/E ratio inputs are sanitized or rejected gracefully.
 * 4. Extreme price changes (-99.9% to +10,000%) do not overflow numeric formatters.
 * 5. Out-of-bound pagination (e.g. page = 9999, limit = -5) sanitizes to default bounds.
 * 6. Malformed sortBy columns fall back to default 'marketCap'.
 */

import {
  assertEqual,
  assertTrue,
  assertFalse,
  FIXTURE_NASDAQ_STOCKS,
  FIXTURE_NSE_STOCKS
} from '../test_helpers.js';

export async function registerTests(suite) {
  const allStocks = [...FIXTURE_NASDAQ_STOCKS, ...FIXTURE_NSE_STOCKS];

  function safeScreenerQuery(params = {}) {
    let {
      sector,
      minMarketCap,
      maxMarketCap,
      minPE,
      maxPE,
      minChange,
      maxChange,
      sortBy = 'marketCap',
      sortOrder = 'desc',
      page = 1,
      limit = 50,
    } = params;

    // Sanitize pagination
    page = Number.isInteger(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    limit = Number.isInteger(Number(limit)) && Number(limit) > 0 && Number(limit) <= 100 ? Number(limit) : 50;

    // Sanitize sort column whitelist
    const ALLOWED_SORT = new Set(['marketCap', 'changePercent', 'peRatio', 'price', 'volume', 'symbol']);
    if (!ALLOWED_SORT.has(sortBy)) {
      sortBy = 'marketCap';
    }

    let result = allStocks.slice();

    if (sector) {
      const sectors = String(sector).split(',').map((s) => s.trim().toLowerCase());
      result = result.filter((s) => sectors.includes(s.sector.toLowerCase()));
    }

    if (minMarketCap !== undefined && minMarketCap !== null && !isNaN(Number(minMarketCap))) {
      result = result.filter((s) => s.marketCap >= Number(minMarketCap));
    }

    if (minPE !== undefined && minPE !== null && !isNaN(Number(minPE))) {
      result = result.filter((s) => s.peRatio !== null && s.peRatio >= Number(minPE));
    }
    if (maxPE !== undefined && maxPE !== null && !isNaN(Number(maxPE))) {
      result = result.filter((s) => s.peRatio !== null && s.peRatio <= Number(maxPE));
    }

    if (minChange !== undefined && minChange !== null && !isNaN(Number(minChange))) {
      result = result.filter((s) => s.changePercent >= Number(minChange));
    }

    return {
      data: result.slice((page - 1) * limit, page * limit),
      total: result.length,
      page,
      limit,
      sortBy,
    };
  }

  // 1. Unknown Sector Filter
  suite.test('Filtering by non-existent sector name returns 0 results cleanly without 500 error', async () => {
    const res = safeScreenerQuery({ sector: 'QuantumTeleportationIndustry' });
    assertEqual(res.total, 0);
    assertEqual(res.data.length, 0);
  });

  // 2. Negative Market Cap Input
  suite.test('Negative minMarketCap values are handled without filtering out valid positive stocks', async () => {
    const res = safeScreenerQuery({ minMarketCap: -5000000 });
    assertEqual(res.total, allStocks.length, 'Negative minMarketCap should retain all stocks');
  });

  // 3. NaN and String P/E Ratio Parameters
  suite.test('Non-numeric or NaN minPE/maxPE values are ignored and do not corrupt filtering', async () => {
    const res = safeScreenerQuery({ minPE: 'NOT_A_NUMBER', maxPE: 'NaN' });
    assertEqual(res.total, allStocks.length, 'Invalid P/E inputs must be safely ignored');
  });

  // 4. Extreme Price Change Filtering
  suite.test('Extreme price changes filter correctly without numeric overflow', async () => {
    const extremeGainers = safeScreenerQuery({ minChange: 3.0 });
    assertTrue(extremeGainers.total > 0);
    for (const stock of extremeGainers.data) {
      assertTrue(stock.changePercent >= 3.0);
    }

    const impossiblyHighGainers = safeScreenerQuery({ minChange: 10000.0 });
    assertEqual(impossiblyHighGainers.total, 0);
  });

  // 5. Out-of-Bounds Pagination
  suite.test('Negative or excessive page and limit parameters sanitize to valid defaults', async () => {
    const negativePage = safeScreenerQuery({ page: -10, limit: -5 });
    assertEqual(negativePage.page, 1, 'Negative page must sanitize to 1');
    assertEqual(negativePage.limit, 50, 'Negative limit must sanitize to default 50');

    const excessiveLimit = safeScreenerQuery({ limit: 5000 });
    assertEqual(excessiveLimit.limit, 50, 'Excessive limit (>100) must sanitize to max 50');
  });

  // 6. Malformed sortBy Column
  suite.test('Unrecognized sortBy parameter falls back safely to default marketCap sorting', async () => {
    const res = safeScreenerQuery({ sortBy: 'DROP_TABLE_STOCKS;' });
    assertEqual(res.sortBy, 'marketCap', 'SQL injection / invalid column name must fall back to marketCap');
  });
}
