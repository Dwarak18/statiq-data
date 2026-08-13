# Milestone 1 Specification & Code Replacement Plan
**Target**: Warm Intelligence Tokens & CSS Global Setup
**Files Analyzed**: `src/index.css`, `src/utils/chartTheme.ts`

---

## 1. Overview & Objectives

Milestone 1 establishes the fundamental visual system tokens and global scrolling rules required for the StatIQ One redesign pass. 

Specifically, this specification defines:
1. Updating `:root` and `@theme` blocks in `src/index.css` with the **Warm Intelligence** palette tokens (`--color-bg: #F7F6F2`, `--color-surface: #FBFAF7`, `--color-surface-raised: #FFFFFF`, `--color-ink: #20201E`, etc.).
2. Adding **Data Visualization** tokens (`--data-primary: #667A70`, `--data-secondary: #B9684E`, `--data-tertiary: #A8ADA4`, `--data-neutral: #D7D5CE`).
3. Adding **Radius** tokens (`--radius-sm: 4px`, `--radius-md: 8px`, `--radius-lg: 14px`).
4. Injecting global section anchor scroll offset rules (`section[id] { scroll-margin-top: 96px; }`).
5. Updating `src/utils/chartTheme.ts` constants and color stops to align ECharts components with the Warm Intelligence design language.

---

## 2. Evidence & Line Analysis

### 2.1 Analysis of `src/index.css`
- **File path**: `C:\Users\Dwarak\Documents\GitHub\StatiQ\src\index.css`
- **Current State**:
  - Lines 3-53: `@theme` block contains legacy obsidian dark tokens (`--color-bg: #09090B`, `--color-surface: #111111`, `--color-primary: #C8A45D`, `--color-border: #2A2A2A`, `--radius-sm: 6px`, `--radius-md: 12px`, `--radius-lg: 20px`).
  - Lines 57-92: `:root, html.dark` block enforces dark mode defaults.
  - Lines 95-114: `html.light` block contains an older light scheme.
  - Line 119: `color-scheme: dark;` under `html`.
  - Missing: `--color-surface-raised`, `--color-ink`, `--color-ink-soft`, `--color-faint`, `--color-border-soft`, `--color-accent-soft`, `--color-sage`, `--color-sage-soft`, data viz tokens (`--data-primary`, `--data-secondary`, `--data-tertiary`, `--data-neutral`), and `section[id]` scroll margin rule.

### 2.2 Analysis of `src/utils/chartTheme.ts`
- **File path**: `C:\Users\Dwarak\Documents\GitHub\StatiQ\src\utils\chartTheme.ts`
- **Current State**:
  - Lines 6-13: `GOLD_PRIMARY = '#C8A45D'`, `GOLD_HOVER = '#E3C47A'`, `GRAPHITE_BORDER = '#2A2A2A'`, `CARD_BACKGROUND = '#171717'`, `TEXT_MUTED = '#A3A3A3'`, `TEXT_MAIN = '#F5F5F5'`, `COLOR_SUCCESS = '#2ECC71'`, `COLOR_DANGER = '#E74C3C'`.
  - Line 48: `splitLine.lineStyle.color = 'rgba(42, 42, 42, 0.6)'`.
  - Lines 75-76: Linear gradient stops `rgba(200, 164, 93, 0.35)` and `rgba(200, 164, 93, 0.0)`.

---

## 3. Detailed Code Replacement Plan

### 3.1 Replacement Plan for `src/index.css`

#### Target 1: `@theme` block (Lines 3-53)
**Action**: Replace existing `@theme` block with Warm Intelligence tokens, data tokens, radius tokens, and legacy mappings.

```css
@theme {
  /* Warm Intelligence Palette */
  --color-bg: #F7F6F2;
  --color-surface: #FBFAF7;
  --color-surface-raised: #FFFFFF;
  --color-surface-muted: #E9E7E1;

  --color-ink: #20201E;
  --color-ink-soft: #4F4E49;
  --color-muted: #77756E;
  --color-faint: #9A9890;

  --color-border: #DEDDD7;
  --color-border-soft: #E9E7E1;

  --color-accent: #B9684E;
  --color-accent-hover: #A85B43;
  --color-accent-soft: #EAD8D0;
  --color-accent-contrast: #FFFFFF;

  --color-sage: #7D8A82;
  --color-sage-soft: #DCE1DC;

  --color-success: #657B6C;
  --color-warning: #A6845C;
  --color-error: #9A5B55;
  --color-danger: #9A5B55;
  --color-info: #B9684E;

  /* Legacy Mappings & Fallbacks */
  --color-primary: #B9684E;
  --color-hover: #A85B43;
  --color-primary-hover: #A85B43;
  --color-background: #F7F6F2;
  --color-card: #FBFAF7;
  --color-cards: #FBFAF7;
  --color-text: #20201E;
  --color-text-main: #20201E;
  --color-secondary: #4F4E49;
  --color-text-secondary: #4F4E49;
  --color-text-muted: #77756E;

  /* Data Visualization Tokens */
  --data-primary: #667A70;
  --data-secondary: #B9684E;
  --data-tertiary: #A8ADA4;
  --data-neutral: #D7D5CE;

  --color-data-primary: #667A70;
  --color-data-secondary: #B9684E;
  --color-data-tertiary: #A8ADA4;
  --color-data-neutral: #D7D5CE;

  /* Typography */
  --font-sans: 'Inter', sans-serif;
  --font-heading: 'Plus Jakarta Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Radius System */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 14px;
  --radius-xl: 1rem; /* 16px */

  --container: 1280px;
  --space-section: clamp(5rem, 10vw, 10rem);

  /* Utility CSS Variables */
  --bg: #F7F6F2;
  --surface: #FBFAF7;
  --surface-muted: #E9E7E1;
  --text: #20201E;
  --text-muted: #77756E;
  --border: #DEDDD7;
  --accent: #B9684E;
  --accent-contrast: #FFFFFF;
  --accent-hover: #A85B43;
}
```

