# StatIQ One — Subtle Professional Visual System & Scroll/Navigation Bug Fix

## Purpose

This document updates the StatIQ One redesign direction.

The previous palette direction was too "designed" and too obviously inspired by generic earthy/neutral mood-board palettes.

The new target is:

> **quiet, intelligent, premium, technical, warm, and restrained.**

Think of the visual restraint found in modern Anthropic/Claude-style product interfaces: very light surfaces, dark readable typography, extremely controlled accent usage, subtle borders, and almost no decorative color noise.

Do **not** copy Anthropic or Claude's branding. Use the same design principles, then establish a distinct StatIQ One visual identity.

Anthropic's current product/design materials emphasize building a coherent design system around colors, typography, spacing, and components rather than treating color as isolated decoration. citeturn0search0

---

# 1. Visual diagnosis

The supplied palette references have good taste individually, but they are not the right direction for StatIQ One.

### Problem with the first palette

The combination of:

- muted teal
- sage
- beige
- dusty pink
- cream

creates an interior-design / lifestyle / architecture mood.

That is not necessarily bad, but it makes StatIQ One feel less like an intelligence/data product.

### Problem with the second palette

The darker green + brown + sage + tan combination feels:

- earthy
- organic
- editorial
- premium

but also somewhat "brand mood board" rather than "technology product".

### Problem with the third palette

The dark red + brown + green + blue combination introduces too many competing semantic colors.

It would work for a creative brand, but it is unnecessary for a professional intelligence platform.

## New rule

**Color should support hierarchy, not become the identity of every section.**

StatIQ One should be recognizable primarily through:

1. typography
2. spacing
3. layout
4. information hierarchy
5. product/data visualization
6. restrained accent color

—not through a large collection of colored backgrounds.

---

# 2. Recommended color system

## Primary palette — "Warm Intelligence"

Use this as the default direction.

```css
:root {
  /* Canvas */
  --color-bg: #F7F6F2;
  --color-surface: #FBFAF7;
  --color-surface-raised: #FFFFFF;

  /* Typography */
  --color-ink: #20201E;
  --color-ink-soft: #4F4E49;
  --color-muted: #77756E;
  --color-faint: #9A9890;

  /* Structure */
  --color-border: #DEDDD7;
  --color-border-soft: #E9E7E1;

  /* Primary accent */
  --color-accent: #B9684E;
  --color-accent-hover: #A85B43;
  --color-accent-soft: #EAD8D0;

  /* Secondary data tone */
  --color-sage: #7D8A82;
  --color-sage-soft: #DCE1DC;

  /* Status */
  --color-success: #657B6C;
  --color-warning: #A6845C;
  --color-error: #9A5B55;
}
```

### Why this works

The page is mostly:

**ivory + white + charcoal + gray**

with:

**muted clay/terracotta**

used sparingly.

The sage tone exists primarily for data visualization or secondary states.

This prevents the website from becoming an "earth-tone website".

---

# 3. Alternative palette — even more minimal

If the first palette still feels too colorful, use this.

```css
:root {
  --color-bg: #F8F8F6;
  --color-surface: #FFFFFF;
  --color-surface-muted: #F1F1EE;

  --color-ink: #1D1D1B;
  --color-ink-soft: #55544F;
  --color-muted: #7C7B75;

  --color-border: #E2E1DC;

  --color-accent: #C46B50;
  --color-accent-soft: #F0DDD6;

  --color-data: #7D8982;
}
```

This is the palette I would choose if the goal is:

> **"I want the website to feel expensive without looking like it is trying to look expensive."**

---

# 4. Anthropic/Claude-inspired design principles

Do not copy their colors or UI literally.

Copy the underlying restraint.

Anthropic's current public product/design material describes design systems in terms of consistent colors, typography, components, and refinement over time. citeturn0search0

Claude's public interface also demonstrates a relatively restrained product presentation: large readable typography, generous whitespace, light surfaces, dark text, and limited visual noise. citeturn1search1

## Use these principles

### A. Warm white instead of pure white everywhere

Avoid:

```css
background: #ffffff;
```

as the entire website.

Prefer:

```css
background: #F7F6F2;
```

with white surfaces only where separation is useful.

### B. Near-black instead of pure black

Avoid:

```css
#000000
```

Use:

```css
#20201E
```

This makes large typography substantially less harsh.

### C. Borders instead of shadows

Prefer:

```css
border: 1px solid #DEDDD7;
```

over:

```css
box-shadow: 0 20px 50px rgba(...);
```

