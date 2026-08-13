# Original User Request

## 2026-08-12T08:54:20Z

Redesign the StatIQ One marketing website (`src/pages/Home.tsx` and its associated styles) to look like a **real intelligence/data product** built by an experienced product + frontend team — confident, editorial, technical without being noisy, data-aware, and credible — rather than a generic AI-generated SaaS landing page.

Working directory: C:\Users\Dwarak\Documents\GitHub\StatiQ

Integrity mode: development

Reference specification: `C:\Users\Dwarak\Documents\GitHub\StatiQ\statiqone-redesign.md`  
Frontend skill: `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\skills\frontend-skill\SKILL.md`  
Reference site: https://statiqone.com/

---

## Tech stack (confirmed from repository)

- **Framework**: React 19 + TypeScript, Vite
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss"` in `index.css`), with `tailwind-merge` and `clsx`
- **Animation**: `motion` (Framer Motion v12)
- **Icons**: `lucide-react`
- **Charts**: `echarts` + `echarts-for-react`
- **Routing**: `react-router-dom` v7
- **Existing brand tokens**: gold accent `#C8A45D` / `#E3C47A`, near-black background `#09090B`, dark surfaces
- **Fonts already in use**: Inter (sans), Plus Jakarta Sans (heading), JetBrains Mono (mono)

---

## Requirements

### R1. Read the skill and spec before writing any code

Read and follow `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\skills\frontend-skill\SKILL.md` in full before making any changes.

Also read `C:\Users\Dwarak\Documents\GitHub\StatiQ\statiqone-redesign.md` in full. It defines visual personality, layout, section architecture, design tokens, motion system, responsive behavior, accessibility, and definition of done.

Then inspect the existing repository (routes, components, assets, `index.css`, `App.tsx`) before writing anything.

### R2. Redesign `Home.tsx` (the public marketing page)

Redesign the public-facing home/marketing page at `src/pages/Home.tsx`.

Implement all 12 sections described in the spec:

1. **Navigation** — compact, transparent on hero, solid on scroll, mobile-safe
2. **Hero** — editorial split layout (copy left, data visualization right); strong typographic headline naming the real value proposition; no fake dashboard
3. **Proof strip** — horizontal, typography-led, verified capabilities/coverage only; no invented metrics
4. **What StatIQ One does** — conceptual flow diagram: `Sources → Intelligence Layer → Analysis → Output`; real information architecture, not decorative arrows
5. **Product surface** — large, visually dominant; choose Option A (interactive data canvas), B (research workspace), or C (intelligence dashboard) based on what matches the real product
6. **Capabilities** — editorial numbered list (`01 —`, `02 —`, `03 —`) with accordion/reveal; no three identical cards
7. **Research / methodology** — trust-building technical note; monospace labels, structured layout
8. **Use cases / sectors** — tabbed selector that changes content (`Researchers | Businesses | Analysts | Decision Makers`)
9. **Evidence / case studies** — use "How the platform is used" framing since no real case studies are available
10. **About / team** — concise; who built it, why it exists
11. **Final CTA** — action-connected (`Request a demo`, `Explore the platform`, `Talk to the team`)
12. **Footer** — compact; logo, nav, contact, legal

### R3. Extend the design system in `index.css` to support the redesign

Add CSS custom properties for the new layout tokens described in `statiqone-redesign.md` (section spacing, container width, editorial grid, radius, border, surface-muted) without removing any existing tokens.

Apply the Tailwind v4 `@theme` block pattern already in use.

Integrate the existing brand gold (`#C8A45D`) as the StatIQ accent.

### R4. Visual personality — editorial not template

The page must not look like a generic AI-generated SaaS landing page.

Specifically:
- No purple/blue AI gradients
- No "Unlock / Transform / Revolutionize" hero copy
- No three identical feature cards
- No decorative glassmorphism blobs
- No fake statistics, logos, testimonials, or metrics
- No randomly animated every-element scroll entrance
- Use controlled asymmetry: text block offset from data visual, editorial side labels, horizontal rules, split layouts, full-bleed sections
- Use strong typography hierarchy (the existing Plus Jakarta Sans + Inter combination is good; leverage it)
- Where content is missing, insert clearly labeled `[CONTENT PLACEHOLDER: ...]` rather than inventing it

### R5. No fabricated business facts

Do not invent:
- Client logos
- Customer counts
- Revenue or growth metrics
- Awards or certifications
- Partnerships
- Employee count
- Product modules that don't exist
- Market statistics
- Testimonials
- Case studies

Use real positioning from the live site https://statiqone.com/ plus the information already present in the existing source files.

### R6. Motion system

Use the existing `motion` library (Framer Motion v12).

Implement:
- Section entrance (opacity + 8–24px Y translation, 400–700ms)
- Hover states (150–250ms subtle transforms)
- Capability reveal animation
- Use-case tab transition

Respect `prefers-reduced-motion`.

Do not animate every element on scroll.

### R7. Responsive layout

The redesign must be intentionally responsive at: 390px, 430px, 768px, 1024px, 1440px.

