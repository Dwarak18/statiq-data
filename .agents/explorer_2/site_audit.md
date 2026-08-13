# Existing-Site UI/UX Audit Report — StatIQ One Marketing Redesign

**Auditor**: Explorer 2 (Existing-Site UI/UX Auditor)  
**Target File**: `src/pages/Home.tsx` & Associated Components (`Navbar.tsx`, `Footer.tsx`, `InstitutionalTrustBar.tsx`, `PremiumExperience.tsx`, `Card.tsx`, `Button.tsx`, `Badge.tsx`, `index.css`)  
**Date**: August 12, 2026  
**Status**: Completed — Read-Only Investigation  

---

## Executive Summary

An in-depth UI/UX, typographic, architectural, responsive, and accessibility audit was conducted on `src/pages/Home.tsx` and its supporting design primitives and layout components. 

While the current implementation attempts to convey an institutional tone through dark-mode surface colors (`#09090B`, `#171717`) and gold accents (`#C8A45D`), it heavily suffers from **generic AI SaaS landing page anti-patterns**, **missing 7 of 12 core product architecture sections**, **WCAG 2.1 AA accessibility violations**, **hardcoded/fabricated business metrics**, and **unoptimized mobile layouts**.

This document outlines the direct observations, logical chains, caveats, final conclusions, and an exhaustive list of all 14 identified flaws mapped cleanly to:
`Problem → Why it hurts → Proposed fix → Implementation location`.

---

## 1. Observation

### A. Repository & Component Architecture Survey
- **Page Entry**: `src/pages/Home.tsx` (485 lines) wrapped in `<Layout>` (`src/components/layout/Layout.tsx`).
- **Layout Primitives**: `<Navbar />` (`src/components/layout/Navbar.tsx`), `<Footer />` (`src/components/layout/Footer.tsx`).
- **UI Primitives**: `<Button>` (`src/components/ui/Button.tsx`), `<Card>` (`src/components/ui/Card.tsx`), `<Badge>` (`src/components/ui/Badge.tsx`), `<InstitutionalTrustBar>` (`src/components/ui/InstitutionalTrustBar.tsx`), `<PremiumExperience>` (`src/components/ui/PremiumExperience.tsx`).
- **Design Tokens**: Tailwind CSS v4 `@theme` block in `src/index.css`.
- **Iconography**: `lucide-react`.
- **Motion**: `motion` (Framer Motion v12).

### B. Current Section Architecture Inventory
The current `Home.tsx` consists of 7 sections:
1. **Hero Section** (`Home.tsx:84-218`): Left editorial copy + search bar + trending pills; Right "Live Macro Snapshot" hardcoded indicator card; Bottom metrics band.
2. **Institutional Trust Bar** (`InstitutionalTrustBar.tsx`): Source integrity pills (`SEC EDGAR`, `IMF`, `World Bank`, `FRED`, `Eurostat`, `OECD`).
3. **Category Filter Strip** (`Home.tsx:223-237`): Horizontal scroll of 9 sector buttons.
4. **Featured Institutional Statistics Grid** (`Home.tsx:240-289`): 4-card grid displaying static metrics.
5. **Quick Access Matrix** (`Home.tsx:292-386`): 3 columns (Key Sectors, Top Equities, Sovereign Economies) with 5 hardcoded link rows each.
6. **Reports & Exclusive Intelligence** (`Home.tsx:389-455`): 4 report cards with lock icons + toast trigger PDF links + `UpgradeCard`.
7. **Institutional Digest Subscription** (`Home.tsx:458-482`): Newsletter subscription form.
8. **Footer** (`Footer.tsx`): 5-column link layout + copyright notice © 2027.

### C. Missing Required Redesign Sections (from `statiqone-redesign.md` & R2)
- **Section 04 (What StatIQ One does)**: Conceptual model diagram (`Sources → Intelligence Layer → Analysis → Output`) is **completely missing**.
- **Section 05 (Product surface)**: Large interactive data canvas or research workspace visual is **missing** (only a small hardcoded macro snapshot card exists in the hero).
- **Section 06 (Capabilities)**: Numbered editorial list (`01—`, `02—`, `03—`) with accordion reveal is **missing** (replaced by generic 4-card grids).
- **Section 07 (Research / methodology)**: Technical research note layout with monospace labels and process explanation is **missing**.
- **Section 08 (Use cases / sectors)**: Interactive tabbed selector (`Researchers | Businesses | Analysts | Decision Makers`) is **missing**.
- **Section 09 (Evidence / case studies)**: "How the platform is used" structured framing is **missing**.
- **Section 10 (About / team)**: Concise origin, philosophy, and human context section is **missing**.