The site should feel flat and precise.

### D. Accent color is rare

The accent should appear on:

- primary CTA
- selected navigation state
- important data point
- interactive focus
- small highlights

It should NOT cover:

- every section
- every card
- every icon
- every heading

Target:

> roughly 5–10% of visible UI should contain strong accent color.

---

# 5. Color hierarchy

Use this approximate distribution:

```text
70%  warm neutral canvas
20%  white / near-white surfaces
7%   charcoal / typography
3%   accent + data colors
```

Do not interpret this as pixel-perfect math.

It is a visual discipline.

The page should feel almost monochromatic at first glance.

Then the accent should become noticeable only when the user interacts or looks closer.

---

# 6. Section backgrounds

Do NOT alternate every section:

```text
white
green
beige
white
orange
gray
white
```

That is exactly the type of visual pattern that makes a website look AI-generated.

Instead:

```text
Warm canvas
────────────
White product surface
────────────
Warm canvas
────────────
Warm canvas + data visualization
────────────
White research surface
────────────
Warm canvas
```

Use background changes only when they create semantic separation.

---

# 7. Cards

Cards should be used less frequently.

### Bad

```text
┌────────────┐
│ Icon       │
│ Title      │
│ Text       │
└────────────┘

┌────────────┐
│ Icon       │
│ Title      │
│ Text       │
└────────────┘

┌────────────┐
│ Icon       │
│ Title      │
│ Text       │
└────────────┘
```

This is generic SaaS design.

### Better

Use editorial rows:

```text
01   Intelligence Layer
     Short explanation                  →

────────────────────────────────────────

02   Data Analysis
     Short explanation                  →

────────────────────────────────────────

03   Decision Support
     Short explanation                  →
```

This immediately feels more deliberate.

---

# 8. Typography direction

Typography matters more than color here.

## Recommended direction

Use:

- one highly readable sans-serif for UI/body
- optionally one refined serif/display family for major editorial headings

Do not use an ornamental fashion serif everywhere.

The goal is:

```text
Technical clarity
+
Editorial confidence
```

not:

```text
Luxury fashion magazine
```

## Suggested typography structure

```css
--font-body: "Inter", "Geist", system-ui, sans-serif;
--font-display: "Instrument Serif", Georgia, serif;
```

Only use the serif selectively.

For example:

```text
StatIQ One

Intelligence
for better
decisions.
```

The word "Intelligence" could use the display family while supporting text remains sans-serif.

If the existing brand already has fonts, inspect and preserve them before introducing new fonts.

---

# 9. Radius and shape language

Do not use excessive rounded corners.

### Recommended

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 14px;
```

Most content should use:

- square-ish surfaces
- subtle 4–8px radius
- occasional 12–14px radius for important product surfaces

Avoid:

```css
rounded-3xl
rounded-full
```

on everything.

Pills should be reserved for:

- status
- filters
- categories
- compact controls

---

# 10. Shadows

Use almost no shadows.

Preferred:

```css
box-shadow:
  0 1px 2px rgba(20, 20, 18, 0.04);
```

For a raised product surface:

```css
box-shadow:
  0 8px 30px rgba(20, 20, 18, 0.06);
```

Do not use giant diffuse shadows.

The product should look grounded, not floating.

---

# 11. Data visualization colors

StatIQ One is an intelligence/data-oriented product, so visualization needs its own controlled system.

Use:

```css
--data-primary: #667A70;
--data-secondary: #B9684E;
--data-tertiary: #A8ADA4;
--data-neutral: #D7D5CE;
```

But do NOT show all four colors in every chart.

A typical chart should have:

```text
Primary data      dark sage
Comparison        light gray
Important point   muted clay
Grid              very light gray
```

This keeps charts readable and professional.

---

# 12. Background texture

If the current website needs more visual personality, do not immediately add gradients.

Use extremely subtle texture:

- 1px grid
- faint rules
- tiny noise
- hairline dividers
- data ticks
- coordinate labels

Example:

```css
background-image:
  linear-gradient(
    to right,
    rgba(32, 32, 30, 0.035) 1px,
    transparent 1px
  );
background-size: 80px 80px;
```

Keep opacity extremely low.

If the grid is immediately noticeable, it is too strong.

---

# 13. What NOT to use

Avoid these unless there is a strong product reason:

- purple AI gradients
- neon blue
- neon green
- glowing borders
- glassmorphism
- floating blobs
- 3D AI brains
- random particles
- gradient text
- huge rounded cards
- excessive icons
- animated backgrounds
- cursor-following effects
- artificial dashboard screenshots
- fake metrics

These are visual shortcuts.

StatIQ One needs product credibility rather than visual spectacle.

---

# 14. Navigation design

The navigation should be quiet.

Suggested:

```text
STATIQ ONE

