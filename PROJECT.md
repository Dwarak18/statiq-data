# Project: StatIQ One — Warm Intelligence Visual System & Scroll Fix Pass

## Architecture
StatIQ One is a React 19 + TypeScript + Vite marketing and intelligence application styled using Tailwind CSS v4 (`@import "tailwindcss";` in `src/index.css`), Framer Motion v12 (`motion`), `lucide-react`, and `echarts-for-react`.

The primary entry point is `src/pages/Home.tsx`, which composes 12 section components (`Header`, `Hero`, `ProofStrip`, `IntelligenceFlow`, `ProductSurface`, `Capabilities`, `Methodology`, `UseCases`, `Evidence`, `About`, `FinalCTA`, `Footer`).

The architecture requires:
1. Centralized CSS Custom Property theme definitions in `src/index.css` following Tailwind v4 `@theme` conventions.
2. Centralized ECharts theme integration in `src/utils/chartTheme.ts`.
3. Native CSS `scroll-margin-top` + centralized JS scroll helper (`scrollToSection`) + `IntersectionObserver` active state navigation in `Header.tsx` and `Home.tsx`.
4. Decoupled, modular section components in `src/components/sections/` adhering to Warm Intelligence design tokens and editorial numbered row layouts.

## Feature Inventory
| # | Feature / Requirement | Description | Milestone | Source |
|---|-----------------------|-------------|-----------|--------|
| 1 | R1: Reconnaissance | Conduct full codebase inspection and document findings before code changes | M1 | Survey |
| 2 | R2: Warm Palette Tokens | Implement Warm Intelligence color palette (`#F7F6F2` canvas, `#20201E` ink, `#B9684E` accent, `#7D8A82` sage) in `src/index.css` | M1 | Spec §2 |
| 3 | R2: Data Viz & Radius Tokens | Add `--data-primary` to `--data-neutral` and `--radius-sm` (4px), `--radius-md` (8px), `--radius-lg` (14px) tokens | M1 | Spec §2 |
| 4 | R2: ECharts Theme Update | Update `src/utils/chartTheme.ts` to match Warm Intelligence palette | M1 | Code Audit |
| 5 | R4: CSS Scroll Margin | Add `scroll-margin-top: 96px` (desktop) / `72px` (mobile) on `section[id]` | M1 | Spec §17 |
| 6 | R4: Header `data-site-header` | Add `data-site-header` attribute to `<header>` element in `Header.tsx` | M2 | Spec §18 |
| 7 | R4: Centralized Scroll Helper | Implement `scrollToSection` helper with `requestAnimationFrame` for mode/tab scroll ordering | M2 | Spec §18-20 |
| 8 | R4: IntersectionObserver Spy | Replace `window.scrollY + 200` manual scroll listener in `Home.tsx` with `IntersectionObserver` | M2 | Spec §21 |
| 9 | R4: Accessibility & Reduced Motion | Add `prefers-reduced-motion` check for JS smooth scrolling & CSS fallback | M2 | Spec §18 |
| 10 | R3: Color Distribution Ratios | Apply ~70% warm neutral canvas, ~20% white surface-raised, ~7% text ink, ~3% accent ratio across `Home.tsx` | M3 | Spec §3 |
| 11 | R3: Hardcoded Dark Class Removal | Strip arbitrary obsidian dark classes (`bg-[#09090B]`, `bg-[#111111]`, `border-[#2A2A2A]`, `text-[#C8A45D]`) from all section components | M3 | Code Audit |
| 12 | R3: Border over Shadow & Radius | Replace heavy box-shadows with 1px border; enforce restrained radius (`rounded-sm`/`rounded-md`) | M3 | Spec §4-5 |
| 13 | R3: Editorial Numbered Rows | Convert boxy card grids in `ProofStrip`, `IntelligenceFlow`, `Capabilities`, `Methodology`, `Evidence` to numbered rows (`01 —`, `02 —`) | M4 | Spec §7 |
| 14 | R5: Typography Refinement | Enforce Plus Jakarta Sans headings with tight letter-spacing, Inter body copy with line-height 1.6-1.7, 60-75ch line length | M4 | Spec §10 |
| 15 | R6: E2E Test Suite Creation | Build requirement-driven E2E test suite covering Tiers 1-4 (Features, Boundaries, Combinations, Real-World Workloads) | Dual Track | Spec & Guidelines |
| 16 | R6: Verification & Hardening | Run `npm run lint` (`tsc --noEmit`), execute E2E test suite, perform Tier 5 white-box adversarial hardening | M5 (Final) | Spec R6 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Warm Intelligence Tokens & Global Styles | CSS `@theme` tokens, ECharts theme, CSS `scroll-margin-top` in `src/index.css` & `src/utils/chartTheme.ts` | None | PLANNED |
| M2 | Scroll & Navigation Architecture | `data-site-header` in `Header.tsx`, centralized `scrollToSection`, RAF toggle ordering, `IntersectionObserver` active state in `Home.tsx` | M1 | PLANNED |
| M3 | Home Page & Section Visual System Refinement | Strip hardcoded obsidian dark classes, apply ~70/20/7/3 distribution, border over shadow, restrained radius across sections | M1 | PLANNED |
| M4 | Editorial Numbered Rows & Typography | Refactor `ProofStrip`, `IntelligenceFlow`, `Capabilities`, `Methodology`, `Evidence` into editorial numbered rows; tune typography | M1, M3 | PLANNED |
| E2E | E2E Test Track | Design test runner & test cases for Tiers 1-4; publish `TEST_READY.md` | None | PLANNED |
| M5 | Final Verification & Hardening | 100% E2E test suite pass, `npm run lint` pass, Tier 5 adversarial coverage hardening | M1, M2, M3, M4, E2E | PLANNED |

