# StatIQ One — Test Infrastructure Specification (TEST_INFRA.md)

## Overview
This document specifies the opaque-box, requirement-driven E2E test infrastructure for the **StatIQ One Warm Intelligence Visual System & Scroll Fix**.

The test suite validates compliance against specifications in `PROJECT.md`, `ORIGINAL_REQUEST.md`, and `statiqone-visual-system-scroll-fix.md`.

---

## Test Architecture & Framework Layout

The test suite is structured into modular Tier-based test files in `tests/e2e/` and driven by a unified runner `scripts/verify-e2e.ts`:

```
C:\Users\Dwarak\Documents\GitHub\StatiQ\
├── scripts/
│   └── verify-e2e.ts                         # Runnable CLI test entry point
├── tests/
│   └── e2e/
│       ├── test_utils.ts                      # File resolution, AST & CSS variable parser helpers
│       ├── tier1_feature_coverage.test.ts     # Tier 1: Feature Coverage Tests
│       ├── tier2_boundary_corner.test.ts      # Tier 2: Boundary & Corner Cases
│       ├── tier3_pairwise_combinations.test.ts# Tier 3: Pairwise Combinations & Scroll Spy
│       └── tier4_real_world.test.ts           # Tier 4: Real-world Workloads & Import Tracing
├── TEST_INFRA.md                             # Infrastructure & Test Matrix Specification
└── TEST_READY.md                             # E2E Test Suite Readiness Declaration
```

---

## Automated Test Coverage Matrix (4 Tiers)

### Tier 1: Feature Coverage
- **Warm Palette Variable Presence**: Verifies all 24 CSS custom properties (`--color-bg`, `--color-surface`, `--color-surface-raised`, `--color-ink`, `--color-ink-soft`, `--color-muted`, `--color-faint`, `--color-border`, `--color-border-soft`, `--color-accent`, `--color-accent-hover`, `--color-accent-soft`, `--color-sage`, `--color-sage-soft`, `--color-success`, `--color-warning`, `--color-error`, `--data-primary`, `--data-secondary`, `--data-tertiary`, `--data-neutral`, `--radius-sm`, `--radius-md`, `--radius-lg`) match exact Warm Intelligence values in `src/index.css`.
- **`data-site-header` Attribute**: Verifies `<header>` tag in `src/components/layout/Header.tsx` includes `data-site-header`.
- **Section `scroll-margin-top` Rules**: Verifies `section[id]` has `scroll-margin-top: 96px` (desktop) and `72px` (mobile).
- **Editorial Row Structures**: Verifies key sections (`ProofStrip`, `IntelligenceFlow`, `Capabilities`, `Methodology`, `Evidence`) incorporate editorial numbered row layout (`01 —`, `02 —`, etc.).
- **Plus Jakarta Sans Font Loading**: Verifies heading typography specifies `'Plus Jakarta Sans'` and loads cleanly.

### Tier 2: Boundary & Corner Cases
- **Responsive Mobile vs Desktop Boundaries**: Verifies `@media (max-width: 768px)` overrides `scroll-margin-top` from 96px to 72px.
- **Accessibility Reduced Motion Fallback**: Verifies `@media (prefers-reduced-motion: reduce)` block overrides `scroll-behavior: auto !important` and resets transition/animation durations.
- **Mobile Navigation Collapse & ARIA State**: Verifies mobile nav drawer uses compact modal/drawer toggling with valid `aria-expanded` and `aria-controls` attributes.

### Tier 3: Pairwise Combinations
- **Tab Mode Toggle & Smooth Scroll Ordering**: Verifies centralized `scrollToSection` helper with dynamic header height calculation and `requestAnimationFrame` layout stability before scrolling.
- **Active Section State Switching (IntersectionObserver Spy)**: Verifies `IntersectionObserver` rootMargin setup in `Home.tsx` and elimination of manual `window.scrollY + 200` scroll listeners.

### Tier 4: Real-world Application Scenarios
- **Full Marketing Page Composition**: Verifies `Home.tsx` imports and renders all 12 section components (`Header`, `Hero`, `ProofStrip`, `IntelligenceFlow`, `ProductSurface`, `Capabilities`, `Methodology`, `UseCases`, `Evidence`, `About`, `FinalCTA`, `Footer`).
- **Zero Legacy Obsidian Dark Hex Classes**: Audits all 13 core section/page files for hardcoded dark hex codes (`#09090B`, `#111111`, `#2A2A2A`, `#C8A45D`), ensuring complete adoption of Warm Intelligence tokens.
- **Zero Broken Import Paths**: Traces every import across all `.ts` and `.tsx` files in `src/` to ensure 100% path resolution.

---

## How to Run the Test Suite

Run using Node / TypeScript via `tsx` or `npm`:

```bash
# Direct runner execution
npx tsx scripts/verify-e2e.ts

# Via npm script
npm run test:e2e
# or
npm test
```

### Exit Codes & Output Format
- Exits with `code 0` when all tests pass.
- Exits with `code 1` when any test fails, printing exact diagnostic details and missing values.

---

## Expected Output Derivation & Authoritative Oracles
All expected values are derived from `PROJECT.md § Interface Contracts` and `statiqone-visual-system-scroll-fix.md § 2, 17, 18, 21`.