Platform    Intelligence    Research    About

                              Contact →
```

Use:

- warm background
- thin bottom border
- dark typography
- small accent only on active state

Avoid:

- oversized nav
- huge pill buttons
- animated gradient CTA
- excessive blur

---

# 15. Scroll/navigation bug

There is a separate functional issue that must be fixed.

### Current behavior

When the user:

1. scrolls approximately halfway down the page
2. clicks the "Web" toggle/navigation control above
3. expects the corresponding section to align correctly

the destination does not land at the correct viewport position.

This is not a design problem.

It is a scroll-position/state-management problem.

Treat it as a proper frontend bug.

---

# 16. Root cause to investigate

Check all of these before changing the implementation:

### A. Fixed/sticky header offset

If the header is:

```css
position: fixed;
```

or:

```css
position: sticky;
```

the browser may place the target underneath it.

### B. `scrollIntoView()`

Check for:

```js
element.scrollIntoView({
  behavior: "smooth"
});
```

This aligns the element without necessarily accounting for a custom fixed header.

### C. Hardcoded offsets

Search for:

```js
window.scrollTo(...)
```

and:

```js
window.scrollBy(...)
```

Especially:

```js
window.scrollTo({
  top: section.offsetTop - 100
});
```

Hardcoded offsets are fragile.

### D. Nested scroll containers

Check whether the page contains:

```css
overflow: auto;
overflow-y: scroll;
overflow: hidden;
```

on parent elements.

A nested scrolling container can cause `scrollIntoView()` to behave differently than expected.

### E. Dynamic header height

If the header changes height after scrolling, a fixed value such as:

```js
const HEADER_HEIGHT = 80;
```

can become wrong.

### F. Smooth-scroll + state update

Check whether the toggle:

1. changes state
2. re-renders the component
3. changes its height
4. then starts scrolling

That can cause the target position to move during the animation.

---

# 17. Preferred fix

## First choice: CSS `scroll-margin-top`

Give every anchored destination a stable ID:

```html
<section id="web">
```

Then:

```css
section[id] {
  scroll-margin-top: 96px;
}
```

Use the actual header height.

This is preferable to scattering JavaScript offsets throughout the application.

For responsive layouts:

```css
section[id] {
  scroll-margin-top: 88px;
}

@media (max-width: 768px) {
  section[id] {
    scroll-margin-top: 72px;
  }
}
```

---

# 18. If JavaScript scrolling is required

Use a centralized helper.

```ts
function scrollToSection(id: string) {
  const element = document.getElementById(id);

  if (!element) return;

  const header = document.querySelector("[data-site-header]");

  const headerHeight =
    header instanceof HTMLElement
      ? header.getBoundingClientRect().height
      : 0;

  const top =
    element.getBoundingClientRect().top +
    window.scrollY -
    headerHeight -
    16;

  window.scrollTo({
    top,
    behavior: "smooth",
  });
}
```

Do NOT create separate magic numbers for every button.

---

# 19. Better architecture for navigation

Use semantic links when possible:

```html
<a href="#web">Web</a>
```

instead of:

```html
<button onClick={() => window.scrollTo(...)}>
  Web
</button>
```

Navigation should be navigation.

A button should only be used if the control is actually changing application state.

If "Web" is a real toggle between modes/views rather than a section anchor, keep the state change and scroll behavior separate.

---

# 20. If "Web" is a toggle AND a navigation trigger

This distinction is important.

If the UI looks like:

```text
[ Web ] [ Mobile ]
```

and clicking "Web" changes the content being displayed, do not treat it as an anchor link.

The implementation should be:

```text
User selects Web
        ↓
Update selectedMode
        ↓
Render Web content
        ↓
After layout is stable
        ↓
Scroll to Web content
```

Do not scroll before the new content exists.

If React is being used, use a controlled effect carefully:

```ts
useEffect(() => {
  if (selectedMode !== "web") return;

  requestAnimationFrame(() => {
    document
      .getElementById("web")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  });
}, [selectedMode]);
```

However, prefer pure anchor navigation if the toggle does not actually change content.

---

# 21. Active navigation state

If the page has section navigation, use `IntersectionObserver`.

Do not manually calculate:

```js
window.scrollY > 500
```

for each section.

Recommended pattern:

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
    rootMargin: "-96px 0px -55% 0px",
    threshold: 0,
  }
);
```