## Interface Contracts

### Navigation & Header Contract
- Element `<header>` MUST have attribute `data-site-header`.
- Dynamic header height MUST be queryable via `document.querySelector('[data-site-header]').getBoundingClientRect().height`.
- Navigation items MUST invoke `scrollToSection(id)` which calculates top offset: `element.getBoundingClientRect().top + window.scrollY - headerHeight - 16`.
- Section elements MUST possess attribute `id="<section-name>"` and CSS `scroll-margin-top: 96px` (desktop) / `72px` (mobile).

### Visual System Token Contract
- `--color-bg`: `#F7F6F2` (Warm Canvas)
- `--color-surface`: `#FBFAF7`
- `--color-surface-raised`: `#FFFFFF`
- `--color-ink`: `#20201E`
- `--color-ink-soft`: `#4F4E49`
- `--color-muted`: `#77756E`
- `--color-border`: `#DEDDD7`
- `--color-accent`: `#B9684E`
- `--color-sage`: `#7D8A82`
- `--radius-sm`: `4px`
- `--radius-md`: `8px`
- `--radius-lg`: `14px`

## Code Layout
| Path | Owner | Description |
|------|-------|-------------|
| `src/index.css` | M1 | CSS theme variables, `@theme` block, scroll margins |
| `src/utils/chartTheme.ts` | M1 | ECharts warm color theme helper |
| `src/components/layout/Header.tsx` | M2 | Site navigation header, `data-site-header`, brand logo |
| `src/pages/Home.tsx` | M2, M3 | Main marketing page composition & `IntersectionObserver` scroll spy |
| `src/components/sections/Hero.tsx` | M3 | Hero section split layout |
| `src/components/sections/ProductSurface.tsx` | M3 | Product surface interactive canvas |
| `src/components/sections/UseCases.tsx` | M3 | Use case selector section |
| `src/components/sections/About.tsx` | M3 | Team & origin story section |
| `src/components/sections/FinalCTA.tsx` | M3 | Final call to action section |
| `src/components/layout/Footer.tsx` | M3 | Site footer component |
| `src/components/sections/ProofStrip.tsx` | M4 | Editorial metrics & verified capabilities |
| `src/components/sections/IntelligenceFlow.tsx` | M4 | Source to Output conceptual flow (numbered rows) |
| `src/components/sections/Capabilities.tsx` | M4 | Editorial numbered capabilities reveal |
| `src/components/sections/Methodology.tsx` | M4 | Technical methodology stages |
| `src/components/sections/Evidence.tsx` | M4 | Platform workflow evidence |