- Mobile hero: copy stacked above visual
- Proof strip: scrollable row on mobile
- Product surface: simplified view on mobile
- Navigation: compact mobile nav (not a giant animated drawer)
- Typography scales for readability, not just shrinkage

### R8. Accessibility and SEO

Accessibility:
- Semantic heading hierarchy
- Keyboard navigation
- Visible focus states
- Sufficient color contrast (verify gold `#C8A45D` on dark backgrounds)
- `alt` attributes
- `aria-*` only where native semantics are insufficient
- Reduced-motion support

SEO (in `index.html` or via React Helmet / document.title):
- Unique title tag
- Meta description
- Open Graph tags
- Canonical URL
- Semantic H1
- Correct heading hierarchy

---

## Acceptance Criteria

### Repository reconnaissance done
- [ ] The implementation note (Phase 1 output from the skill) is documented before any structural code changes

### Design quality
- [ ] The page does not look like an AI-generated landing page template
- [ ] Typography has a clear 3-level hierarchy (display / body / supporting)
- [ ] At least one section uses a split/asymmetric layout instead of centered stack
- [ ] Capabilities section uses a numbered editorial list with expand/reveal, not three identical cards
- [ ] No decorative gradients dominate any section
- [ ] The StatIQ gold accent is used consistently but sparingly
- [ ] At least one product/data visualization exists and is meaningful (not a fake screenshot)

### Content integrity
- [ ] Zero fabricated statistics
- [ ] Zero fabricated logos
- [ ] Zero fabricated testimonials
- [ ] All missing content is marked `[CONTENT PLACEHOLDER: ...]`

### Engineering
- [ ] `npm run dev` starts without errors
- [ ] `npm run lint` (`tsc --noEmit`) passes with no new TypeScript errors
- [ ] No console errors in the browser
- [ ] No broken import paths
- [ ] Existing routes other than Home still render correctly
- [ ] Motion animations use the existing `motion` library
- [ ] Reduced-motion is handled via `useReducedMotion()` or CSS `@media (prefers-reduced-motion: reduce)`

### Responsive
- [ ] Layout is usable and intentionally composed at 390px, 768px, and 1440px
- [ ] Navigation collapses correctly on mobile

### Accessibility
- [ ] Single `<h1>` on the page
- [ ] Focus states are visible on all interactive elements
- [ ] All meaningful images have descriptive `alt` text

## 2026-08-12T15:30:00Z

Apply the updated visual system and fix the scroll/navigation positioning bug on the StatIQ One marketing website. This is a follow-up pass on the redesign that was just completed.

Working directory: C:\Users\Dwarak\Documents\GitHub\StatiQ

Integrity mode: development

Reference specification: `C:\Users\Dwarak\Documents\GitHub\StatiQ\statiqone-visual-system-scroll-fix.md`  
Frontend skill: `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\skills\frontend-skill\SKILL.md`

---

## Tech stack (confirmed)

- **Framework**: React 19 + TypeScript, Vite
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss"` in `src/index.css`), `tailwind-merge`, `clsx`
- **Animation**: `motion` (Framer Motion v12)
- **Icons**: `lucide-react`
- **Routing**: `react-router-dom` v7

---

## Requirements

### R1. Read the spec and skill in full before writing any code

Read `C:\Users\Dwarak\Documents\GitHub\StatiQ\statiqone-visual-system-scroll-fix.md` completely.  
Read `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\skills\frontend-skill\SKILL.md` completely.

Then inspect the current `src/index.css`, `src/pages/Home.tsx`, and all layout/UI components before writing anything. Output a short reconnaissance note before making changes.

### R2. Replace the visual system with "Warm Intelligence"

Replace the current color palette in `src/index.css` with the **Warm Intelligence** palette from the spec (section 2):

```css
--color-bg: #F7F6F2;
--color-surface: #FBFAF7;
--color-surface-raised: #FFFFFF;

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
```

Add data visualization tokens:
```css
--data-primary: #667A70;
--data-secondary: #B9684E;
--data-tertiary: #A8ADA4;
--data-neutral: #D7D5CE;
```

Add radius tokens:
```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 14px;
```

Preserve all existing Tailwind v4 `@theme` block structure. Do not remove tokens that are referenced elsewhere.

### R3. Apply visual system rules throughout Home.tsx

After updating tokens, audit `src/pages/Home.tsx` and all components it uses and apply these rules from the spec:

**Color distribution target:** ~70% warm neutral canvas, ~20% white surfaces, ~7% typography, ~3% accent + data colors.

**Section backgrounds:** Do NOT alternate a different color for every section. Use:
- Warm canvas (`--color-bg`) as the default
- White/near-white (`--color-surface-raised`) only to create semantic separation (e.g., the product surface section)
- Never: `section 1 = beige, section 2 = green, section 3 = pink`

**Borders over shadows:** Replace `box-shadow` with `border: 1px solid var(--color-border)` wherever the intent is surface separation. Use only minimal shadows where a surface genuinely needs lift (max `0 8px 30px rgba(20,20,18,0.06)`).

