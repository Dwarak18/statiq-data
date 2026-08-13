# StatIQ One — Comprehensive Specification Analysis & Mining Report

## Overview
This document provides an exhaustive specification breakdown extracted from `ORIGINAL_REQUEST.md`, `statiqone-visual-system-scroll-fix.md`, and `frontend-skill/SKILL.md`. It documents all concrete design tokens, visual hierarchy rules, layout structures, scroll fix parameters, typography constraints, accessibility standards, and anti-AI design principles for the StatIQ One marketing website.

---

## 1. Visual System: "Warm Intelligence" Palette & Custom Property Tokens

The redesign moves away from generic SaaS dark/AI styling and earthy mood boards to a quiet, intelligent, technical, and restrained palette.

### 1.1 Custom CSS Property Specifications (`src/index.css`)
```css
:root {
  /* Canvas & Surface Tokens */
  --color-bg: #F7F6F2;             /* 70% Default Warm Neutral Canvas */
  --color-surface: #FBFAF7;        /* Subtle Raised Surface */
  --color-surface-raised: #FFFFFF; /* 20% Pure White Surface for Semantic Separation */
  --color-surface-muted: #F1F1EE;  /* Muted Surface Alternate */

  /* Typography & Ink Tokens */
  --color-ink: #20201E;            /* Primary Headings & High Contrast Ink (Near-Black, No Pure #000) */
  --color-ink-soft: #4F4E49;       /* 7% Body Copy & Primary Text */
  --color-muted: #77756E;          /* Secondary & Muted Labels */
  --color-faint: #9A9890;          /* Subtle Captions & Faint Borders */

  /* Structural Dividers & Borders */
  --color-border: #DEDDD7;         /* 1px Solid Border Default (Replaces Heavy Shadows) */
  --color-border-soft: #E9E7E1;    /* Soft Structural Rules */

  /* Primary Brand Accent (Terracotta / Muted Clay) */
  --color-accent: #B9684E;         /* 3% Primary CTAs, Active Nav, Focus States, Rare Data Points */
  --color-accent-hover: #A85B43;   /* Interactive Hover State */
  --color-accent-soft: #EAD8D0;    /* Soft Accent Background / Highlight */

  /* Secondary Data & Neutral Tones */
  --color-sage: #7D8A82;           /* Secondary Data Visualization Tone */
  --color-sage-soft: #DCE1DC;      /* Soft Data Fill Tone */

  /* Data Visualization Specific Palette */
  --data-primary: #667A70;         /* Primary Data Line / Bar (Dark Sage) */
  --data-secondary: #B9684E;       /* Comparison / Key Highlight (Muted Clay) */
  --data-tertiary: #A8ADA4;        /* Auxiliary Data Points (Light Gray/Sage) */
  --data-neutral: #D7D5CE;         /* Gridlines & Neutral Data Fills */

  /* Status Indicators */
  --color-success: #657B6C;        /* Muted Green */
  --color-warning: #A6845C;        /* Muted Gold/Brown */
  --color-error: #9A5B55;          /* Muted Red */

  /* Radius System (Restrained Square-ish Language) */
  --radius-sm: 4px;                /* Default Subtle Radius for Inputs/Buttons */
  --radius-md: 8px;                /* Standard Card / Container Radius */
  --radius-lg: 14px;               /* Product Surface / Hero Feature Container Only */
}
```

### 1.2 Radius & Shadow Restraint Rules
- **Radius**: Remove `rounded-3xl` and `rounded-2xl` from non-pill elements. Use `4px` (`--radius-sm`) or `8px` (`--radius-md`) by default; reserve `14px` (`--radius-lg`) exclusively for major product workspace surfaces. Pills (`rounded-full`) are strictly reserved for compact status tags, filters, or category badges.
- **Borders over Shadows**: Replace heavy ambient box-shadows (`box-shadow: 0 20px 50px ...`) with crisp `1px solid var(--color-border)` (`#DEDDD7`).
- **Allowed Shadows**:
  - Default subtle lift: `box-shadow: 0 1px 2px rgba(20, 20, 18, 0.04)`.
  - Raised product surface lift: `box-shadow: 0 8px 30px rgba(20, 20, 18, 0.06)`.

---

## 2. Layout Distribution Ratio & Section Rules

