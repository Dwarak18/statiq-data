# Testing

StatIQ One uses a requirement-driven E2E verification approach rather than only visual smoke checks.

## Test Files

- `TEST_INFRA.md` - test architecture and coverage matrix
- `TEST_READY.md` - readiness note and execution summary
- `tests/e2e/test_utils.ts` - helper utilities
- `tests/e2e/tier1_feature_coverage.test.ts`
- `tests/e2e/tier2_boundary_corner.test.ts`
- `tests/e2e/tier3_pairwise_combinations.test.ts`
- `tests/e2e/tier4_real_world.test.ts`
- `scripts/verify-e2e.ts` - unified runner

## Coverage Model

### Tier 1

- warm palette tokens
- `data-site-header`
- section `scroll-margin-top`
- editorial row structure
- heading font usage

### Tier 2

- responsive scroll-offset boundaries
- reduced-motion fallback
- mobile navigation state handling

### Tier 3

- `scrollToSection` ordering and layout stability
- `IntersectionObserver` active-section behavior

### Tier 4

- full page composition
- no legacy dark hex classes
- no broken import paths

## Commands

Run verification with either command:

```bash
npm run test:e2e
```

```bash
npx tsx scripts/verify-e2e.ts
```

## Expectations

- Exit code `0` means the checks passed.
- Exit code `1` means at least one contract failed.
- The suite should fail loudly on missing tokens, broken imports, or scroll/navigation regressions.

## What the Tests Protect

- design token integrity
- navigation behavior
- scroll positioning
- responsive boundaries
- accessibility fallbacks
- import graph health

## Good Practice

When changing section structure, theme tokens, or navigation logic, update the tests alongside the implementation.
