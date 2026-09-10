---
name: premium-web-design
description: >-
  Premium web design skill for StatIQ One. Teaches production-quality
  HTML/CSS/React output — layouts that feel hand-crafted, not templated.
  Inspired by claude-code-templates and gstack /design-html specialist.
  Use when building landing pages, marketing sections, or any public-facing UI.
sources:
  - https://github.com/davila7/claude-code-templates
  - https://github.com/garrytan/gstack
---

# Premium Web Design Skill

Premium web design is not more complexity — it is more intentionality.
Every pixel is a decision. Every spacing unit is chosen. Every color
relationship is deliberate. This skill encodes those decisions for StatIQ One.

---

## The Premium Standard

A component meets the premium bar when:
1. It uses fewer elements than the naive implementation (less is more).
2. Every detail — spacing, weight, color — serves communication, not decoration.
3. It loads fast (no layout shift, no FOIT, images with aspect-ratio set).
4. It looks correct on first render — no flicker, no unnecessary skeleton.
5. It would not look out of place on a well-crafted editorial product
   (The Economist digital, Bloomberg Markets, Stripe).

---

## 1. Spatial Design

### The Three Rhythm Zones

Premium layouts use three distinct density levels — not one uniform grid.

```
BREATHE   — hero, intro sections        -> py-24 to py-32
ENGAGE    — feature, content sections   -> py-16 to py-20
DENSE     — data tables, comparison     -> py-8 to py-12
```

Never use the same vertical padding for all sections.
Contrast in density creates the page visual rhythm.

### Column Asymmetry

Symmetric grids feel template-generated. Use intentional asymmetry:

```tsx
// Premium: asymmetric editorial column
<div className="grid grid-cols-[2fr_1fr] gap-12 items-start">
  <MainContent />
  <SidePanel />
</div>

// Premium: offset grid with editorial bleed
<div className="grid grid-cols-12 gap-4">
  <div className="col-span-7 col-start-1"><Headline /></div>
  <div className="col-span-4 col-start-9"><MetricCallout /></div>
</div>
```

### Base Unit: 8px (with deliberate breaks)
Use multiples: 8, 16, 24, 32, 48, 64, 96, 128.

The premium break: Occasionally use non-grid values (e.g., mt-[52px]) for
optical corrections. A headline that looks optically centred often sits
1-4px above the geometric centre.

---

## 2. Typography at Premium Level

### The Type Scale for StatIQ

```css
/* Display — hero headlines */
font-size: clamp(3rem, 5vw, 5rem); line-height: 1.05; letter-spacing: -0.03em;

/* Heading 1 — section titles */
font-size: clamp(2rem, 3.5vw, 3rem); line-height: 1.1; letter-spacing: -0.02em;

/* Heading 2 — sub-sections */
font-size: clamp(1.5rem, 2.5vw, 2rem); line-height: 1.15; letter-spacing: -0.01em;

/* Body */
font-size: 1rem; line-height: 1.65; letter-spacing: 0;

/* Label / Caption */
font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600;

/* Data / Numbers */
font-variant-numeric: tabular-nums; font-feature-settings: "tnum";
```

### Typographic Contrast Rules
- Heading to body contrast: minimum 2x size difference.
- Use weight as secondary contrast: 700 heading vs 400 body (not 700 vs 500).
- Reserve tracking (letter-spacing) for labels and all-caps text only.
- Max body text width: 68ch. Long lines destroy readability.

```tsx
<p className="max-w-[68ch] text-base leading-relaxed text-[--color-ink]/80">
  Body text limited to optimal reading width.
</p>
```

---

## 3. Color at Premium Level

### StatIQ Color Philosophy

The palette is warm editorial — not tech-blue, not startup-purple.
It communicates: authoritative, human, intelligent.

```
Canvas     #F7F6F2  — warm off-white, not cold white
Ink        #20201E  — warm near-black, not pure black
Rust       #C8722A  — editorial accent, energy + credibility
Sage       #5C7A5C  — data positive, calm authority
Surface    #EFEDE8  — card lift, subtle warmth
```

### Color for Every Element
1. Background: canvas or surface (never pure white)
2. Text: ink or ink/70 (never pure black or gray-500)
3. Accent: rust or sage (never blue-500)
4. Border: --color-border at full or 50% opacity

### Color Contrast for Data
| State | Color | Meaning |
|---|---|---|
| Gain / positive | --color-data-positive #2D6A4F | Growth |
| Loss / negative | --color-data-negative #C0392B | Risk |
| Neutral | --color-ink/50 | No signal |
| Alert | --color-accent-warm | Attention |

---

## 4. Component Craft Patterns

### Premium Card
```tsx
// Not: white card with drop shadow
// Yes: surface lift with editorial border
<div className="
  bg-[--color-surface-raised]
  border border-[--color-border]
  rounded-lg p-6
  transition-shadow duration-200
  hover:shadow-[0_2px_12px_rgba(32,32,30,0.08)]
">
```

### Premium Button Hierarchy
```tsx
// Primary — one per page/section
<button className="
  bg-[--color-accent-warm] text-white px-6 py-3 rounded font-medium
  hover:brightness-110 active:scale-[0.98]
  transition-all duration-150
">{label}</button>

// Secondary — supporting action
<button className="
  border border-[--color-border] text-[--color-ink] px-6 py-3 rounded font-medium
  hover:bg-[--color-surface-raised] transition-colors duration-150
">{label}</button>

// Ghost — tertiary / nav
<button className="
  text-[--color-ink]/70 underline-offset-4
  hover:text-[--color-ink] hover:underline transition-colors duration-150
">{label}</button>
```

### Premium Metric Display
```tsx
// Every number needs: value + unit + trend + context
<div className="flex flex-col gap-0.5">
  <span className="text-xs font-medium tracking-widest uppercase text-[--color-ink]/50">AUM Tracked</span>
  <div className="flex items-baseline gap-2">
    <span className="text-3xl font-bold tabular-nums font-heading">2.4T</span>
    <span className="text-[--color-data-positive] text-sm font-medium">+12.3%</span>
  </div>
  <span className="text-xs text-[--color-ink]/40">vs last quarter</span>
</div>
```

### Premium Section Divider
```tsx
<div className="flex items-center gap-4 py-2">
  <div className="flex-1 h-px bg-[--color-border]" />
  {label && (
    <span className="text-xs font-medium tracking-widest text-[--color-ink]/40 uppercase">{label}</span>
  )}
  <div className="flex-1 h-px bg-[--color-border]" />
</div>
```

---

## 5. Production Checklist

### Performance
- [ ] No layout shift (CLS = 0) — images have width + height or aspect-ratio
- [ ] No FOIT — fonts loaded with font-display: swap
- [ ] No unnecessary re-renders — React.memo for pure display components
- [ ] Tailwind classes in cn() or clsx() — no string concatenation

### Visual Quality
- [ ] Scores >= 8/10 on all Anti-UI-Slop audit dimensions
- [ ] Tested at 375px, 768px, 1280px, 1920px
- [ ] StatIQ tokens used — no hardcoded hex
- [ ] Hover, focus, active, disabled states all defined

### Code Quality
- [ ] TypeScript strict — no any, no as unknown
- [ ] Props interface exported from component file
- [ ] aria-label on all icon-only buttons
- [ ] npm run lint clean, npm test 13/13 passing

---

## 6. The Premium Gut-Check

Before marking done, ask three questions:
1. Is there anything generic here? If yes, remove or replace it.
2. Is there one element that could only belong to StatIQ? If no, add one.
3. Would this load in a single blink and feel complete? If no, fix CLS.

If all three pass: ship it.
