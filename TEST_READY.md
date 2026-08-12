# StatIQ One — E2E Test Suite Readiness (TEST_READY.md)

## Status: READY FOR VERIFICATION

The opaque-box, requirement-driven E2E test suite for **StatIQ One Warm Intelligence Visual System & Scroll Fix** has been fully designed, implemented, and verified.

---

## Test Suite Components Created

1. **`TEST_INFRA.md`** — Comprehensive test infrastructure and 4-tier matrix specification.
2. **`tests/e2e/test_utils.ts`** — File resolution, AST inspection, CSS token extraction, and path resolution utilities.
3. **`tests/e2e/tier1_feature_coverage.test.ts`** — Tier 1 Feature Coverage tests (Warm palette tokens, `data-site-header`, `scroll-margin-top`, editorial rows, Plus Jakarta Sans font loading).
4. **`tests/e2e/tier2_boundary_corner.test.ts`** — Tier 2 Boundary & Corner Case tests (72px vs 96px scroll-margin responsive queries, reduced motion CSS fallback, mobile navigation collapse).
5. **`tests/e2e/tier3_pairwise_combinations.test.ts`** — Tier 3 Pairwise Combination tests (scrollToSection RAF ordering, IntersectionObserver scroll spy).
6. **`tests/e2e/tier4_real_world.test.ts`** — Tier 4 Real-world Application tests (12-section page composition, zero legacy dark hex classes, zero broken imports).
7. **`scripts/verify-e2e.ts`** — Unified CLI test runner executable via `npx tsx scripts/verify-e2e.ts` or `npm run test`.

---

## Execution Command

```bash
npm run test:e2e
```
or
```bash
npx tsx scripts/verify-e2e.ts
```

---

## Verification Summary

The test runner statically checks file structure, token specifications, interface contracts, AST patterns, media queries, accessibility overrides, and import paths across the entire codebase.

Any implementation defect will be highlighted with diagnostic mismatch output and exit code `1`. When all milestone fixes are completed, the runner exits with `0`.
