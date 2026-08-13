# HANDOFF REPORT — SURVEY SUBAGENT 2

**Task:** Codebase Structure & Visual System Reconnaissance for StatIQ One Redesign & Scroll Fix  
**Working Directory:** `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\teamwork_preview_explorer_survey_2`  
**Target Repository:** `C:\Users\Dwarak\Documents\GitHub\StatiQ`  
**Date:** 2026-08-12  

---

## 1. Observation

Direct observations from inspecting the codebase at `C:\Users\Dwarak\Documents\GitHub\StatiQ`:

### A. ORIGINAL_REQUEST.md Location & Specs
- File: `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\ORIGINAL_REQUEST.md`
- Lines 217–258 specify the Warm Intelligence palette (`--color-bg: #F7F6F2`, `--color-surface: #FBFAF7`, `--color-surface-raised: #FFFFFF`, `--color-ink: #20201E`, `--color-ink-soft: #4F4E49`, `--color-muted: #77756E`, `--color-border: #DEDDD7`, `--color-accent: #B9684E`, `--color-sage: #7D8A82`, `--radius-sm: 4px`, `--radius-md: 8px`, `--radius-lg: 14px`).
- Lines 290–334 specify the navigation scroll bug fix requirements (add `data-site-header`, apply `scroll-margin-top`, replace manual `window.scrollY > 500` / offset checks with `IntersectionObserver`).

### B. CSS Theme Tokens (`src/index.css`)
- `src/index.css` lines 1–53 define Tailwind v4 `@import "tailwindcss";` and `@theme { ... }` block.
- Lines 57–92 define `:root, html.dark` with obsidian/dark tokens (`--color-background: #09090B`, `--color-surface: #111111`, `--color-card: #171717`, `--color-border: #2A2A2A`, `--color-primary: #C8A45D`).
- Lines 36–39 define radius tokens: `--radius-sm: 6px`, `--radius-md: 12px`, `--radius-lg: 20px`.

### C. Home Page Structure & Hardcoded Styling (`src/pages/Home.tsx`)
- Line 48: `<div className="flex min-h-screen flex-col bg-[#09090B] font-sans text-[#F4F4F5]">` hardcodes obsidian dark background `#09090B`.
- Lines 20–34: Manual scroll position spy algorithm: `const scrollPosition = window.scrollY + 200;` checking `element.offsetTop`.
- Lines 40–45: `handleNavigate` handler uses `element.scrollIntoView({ behavior: 'smooth' })`.
- All 12 sections are rendered in sequence: `Header`, `Hero`, `ProofStrip`, `IntelligenceFlow`, `ProductSurface`, `Capabilities`, `Methodology`, `UseCases`, `Evidence`, `About`, `FinalCTA`, `Footer`.

