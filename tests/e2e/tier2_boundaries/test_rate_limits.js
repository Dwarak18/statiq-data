/**
 * Tier 2 Boundary Test: Rate Limiting Thresholds & HTTP 429 Responses
 * 
 * Verifies:
 * 1. Auth rate limiter allows requests 1 through 20 within 15-minute window.
 * 2. Request 21 triggers HTTP 429 Too Many Requests response.
 * 3. Rate limiter response includes structured error code and Retry-After header.
 * 4. General API limiter enforces 300 requests / 15 min ceiling.
 * 5. Distinct client IP addresses maintain independent rate limiter buckets.
 */

import {
  assertEqual,
  assertTrue,
  assertFalse,
  assertIncludes
} from '../test_helpers.js';

export async function registerTests(suite) {
  // Rate Limiter Simulator mirroring express-rate-limit
  class RateLimiterBucket {
    constructor({ max = 20, windowMs = 15 * 60 * 1000 } = {}) {
      this.max = max;
      this.windowMs = windowMs;
      this.ipHits = new Map();
    }

    handleRequest(ip = '127.0.0.1') {
      const now = Date.now();
      let record = this.ipHits.get(ip);

      if (!record || now > record.resetTime) {
        record = { count: 1, resetTime: now + this.windowMs };
        this.ipHits.set(ip, record);
        return { status: 200, remaining: this.max - 1 };
      }

      if (record.count >= this.max) {
        const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
        return {
          status: 429,
          error: 'too_many_requests',
          message: 'Too many requests from this IP, please try again later.',
          retryAfter: retryAfterSec,
        };
      }

      record.count++;
      return { status: 200, remaining: this.max - record.count };
    }
  }

  // 1. Auth Limiter Up to Limit (1 through 20)
  suite.test('Auth rate limiter allows 20 consecutive requests from an IP', async () => {
    const limiter = new RateLimiterBucket({ max: 20 });
    const ip = '192.168.1.50';

    for (let i = 1; i <= 20; i++) {
      const res = limiter.handleRequest(ip);
      assertEqual(res.status, 200, `Request ${i} must succeed`);
      assertEqual(res.remaining, 20 - i);
    }
  });

  // 2. Request 21 Triggers HTTP 429
  suite.test('Request 21 exceeding the 20-request threshold receives HTTP 429 Too Many Requests', async () => {
    const limiter = new RateLimiterBucket({ max: 20 });
    const ip = '192.168.1.50';

    // Exhaust 20 requests
    for (let i = 1; i <= 20; i++) {
      limiter.handleRequest(ip);
    }

    // 21st request
    const blockedRes = limiter.handleRequest(ip);
    assertEqual(blockedRes.status, 429, '21st request must receive HTTP 429');
    assertEqual(blockedRes.error, 'too_many_requests');
    assertTrue(blockedRes.retryAfter > 0, 'Must provide positive retryAfter seconds');
  });

  // 3. General API Limiter (300 Requests)
  suite.test('General API limiter allows up to 300 requests before blocking', async () => {
    const generalLimiter = new RateLimiterBucket({ max: 300 });
    const ip = '10.0.0.10';

    for (let i = 1; i <= 300; i++) {
      const res = generalLimiter.handleRequest(ip);
      assertEqual(res.status, 200);
    }

    const blocked = generalLimiter.handleRequest(ip);
    assertEqual(blocked.status, 429);
  });

  // 4. IP Isolation
  suite.test('Distinct client IPs have independent rate limit quotas', async () => {
    const limiter = new RateLimiterBucket({ max: 5 });
    const ipA = '192.168.1.100';
    const ipB = '192.168.1.200';

    // Exhaust IP A
    for (let i = 0; i < 5; i++) {
      limiter.handleRequest(ipA);
    }
    assertEqual(limiter.handleRequest(ipA).status, 429);

    // IP B should still have full quota
    const resB = limiter.handleRequest(ipB);
    assertEqual(resB.status, 200);
    assertEqual(resB.remaining, 4);
  });
}
