#!/usr/bin/env node
/**
 * STATIQONE Master E2E Test Runner
 * 
 * Executes comprehensive integration, boundary, combinatorial,
 * and real-world scenario test suites across 4 quality tiers.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI Formatting Codes
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgGreen: '\x1b[42m\x1b[30m',
  bgRed: '\x1b[41m\x1b[37m',
  bgBlue: '\x1b[44m\x1b[37m',
};

// Parse CLI Arguments
const args = process.argv.slice(2);
const tierFilter = args.find((a) => a.startsWith('--tier='))?.split('=')[1];
const nameFilter = args.find((a) => a.startsWith('--filter='))?.split('=')[1]?.toLowerCase();
const bail = args.includes('--bail');
const verbose = args.includes('--verbose');

const TIERS = [
  { id: 'tier1', name: 'Tier 1: Core Feature Verification (>= 5 tests/feature)', dir: path.join(__dirname, 'tier1_features') },
  { id: 'tier2', name: 'Tier 2: Boundary Value Analysis & Edge Conditions', dir: path.join(__dirname, 'tier2_boundaries') },
  { id: 'tier3', name: 'Tier 3: Combinatorial & Cross-Feature Pairwise', dir: path.join(__dirname, 'tier3_combinations') },
  { id: 'tier4', name: 'Tier 4: Realistic Multi-Step End-to-End Workflows', dir: path.join(__dirname, 'tier4_real_world') },
  { id: 'tier5', name: 'Tier 5: Adversarial Edge Cases & Fuzz Testing', dir: path.join(__dirname, 'tier5_adversarial') },
];

class TestContext {
  constructor(suiteName) {
    this.suiteName = suiteName;
    this.tests = [];
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }
}

async function runSuite(filePath, tierName) {
  const relPath = path.relative(__dirname, filePath);
  const suiteModule = await import(`file://${filePath}`);
  
  if (typeof suiteModule.registerTests !== 'function') {
    throw new Error(`Suite ${relPath} does not export a registerTests(context) function.`);
  }

  const suiteName = path.basename(filePath, '.js');
  const ctx = new TestContext(suiteName);
  await suiteModule.registerTests(ctx);

  const results = [];
  console.log(`\n  ${colors.bold}${colors.cyan}● ${suiteName}${colors.reset} ${colors.dim}(${ctx.tests.length} tests)${colors.reset}`);

  for (const t of ctx.tests) {
    if (nameFilter && !t.name.toLowerCase().includes(nameFilter) && !suiteName.toLowerCase().includes(nameFilter)) {
      continue;
    }

    const start = performance.now();
    let passed = false;
    let error = null;

    try {
      await t.fn();
      passed = true;
    } catch (err) {
      passed = false;
      error = err;
    }

    const duration = (performance.now() - start).toFixed(2);
    results.push({ name: t.name, passed, error, duration });

    if (passed) {
      console.log(`    ${colors.green}✔${colors.reset} ${t.name} ${colors.dim}(${duration}ms)${colors.reset}`);
    } else {
      console.log(`    ${colors.red}✖ ${t.name}${colors.reset} ${colors.dim}(${duration}ms)${colors.reset}`);
      console.log(`      ${colors.red}${error?.stack || error?.message || error}${colors.reset}`);
      if (bail) {
        return results;
      }
    }
  }

  return results;
}

async function main() {
  const startTime = performance.now();

  console.log(`\n${colors.bold}${colors.bgBlue} STATIQONE E2E TEST RUNNER ${colors.reset}`);
  console.log(`${colors.dim}Platform: www.statiqone.com | Mode: Full Verification | Node: ${process.version}${colors.reset}\n`);

  let totalSuites = 0;
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const tierStats = {};

  for (const tier of TIERS) {
    if (tierFilter && tier.id !== tierFilter) {
      continue;
    }

    if (!fs.existsSync(tier.dir)) {
      continue;
    }

    const files = fs.readdirSync(tier.dir).filter((f) => f.endsWith('.js')).sort();
    if (files.length === 0) continue;

    console.log(`\n${colors.bold}${colors.magenta}=== ${tier.name} ===${colors.reset}`);
    tierStats[tier.id] = { name: tier.name, suites: files.length, total: 0, passed: 0, failed: 0 };

    for (const file of files) {
      const fullPath = path.join(tier.dir, file);
      totalSuites++;

      try {
        const suiteResults = await runSuite(fullPath, tier.name);
        for (const res of suiteResults) {
          totalTests++;
          tierStats[tier.id].total++;
          if (res.passed) {
            passedTests++;
            tierStats[tier.id].passed++;
          } else {
            failedTests++;
            tierStats[tier.id].failed++;
            if (bail) break;
          }
        }
      } catch (err) {
        console.log(`    ${colors.red}✖ Failed to load suite: ${file}${colors.reset}`);
        console.log(`      ${colors.red}${err.stack || err}${colors.reset}`);
        failedTests++;
        tierStats[tier.id].failed++;
        if (bail) break;
      }

      if (bail && failedTests > 0) break;
    }

    if (bail && failedTests > 0) break;
  }

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);

  // Print Summary Table
  console.log(`\n${colors.bold}═════════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold} TEST EXECUTION SUMMARY ${colors.reset}`);
  console.log(`${colors.bold}═════════════════════════════════════════════════════════════════════${colors.reset}`);

  for (const [tId, stat] of Object.entries(tierStats)) {
    const statusColor = stat.failed === 0 ? colors.green : colors.red;
    console.log(` ${colors.bold}${stat.name}${colors.reset}`);
    console.log(`   Suites: ${stat.suites} | Tests: ${stat.total} | Passed: ${statusColor}${stat.passed}${colors.reset} | Failed: ${stat.failed > 0 ? colors.red + stat.failed : colors.dim + '0'}${colors.reset}`);
  }

  console.log(`─────────────────────────────────────────────────────────────────────`);
  console.log(` Total Suites : ${colors.bold}${totalSuites}${colors.reset}`);
  console.log(` Total Tests  : ${colors.bold}${totalTests}${colors.reset}`);
  console.log(` Passed       : ${colors.green}${colors.bold}${passedTests}${colors.reset}`);
  console.log(` Failed       : ${failedTests > 0 ? colors.red + colors.bold + failedTests : colors.green + '0'}${colors.reset}`);
  console.log(` Duration     : ${colors.cyan}${elapsed}s${colors.reset}`);
  console.log(` Memory Usage : ${colors.dim}${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB${colors.reset}`);
  console.log(`${colors.bold}═════════════════════════════════════════════════════════════════════${colors.reset}`);

  if (failedTests === 0 && totalTests > 0) {
    console.log(`\n${colors.bold}${colors.bgGreen} ✔ ALL ${totalTests} E2E TESTS PASSED (100% SUCCESS) ${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${colors.bold}${colors.bgRed} ✖ TEST RUN FAILED (${failedTests} failures) ${colors.reset}\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`Fatal Runner Error:`, err);
  process.exit(1);
});