Adjust the root margin based on the real header height.

This keeps the navigation state synchronized with actual viewport position.

---

# 22. Required scroll bug test matrix

The developer must manually test:

### Desktop

- [ ] Click Web from top
- [ ] Click Web after scrolling 25%
- [ ] Click Web after scrolling 50%
- [ ] Click Web after scrolling 75%
- [ ] Click Web from the section immediately above it
- [ ] Click Web repeatedly
- [ ] Refresh while URL contains the section hash

### Mobile

- [ ] Same tests at 390px
- [ ] Test sticky header
- [ ] Test mobile navigation
- [ ] Test smooth scroll
- [ ] Test orientation change

### Edge cases

- [ ] Target section has images still loading
- [ ] Target section contains dynamic content
- [ ] Header changes height on scroll
- [ ] Browser back/forward
- [ ] Direct URL with `#web`
- [ ] Reduced-motion preference

---

# 23. Scroll behavior accessibility

Respect:

```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

Do not force long smooth animations for users who disable motion.

Keep scroll duration short enough that navigation feels immediate.

---

# 24. Final design target

The visual result should feel like:

```text
Quiet
     ↓
Precise
     ↓
Intelligent
     ↓
Trustworthy
     ↓
Technical
     ↓
Premium
```

Not:

```text
AI startup
     ↓
Gradient
     ↓
Cards
     ↓
Glowing animation
     ↓
More cards
     ↓
Huge CTA
```

---

# 25. Concrete implementation priority

Do these in this order.

## Phase 1 — Fix functionality

- [ ] Audit all navigation/toggle scroll handlers.
- [ ] Identify fixed/sticky header dimensions.
- [ ] Identify nested scroll containers.
- [ ] Remove hardcoded scroll offsets.
- [ ] Add stable section IDs.
- [ ] Add `scroll-margin-top`.
- [ ] Centralize scrolling if JavaScript is required.
- [ ] Fix active-section state.
- [ ] Test desktop and mobile.
- [ ] Test hash navigation.

## Phase 2 — Replace visual system

- [ ] Replace current palette with Warm Intelligence palette.
- [ ] Reduce number of visual colors.
- [ ] Replace pure white backgrounds with warm neutral where appropriate.
- [ ] Replace pure black typography with near-black.
- [ ] Reduce shadows.
- [ ] Reduce excessive corner radius.
- [ ] Replace colorful cards with editorial layouts.
- [ ] Introduce restrained data visualization colors.

## Phase 3 — Typography

- [ ] Audit current font loading.
- [ ] Remove unnecessary font families.
- [ ] Establish display/body hierarchy.
- [ ] Improve line lengths.
- [ ] Tune heading letter-spacing.
- [ ] Tune paragraph line-height.

## Phase 4 — Polish

- [ ] Add subtle rules/grid only where useful.
- [ ] Add restrained hover states.
- [ ] Add section transitions.
- [ ] Add reduced-motion handling.
- [ ] Verify accessibility.
- [ ] Verify performance.

---

# 26. Non-negotiable rule

Do not implement the palette as:

```text
Section 1 = beige
Section 2 = green
Section 3 = pink
Section 4 = cream
Section 5 = brown
```

That defeats the entire purpose.

The correct approach is:

```text
Warm neutral canvas
        +
white surfaces
        +
near-black typography
        +
hairline borders
        +
one restrained accent
        +
very subtle data colors
```

The user should notice the **content and product**, not the color palette.

---

# 27. Acceptance criteria

The redesign passes only if:

- [ ] The page feels subtle at first glance.
- [ ] There is no obvious generic AI/SaaS color treatment.
- [ ] Color does not dominate the page.
- [ ] Typography carries most of the visual hierarchy.
- [ ] Accent color is used intentionally.
- [ ] Product/data surfaces look credible.
- [ ] Cards are not used as the default layout primitive.
- [ ] Shadows are restrained.
- [ ] Border/radius system is consistent.
- [ ] Navigation feels stable.
- [ ] Clicking the Web control lands at the correct section regardless of current scroll position.
- [ ] Fixed/sticky header never covers the destination heading.
- [ ] Mobile and desktop produce correct scroll positions.
- [ ] Direct hash navigation works.
- [ ] Reduced-motion users are respected.
- [ ] No hardcoded scroll offsets remain unless explicitly justified.
