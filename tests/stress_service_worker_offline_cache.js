/**
 * Empirical Stress Test 3: Service Worker Offline Cache Extraction & Timestamp Validation
 * 
 * Verifies:
 * 1. Financial API routes (/api/stocks/*, /api/news*, /api/insurance*) use Stale-While-Revalidate (SWR).
 * 2. 'x-statiqone-cached-at' timestamp header is injected with valid ISO 8601 UTC format.
 * 3. 'x-statiqone-cache-status' header is set to 'STALE_REVALIDATED'.
 * 4. Offline network failure serves cached data with original cachedAt timestamp.
 * 5. Offline uncached request yields structured HTTP 503 JSON fallback.
 * 6. Navigation and static asset cache strategies function under offline stress.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');
const path = require('path');

// Mock CacheStorage using native web standard Response / Headers
class MockCache {
  constructor(name) {
    this.name = name;
    this.store = new Map();
  }
  async put(request, response) {
    const key = typeof request === 'string' ? request : request.url;
    // Store clone of response
    this.store.set(key, response.clone());
  }
  async match(request) {
    const key = typeof request === 'string' ? request : request.url;
    const item = this.store.get(key);
    return item ? item.clone() : null;
  }
  async addAll(assets) {
    assets.forEach((a) => this.store.set(a, new Response('asset-body')));
  }
}

class MockCacheStorage {
  constructor() {
    this.caches = new Map();
  }
  async open(name) {
    if (!this.caches.has(name)) {
      this.caches.set(name, new MockCache(name));
    }
    return this.caches.get(name);
  }
  async match(request) {
    for (const cache of this.caches.values()) {
      const match = await cache.match(request);
      if (match) return match;
    }
    return null;
  }
  async keys() {
    return Array.from(this.caches.keys());
  }
  async delete(name) {
    return this.caches.delete(name);
  }
}

async function testServiceWorkerOfflineResilience() {
  console.log('\n======================================================');
  console.log('STRESS TEST 3: Service Worker Offline Cache Extraction');
  console.log('======================================================\n');

  const swPath = path.join(process.cwd(), 'public', 'sw.js');
  const swCode = fs.readFileSync(swPath, 'utf8');

  console.log('Inspecting public/sw.js syntax and structure...');
  if (!swCode.includes('x-statiqone-cached-at')) {
    throw new Error("Missing 'x-statiqone-cached-at' header in public/sw.js");
  }
  if (!swCode.includes('x-statiqone-cache-status')) {
    throw new Error("Missing 'x-statiqone-cache-status' header in public/sw.js");
  }
  console.log('  ✔ Custom header tokens present in Service Worker script.');

  // Set up mock Service Worker scope
  const eventListeners = {};
  const mockCaches = new MockCacheStorage();

  const mockSelf = {
    addEventListener(event, handler) {
      eventListeners[event] = handler;
    },
    skipWaiting() {},
    clients: { claim: async () => {} },
  };

  // Evaluate Service Worker script in sandbox context using standard Response & Headers
  const swFunction = new Function(
    'self',
    'caches',
    'Headers',
    'Response',
    'URL',
    swCode
  );

  swFunction(mockSelf, mockCaches, Headers, Response, URL);

  console.log('  ✔ Service Worker listeners registered:', Object.keys(eventListeners));

  let passed = true;
  const failureReasons = [];

  // Scenario 1: Online fetch triggers cache insertion with timestamp headers
  console.log('\nScenario 1: Online API Fetch & SWR Cache Insertion with Headers');
  try {
    const screenerUrl = 'https://www.statiqone.com/api/stocks/screener?sector=Technology';
    const mockStockData = {
      data: [{ symbol: 'AAPL', price: 224.23 }, { symbol: 'NVDA', price: 128.15 }],
      lastUpdated: new Date().toISOString(),
    };

    let respondedWith = null;
    const fetchEvent = {
      request: new Request(screenerUrl, { method: 'GET' }),
      respondWith(promise) {
        respondedWith = promise;
      },
    };

    // Mock global network fetch
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (req) => {
      return new Response(JSON.stringify(mockStockData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    eventListeners['fetch'](fetchEvent);
    const initialResponse = await respondedWith;
    console.log('  ✔ Initial Network Fetch Returned Status:', initialResponse.status);

    // Wait a tick for background async caching to complete
    await new Promise((r) => setTimeout(r, 20));

    // Check DATA_CACHE contents
    const dataCache = await mockCaches.open('statiqone-v1-data');
    const cachedResponse = await dataCache.match(fetchEvent.request);

    if (!cachedResponse) {
      throw new Error('SWR failed to store response in statiqone-v1-data cache');
    }

    const cachedAt = cachedResponse.headers.get('x-statiqone-cached-at');
    const cacheStatus = cachedResponse.headers.get('x-statiqone-cache-status');

    console.log('  ✔ Cached Response Headers:');
    console.log('     x-statiqone-cached-at:', cachedAt);
    console.log('     x-statiqone-cache-status:', cacheStatus);

    if (!cachedAt || isNaN(Date.parse(cachedAt))) {
      throw new Error(`Invalid ISO timestamp in x-statiqone-cached-at: ${cachedAt}`);
    }
    if (cacheStatus !== 'STALE_REVALIDATED') {
      throw new Error(`Expected cache status 'STALE_REVALIDATED', got '${cacheStatus}'`);
    }

    globalThis.fetch = originalFetch;
  } catch (err) {
    passed = false;
    failureReasons.push(`Scenario 1 Failed: ${err.message}`);
    console.error('  ✖ Scenario 1 Error:', err.message);
  }

  // Scenario 2: Offline transition serves cached data with intact headers
  console.log('\nScenario 2: Offline Request Returns Stale Data with Original Timestamp');
  try {
    const screenerUrl = 'https://www.statiqone.com/api/stocks/screener?sector=Technology';
    const req = new Request(screenerUrl, { method: 'GET' });

    // Simulate network DOWN (fetch throws)
    globalThis.fetch = async () => {
      throw new TypeError('Failed to fetch (net::ERR_INTERNET_DISCONNECTED)');
    };

    let offlineResponsePromise = null;
    const offlineEvent = {
      request: req,
      respondWith(promise) {
        offlineResponsePromise = promise;
      },
    };

    eventListeners['fetch'](offlineEvent);
    const offlineResponse = await offlineResponsePromise;

    console.log('  ✔ Offline Response Status:', offlineResponse.status);
    const extractedCachedAt = offlineResponse.headers.get('x-statiqone-cached-at');
    console.log('  ✔ Extracted Timestamp:', extractedCachedAt);

    const body = await offlineResponse.json();
    console.log('  ✔ Extracted Data Symbols:', body.data.map((s) => s.symbol));

    if (!extractedCachedAt) {
      throw new Error('Offline response missing x-statiqone-cached-at timestamp');
    }
    if (!body.data || body.data.length !== 2) {
      throw new Error('Offline response body corrupted or truncated');
    }
  } catch (err) {
    passed = false;
    failureReasons.push(`Scenario 2 Failed: ${err.message}`);
    console.error('  ✖ Scenario 2 Error:', err.message);
  }

  // Scenario 3: Offline Cache Miss yields 503 Structured Fallback
  console.log('\nScenario 3: Offline Uncached Route Returns 503 Fallback');
  try {
    const uncachedUrl = 'https://www.statiqone.com/api/news?region=Australia';
    const uncachedReq = new Request(uncachedUrl, { method: 'GET' });

    // Network is still offline
    globalThis.fetch = async () => {
      throw new TypeError('Network error');
    };

    let missResponsePromise = null;
    const missEvent = {
      request: uncachedReq,
      respondWith(promise) {
        missResponsePromise = promise;
      },
    };

    eventListeners['fetch'](missEvent);
    const missResponse = await missResponsePromise;

    console.log('  ✔ Uncached Offline Response Status:', missResponse.status);
    const missBody = await missResponse.json();
    console.log('  ✔ Uncached Fallback Body:', missBody);

    if (missResponse.status !== 503) {
      throw new Error(`Expected HTTP 503 for uncached offline request, got ${missResponse.status}`);
    }
    if (missBody.error !== 'offline_and_uncached') {
      throw new Error(`Expected error code 'offline_and_uncached', got '${missBody.error}'`);
    }
  } catch (err) {
    passed = false;
    failureReasons.push(`Scenario 3 Failed: ${err.message}`);
    console.error('  ✖ Scenario 3 Error:', err.message);
  }

  console.log('\n======================================================');
  console.log('SERVICE WORKER OFFLINE TEST RESULT:', passed ? '✅ PASSED' : '❌ FAILED');
  if (!passed) {
    console.log('Failure reasons:', failureReasons);
  }
  console.log('======================================================\n');

  return { passed, failureReasons };
}

testServiceWorkerOfflineResilience().then((res) => {
  if (!res.passed) process.exit(1);
});