---

## 2. Logic Chain

1. **Anti-Pattern Presence → Compromised Product Credibility**:
   - *Observation*: `Home.tsx` relies on hardcoded static numbers (`3.5M+ Audited Statistics`, `45K+ Reports`, `$3.45T AAPL Cap`, `$407.0B Spend`) and fake "REAL-TIME" pulses (`Home.tsx:169`). PDF clicks trigger `Toast` popups ("requires Premium Access") rather than real modal workflows.
   - *Deduction*: This violates Requirement R5 (no fabricated business metrics) and Requirement R4 (anti-AI design rules). It gives the website a prototype/demo feel rather than an authentic institutional data product.

2. **Card Grid Monotony → Generic Template Appearance**:
   - *Observation*: Section 4 (`Featured Institutional Statistics`) and Section 6 (`Reports`) both use 4-column `Card` grids with rounded corners, top badges, mono numbers, and hover lifts (`whileHover={{ y: -4 }}`). Section 5 uses 3 parallel card columns.
   - *Deduction*: Stacking multiple identical card grids creates visual monotony. Fails Section 06 spec requirement for an editorial numbered capability reveal list and Section 04 conceptual workflow diagram.

3. **Inconsistent Design System Tokens → Structural Discord**:
   - *Observation*: Card component has hardcoded `rounded-[16px]` (`Card.tsx:8`). Buttons use `rounded-md` (6px), form inputs use `rounded-xl` (12px), search bar uses `rounded-xl` (12px). Container max-widths fluctuate between `max-w-6xl` (1152px), default container (1280px), and `max-w-2xl` (672px).
   - *Deduction*: Lack of unified CSS layout tokens (`--container-max`, `--space-section`, `--radius-md`) results in misaligned section edges and inconsistent UI element geometry across viewports.

4. **Accessibility Flaws → Non-Compliance with WCAG 2.1 AA**:
   - *Observation*: Heading levels jump directly from H1 to H3 in Quick Access Matrix (`Home.tsx:304`) skipping H2, and from H2 to H4 in Reports (`Home.tsx:422`) skipping H3. Gold text `#C8A45D` at 10-12px size against `#09090B` surface yields ~4.3:1 contrast ratio (fails 4.5:1 AA target). Search input (`Home.tsx:117`) and newsletter input (`Home.tsx:470`) have no `<label>` or `aria-label`. Interactive icons (`Home.tsx:307`) use raw `onClick` without `role="button"` or `tabIndex`.
   - *Deduction*: The current page fails automated accessibility audits and presents major barriers for keyboard and screen-reader users.

5. **Mobile Viewport Neglect → Unoptimized Touch Experience**:
   - *Observation*: Desktop keyboard hints (`Press ↵`, `Cmd + K`) remain visible on mobile screen widths (< 640px). The mobile hero stacks copy above a tall 2x2 macro grid card, pushing all core messaging below the fold. Horizontal filter strips cut off pills without scroll indicators.
   - *Deduction*: Mobile viewports (390px, 430px) were treated as a simple column collapse rather than an intentionally art-directed mobile layout.

---

## 3. Comprehensive Flaw Mapping

Below is the complete, line-by-line documentation of every identified flaw across `src/pages/Home.tsx` and associated files:

### Flaw 1: Hardcoded & Fabricated Business Metrics
- **Problem**: Marketing copy uses hardcoded static metrics (`3.5M+ Audited Statistics`, `45K+ Institutional Reports`, `$3.45T AAPL Cap`, `$407.0B Spend`, `3,542,109 Series Active`) without real API integrations or verified source citations.
- **Why it hurts**: Violates Requirement R5 ("Do not fabricate business facts/metrics"). Hardcoded market caps and active series numbers become stale immediately and compromise institutional credibility.
- **Proposed fix**: Replace fabricated marketing statistics with verified platform capability statements, real product data visualizations, or clearly marked `[CONTENT PLACEHOLDER: ...]` tags.
- **Implementation location**: `src/pages/Home.tsx:23-35, 189, 205-215, 337-352, 367-382`.