### D. Layout Components & Header Audit (`src/components/layout/Header.tsx`, `Footer.tsx`)
- `Header.tsx` line 65: `<header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-[#09090B]/90 backdrop-blur-xl border-b border-[#2A2A2A] shadow-md' : 'bg-transparent border-b border-transparent'}`}>` — missing `data-site-header` attribute.
- `Header.tsx` line 52: Uses direct `el.scrollIntoView({ behavior: 'smooth' })` when clicking nav items.
- `Header.tsx` line 84 & `Footer.tsx` line 18: Logo text displays `STATIQDATA` instead of `StatIQ One`.

### E. Section Components & Card Grids (`src/components/sections/*.tsx`)
- Every section component (`Hero.tsx`, `ProofStrip.tsx`, `IntelligenceFlow.tsx`, `ProductSurface.tsx`, `Capabilities.tsx`, `Methodology.tsx`, `UseCases.tsx`, `Evidence.tsx`, `About.tsx`, `FinalCTA.tsx`) contains hardcoded dark classes: `bg-[#09090B]`, `bg-[#111111]`, `bg-[#171717]`, `border-[#2A2A2A]`, `text-[#F4F4F5]`, `text-[#C8A45D]`.
- Grids identified for editorial row conversion:
  - `Hero.tsx` lines 174–200: 2x2 grid of `MARKET_INDICATORS` cards (`bg-[#171717] border-[#2A2A2A]`).
  - `ProofStrip.tsx` lines 59–85: 4-box grid of `DataPoint` metric components.
  - `IntelligenceFlow.tsx` lines 64–104: 4-box card grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
  - `Methodology.tsx` lines 52–91: 3-box pipeline stage grid (`grid-cols-1 md:grid-cols-3`).
  - `Evidence.tsx` lines 50–106: 2-column workflow cards grid (`grid-cols-1 md:grid-cols-2`).

### F. Chart Utility Theme (`src/utils/chartTheme.ts`)
- Lines 6–11 define hardcoded obsidian colors: `GOLD_PRIMARY = '#C8A45D'`, `GRAPHITE_BORDER = '#2A2A2A'`, `CARD_BACKGROUND = '#171717'`, `TEXT_MUTED = '#A3A3A3'`, `TEXT_MAIN = '#F5F5F5'`.

### G. HTML Meta & Fonts (`index.html`, `App.tsx`)
- `index.html` lines 22–24: Google Fonts loaded (`Inter`, `JetBrains Mono`, `Plus Jakarta Sans`).
- `index.html` line 6: `<title>StatIQ One — Enterprise Financial Research &amp; Market Intelligence Platform</title>`.
- `App.tsx` lines 18–42: 12 routes registered under `ThemeProvider` and `ToastProvider`.

---

## 2. Logic Chain

1. **From Observation A & B**: `index.css` currently implements an obsidian dark color scheme (`#09090B`, `#111111`, `#C8A45D`). Replacing this with the Warm Intelligence system (`#F7F6F2`, `#20201E`, `#B9684E`) requires replacing the CSS custom properties in `@theme` and `:root` in `src/index.css`.
2. **From Observation C & E**: Hundreds of inline Tailwind arbitrary hex classes (`bg-[#09090B]`, `bg-[#111111]`, `bg-[#171717]`, `border-[#2A2A2A]`, `text-[#F4F4F5]`, `text-[#C8A45D]`) are hardcoded across `Home.tsx` and all section components. Simply modifying `index.css` without removing these inline hex classes will leave the components styled in dark obsidian. Therefore, all section files must be refactored to use semantic theme tokens (`bg-bg`, `bg-surface`, `bg-surface-raised`, `border-border`, `text-ink`, `text-accent`).
3. **From Observation D & C**: Navigation clicks use native `scrollIntoView({ behavior: 'smooth' })` without offset, and `<header>` is missing `data-site-header`. When scrolling to `#product`, `#capabilities`, `#methodology`, `#use-cases`, or `#about`, the top 64px sticky header overlaps and obscures the section titles. Adding `data-site-header` to `<header>`, applying `scroll-margin-top: 96px` to section anchors, and switching `Home.tsx` scroll spy to `IntersectionObserver` will resolve the scroll bug.
4. **From Observation E & F**: `IntelligenceFlow.tsx`, `Methodology.tsx`, `ProofStrip.tsx`, and `Evidence.tsx` rely on dark box grids. Converting these to clean editorial numbered rows (`01 —`, `02 —`) will fulfill Requirement R3 and R4 of the visual system specification. Updating `src/utils/chartTheme.ts` will ensure ECharts visual surfaces match the warm palette.

---

## 3. Caveats

- **Theme Context Behavior**: `src/context/ThemeContext.tsx` was not modified during this read-only phase. Its default state setting should be reviewed during implementation to ensure it does not force `.dark` class overrides on top of Warm Intelligence defaults.
- **Other Pages**: Pages outside of `Home.tsx` (such as `/statistics`, `/dashboard`, `/pricing`) were not altered. Their custom components may still use dark hex values until audited separately.

---

## 4. Conclusion

The StatiQ codebase structure is well-organized with clean section decomposition in `src/components/sections/` and a clear route architecture in `App.tsx`. However, to fulfill the Warm Intelligence visual system and fix the navigation scroll bug:

1. `src/index.css` must be updated with the Warm Intelligence CSS variables and radius tokens.
2. `src/utils/chartTheme.ts` must be updated with warm chart tokens.
3. `Header.tsx` must add `data-site-header` and use offset scroll calculation.
4. Section components and `Home.tsx` must be audited to remove hardcoded `#09090B` / `#111111` / `#2A2A2A` / `#C8A45D` classes and apply `scroll-margin-top`.
5. Card grids in `IntelligenceFlow`, `Methodology`, `ProofStrip`, and `Evidence` must be refactored to editorial numbered rows.
6. `Home.tsx` scroll spy must switch from `window.scrollY + 200` to `IntersectionObserver`.

---

## 5. Verification Method

To independently verify the survey findings and subsequent implementation changes:

1. **Static Analysis & Type Verification**:
   - Run `npm run lint` or `npx tsc --noEmit` from working directory `C:\Users\Dwarak\Documents\GitHub\StatiQ` to confirm zero TypeScript compilation errors.
2. **Visual Inspection**:
   - Start dev server via `npm run dev` and navigate to `http://localhost:5173`.
   - Inspect `#root` background in devtools to verify `--color-bg: #F7F6F2` canvas background.
   - Verify `<header>` has attribute `data-site-header`.
   - Click navigation links ("Product", "Capabilities", "Methodology", "Use Cases", "About") and verify section titles land clearly below the sticky header without being obscured.
3. **Invalidation Conditions**:
   - Any remaining `#09090B` or `#111111` background classes on `Home.tsx` sections.
   - Section headings hidden under header after navigation click.
   - TypeScript or lint errors during `npm run lint`.
