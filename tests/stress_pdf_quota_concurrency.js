/**
 * Empirical Stress Test 1: Concurrency Race Condition on Monthly PDF Quota
 * 
 * Verifies whether launching 20 concurrent requests against a Monthly subscriber's
 * quota (limit: 5) strictly limits generation to exactly 5 reports or over-consumes.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const reportService = require('../authsystem/backend/src/services/reportService.js');

async function testConcurrentMonthlyQuota() {
  console.log('\n======================================================');
  console.log('STRESS TEST 1: Concurrent Monthly PDF Quota Consumption');
  console.log('======================================================\n');

  const userId = `usr_concurrent_test_${Date.now()}`;
  
  // Set up a monthly subscription with 0 used reports
  reportService.setMemoryUserSubscription(userId, 'monthly', 0);

  const initialQuota = await reportService.getUserReportQuota(userId);
  console.log('Initial Quota State:', initialQuota);

  console.log('\nLaunching 20 simultaneous concurrent generation requests...');
  
  const concurrencyCount = 20;
  const userObj = {
    id: userId,
    subscriptionTier: 'monthly',
    role: 'user',
    email: 'concurrent.trader@statiqone.com',
    displayName: 'Concurrent Trader',
  };

  const startMs = performance.now();
  
  const results = await Promise.all(
    Array.from({ length: concurrencyCount }, async (_, idx) => {
      try {
        const quota = await reportService.enforceAndConsumeQuota(userObj);
        return {
          idx,
          status: 'SUCCESS',
          used: quota.usedThisMonth,
          remaining: quota.remaining,
        };
      } catch (err) {
        return {
          idx,
          status: 'REJECTED',
          error: err.message,
          statusCode: err.status,
        };
      }
    })
  );

  const durationMs = (performance.now() - startMs).toFixed(2);
  const successes = results.filter((r) => r.status === 'SUCCESS');
  const rejections = results.filter((r) => r.status === 'REJECTED');

  console.log(`\nResults across ${concurrencyCount} parallel requests (${durationMs}ms):`);
  console.log(`  Successful Consumptions: ${successes.length} (Expected: 5)`);
  console.log(`  Rejected (Quota Exceeded): ${rejections.length} (Expected: 15)`);

  const finalQuota = await reportService.getUserReportQuota(userId);
  console.log('\nFinal Quota State:', finalQuota);

  if (successes.length > 5) {
    console.error(`\n❌ RACE CONDITION DETECTED! Over-consumed: ${successes.length} reports generated (Quota cap was 5).`);
    return { passed: false, successes: successes.length, rejections: rejections.length };
  } else if (successes.length === 5 && rejections.length === 15) {
    console.log(`\n✅ CONCURRENCY CHECK PASSED: Strict 5-report cap enforced.`);
    return { passed: true, successes: 5, rejections: 15 };
  } else {
    console.log(`\n⚠️ UNEXPECTED RESULT: ${successes.length} successes, ${rejections.length} rejections.`);
    return { passed: false, successes: successes.length, rejections: rejections.length };
  }
}

testConcurrentMonthlyQuota().then((res) => {
  console.log('\nTest Completed. Passed:', res.passed);
  if (!res.passed) {
    process.exit(1);
  }
});