---

### Flaw 2: Missing 7 of 12 Core Architecture Sections
- **Problem**: `Home.tsx` lacks 7 required sections: Section 04 (What StatIQ One Does flow diagram), Section 05 (Product Surface interactive data canvas), Section 06 (Capabilities numbered editorial list), Section 07 (Research / Methodology note), Section 08 (Use Cases tabbed selector), Section 09 (Evidence / "How platform is used"), and Section 10 (About / Team).
- **Why it hurts**: Violates Requirement R2 and Redesign Spec Section 01-12. The visitor is left without an understanding of the product mechanism, target personas, methodology, or workspace.
- **Proposed fix**: Deconstruct `Home.tsx` into 12 modular section components residing in `src/components/sections/` and assemble them according to the spec flow.
- **Implementation location**: `src/pages/Home.tsx`, `src/components/sections/`.

---

### Flaw 3: Generic SaaS 4-Card Grid Monotony
- **Problem**: "Featured Institutional Statistics" and "Institutional Research Reports" use identical 4-column card grids (`Card` components with rounded borders, top badges, mono numbers, and hover lift animations).
- **Why it hurts**: Violates Requirement R4 and SKILL Anti-AI design rules ("No three/four identical cards"). Creates visual monotony and looks like a generic landing page template.
- **Proposed fix**: Replace card grids with an editorial numbered list (`01—`, `02—`, `03—`) with accordion reveal for capabilities, and structured asymmetric split layouts for reports and evidence.
- **Implementation location**: `src/pages/Home.tsx:257-287, 405-441`.

---

### Flaw 4: Hero Radial Dot Matrix Background & Floating Card Hero
- **Problem**: Hero background relies on a generic radial dot grid pattern (`bg-[radial-gradient(#2A2A2A_1px,transparent_1px)]`) combined with a floating "Live Macro Snapshot" card on the right column.
- **Why it hurts**: Violates Requirement R4 ("No floating card hero / generic AI template artifacts"). The dot grid adds visual noise without communicating data or value.
- **Proposed fix**: Replace the dot matrix with clean dark surface background tokens (`--color-background`), crisp architectural grid rules, and replace the floating card with a data-aware editorial split layout featuring a meaningful abstract/interactive data visual.
- **Implementation location**: `src/pages/Home.tsx:85, 156-193`.

---

### Flaw 5: Severe Heading Hierarchy Skipped Levels (WCAG 1.3.1)
- **Problem**: `Home.tsx` jumps directly from `<h1>` to `<h3>` in the Quick Access Matrix (`Home.tsx:304, 328, 358`) skipping `<h2>`, jumps from `<h2>` to `<h4>` in Reports (`Home.tsx:422`) skipping `<h3>`, and uses a `<span>` for the Live Macro Snapshot header (`Home.tsx:167`).
- **Why it hurts**: Severe accessibility violation. Screen readers rely on sequential heading structures (H1 -> H2 -> H3 -> H4) to build a document outline for visually impaired users.
- **Proposed fix**: Enforce strict semantic hierarchy: single H1 for Hero title, H2 for all major section headers, H3 for sub-section titles/card titles, and H4 for sub-items.
- **Implementation location**: `src/pages/Home.tsx:167, 245, 304, 328, 358, 394, 422, 464`.

---

### Flaw 6: Borderline Color Contrast on Gold Accents & Captions (WCAG 2.1 AA)
- **Problem**: Primary gold `#C8A45D` used for small 10-12px uppercase section tags (`AUDITED METRICS`, `EXECUTIVE BRIEFINGS`, `Sectors:`) against dark `#09090B` / `#171717` background yields a contrast ratio of ~4.3:1 (below WCAG AA threshold of 4.5:1 for normal text). `#A3A3A3` text-muted on dark card surfaces at 10px font size also fails the threshold.
- **Why it hurts**: Impairs legibility for users with low vision or in high ambient light environments.
- **Proposed fix**: Use high-contrast text `#F5F5F5` / `#FFFFFF` for section headers; adjust small gold text to higher-contrast `#D4AF37` or increase font weight/size; update muted text token to `#A1A1AA` or `#D4D4D8` for small captions.
- **Implementation location**: `src/index.css:4-26, 38-78`, `src/pages/Home.tsx:244, 393, 460`.

