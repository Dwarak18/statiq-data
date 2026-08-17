/**
 * Tier 5 Adversarial Test: Stock Screener Property Fuzzer & Query Oracle
 * 
 * Verifies:
 * 1. 500+ randomized adversarial combinations (NaN, Infinity, SQLi, Prototype Pollution).
 * 2. Screener query engine NEVER throws unhandled exceptions and ALWAYS returns a valid schema.
 * 3. Inverted range filtering (e.g. min > max) resolves to empty dataset cleanly.
 * 4. Numeric overflow / underflow bounds protection across market cap, P/E, volume, and change %.
 * 5. Pagination boundary sanitizer strictly bounds page (>=1) and limit (1..100).
 */

import {
  assertEqual,
  assertTrue,
  assertFalse,
} from '../test_helpers.js';

let stockService;
try {
  stockService = await import('../../../authsystem/backend/src/services/stockService.js');
} catch {
  // Fallback direct import
  stockService = await import('../../authsystem/backend/src/services/stockService.js').catch(() => null);
}

export async function registerTests(suite) {
  // 1. High-Volume Property-Based Fuzzer Oracle
  suite.test('500+ randomized adversarial query parameters execute with zero unhandled exceptions', async () => {
    if (!stockService || !stockService.getScreenerQuotes) {
      throw new Error('Stock service module could not be loaded');
    }

    const adversarialValues = [
      '',
      null,
      undefined,
      'NaN',
      'Infinity',
      '-Infinity',
      '-1',
      '-999999999999',
      '999999999999999',
      '1e20',
      '0.00000000001',
      '0',
      'drop table stocks;--',
      "' OR '1'='1' --",
      '<script>alert(1)</script>',
      '__proto__',
      'constructor',
      'prototype',
      'hasOwnProperty',
      'true',
      'false',
      '[]',
      '{}',
      'undefined',
      'null',
      '⚡️🔥🚀',
      'Technology,Financial Services',
      'NonExistentSector123',
    ];

    // Generator function for adversarial queries
    function generateAdversarialQuery(seed) {
      const pick = (arr) => arr[Math.floor(Math.abs(Math.sin(seed++) * 10000) % arr.length)];
      return {
        exchange: pick(['all', 'NASDAQ', 'NSE', 'LSE', 'INVALID', '']),
        sector: pick(adversarialValues),
        minMarketCap: pick(adversarialValues),
        maxMarketCap: pick(adversarialValues),
        minPE: pick(adversarialValues),
        maxPE: pick(adversarialValues),
        minChange: pick(adversarialValues),
        maxChange: pick(adversarialValues),
        minVolume: pick(adversarialValues),
        search: pick(adversarialValues),
        sortBy: pick(adversarialValues),
        sortOrder: pick(['asc', 'desc', 'ASC', 'DESC', 'invalid', '']),
        page: pick(adversarialValues),
        limit: pick(adversarialValues),
      };
    }

    let iterations = 500;
    for (let i = 0; i < iterations; i++) {
      const q = generateAdversarialQuery(i + 1);
      const res = await stockService.getScreenerQuotes(q);

      // Oracle invariants
      assertTrue(res !== null && typeof res === 'object', `Iteration ${i}: Result must be an object`);
      assertEqual(res.success, true, `Iteration ${i}: Result success must be true`);
      assertTrue(Array.isArray(res.data), `Iteration ${i}: Result data must be an array`);
      assertTrue(typeof res.pagination === 'object', `Iteration ${i}: Pagination object required`);
      assertTrue(Number.isFinite(res.pagination.total) && res.pagination.total >= 0, `Iteration ${i}: total must be non-negative finite number`);
      assertTrue(res.pagination.page >= 1, `Iteration ${i}: page must be >= 1`);
      assertTrue(res.pagination.limit >= 1 && res.pagination.limit <= 100, `Iteration ${i}: limit must be bounded 1..100`);
      assertTrue(typeof res.marketStatus === 'object', `Iteration ${i}: marketStatus required`);
    }
  });

  // 2. Inverted Range Boundary Checks
  suite.test('Inverted filter boundaries (min > max) cleanly evaluate to empty set without runtime error', async () => {
    // minMarketCap (500B) > maxMarketCap (100B)
    const resMarketCap = await stockService.getScreenerQuotes({
      minMarketCap: '500000000000',
      maxMarketCap: '100000000000',
    });
    assertEqual(resMarketCap.data.length, 0, 'Inverted market cap must return 0 results');
    assertEqual(resMarketCap.pagination.total, 0);

    // minPE (100) > maxPE (10)
    const resPE = await stockService.getScreenerQuotes({
      minPE: '100',
      maxPE: '10',
    });
    assertEqual(resPE.data.length, 0, 'Inverted PE must return 0 results');

    // minChange (10%) > maxChange (-10%)
    const resChange = await stockService.getScreenerQuotes({
      minChange: '10',
      maxChange: '-10',
    });
    assertEqual(resChange.data.length, 0, 'Inverted change % must return 0 results');
  });

  // 3. Negative Numeric Boundary Filtering
  suite.test('Negative and fractional filter values parse accurately without corruption', async () => {
    // Large negative change limit
    const resNegativeChange = await stockService.getScreenerQuotes({
      minChange: '-50.0',
      maxChange: '-0.01',
    });
    assertTrue(resNegativeChange.success);
    for (const item of resNegativeChange.data) {
      assertTrue(item.changePercent <= -0.01, `Item ${item.symbol} changePercent must be negative`);
      assertTrue(item.changePercent >= -50.0);
    }
  });

  // 4. Prototype Pollution & Prototype Property Safety
  suite.test('Object prototype properties passed as sort or search parameters do not corrupt state', async () => {
    const resProto = await stockService.getScreenerQuotes({
      sortBy: 'toString',
      search: '__proto__',
    });
    assertTrue(resProto.success);
    assertTrue(Array.isArray(resProto.data));

    // Verify global Object prototype remains clean
    assertEqual(Object.prototype.polluted, undefined);
  });

  // 5. Extreme Pagination Clamping
  suite.test('Extreme pagination values (page=1000000, limit=999999) clamp safely to standard boundaries', async () => {
    const resLargePage = await stockService.getScreenerQuotes({
      page: '1000000',
      limit: '50',
    });
    assertEqual(resLargePage.pagination.page, 1000000);
    assertEqual(resLargePage.data.length, 0, 'Page far beyond total count must return empty data array');

    const resLargeLimit = await stockService.getScreenerQuotes({
      limit: '9999999',
    });
    assertEqual(resLargeLimit.pagination.limit, 100, 'Limit above 100 must be clamped to 100');

    const resNegativePagination = await stockService.getScreenerQuotes({
      page: '-5',
      limit: '-20',
    });
    assertEqual(resNegativePagination.pagination.page, 1, 'Negative page must sanitize to 1');
    assertEqual(resNegativePagination.pagination.limit, 1, 'Negative limit must sanitize to 1');
  });
}
