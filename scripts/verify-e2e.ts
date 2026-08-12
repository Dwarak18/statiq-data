import { runTier1Tests } from '../tests/e2e/tier1_feature_coverage.test';
import { runTier2Tests } from '../tests/e2e/tier2_boundary_corner.test';
import { runTier3Tests } from '../tests/e2e/tier3_pairwise_combinations.test';
import { runTier4Tests } from '../tests/e2e/tier4_real_world.test';
import { TestResult } from '../tests/e2e/test_utils';

function main() {
  console.log('================================================================');
  console.log('  StatIQ One — E2E Automated Requirement-Driven Test Runner');
  console.log('  Scope: Warm Intelligence Visual System & Scroll Fix');
  console.log('================================================================\n');

  const tier1Results = runTier1Tests();
  const tier2Results = runTier2Tests();
  const tier3Results = runTier3Tests();
  const tier4Results = runTier4Tests();

  const allResults: TestResult[] = [
    ...tier1Results,
    ...tier2Results,
    ...tier3Results,
    ...tier4Results,
  ];

  let totalPassed = 0;
  let totalFailed = 0;

  const printTierResults = (tierNumber: number, title: string, results: TestResult[]) => {
    console.log(`\n--- TIER ${tierNumber}: ${title} ---`);
    for (const res of results) {
      const icon = res.passed ? '✓ PASS' : '✗ FAIL';
      const statusColor = res.passed ? '\x1b[32m' : '\x1b[31m';
      const reset = '\x1b[0m';

      console.log(`${statusColor}${icon}${reset} [Tier ${res.tier}] ${res.name}`);
      console.log(`       Message: ${res.message}`);
      if (!res.passed && res.details && res.details.length > 0) {
        console.log(`       Diagnostics:`);
        for (const detail of res.details) {
          console.log(`         - ${detail}`);
        }
      }
      if (res.passed) totalPassed++;
      else totalFailed++;
    }
  };

  printTierResults(1, 'Feature Coverage', tier1Results);
  printTierResults(2, 'Boundary & Corner Cases', tier2Results);
  printTierResults(3, 'Pairwise Combinations', tier3Results);
  printTierResults(4, 'Real-world Application Scenarios', tier4Results);

  console.log('\n================================================================');
  console.log('                      TEST SUMMARY REPORT                       ');
  console.log('================================================================');
  console.log(`Total Automated Tests Executed: ${allResults.length}`);
  console.log(`Passed:                         ${totalPassed}`);
  console.log(`Failed:                         ${totalFailed}`);
  console.log(`Overall Status:                 ${totalFailed === 0 ? 'PASSED (100%)' : 'ACTION REQUIRED'}`);
  console.log('================================================================\n');

  if (totalFailed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();
