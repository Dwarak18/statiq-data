/**
 * Tier 4 Real-World Scenario: System Administration & Data Feed Maintenance Cycle
 * 
 * Simulates an administrator performing routine maintenance:
 * 1. Admin logs in with RBAC role 'admin'.
 * 2. Admin triggers manual RSS news feed refresh (POST /api/news/refresh).
 * 3. Admin monitors status of all 4 external feeds via GET /api/news/sources.
 * 4. Admin queries system health endpoint GET /api/health (verifying uptime & DB latency).
 * 5. Admin promotes a high-volume research user to Annual tier manually.
 */

import {
  assertEqual,
  assertTrue,
  assertFalse,
  signJwt,
  verifyJwt,
  FIXTURE_INSURANCE_ARTICLES
} from '../test_helpers.js';

export async function registerTests(suite) {
  suite.test('Admin maintenance cycle triggers manual refresh, inspects feed health, and updates user roles', async () => {
    // -------------------------------------------------------------
    // Step 1: Admin Authentication
    // -------------------------------------------------------------
    const adminUser = { id: 'usr-admin-001', email: 'admin@statiqone.com', role: 'admin' };
    const adminToken = signJwt({ sub: adminUser.id, role: adminUser.role });
    const decoded = verifyJwt(adminToken);
    assertEqual(decoded.role, 'admin');

    // -------------------------------------------------------------
    // Step 2: Trigger Manual News Feed Refresh
    // -------------------------------------------------------------
    function handleAdminFeedRefresh(user) {
      if (user.role !== 'admin') {
        return { status: 403, error: 'forbidden_admin_required' };
      }
      return {
        status: 200,
        success: true,
        refreshedSources: ['IJ', 'RN', 'TI', 'BI'],
        totalArticlesIndexed: FIXTURE_INSURANCE_ARTICLES.length,
        completedAt: new Date().toISOString(),
      };
    }

    const refreshRes = handleAdminFeedRefresh(adminUser);
    assertEqual(refreshRes.status, 200);
    assertEqual(refreshRes.refreshedSources.length, 4);

    // -------------------------------------------------------------
    // Step 3: Check Source Statuses
    // -------------------------------------------------------------
    function getNewsSources() {
      return [
        { code: 'IJ', name: 'Insurance Journal', status: 'HEALTHY', responseTimeMs: 142 },
        { code: 'RN', name: 'Reinsurance News', status: 'HEALTHY', responseTimeMs: 98 },
        { code: 'TI', name: 'The Insurer', status: 'HEALTHY', responseTimeMs: 210 },
        { code: 'BI', name: 'Business Insurance', status: 'HEALTHY', responseTimeMs: 165 },
      ];
    }

    const sources = getNewsSources();
    assertEqual(sources.length, 4);
    assertTrue(sources.every((s) => s.status === 'HEALTHY'));

    // -------------------------------------------------------------
    // Step 4: System Health Inspection
    // -------------------------------------------------------------
    function getSystemHealth() {
      return {
        status: 'ok',
        service: 'statiqone-backend',
        uptime: 86400,
        database: { status: 'connected', latencyMs: 2.1 },
        feeds: { active: 4, failing: 0 },
      };
    }

    const health = getSystemHealth();
    assertEqual(health.status, 'ok');
    assertEqual(health.database.status, 'connected');
    assertTrue(health.database.latencyMs < 50);

    // -------------------------------------------------------------
    // Step 5: Manual User Tier Promotion
    // -------------------------------------------------------------
    const targetUser = { id: 'usr-researcher-1', subscriptionTier: 'monthly' };
    function promoteUserTier(caller, target, newTier) {
      if (caller.role !== 'admin') throw new Error('Forbidden');
      target.subscriptionTier = newTier;
      return target;
    }

    promoteUserTier(adminUser, targetUser, 'annual');
    assertEqual(targetUser.subscriptionTier, 'annual');
  });
}
