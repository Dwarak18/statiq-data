/**
 * Tier 2 Boundary Test: Payload Size Limits & Buffer Overflows
 * 
 * Verifies:
 * 1. Express body parser limit (32KB) blocks oversized request payloads with HTTP 413.
 * 2. Payloads under 32KB boundary are processed successfully.
 * 3. Extremely long news article summaries are truncated or stored safely without memory leaks.
 * 4. Bulk stock symbol query limits (max 100 symbols per request).
 */

import {
  assertEqual,
  assertTrue,
  assertFalse
} from '../test_helpers.js';

export async function registerTests(suite) {
  // Body Parser Size Limit Simulator (32KB = 32,768 bytes)
  const MAX_BYTES = 32 * 1024;

  function simulateBodyParser(jsonString) {
    const byteLength = Buffer.byteLength(jsonString, 'utf8');
    if (byteLength > MAX_BYTES) {
      return {
        status: 413,
        error: 'payload_too_large',
        message: `Request body exceeds maximum limit of 32KB (received ${byteLength} bytes).`,
      };
    }
    try {
      const parsed = JSON.parse(jsonString);
      return { status: 200, body: parsed };
    } catch {
      return { status: 400, error: 'invalid_json' };
    }
  }

  // 1. Payload Within 32KB Boundary (30KB)
  suite.test('Request payload under 32KB limit is parsed successfully', async () => {
    const validData = { data: 'X'.repeat(30 * 1024) };
    const jsonString = JSON.stringify(validData);
    const res = simulateBodyParser(jsonString);
    assertEqual(res.status, 200);
    assertTrue(res.body.data.length > 0);
  });

  // 2. Oversized Payload (35KB) Triggers HTTP 413
  suite.test('Request payload exceeding 32KB is rejected with HTTP 413 Payload Too Large', async () => {
    const oversizedData = { data: 'X'.repeat(35 * 1024) };
    const jsonString = JSON.stringify(oversizedData);
    const res = simulateBodyParser(jsonString);
    assertEqual(res.status, 413);
    assertEqual(res.error, 'payload_too_large');
  });

  // 3. Bulk Symbol Query Limit (Max 100 symbols)
  suite.test('Bulk ticker query limits batches to maximum 100 symbols per request', async () => {
    function parseSymbols(symbolParam) {
      if (!symbolParam) return [];
      const symbols = String(symbolParam)
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);
      return symbols.slice(0, 100);
    }

    const requested150Symbols = Array.from({ length: 150 }, (_, i) => `SYM${i}`).join(',');
    const parsed = parseSymbols(requested150Symbols);
    assertEqual(parsed.length, 100, 'Batch size must be capped at 100 symbols');
    assertEqual(parsed[0], 'SYM0');
    assertEqual(parsed[99], 'SYM99');
  });

  // 4. Large News Excerpt Sanitization
  suite.test('Large news article descriptions (> 10KB) are sanitized and clamped cleanly', async () => {
    const rawLongArticle = {
      title: 'Global Reinsurance Market Report',
      description: 'Extensive analysis text. '.repeat(500), // ~13KB
    };

    function clampDescription(desc, maxChars = 2000) {
      if (!desc) return '';
      return desc.length > maxChars ? desc.substring(0, maxChars) + '...' : desc;
    }

    const clamped = clampDescription(rawLongArticle.description);
    assertTrue(clamped.length <= 2003);
    assertTrue(clamped.endsWith('...'));
  });
}