### 2.1 Color Distribution Ratio
The page must strictly adhere to an approximate visual weight breakdown:
- **70% Warm Neutral Canvas (`--color-bg` / `#F7F6F2`)**: Dominant canvas background across almost all sections.
- **20% White / Near-White Surfaces (`--color-surface-raised` / `#FFFFFF`)**: Isolated white containers used only when creating semantic separation (e.g. Product Surface workspace, Research note).
- **7% Typography Ink (`--color-ink` / `#20201E` & `--color-ink-soft` / `#4F4E49`)**: High-contrast, clean typography carrying visual hierarchy.
- **3% Accent & Data Highlights (`--color-accent` / `#B9684E` & Data colors)**: Strictly reserved for primary CTAs, active tab/nav states, interactive focus, and key chart points.

### 2.2 Section Background Discipline
- **Anti-Pattern**: Do NOT cycle background colors across consecutive sections (e.g., beige → green → pink → cream → brown).
- **Correct Pattern**:
  1. Hero: Warm canvas (`#F7F6F2`)
  2. Proof Strip: Warm canvas with hairline borders
  3. What StatIQ One Does: Warm canvas
  4. Product Surface: White raised workspace (`#FFFFFF`) with subtle border
  5. Capabilities: Warm canvas
  6. Methodology / Research: White surface note (`#FFFFFF`)
  7. Use Cases / CTA / Footer: Warm canvas

---

## 3. Card & Grid Transformation Rules

### 3.1 Editorial Row Layout (`01 —`, `02 —`, etc.)
- **Anti-Pattern**: Side-by-side 3-card grids containing identical icon + title + paragraph configurations.
- **Required Transformation**: Replace generic feature card grids with **editorial numbered rows**:
  ```text
  01   Intelligence Layer
       Structured multi-source synthesis engine          →
  ─────────────────────────────────────────────────────────
  02   Continuous Analysis
       Real-time entity tracking and anomaly detection   →
  ─────────────────────────────────────────────────────────
  03   Decision Support
       Audit-ready evidence chains and summaries          →
  ```
- **Asymmetrical & Controlled Layouts**: Leverage asymmetric 2-column split layouts, horizontal rule dividers, side-aligned section labels, and progressive disclosure accordions.

---

## 4. Scroll Fix & Navigation Specifications

### 4.1 Root Cause Diagnosis
1. **Fixed/Sticky Header Overlap**: Target sections scrolled behind the fixed/sticky header (`data-site-header`) because scroll offsets were unadjusted.
2. **Dynamic Header Dimensions**: Desktop header height is `96px` while mobile header height is `72px`.
3. **JS `scrollIntoView()` Flaws**: Native `scrollIntoView()` ignores fixed header overlays unless `scroll-margin-top` is declared on destination elements.
4. **State-Toggle Timing Defect**: Toggling "Web" / mode view updated React state, changed DOM layout height, and initiated smooth scrolling simultaneously—causing target calculations to undershoot.
5. **Fragile Scroll Listeners**: Using `window.scrollY > 500` or `scrollY + 200` offset math created inconsistent navigation active states across varying display heights.

### 4.2 Preferred CSS Scroll Margin Fix
All target `<section>` elements with an `id` must specify responsive `scroll-margin-top`:
```css
section[id] {
  scroll-margin-top: 96px; /* Accounts for 96px desktop fixed header + padding */
}

@media (max-width: 768px) {
  section[id] {
    scroll-margin-top: 72px; /* Accounts for 72px mobile fixed header */
  }
}
```

### 4.3 Centralized JS Scroll Helper (`scrollToSection`)
If programmatic JS scrolling is invoked:
```ts
export function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) return;

  const header = document.querySelector('[data-site-header]');
  const headerHeight = header instanceof HTMLElement 
    ? header.getBoundingClientRect().height 
    : 96;

  const top = element.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

  window.scrollTo({
    top,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  });
}
```

### 4.4 Toggle State Ordering (`requestAnimationFrame`)
When a control (e.g. "Web") triggers both a React state update and section scroll:
1. Execute React state change (`setSelectedMode("web")`).
2. Allow DOM re-render.
3. Defer scroll execution via `requestAnimationFrame` / `setTimeout` until layout dimensions stabilize.

### 4.5 Active Navigation Observer (`IntersectionObserver`)
Replace manual scroll position arithmetic in `Home.tsx` with `IntersectionObserver`:
```ts
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveSection(entry.target.id);
      }
    });
  },
  {
    root: null,
    rootMargin: "-96px 0px -55% 0px", // Top margin offsets header; bottom margin triggers early
    threshold: 0,
  }
);
```