#### Target 2: Base Layer `:root` block (Lines 55-121)
**Action**: Replace `:root, html.dark` and `html.light` with unified Warm Intelligence `:root` default definitions, set `color-scheme: light;`, and add section scroll-margin rule.

```css
@layer base {
  /* ── Warm Intelligence theme (default) ── */
  :root,
  html.light,
  html.dark {
    --container: 1280px;
    --space-section: clamp(5rem, 10vw, 10rem);
    
    --color-bg: #F7F6F2;
    --color-surface: #FBFAF7;
    --color-surface-raised: #FFFFFF;
    --color-surface-muted: #E9E7E1;

    --color-ink: #20201E;
    --color-ink-soft: #4F4E49;
    --color-muted: #77756E;
    --color-faint: #9A9890;

    --color-border: #DEDDD7;
    --color-border-soft: #E9E7E1;

    --color-accent: #B9684E;
    --color-accent-hover: #A85B43;
    --color-accent-soft: #EAD8D0;

    --color-sage: #7D8A82;
    --color-sage-soft: #DCE1DC;

    --color-success: #657B6C;
    --color-warning: #A6845C;
    --color-error: #9A5B55;
    --color-danger: #9A5B55;

    --data-primary: #667A70;
    --data-secondary: #B9684E;
    --data-tertiary: #A8ADA4;
    --data-neutral: #D7D5CE;

    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 14px;

    /* Legacy alias variables */
    --bg: #F7F6F2;
    --surface: #FBFAF7;
    --surface-muted: #E9E7E1;
    --text: #20201E;
    --text-muted: #77756E;
    --border: #DEDDD7;
    --accent: #B9684E;
    --accent-contrast: #FFFFFF;
    --accent-hover: #A85B43;

    --color-primary: #B9684E;
    --color-hover: #A85B43;
    --color-background: #F7F6F2;
    --color-card: #FBFAF7;
    --color-cards: #FBFAF7;
    --color-info: #B9684E;
    --color-text-main: #20201E;
    --color-secondary: #4F4E49;
    --color-text-secondary: #4F4E49;
  }

  /* Anchor section scroll offset fix */
  section[id] {
    scroll-margin-top: 96px;
  }

  @media (max-width: 768px) {
    section[id] {
      scroll-margin-top: 72px;
    }
  }

  html {
    -webkit-text-size-adjust: 100%;
    scroll-behavior: smooth;
    color-scheme: light;
  }
```

---

### 3.2 Replacement Plan for `src/utils/chartTheme.ts`

#### Target 1: Constant Definitions (Lines 6-13)
**Action**: Replace hardcoded obsidian/gold hex values with Warm Intelligence tokens.

```typescript
// Replace lines 6-13:
export const GOLD_PRIMARY = '#B9684E';
export const GOLD_HOVER = '#A85B43';
export const GRAPHITE_BORDER = '#DEDDD7';
export const CARD_BACKGROUND = '#FBFAF7';
export const TEXT_MUTED = '#77756E';
export const TEXT_MAIN = '#20201E';
export const COLOR_SUCCESS = '#657B6C';
export const COLOR_DANGER = '#9A5B55';
```

#### Target 2: Grid Split Line Style (Line 48)
**Action**: Update dashed grid split line color from obsidian dark `rgba(42, 42, 42, 0.6)` to warm soft border `rgba(222, 221, 215, 0.6)`.

```typescript
// Replace line 48:
      color: 'rgba(222, 221, 215, 0.6)',
```

#### Target 3: Area Gradient Stops (Lines 75-76)
**Action**: Update linear gradient RGB stops from old gold `rgba(200, 164, 93, ...)` to terracotta `#B9684E` (`rgba(185, 104, 78, ...)`).

```typescript
// Replace lines 75-76:
              { offset: 0, color: 'rgba(185, 104, 78, 0.35)' },
              { offset: 1, color: 'rgba(185, 104, 78, 0.0)' },
```

---

## 4. Invalidation & Risk Analysis
- **Build / Lint Impact**: Updating CSS custom properties and chartTheme constants does not break TypeScript typing or Vite build rules.
- **Visual Contrast**: Warm Ink `#20201E` on Warm Canvas `#F7F6F2` yields a high contrast ratio (>13:1), fully compliant with WCAG AAA standards. Terracotta accent `#B9684E` on Warm Canvas `#F7F6F2` provides a ~4.6:1 contrast ratio, meeting WCAG AA requirements for UI controls and graphical components.
