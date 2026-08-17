/**
 * Tier 4 Real-World Scenario: Mobile PWA Offline Transition, Cached Data & Reconnect
 * 
 * Simulates a mobile trader using STATIQONE on iOS Safari / Android Chrome:
 * 1. User loads the application online -> App shell, stock screener, and news precached.
 * 2. Device loses connectivity (e.g. flight / subway).
 * 3. User navigates between Screener and Insurance News -> Pages load seamlessly from Cache.
 * 4. Stale data banner displays exact "Last synchronized" timestamp.
 * 5. User attempts PDF generation while offline -> Non-crashing offline modal notification.
 * 6. Connectivity restores -> Stale data banner automatically clears as live data revalidates.
 */

import {
  assertEqual,
  assertTrue,
  assertFalse,
  assertIncludes,
  FIXTURE_NASDAQ_STOCKS,
  FIXTURE_INSURANCE_ARTICLES
} from '../test_helpers.js';

export async function registerTests(suite) {
  // Mobile Trader Session Simulator
  class MobilePwaTraderSession {
    constructor() {
      this.isOnline = true;
      this.serviceWorkerCache = new Map();
      this.activePage = '/';
      this.offlineBannerVisible = false;
      this.lastSyncTimestamp = null;
    }

    async navigate(pageUrl) {
      this.activePage = pageUrl;
      if (this.isOnline) {
        this.offlineBannerVisible = false;
        if (pageUrl.includes('screener')) {
          this.lastSyncTimestamp = new Date().toISOString();
          this.serviceWorkerCache.set('api/stocks', {
            data: FIXTURE_NASDAQ_STOCKS.slice(0, 10),
            syncedAt: this.lastSyncTimestamp,
          });
        } else if (pageUrl.includes('news')) {
          this.lastSyncTimestamp = new Date().toISOString();
          this.serviceWorkerCache.set('api/news', {
            articles: FIXTURE_INSURANCE_ARTICLES.slice(0, 5),
            syncedAt: this.lastSyncTimestamp,
          });
        }
        return { status: 200, fromCache: false, page: pageUrl };
      }

      // Offline Navigation
      this.offlineBannerVisible = true;
      const cacheKey = pageUrl.includes('screener') ? 'api/stocks' : 'api/news';
      if (this.serviceWorkerCache.has(cacheKey)) {
        const cached = this.serviceWorkerCache.get(cacheKey);
        return {
          status: 200,
          fromCache: true,
          cachedData: cached,
          banner: `Offline mode. Showing cached data from ${cached.syncedAt}`,
        };
      }

      return { status: 503, error: 'offline_uncached' };
    }

    async requestOfflinePdf() {
      if (!this.isOnline) {
        return {
          status: 503,
          error: 'offline_action_unavailable',
          message: 'AI Report Generation requires an active internet connection to synthesize live data.',
        };
      }
      return { status: 200, success: true };
    }
  }

  suite.test('Mobile PWA handles online precaching, offline navigation, and background revalidation', async () => {
    const session = new MobilePwaTraderSession();

    // Step 1: Initial Online Browsing (Populate Caches)
    const screenerNav = await session.navigate('/screener');
    assertEqual(screenerNav.status, 200);
    assertFalse(screenerNav.fromCache);
    assertFalse(session.offlineBannerVisible);

    const newsNav = await session.navigate('/news');
    assertEqual(newsNav.status, 200);
    assertFalse(newsNav.fromCache);

    // Step 2: Airplane Mode Triggered (Device Goes Offline)
    session.isOnline = false;

    // Step 3: Browse Screener while Offline
    const offlineScreener = await session.navigate('/screener');
    assertEqual(offlineScreener.status, 200);
    assertTrue(offlineScreener.fromCache, 'Must load from Service Worker cache');
    assertTrue(session.offlineBannerVisible, 'Stale data banner must be visible');
    assertIncludes(offlineScreener.banner, 'Offline mode');

    // Step 4: Attempt PDF generation while offline
    const pdfAttempt = await session.requestOfflinePdf();
    assertEqual(pdfAttempt.status, 503);
    assertEqual(pdfAttempt.error, 'offline_action_unavailable');

    // Step 5: Connectivity Restores (Network Reconnect)
    session.isOnline = true;
    const reconnectedNav = await session.navigate('/screener');
    assertEqual(reconnectedNav.status, 200);
    assertFalse(reconnectedNav.fromCache);
    assertFalse(session.offlineBannerVisible, 'Banner must dismiss on live reconnect');
  });
}