**Radius:** Replace `rounded-3xl`, `rounded-2xl`, `rounded-full` on non-pill UI with `rounded-sm` (4px) or `rounded-md` (8px). Reserve `rounded-lg` (14px) for important product surfaces only.

**Accent usage:** The accent color (`#B9684E`) should appear on primary CTAs, active navigation state, important data points, and interactive focus only — not on every icon, heading, or card.

**Cards:** Where three identical icon/title/text cards exist, replace with editorial numbered rows (see spec section 7):
```
01   Capability Name
     Short explanation          →
─────────────────────────────────
02   Capability Name
     Short explanation          →
```

**Typography:** Near-black `#20201E` for headings, `#4F4E49` for body, `#77756E` for muted/secondary. No pure `#000000` or pure `#ffffff` surfaces.

**Background texture (optional):** If personality is needed, use only an extremely subtle 1px grid at opacity ≤ 0.035 (see spec section 12). If it is immediately noticeable, it is too strong.

### R4. Fix the scroll/navigation positioning bug

There is a functional bug: when the user scrolls partway down the page and then clicks the "Web" toggle/navigation control, the destination section does not land at the correct viewport position — the fixed/sticky header covers the heading.

**Phase 1 — Audit (do this before fixing):**
- Find all navigation/toggle scroll handlers in `Home.tsx` and layout components
- Check for `scrollIntoView()`, `window.scrollTo()`, `window.scrollBy()` calls
- Check for hardcoded offsets like `section.offsetTop - 100`
- Check for `overflow: hidden/auto/scroll` on parent containers
- Check for dynamic header height changes on scroll

**Phase 2 — Fix:**

Preferred fix — CSS `scroll-margin-top`:
```css
section[id] {
  scroll-margin-top: 96px; /* use actual header height */
}
@media (max-width: 768px) {
  section[id] {
    scroll-margin-top: 72px;
  }
}
```

If JavaScript scrolling is required, use a single centralized helper (see spec section 18):
```ts
function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) return;
  const header = document.querySelector('[data-site-header]');
  const headerHeight = header instanceof HTMLElement
    ? header.getBoundingClientRect().height : 0;
  const top = element.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
  window.scrollTo({ top, behavior: 'smooth' });
}
```

If "Web" is a toggle that changes content AND triggers scroll (spec section 20), implement as:
1. Update state
2. Render new content
3. After layout is stable (`requestAnimationFrame`), then scroll

Use `IntersectionObserver` for active section state — not `window.scrollY > 500` manual comparisons (spec section 21).

Add `data-site-header` attribute to the header element.

**Accessibility:** Respect `prefers-reduced-motion` — use `scroll-behavior: auto` for reduced-motion users.

### R5. Typography refinement

- Audit font loading — remove any unnecessary font families introduced during the redesign
- Establish clear display/body hierarchy using the existing Plus Jakarta Sans (headings) + Inter (body) combination
- Tune heading `letter-spacing` to feel tight and confident, not loose
- Tune paragraph `line-height` to ~1.6–1.7 for readability
- Keep line lengths to ~60–75ch for body copy

### R6. Preserve all existing functionality

- All routes other than Home must continue to work
- No new TypeScript errors (`npm run lint` must pass)
- No console errors
- No broken imports

---

## Acceptance Criteria

### Visual system
- [ ] Page feels quiet and near-monochromatic at first glance
- [ ] No obvious AI/SaaS color treatment (no purple/blue gradients, no neon)
- [ ] Section backgrounds do not alternate a different color for every section
- [ ] Warm canvas `#F7F6F2` is the dominant background
- [ ] Near-black `#20201E` is used for primary text (not pure `#000000`)
- [ ] Accent color `#B9684E` appears sparingly — primarily on CTAs and interactive states
- [ ] Shadows are minimal or replaced with borders
- [ ] Radius is restrained (`rounded-3xl` removed from non-pill elements)

### Layout & cards
- [ ] No three identical icon/title/text card grids remain
- [ ] At least one capability/feature section uses an editorial numbered row layout
- [ ] Typography carries most of the visual hierarchy

### Scroll bug fix
- [ ] Clicking the "Web" control from any scroll position lands correctly (heading not hidden under header)
- [ ] No hardcoded scroll offsets (`- 100`, `- 80`, etc.) remain unless explicitly justified in a comment
- [ ] `scroll-margin-top` is applied to all section anchors OR a centralized JS scroll helper is used
- [ ] Active section navigation state uses `IntersectionObserver`
- [ ] Hash navigation (`#web`) works correctly from a direct URL
- [ ] Reduced-motion users receive `scroll-behavior: auto`

### Engineering
- [ ] `npm run dev` starts without errors
- [ ] `npm run lint` (`tsc --noEmit`) passes with no new TypeScript errors
- [ ] No console errors
- [ ] All non-Home routes still render correctly

### Accessibility
- [ ] Visible focus states on all interactive elements
- [ ] Scroll behavior respects `prefers-reduced-motion`
