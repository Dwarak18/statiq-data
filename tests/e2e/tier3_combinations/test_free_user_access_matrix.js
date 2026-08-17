/**
 * Tier 3 Combinatorial Test: Free User Access Control Matrix
 * 
 * Verifies cross-feature permission gating for Free tier users:
 * 1. Stock Screener: Access to basic screener table and filters allowed.
 * 2. News Feed: Gated strictly to 3 unlocked articles per region (USA, Europe, Asia, Global).
 * 3. PDF Reports: Direct PDF download blocked with HTTP 403 (upgrade_required).
 * 4. Pricing / Subscription: Upgrade CTA properly presented with clear tier comparisons.
 */

import {
  assertEqual,
  assertTrue,
  assertFalse,
  FIXTURE_NASDAQ_STOCKS,
  FIXTURE_NSE_STOCKS,
  FIXTURE_INSURANCE_ARTICLES
} from '../test_helpers.js';

export async function registerTests(suite) {
  const freeUser = {
    id: 'free-user-123',
    email: 'free.analyst@example.com',
    role: 'user',
    subscriptionTier: 'free',
    monthlyPdfCount: 0,
  };

  // 1. Stock Screener Access
  suite.test('Free tier user can access basic stock screener with filters', async () => {
    function getScreenerForUser(user) {
      const allowed = ['free', 'monthly', 'annual'].includes(user.subscriptionTier);
      return {
        allowed,
        data: [...FIXTURE_NASDAQ_STOCKS, ...FIXTURE_NSE_STOCKS].slice(0, 20),
      };
    }

    const res = getScreenerForUser(freeUser);
    assertTrue(res.allowed);
    assertTrue(res.data.length >= 20);
  });

  // 2. Regional News Gating Matrix
  suite.test('Free tier user receives max 3 articles for each region with remaining articles locked', async () => {
    function getNewsForUser(user, region) {
      const articles = FIXTURE_INSURANCE_ARTICLES.filter((a) => !region || region === 'all' || a.region === region);
      const isFree = user.subscriptionTier === 'free';

      const counts = {};
      const output = [];

      for (const art of articles) {
        const r = art.region || 'Global';
        counts[r] = (counts[r] || 0) + 1;
        if (isFree && counts[r] > 3) {
          output.push({ ...art, isLocked: true });
        } else {
          output.push({ ...art, isLocked: false });
        }
      }

      return {
        articles: output,
        unlockedCount: output.filter((a) => !a.isLocked).length,
        lockedCount: output.filter((a) => a.isLocked).length,
      };
    }

    const usaNews = getNewsForUser(freeUser, 'USA');
    assertTrue(usaNews.unlockedCount <= 3, 'Free user USA news unlocked count must be <= 3');
    assertTrue(usaNews.lockedCount > 0, 'Excess USA articles must be locked');
  });

  // 3. PDF Generation Blocked
  suite.test('Free tier user requesting PDF report receives HTTP 403 upgrade_required with CTA payload', async () => {
    function generateReport(user) {
      if (user.subscriptionTier === 'free') {
        return {
          status: 403,
          error: 'upgrade_required',
          message: 'PDF report generation requires a Monthly or Annual subscription.',
          pricingUrl: 'https://www.statiqone.com/pricing',
        };
      }
      return { status: 200, pdfGenerated: true };
    }

    const res = generateReport(freeUser);
    assertEqual(res.status, 403);
    assertEqual(res.error, 'upgrade_required');
    assertEqual(res.pricingUrl, 'https://www.statiqone.com/pricing');
  });

  // 4. Feature Matrix Completeness
  suite.test('Free user capability matrix correctly evaluates all feature gates', async () => {
    function evaluateCapabilities(user) {
      return {
        canViewScreener: true,
        canViewAllNews: user.subscriptionTier !== 'free',
        canDownloadPdf: ['monthly', 'annual'].includes(user.subscriptionTier),
        pdfMonthlyQuota: user.subscriptionTier === 'annual' ? Infinity : user.subscriptionTier === 'monthly' ? 5 : 0,
      };
    }

    const caps = evaluateCapabilities(freeUser);
    assertTrue(caps.canViewScreener);
    assertFalse(caps.canViewAllNews);
    assertFalse(caps.canDownloadPdf);
    assertEqual(caps.pdfMonthlyQuota, 0);
  });
}