---

### Flaw 7: Missing Accessible Labels on Form Inputs and ARIA on Icons (WCAG 4.1.2 / 1.1.1)
- **Problem**: Hero search input (`Home.tsx:117`) and Newsletter email input (`Home.tsx:470`) rely exclusively on `placeholder` attributes without `<label>` or `aria-label`. Lucide SVG icons throughout the page lack `aria-hidden="true"`.
- **Why it hurts**: Screen readers cannot announce input names to blind users. Decorative icons are announced as unlabelled graphics, cluttering screen reader speech output.
- **Proposed fix**: Add `<label className="sr-only">` or `aria-label="..."` to all form inputs. Add `aria-hidden="true"` to all decorative Lucide icons.
- **Implementation location**: `src/pages/Home.tsx:115-134, 468-479`, `src/components/layout/Navbar.tsx:72, 98`.

---

### Flaw 8: Inconsistent Border Radius Across UI Primitives
- **Problem**: `Card` component uses hardcoded `rounded-[16px]` (`Card.tsx:8`), `Button` uses `rounded-md` (6px), form inputs use `rounded-xl` (12px) or `rounded-lg` (8px), search container uses `rounded-xl` (12px).
- **Why it hurts**: Inconsistent geometric radii make the UI look assembled from disparate component libraries. 16px radius creates an overly rounded, consumer-SaaS look rather than a crisp institutional research platform.
- **Proposed fix**: Standardize border radius tokens in `index.css` (`--radius-sm: 4px`, `--radius-md: 8px`, `--radius-lg: 12px`) and enforce across Card, Button, and Input primitives.
- **Implementation location**: `src/components/ui/Card.tsx:8`, `src/components/ui/Button.tsx:15`, `src/index.css:31`.

---

### Flaw 9: Non-Semantic Interactive Icon Clicks & Event Bubbling
- **Problem**: `ChevronRight` in Quick Access Matrix (`Home.tsx:307, 331, 361`) places an `onClick` directly on a raw SVG element without keyboard focus or accessibility roles. PDF download buttons (`Home.tsx:432`) are nested inside clickable `Card` divs.
- **Why it hurts**: Keyboard-only users cannot tab to or activate icon buttons. Clicking PDF triggers both the toast notification and parent card navigation due to event bubbling.
- **Proposed fix**: Wrap interactive icons in `<button>` or `<Link>` with `aria-label`. Un-nest interactive card buttons and call `e.stopPropagation()` cleanly.
- **Implementation location**: `src/pages/Home.tsx:307-310, 331-334, 361-364, 431-436`.

---

### Flaw 10: Missing Visible Focus Rings on Interactive Controls (WCAG 2.4.7)
- **Problem**: Tag filter buttons (`Home.tsx:145, 228`) and search inputs use `focus-within:border-primary/50` or `outline-none` without providing `focus-visible:ring-2 focus-visible:ring-primary` outline styles.
- **Why it hurts**: Keyboard users navigating via Tab key cannot see which pill or input is focused.
- **Proposed fix**: Add consistent `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background` to all interactive controls.
- **Implementation location**: `src/pages/Home.tsx:145, 228`, `src/components/ui/Button.tsx:15`.

---

### Flaw 11: Unhandled Reduced Motion Preferences (WCAG 2.3.3)
- **Problem**: Framer Motion (`motion.div`) animations run unconditionally with Y translations (`y: 15` / `y: 20`) and hover lifts without checking `prefers-reduced-motion`.
- **Why it hurts**: Causes vestibular motion distress for users with motion sensitivity settings enabled on their devices.
- **Proposed fix**: Use Framer Motion's `useReducedMotion()` hook or CSS `@media (prefers-reduced-motion: reduce)` rules to bypass transform animations when requested.
- **Implementation location**: `src/pages/Home.tsx:37-45, 92, 107, 137, 157, 198, 252, 294, 399`.

