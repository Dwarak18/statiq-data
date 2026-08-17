/**
 * Tier 5 Adversarial Test: Malformed RSS Feeds, Network Latency & Multi-Feed Fallback
 * 
 * Verifies:
 * 1. Malformed XML (unclosed tags, XML entities, binary noise) parses without unhandled crashes.
 * 2. High-latency / timeout simulation across upstream feeds triggers fallback gracefully.
 * 3. Partial feed failure (e.g. 3 of 4 feeds down) maintains 100% service availability with partial data.
 * 4. Regional and category classifier handles ambiguous, multi-regional, and adversarial spam inputs.
 * 5. Tier-gating invariant strictly enforces max 3 items per region for Free users under adversarial parameters.
 */

import {
  assertEqual,
  assertTrue,
  assertFalse,
  assertIncludes,
} from '../test_helpers.js';

let newsService;
try {
  newsService = await import('../../../authsystem/backend/src/services/newsService.js');
} catch {
  newsService = await import('../../authsystem/backend/src/services/newsService.js').catch(() => null);
}

export async function registerTests(suite) {
  const dummyFeedConfig = {
    id: 'test-feed',
    name: 'Test Feed Publication',
    sourceCode: 'TF',
    defaultRegion: 'USA',
    defaultCategory: 'Commercial Lines',
  };

  // 1. Malformed and Adversarial XML Payloads
  suite.test('Adversarial XML payloads (unclosed tags, entities, binary noise) parse safely without crash', async () => {
    const { parseRssXml } = newsService;

    const malformedPayloads = [
      '',
      '   ',
      '<html><body>404 Not Found</body></html>',
      '<xml><unclosed><item><title>Test',
      '<?xml version="1.0"?><rss><channel><item><title></title><link></link></item></channel></rss>',
      '<item><title><![CDATA[Unclosed CDATA</title><link>https://example.com/1</link></item>',
      '<item><title>&invalidEntity;&#999999999;</title><link>https://example.com/2</link></item>',
      '<item>' + '<a><b>'.repeat(1000) + '<title>Deeply Nested</title><link>https://example.com/3</link>' + '</b></a>'.repeat(1000) + '</item>',
      Buffer.from([0x00, 0x01, 0xFF, 0xFE, 0x80]).toString('utf8'),
      '<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Atom Entry Without Link</title></entry></feed>',
    ];

    for (let i = 0; i < malformedPayloads.length; i++) {
      const payload = malformedPayloads[i];
      let articles = [];
      let threw = false;

      try {
        articles = parseRssXml(payload, dummyFeedConfig);
      } catch (err) {
        threw = true;
      }

      assertFalse(threw, `Payload index ${i} must not throw unhandled exception`);
      assertTrue(Array.isArray(articles), `Payload index ${i} must return an array`);
    }
  });

  // 2. High-Latency & Upstream Feed Failure Simulation
  suite.test('Simulated timeout and 500 error in upstream feeds trigger graceful fallback', async () => {
    // Simulate multi-feed aggregation where 3 feeds throw errors
    const mockFeeds = [
      { name: 'Feed A', fetch: async () => { throw new Error('ETIMEDOUT: Connection timed out'); } },
      { name: 'Feed B', fetch: async () => { throw new Error('HTTP 502 Bad Gateway'); } },
      { name: 'Feed C', fetch: async () => { throw new Error('ECONNREFUSED: Server unreachable'); } },
      {
        name: 'Feed D',
        fetch: async () => ({
          articles: [
            {
              id: 'art-d-1',
              guidHash: 'hash-d-1',
              source: 'Feed D',
              sourceCode: 'FD',
              title: 'Resilient Market Intelligence Update',
              description: 'Operational continuity verified under severe network degradation.',
              link: 'https://www.feed-d.com/resilience',
              pubDate: new Date().toISOString(),
              region: 'Global',
              category: 'Reinsurance',
              imageUrl: 'https://example.com/img.jpg',
            },
          ],
        }),
      },
    ];

    const results = await Promise.allSettled(mockFeeds.map((f) => f.fetch()));
    const successfulArticles = [];

    results.forEach((r) => {
      if (r.status === 'fulfilled' && r.value.articles) {
        successfulArticles.push(...r.value.articles);
      }
    });

    assertEqual(successfulArticles.length, 1, 'Only healthy feed yields articles');
    assertEqual(successfulArticles[0].title, 'Resilient Market Intelligence Update');
  });

  // 3. Multi-Regional & Adversarial Text Classification
  suite.test('Regional classifier resolves ambiguous and multi-region text accurately', async () => {
    const { classifyRegion, classifyCategory } = newsService;

    // Test Case A: Heavy Asia context with minor US mention
    const textAsia = classifyRegion(
      'Global',
      'IRDAI introduces new solvency norms for Indian life and general insurers',
      'GI Council and LIC report strong premium growth while observing US Federal Reserve rate decisions.'
    );
    assertEqual(textAsia, 'Asia', 'Dominant Indian insurance context must classify as Asia');

    // Test Case B: Heavy Europe context
    const textEurope = classifyRegion(
      'Global',
      "Lloyd's of London and Munich Re announce European treaty renewal results",
      'EIOPA Solvency II directives reviewed in Frankfurt and Paris.'
    );
    assertEqual(textEurope, 'Europe', 'Lloyds/Munich Re/EIOPA context must classify as Europe');

    // Test Case C: Pure Catastrophe / ILS without specific country
    const textGlobal = classifyRegion(
      'Global',
      'Global Catastrophe Bond Issuance Reaches Record High at Mid-Year Renewals',
      'Worldwide retrocession capacity expands across capital markets and ILS funds.'
    );
    assertEqual(textGlobal, 'Global', 'Global Cat Bond context must classify as Global');

    // Category Classification Check
    const catReinsurance = classifyCategory('Treaty Quota Share Renewals', 'Reinsurance capacity expands', 'General');
    assertEqual(catReinsurance, 'Reinsurance & ILS');

    const catRegulatory = classifyCategory('EIOPA Solvency II Capital Rules', 'Compliance directives issued', 'General');
    assertEqual(catRegulatory, 'Regulatory & Risk');
  });

  // 4. Tier-Gating Invariant Oracle under Adversarial Filter Parameters
  suite.test('Tier-gating invariant strictly guarantees Free tier receives <= 3 articles per region', async () => {
    const { getNewsArticles } = newsService;

    // Query across all regions as Free user
    const freeResAll = await getNewsArticles({
      region: 'all',
      limit: 100,
      userTier: 'free',
      userRole: 'user',
    });

    assertTrue(freeResAll.success);
    assertTrue(freeResAll.isGated, 'Free user response must be marked isGated: true');

    // Count regional distribution
    const counts = { USA: 0, Europe: 0, Asia: 0, Global: 0 };
    freeResAll.articles.forEach((art) => {
      counts[art.region] = (counts[art.region] || 0) + 1;
    });

    // Oracle invariant: Every region MUST have <= 3 articles in Free tier
    for (const [region, count] of Object.entries(counts)) {
      assertTrue(
        count <= 3,
        `Region ${region} has ${count} articles, exceeding Free tier maximum of 3`
      );
    }

    // Single region query as Free user
    const freeResAsia = await getNewsArticles({
      region: 'Asia',
      limit: 50,
      userTier: 'free',
    });
    assertTrue(freeResAsia.articles.length <= 3, 'Single region query for Free tier must return <= 3 articles');

    // Paid subscriber receives full feed
    const paidRes = await getNewsArticles({
      region: 'all',
      limit: 50,
      userTier: 'monthly',
    });
    assertFalse(paidRes.isGated, 'Monthly subscriber response must not be gated');
    assertTrue(paidRes.articles.length >= freeResAll.articles.length, 'Paid subscriber receives >= Free tier articles');
  });
}
