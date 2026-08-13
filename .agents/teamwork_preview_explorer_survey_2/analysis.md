# STATIQ ONE CODEBASE SURVEY & VISUAL SYSTEM AUDIT REPORT

**Author:** Survey Subagent 2 (`teamwork_preview_explorer`)  
**Target Repository:** `C:\Users\Dwarak\Documents\GitHub\StatiQ`  
**Date:** 2026-08-12  

---

## 1. Executive Summary & Scope Overview

This report provides a comprehensive, read-only reconnaissance and technical audit of the **StatIQ One** marketing website (`src/pages/Home.tsx`, `src/index.css`, layout/section/UI components, font setup, and navigation logic).

The current implementation reflects an initial redesign pass that used an obsidian/near-black theme (`#09090B`, `#111111`, `#171717`) with gold accents (`#C8A45D`). The repository is now transitioning to the **Warm Intelligence** visual system (`#F7F6F2` warm canvas, `#20201E` ink, `#B9684E` terracotta accent, `#7D8A82` sage), accompanied by a critical fix for a navigation/scroll positioning bug.

---

## 2. Analysis of ORIGINAL_REQUEST.md & Specification Requirements

Key requirements defined in `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\ORIGINAL_REQUEST.md` and related specs (`statiqone-redesign.md`, `statiqone-visual-system-scroll-fix.md`):

1. **Warm Intelligence Palette Replacement**:
   - Primary canvas background: `#F7F6F2` (`--color-bg`)
   - Surface background: `#FBFAF7` (`--color-surface`)
   - Raised surface background: `#FFFFFF` (`--color-surface-raised`)
   - Primary text / ink: `#20201E` (`--color-ink`)
   - Soft ink: `#4F4E49` (`--color-ink-soft`)
   - Muted text: `#77756E` (`--color-muted`)
   - Borders: `#DEDDD7` (`--color-border`), `#E9E7E1` (`--color-border-soft`)
   - Accent color: `#B9684E` (`--color-accent`), `#A85B43` (`--color-accent-hover`), `#EAD8D0` (`--color-accent-soft`)
   - Sage secondary: `#7D8A82` (`--color-sage`), `#DCE1DC` (`--color-sage-soft`)
   - Data visual tokens: `--data-primary` (`#667A70`), `--data-secondary` (`#B9684E`), `--data-tertiary` (`#A8ADA4`), `--data-neutral` (`#D7D5CE`)
   - Restrained radii: `--radius-sm` (4px), `--radius-md` (8px), `--radius-lg` (14px)