---

### Flaw 12: Desktop Keyboard Shortcuts Rendered on Mobile Viewports
- **Problem**: Keyboard shortcut badges (`Press ↵`, `Cmd + K`) in the search input and search trigger are rendered on small mobile screens (< 640px). `Navbar.tsx` mobile drawer is cluttered with heavy borders and duplicate search triggers.
- **Why it hurts**: Consumes limited mobile screen space with irrelevant desktop hints. Mobile navigation menu feels heavy and unrefined.
- **Proposed fix**: Wrap shortcut hints in `hidden sm:inline-flex`. Streamline mobile navigation drawer to essential routes and compact search trigger.
- **Implementation location**: `src/pages/Home.tsx:126`, `src/components/layout/Navbar.tsx:75, 144`.

---

### Flaw 13: Toast Notification Overuse for Core Links
- **Problem**: PDF report download links (`Home.tsx:78`) and footer social links (`Footer.tsx:11`) execute `showToast(...)` notifications ("requires Premium Institutional Access", "Redirecting to portal") instead of real routing or modal workflows.
- **Why it hurts**: Toast popups feel like fake demo stubs, annoying visitors and undermining platform credibility.
- **Proposed fix**: Replace toast popups with an explicit `UpgradeModal` / `AuthModal` preview dialog or real static route destinations.
- **Implementation location**: `src/pages/Home.tsx:76-79`, `src/components/layout/Footer.tsx:9-12`.

---

### Flaw 14: Mobile Layout Metric Card Wrapping & Stacking Issues (390px / 430px)
- **Problem**: `Key Metrics Band` uses `grid-cols-2 sm:grid-cols-4`. On 390px iPhone viewports, narrow grid columns squeeze labels like "INSTITUTIONAL REPORTS" into awkward 3-line text wraps. `Category Filter Strip` cuts off without overflow scroll masks.
- **Why it hurts**: Destroys visual polish and legibility on smaller mobile devices.
- **Proposed fix**: Use horizontal scroll row on mobile for metrics or responsive auto-fit grid with `clamp()` typography and touch-scroll fade masks.
- **Implementation location**: `src/pages/Home.tsx:203-217, 225`.

---

## 4. Caveats

- **Scope Boundary**: Audit was conducted via read-only file inspection of `src/pages/Home.tsx`, associated components, styles, and reference documentation. Code execution (browser preview) was not performed during this phase.
- **Data Integrations**: The backend data service (`src/services/dataService.ts`) exists for dataset exploration, but `Home.tsx` does not utilize live data bindings.
- **Assumptions**: Preserved all existing working page routes (`/statistics`, `/industry`, `/company`, `/country`, `/dataset`, `/search`, `/workspace`, `/dashboard`, `/pricing`, `/advertising`).

---

## 5. Conclusion

The current `src/pages/Home.tsx` falls short of the StatIQ One redesign specification. It reads as a generic SaaS template with card grids, hardcoded metrics, and missing architectural sections.

To achieve the quality target ("a real intelligence/data product built by an experienced product + frontend team"), `Home.tsx` must be refactored into a modular 12-section layout system adhering to the CSS design tokens defined in `statiqone-redesign.md` and supported by accessible, responsive UI primitives.

---

## 6. Verification Method

To independently verify the findings in this audit report:

1. **File Inspection**:
   - Inspect `src/pages/Home.tsx` to confirm missing section components (Sections 04, 05, 06, 07, 08, 09, 10).
   - Inspect `src/pages/Home.tsx:304, 422` to observe broken heading hierarchy (`H1 -> H3`, `H2 -> H4`).
   - Inspect `src/components/ui/Card.tsx:8` to observe hardcoded `rounded-[16px]`.

2. **Automated Verification Command**:
   ```bash
   npm run lint
   ```
   Confirm TypeScript build integrity before and after proposed redesign edits.

3. **Accessibility Audit Verification**:
   - Run Lighthouse or axe-core automated audits on `http://localhost:5173/` to verify input labels, heading hierarchy, contrast ratios, and focus rings.

---