---

## 5. Typography Rules & Standards

### 5.1 Font Stack & Hierarchy
- **Headings (`--font-heading`)**: `Plus Jakarta Sans`, sans-serif.
  - Letter-spacing: Tight & confident (`tracking-tight` / `-0.02em` to `-0.03em`).
- **Body & UI (`--font-sans`)**: `Inter`, sans-serif.
  - Paragraph Line-Height: `1.6` – `1.7` (`leading-relaxed`).
  - Optimal Line Length: `60ch` to `75ch` (`max-w-prose` or `max-w-[65ch]`).
- **Monospace Labels (`--font-mono`)**: `JetBrains Mono`, monospace (used for technical metrics, code tags, section indexes).
- **Optional Display Serif (`--font-display`)**: `Instrument Serif` or `Georgia` used strictly for selective single-word emphasis (e.g., *"Intelligence"* in hero).

---

## 6. Accessibility & Motion Rules

### 6.1 Prefers-Reduced-Motion Rules
- Must enforce global CSS override:
```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto !important;
  }
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
- In React motion animations (Framer Motion v12), wrap variants or use `useReducedMotion()`.

### 6.2 Semantic HTML & Keyboard Focus
- Single `<h1>` tag on the landing page (located in Hero).
- Interactive elements (`<button>`, `<a>`) must feature visible focus rings (`focus-visible:outline-2 focus-visible:outline-[#B9684E]`).
- Color contrast: Ensure `#20201E` and `#4F4E49` achieve WCAG AA contrast ratio (≥ 4.5:1) against `#F7F6F2` canvas and `#FFFFFF` surfaces.

---

## 7. Content Integrity & Anti-AI Guidelines
- **Zero Fabricated Facts**: Absolutely no fake client logos, fabricated testimonial quotes, false user counts, fictitious awards, or fake metric percentages.
- **Content Placeholders**: Any missing text must be explicitly marked as `[CONTENT PLACEHOLDER: Description]`.
- **Anti-AI Rules**: Prohibit blue/purple neon gradients, 3D floating icons, glassmorphism blobs, and random scroll entrance animations on every element.

---

## Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Visual System | Warm Intelligence Palette | Replaces dark/neon colors with ivory canvas (`#F7F6F2`), white surfaces (`#FFFFFF`), near-black ink (`#20201E`), and terracotta accent (`#B9684E`). | CSS Variables in `src/index.css` | Uniform warm theme across app | Falls back to system sans/serif if tokens fail | `statiqone-visual-system-scroll-fix.md` §2 |
| 2 | Visual System | 70/20/7/3 Color Distribution | Enforces visual balance: 70% canvas, 20% white surface, 7% ink, 3% terracotta/sage accent. | UI styling rules & Tailwind classes | Quiet, non-distracting visual hierarchy | Accent visual bloat if overused | `statiqone-visual-system-scroll-fix.md` §5 |
| 3 | Visual System | Data Visualization Palette | Dedicated tokens (`--data-primary`: `#667A70`, `--data-secondary`: `#B9684E`, `--data-tertiary`: `#A8ADA4`, `--data-neutral`: `#D7D5CE`). | ECharts config / SVG data charts | Professional, readable data visualizations | Chart clutter if >2 accent colors used simultaneously | `statiqone-visual-system-scroll-fix.md` §11 |
| 4 | Visual System | Restrained Radius System | Enforces `4px` (`--radius-sm`), `8px` (`--radius-md`), and `14px` (`--radius-lg`). Removes `rounded-3xl` on non-pills. | Radius CSS tokens | Precise, square-ish UI component geometry | UI looks generic/bouncy if rounded-3xl used | `statiqone-visual-system-scroll-fix.md` §9 |
| 5 | Card Layout | Editorial Numbered Rows | Replaces 3-card grids with structured numbered list items (`01 — Capability Name`). | Content arrays / section items | Editorial 1-column / split list layout | Cluttered layout if formatted as side-by-side cards | `statiqone-visual-system-scroll-fix.md` §7 |
| 6 | Navigation | Header Offset Fix (`scroll-margin-top`) | Defines `scroll-margin-top: 96px` (desktop) and `72px` (mobile) on `section[id]`. | Viewport scroll / anchor click | Target section heading aligns perfectly below fixed header | Heading hidden under header if scroll margin missing | `statiqone-visual-system-scroll-fix.md` §17 |
| 7 | Navigation | Centralized `scrollToSection` Helper | Programmatic scrolling accounting for `[data-site-header]` height and scroll position. | Section ID string (`"web"`, `"product"`) | Smooth scroll to target offset | Falls back gracefully if target element ID missing | `statiqone-visual-system-scroll-fix.md` §18 |
| 8 | Navigation | Stable Toggle-Scroll (`requestAnimationFrame`) | Defers smooth scrolling until after React state updates & DOM layout height stabilizes. | Mode toggle interaction | Synchronized view transition & scroll alignment | Target undershoot if scroll starts before re-render | `statiqone-visual-system-scroll-fix.md` §20 |
| 9 | Navigation | `IntersectionObserver` Active Nav | Tracks currently visible section in viewport with `rootMargin: "-96px 0px -55% 0px"`. | Viewport scroll intersection entries | Active nav highlight state update | Incorrect nav highlight if hardcoded scrollY used | `statiqone-visual-system-scroll-fix.md` §21 |
| 10 | Typography | Display / Body Hierarchy Tuning | Pairs `Plus Jakarta Sans` (tight headings) with `Inter` (`1.6-1.7` line height, `60-75ch` line length). | Typography CSS rules & Tailwind classes | Readable, confidence-inspiring typography | Hard to read if line length > 75ch or line-height loose | `statiqone-visual-system-scroll-fix.md` §8 |
| 11 | Accessibility | Prefers-Reduced-Motion Override | Disables smooth scrolling and animations when user prefers reduced motion. | `@media (prefers-reduced-motion: reduce)` | Immediate layout jumps (`scroll-behavior: auto`) | Motion sickness if smooth scroll forced | `statiqone-visual-system-scroll-fix.md` §23 |
| 12 | Content Strategy | Content Placeholders & Anti-Fabrication | Prohibits fake testimonials, client logos, and metrics; enforces `[CONTENT PLACEHOLDER: ...]`. | Source content / site text | Honest, audit-ready product copy | Credibility loss if fake logos/metrics rendered | `ORIGINAL_REQUEST.md` R5 & `SKILL.md` §4 |

---

## Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Scroll Margin | Direct URL hash navigation (e.g. `https://statiqone.com/#capabilities`) | Page loads and browser jumps to section anchor; header overlays title if CSS `scroll-margin-top` is omitted. Correct behavior: `scroll-margin-top: 96px` maintains title clearance below fixed header. |
| 2 | Centralized Scroll | Target section element ID does not exist in DOM | `scrollToSection(id)` fails to find element. Correct behavior: helper early-returns without throwing JavaScript console errors. |
| 3 | State Toggle & Scroll | User clicks view toggle ("Web") while located halfway down page | Component re-renders with new height. If scrolling begins before layout update, scroll offset is calculated on old height and undershoots destination. Correct behavior: wrapped in `requestAnimationFrame` after state commit. |
| 4 | Responsive Header Offset | Viewport resized from desktop (>768px) to mobile (390px) | Fixed header height shrinks from 96px to 72px. Hardcoded JS offsets (e.g. `-100px`) over-scroll on mobile. Correct behavior: Media query `@media (max-width: 768px)` updates `scroll-margin-top: 72px`. |
| 5 | Accessibility Motion | System settings have `prefers-reduced-motion: reduce` enabled | Clicking navigation links triggers multi-second smooth scrolling animation. Correct behavior: CSS override forces `scroll-behavior: auto` for instant positioning. |
| 6 | Typography Line Length | Ultra-wide display (1920px+) without line-length constraints | Body text stretches across screen (>120 characters per line), hurting readability. Correct behavior: CSS `max-width: 65ch` or `max-w-prose` keeps line length between 60ch and 75ch. |
| 7 | Contrast Ratio | Terracotta accent text (`#B9684E`) placed on light gray background (`#DEDDD7`) | Contrast ratio drops below 4.5:1 WCAG AA threshold. Correct behavior: Accent color reserved for large CTAs, active indicators, and high-contrast background surfaces. |
| 8 | Background Texture | Faint grid pattern background applied with opacity > 0.05 | Background grid becomes visually distracting and looks like noisy AI template styling. Correct behavior: Keep grid opacity strictly ≤ 0.035 (`rgba(32, 32, 30, 0.035)`). |