2. **Color & Surface Distribution**:
   - Target ratio: ~70% warm neutral canvas, ~20% white surfaces, ~7% typography, ~3% accent + data colors.
   - Do NOT alternate background colors per section. Default to `--color-bg` (#F7F6F2).
   - Replace heavy drop-shadows with subtle 1px borders (`var(--color-border)`).
   - Remove hardcoded dark hex codes (`#09090B`, `#111111`, `#171717`, `#2A2A2A`, `#C8A45D`).

3. **Editorial Card Conversions**:
   - Convert generic 3-card or multi-card grids into editorial numbered rows (`01 — Title / Description`).

4. **Navigation & Scroll Positioning Bug Fix**:
   - Fixed header covers section headings when scrolling via navigation controls/toggles (`scrollIntoView` bug).
   - Required fixes: Add `data-site-header` to `<header>`, apply `scroll-margin-top` to section anchors, replace manual scroll spy (`window.scrollY + 200`) with `IntersectionObserver`.

---

## 3. Tailwind v4 Theme Structure & CSS Token Inventory (`src/index.css`)

### Current Setup
- `src/index.css` uses Tailwind v4 `@import "tailwindcss";` followed by `@theme { ... }` block and `@layer base { ... }`.

### Existing CSS Custom Properties (`@theme` & `:root`)
- **Colors**:
  - `--color-primary`: `#C8A45D` (Dark) / `#B8913F` (Light)
  - `--color-hover` / `--color-accent-hover`: `#E3C47A` / `#A07830`
  - `--color-accent`: `#C8A45D`
  - `--color-bg` / `--color-background`: `#09090B` (Dark) / `#F8F8F6` (Light)
  - `--color-surface`: `#111111` (Dark) / `#FFFFFF` (Light)
  - `--color-surface-muted` / `--color-card`: `#171717` (Dark) / `#F2F1EE` (Light)
  - `--color-text` / `--color-text-main`: `#F4F4F5` / `#111111`
  - `--color-border`: `#2A2A2A` / `#E0DDD6`
- **Fonts**:
  - `--font-sans`: `'Inter', sans-serif`
  - `--font-heading`: `'Plus Jakarta Sans', sans-serif`
  - `--font-mono`: `'JetBrains Mono', monospace`
- **Radii**:
  - `--radius-sm`: `6px` -> Needs update to `4px`
  - `--radius-md`: `12px` -> Needs update to `8px`
  - `--radius-lg`: `20px` -> Needs update to `14px`
  - `--radius-xl`: `1rem` (16px)

### Discrepancy Note
The root theme (`:root, html.dark`) currently defaults to dark obsidian (#09090B). The light theme rules (`html.light`) exist but do not match the exact Warm Intelligence specification tokens (`#F7F6F2`, `#20201E`, `#B9684E`).

---

## 4. Current Code Structure & Component Tree

### Entry Points & Global Config
- **`index.html`**:
  - Title: `StatIQ One — Enterprise Financial Research & Market Intelligence Platform`
  - Canonical link: `https://statiqone.com/`
  - Meta description & Open Graph tags present.
  - Preconnected Google Fonts loaded: `Inter` (300, 400, 500, 600, 700), `JetBrains Mono` (400, 500, 600, 700), `Plus Jakarta Sans` (400, 500, 600, 700, 800).
- **`src/App.tsx`**:
  - Context Providers: `ThemeProvider`, `ToastProvider`.
  - Router setup: `BrowserRouter` with 12 routes (`/`, `/statistics`, `/login`, `/signup`, `/dashboard`, `/dataset`, `/company`, `/industry`, `/country`, `/search`, `/workspace`, `/pricing`, `/advertising`).
- **`src/pages/Home.tsx`**:
  - Wraps all 12 marketing sections in a single column layout.
  - Root `<div className="flex min-h-screen flex-col bg-[#09090B] font-sans text-[#F4F4F5]">` has hardcoded `#09090B`.
  - Implements scroll spy using `window.scrollY + 200` and `element.offsetTop`.
  - Implements `handleNavigate` calling `element.scrollIntoView({ behavior: 'smooth' })`.

### Component Directory Hierarchy (`src/components/`)
```
src/components/
├── layout/
│   ├── Header.tsx           # Sticky nav header (missing data-site-header)
│   ├── Footer.tsx           # Global site footer
│   ├── MobileNav.tsx        # Mobile menu drawer
│   └── Layout.tsx           # Page layout wrapper
├── sections/
│   ├── Hero.tsx             # Section 02: Split hero + live macro snapshot card
│   ├── ProofStrip.tsx       # Section 03: Source chips + 4 DataPoint metrics
│   ├── IntelligenceFlow.tsx # Section 04: 4-stage pipeline grid
│   ├── ProductSurface.tsx   # Section 05: ECharts workspace canvas + citation panel
│   ├── Capabilities.tsx     # Section 06: Editorial accordion (4 items)
│   ├── Methodology.tsx      # Section 07: Technical memorandum card + 3-stage pipeline
│   ├── UseCases.tsx         # Section 08: Role tabs (4 roles) + pathway details
│   ├── Evidence.tsx         # Section 09: 2-column workflow specification cards
│   ├── About.tsx            # Section 10: Mission quote + 3 core principles
│   └── FinalCTA.tsx         # Section 11: Call to action card + trust badges
└── ui/
    ├── Button.tsx, Card.tsx, Container.tsx, DataPoint.tsx, Reveal.tsx, SectionLabel.tsx, Tabs.tsx, etc.
```

---

## 5. Section-by-Section Detailed Inspection

| Section | File Path | Current Background & Border | Key Subcomponents & Elements | Discrepancies & Hardcoded Styles |
|---|---|---|---|---|
| **01 Nav / Header** | `src/components/layout/Header.tsx` | `bg-[#09090B]/90 border-[#2A2A2A]` | `BarChart2` logo icon, `NAV_ITEMS`, `SpotlightSearchModal`, `ThemeToggle` | Missing `data-site-header`; logo text says `STATIQDATA` instead of `StatIQ One`; hardcoded `#09090B`, `#2A2A2A`, `#C8A45D`. |
| **02 Hero** | `src/components/sections/Hero.tsx` | `bg-[#09090B] border-b border-[#2A2A2A]` | SectionLabel "01", H1 headline, CTA buttons, search bar, `MARKET_INDICATORS` grid (2x2) | Radial dot pattern opacity-15 (`#2A2A2A`), hardcoded dark colors `#111111`, `#171717`, `#C8A45D`. Direct `scrollIntoView` call on button click. |
| **03 Proof Strip** | `src/components/sections/ProofStrip.tsx` | `bg-[#09090B] border-b border-[#2A2A2A]` | `VERIFIED_SOURCES` horizontal scroller (6 chips), 4 `DataPoint` metric cards | 4-card metric grid uses dark card background `#111111`. Has `[CONTENT PLACEHOLDER]` tag. |
| **04 What StatIQ One Does** | `src/components/sections/IntelligenceFlow.tsx` | `bg-[#09090B] border-b border-[#2A2A2A]` | 4-stage pipeline flow grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`) | 4 separate card boxes (`bg-[#111111] border-[#2A2A2A]`). Can be refined into a unified horizontal flow. |
| **05 Product Surface** | `src/components/sections/ProductSurface.tsx` | `bg-[#09090B] border-b border-[#2A2A2A]`, id="product" | Dataset key tabs (`aapl`, `fed`, `ai`), 8-col ECharts line chart, 4-col citation panel | Chart uses `src/utils/chartTheme.ts` constants (`GOLD_PRIMARY = '#C8A45D'`, `CARD_BACKGROUND = '#171717'`, `GRAPHITE_BORDER = '#2A2A2A'`). Missing `scroll-margin-top`. |
| **06 Capabilities** | `src/components/sections/Capabilities.tsx` | `bg-[#09090B] border-b border-[#2A2A2A]`, id="capabilities" | 4-col sticky info card, 8-col accordion list (`01 —`, `02 —`, `03 —`, `04 —`) | Uses dark accordion items (`bg-[#111111] border-[#2A2A2A] border-[#C8A45D]/60`). Missing `scroll-margin-top`. |
| **07 Methodology** | `src/components/sections/Methodology.tsx` | `bg-[#09090B] border-b border-[#2A2A2A]`, id="methodology" | Technical memorandum container, 3-card pipeline grid (`bg-[#171717]/60`) | Top accent line is gold (`#C8A45D`). Missing `scroll-margin-top`. |
| **08 Use Cases** | `src/components/sections/UseCases.tsx` | `bg-[#09090B] border-b border-[#2A2A2A]`, id="use-cases" | `Tabs` component (4 roles), 7-col details, 5-col metric preview card (`bg-[#171717]`) | Hardcoded dark background `#111111` and `#171717`. Missing `scroll-margin-top`. |
| **09 Evidence** | `src/components/sections/Evidence.tsx` | `bg-[#09090B] border-b border-[#2A2A2A]` | 2-column workflow cards (`grid-cols-1 md:grid-cols-2`) with 3-step process blocks | Uses dark workflow card containers (`bg-[#111111] border-[#2A2A2A]`). Has `[CONTENT PLACEHOLDER]` tag. |
| **10 About / Team** | `src/components/sections/About.tsx` | `bg-[#09090B] border-b border-[#2A2A2A]`, id="about" | 5-col mission quote block (`bg-[#111111]`), 7-col stacked principles cards (3 items) | Hardcoded dark surfaces `#111111`. Missing `scroll-margin-top`. |
| **11 Final CTA** | `src/components/sections/FinalCTA.tsx` | `bg-[#09090B] border-b border-[#2A2A2A]` | Centered container (`bg-[#111111] border-[#2A2A2A]`), CTAs, trust badges | Background radial grid pattern in dark gray (`#2A2A2A`). |
| **12 Footer** | `src/components/layout/Footer.tsx` | `bg-[#09090B] border-t border-[#2A2A2A]` | Brand column (2 cols), Institutional links, Platform links, Governance links | Logo text says `STATIQDATA`. Hardcoded dark gray `#09090B`, `#2A2A2A`, `#A1A1AA`. |

---

## 6. Card Grids to be Converted to Editorial Rows & Asymmetric Layouts

1. **Proof Strip Metrics (`ProofStrip.tsx`)**:
   - Current: 4 discrete boxes (`grid-cols-2 md:grid-cols-4`) using `DataPoint` component.
   - Candidate for conversion to editorial metric strip or clean bordered layout.

2. **Intelligence Flow (`IntelligenceFlow.tsx`)**:
   - Current: 4 separate card boxes (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
   - Candidate for conversion to connected horizontal flow steps with numbered rules (`01 Primary Ingestion → 02 Intelligence Layer → 03 Analysis Engine → 04 Decision Output`).

3. **Methodology Pipeline Stages (`Methodology.tsx`)**:
   - Current: 3-card grid (`grid-cols-1 md:grid-cols-3`) with `bg-[#171717]/60` cards inside memorandum container.
   - Candidate for conversion to sequential editorial rows (`01 / Ingestion`, `02 / Screening`, `03 / Cross-Filing`).

4. **Evidence Workflows (`Evidence.tsx`)**:
   - Current: 2 large card blocks (`grid-cols-1 md:grid-cols-2`).
   - Candidate for conversion to split editorial specification rows.

---

## 7. Font Loading & Typography Audit

- **Loaded Fonts (`index.html`)**:
  - `Inter`: Weights 300, 400, 500, 600, 700 (Used for `--font-sans` body copy)
  - `Plus Jakarta Sans`: Weights 400, 500, 600, 700, 800 (Used for `--font-heading` display headers)
  - `JetBrains Mono`: Weights 400, 500, 600, 700 (Used for `--font-mono` labels, metrics, code tags)
- **CSS Hierarchy Settings**:
  - Base body: `font-family: var(--font-sans);`
  - Headings `h1..h6`: `font-family: var(--font-heading);`
- **Tuning Needed**:
  - Heading `letter-spacing` currently uses generic `tracking-tight` (-0.025em). Tightening display headers (e.g. `tracking-tighter` / `-0.035em`) will provide a more confident editorial feel.
  - Body paragraph `line-height` should be consistently ~1.6–1.7 (`leading-relaxed` / `leading-7`).

---

## 8. Scroll & Navigation Positioning Bug Audit (Phase 1 Audit)

### Observations
1. **Header Identification**:
   - `src/components/layout/Header.tsx` renders `<header className="...">` but lacks the required `data-site-header` attribute.
2. **Section Anchor Configuration**:
   - Sections in `Home.tsx` (`id="product"`, `id="capabilities"`, `id="methodology"`, `id="use-cases"`, `id="about"`) do NOT have CSS `scroll-margin-top` set.
3. **Scroll Navigation Calls**:
   - `Home.tsx` line 43: `element.scrollIntoView({ behavior: 'smooth' })`
   - `Header.tsx` line 52: `el.scrollIntoView({ behavior: 'smooth' })`
   - `Hero.tsx` line 95: `el.scrollIntoView({ behavior: 'smooth' })`
   - Native `scrollIntoView()` places the element's top edge at viewport `y=0`, which causes the 64px sticky header (`h-16`) to overlap and hide section titles!
4. **Scroll Spy Implementation**:
   - `Home.tsx` lines 20–34: Uses manual scroll position calculation: `const scrollPosition = window.scrollY + 200;` and `element.offsetTop`.
   - Spec requirement R4 explicitly mandates using `IntersectionObserver` for active section navigation state.

---

## 9. Visual System Discrepancies & Token Mapping

| Current Token / Style | Current Dark Hex | Warm Intelligence Target Hex | CSS Property / Class Target |
|---|---|---|---|
| Main Canvas Background | `#09090B` | `#F7F6F2` | `--color-bg: #F7F6F2` |
| Surface Background | `#111111` | `#FBFAF7` | `--color-surface: #FBFAF7` |
| Surface Raised / Card | `#171717` | `#FFFFFF` | `--color-surface-raised: #FFFFFF` |
| Primary Text / Ink | `#F4F4F5` / `#F5F5F5` | `#20201E` | `--color-ink: #20201E` |
| Soft Ink / Secondary Text | `#A1A1AA` / `#A3A3A3` | `#4F4E49` | `--color-ink-soft: #4F4E49` |
| Muted Text / Captions | `#7A7A7A` | `#77756E` | `--color-muted: #77756E` |
| Borders | `#2A2A2A` | `#DEDDD7` | `--color-border: #DEDDD7` |
| Soft Borders | `#1E1E1E` | `#E9E7E1` | `--color-border-soft: #E9E7E1` |
| Accent Color | `#C8A45D` (Gold) | `#B9684E` (Terracotta) | `--color-accent: #B9684E` |
| Accent Hover | `#E3C47A` | `#A85B43` | `--color-accent-hover: #A85B43` |
| Accent Soft Background | `#C8A45D`/10 | `#EAD8D0` | `--color-accent-soft: #EAD8D0` |
| Sage Secondary | N/A | `#7D8A82` | `--color-sage: #7D8A82` |
| Data Primary | `#C8A45D` | `#667A70` | `--data-primary: #667A70` |
| Radius (Small) | `6px` | `4px` | `--radius-sm: 4px` |
| Radius (Medium) | `12px` | `8px` | `--radius-md: 8px` |
| Radius (Large) | `20px` | `14px` | `--radius-lg: 14px` |

---

## 10. Recommended Next Steps for Implementation Team

1. **CSS System Update (`src/index.css`)**:
   - Inject the Warm Intelligence `--color-*` and `--data-*` tokens into the `@theme` block and `:root` / `html` layers.
   - Update radius tokens (`4px`, `8px`, `14px`).

2. **Chart Theme Constants (`src/utils/chartTheme.ts`)**:
   - Update `GOLD_PRIMARY`, `CARD_BACKGROUND`, `GRAPHITE_BORDER`, `TEXT_MAIN`, `TEXT_MUTED` to reference Warm Intelligence color variables or matching light warm hexes.

3. **Section Background & Border Audit (`src/pages/Home.tsx` + `src/components/sections/*.tsx`)**:
   - Purge arbitrary dark classes (`bg-[#09090B]`, `bg-[#111111]`, `bg-[#171717]`, `border-[#2A2A2A]`, `text-[#F4F4F5]`, `text-[#C8A45D]`).
   - Standardize on semantic tokens (`bg-bg`, `bg-surface`, `bg-surface-raised`, `border-border`, `text-ink`, `text-ink-soft`, `text-accent`).

4. **Scroll & Header Fix**:
   - Add `data-site-header` to `<header>` in `Header.tsx`.
   - Add `scroll-margin-top: 96px` (mobile: `72px`) to `section[id]` rules in `index.css` or Tailwind classes.
   - Implement centralized `scrollToSection` helper using header height calculation.
   - Replace manual `window.scrollY + 200` in `Home.tsx` with `IntersectionObserver`.

5. **Editorial Card Layout Refinement**:
   - Refine `ProofStrip`, `IntelligenceFlow`, `Methodology`, and `Evidence` to reduce dark card grid boxiness into clean editorial rows.

6. **Brand Name Consistency**:
   - Standardize header/footer logo branding from `STATIQDATA` to `StatIQ One`.
