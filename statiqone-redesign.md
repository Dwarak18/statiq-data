# StatIQ One — Frontend Redesign Specification

## Reference

Current website: https://statiqone.com/

## Redesign objective

The current presentation should be moved away from the visual language of a generic AI-generated marketing site.

The new site should feel like a **real intelligence/data product built by an experienced product + frontend team**:

- confident
- editorial
- technical without being noisy
- data-aware
- restrained
- credible
- fast
- human-designed

The redesign should communicate the product before trying to impress the visitor.

## Important constraint

Do not fabricate business facts.

Do not invent:

- client logos
- customer counts
- revenue
- awards
- partnerships
- employees
- product modules
- market statistics
- testimonials
- case studies
- certifications

Use existing verified content. Where information is unavailable, leave an explicit content placeholder for the project owner.

## Design direction

### Visual personality

Use a visual language closer to:

**research platform + modern data company + premium editorial website**

rather than:

**generic SaaS + AI startup template**

The interface should have visual tension through typography, spacing, grids, data surfaces, and composition instead of gradients and decorative effects.

### Color

Start with a restrained neutral base:

- warm/off-white or very light neutral for primary surfaces
- near-black for primary text
- muted gray for secondary text
- one strong StatIQ accent
- one optional data-visualization accent

Do not use a rainbow palette.

Do not make gradients the primary design device.

### Typography

Use one strong display family and one highly readable UI/body family, or a single high-quality family with a deliberate weight system.

Suggested hierarchy:

- Display: large, tight, confident
- H1: 56–80px desktop depending on actual copy length
- H2: 36–52px
- H3: 22–28px
- Body: 17–19px
- Supporting UI: 13–15px

On mobile, scale based on readability rather than simply shrinking desktop values.

### Layout

Use a 12-column desktop grid.

Avoid putting every section into a simple centered stack.

Introduce controlled asymmetry:

- text block offset from data visual
- editorial side labels
- large numerical/statistical anchors where verified
- horizontal rules
- full-bleed visual sections
- split layouts
- dense information areas followed by breathing room

The layout should feel designed, not randomly asymmetric.

---

# Proposed information architecture

## 01 — Navigation

Keep navigation compact.

Suggested structure:

- Logo
- Platform / Product
- Solutions
- Research / Insights
- About
- Contact / CTA

Only keep items that correspond to real pages.

Header behavior:

- transparent or minimal on initial hero if visually appropriate
- becomes solid/blurred only when necessary for readability
- compact on scroll
- mobile navigation should be simple, not an oversized animated menu

Avoid a navigation bar with too many dropdowns.

---

# 02 — Hero

### Goal

Answer three questions immediately:

1. What is StatIQ One?
2. What type of problem does it solve?
3. Why should I continue?

### Composition

Use a strong editorial hero rather than a generic SaaS hero.

Suggested structure:

Left:
- small product/category label
- concise headline
- 1–2 sentence explanation
- primary CTA
- secondary text link

Right:
- real product/data visualization if available
- otherwise a carefully designed abstract information visualization based on actual product concepts

Do not use a fake dashboard screenshot.

### Hero copy direction

Avoid generic phrases such as:

- "Unlock the power of AI"
- "Transform your business"
- "Revolutionize the future"
- "Next-generation intelligence"

The headline should name the actual value proposition.

If the exact positioning is uncertain, use a content placeholder rather than inventing marketing copy.

---

# 03 — Proof / signal strip

Immediately establish credibility with verified information.

Possible content:

- verified platform capabilities
- geographic coverage
- research areas
- verified metrics
- data sources
- methodology
- organizations or sectors served

If no reliable metrics are available, use a qualitative proof strip instead.

Design:

- horizontal
- restrained
- typography-led
- minimal icons

Avoid six shiny cards.

---

# 04 — What StatIQ One does

Explain the platform using a clear conceptual model.

Possible visual:

`Sources → Intelligence Layer → Analysis → Decision / Output`

This should be a real information architecture diagram, not decorative arrows.

Use 3–4 meaningful stages maximum.

Each stage should have:

- title
- short explanation
- optional technical detail
- relevant visual/data cue

---

# 05 — Product / intelligence surface

This should become the visual centerpiece of the website.

Instead of a generic feature-card grid, create one large product surface.

Potential patterns:

### Option A — Interactive data canvas

- map
- trend lines
- filters
- categories
- data points
- contextual annotations

### Option B — Research workspace

- source list
- insight panel
- evidence/context
- timeline
- comparison

### Option C — Intelligence dashboard

Only use this if the real product actually behaves like a dashboard.

The visual must correspond to the actual product.

---

# 06 — Capabilities

Do not use three generic cards.

Use an editorial list:

01 — Capability name  
Short explanation  
Relevant proof / output

02 — Capability name  
Short explanation  
Relevant proof / output

03 — Capability name  
Short explanation  
Relevant proof / output

Allow the active item to reveal more information.

This creates hierarchy without adding visual clutter.

---

# 07 — Research / methodology

A data/intelligence company should explain why its information can be trusted.

Possible content:

- data sources
- collection process
- normalization
- analysis
- validation
- update frequency
- limitations

Only include what is actually true.

This section can visually resemble a technical research note.

Use:

- monospace labels sparingly
- timestamps where real
- source references where available
- structured diagrams
- subtle grid/ruler elements

---

# 08 — Use cases / sectors

If the business serves multiple sectors, make the visitor choose a path.

Example pattern:

`Researchers | Businesses | Analysts | Decision Makers`

Selecting a category changes the supporting content.

Do not make four identical cards.

On mobile, convert this into a stacked selector.

---

# 09 — Evidence / case studies

If real case studies exist:

- show the problem
- show the approach
- show the output
- show measurable result where verified

If case studies do not exist, do not fake them.

Use "How the platform is used" instead.

---

# 10 — About / team

Humanize the company.

Show:

- who built it
- why it exists
- what the team believes
- what they are researching/building

Real photographs are preferable to AI-generated portraits.

Keep this section concise.

---

# 11 — Final CTA

Avoid:

"Ready to transform your business?"

Use a CTA connected to the actual next action:

- Request a demo
- Explore the platform
- Talk to the team
- View research
- Contact us

CTA copy should match the real conversion path.

---

# 12 — Footer

Include:

- logo
- concise description
- primary navigation
- contact
- social links if actually used
- legal links
- copyright

Do not make the footer visually enormous unless there is a real information architecture reason.

---

# Component architecture

Suggested React structure if applicable:

```text
src/
  components/
    layout/
      Header
      MobileNav
      Footer

    sections/
      Hero
      ProofStrip
      IntelligenceFlow
      ProductSurface
      Capabilities
      Methodology
      UseCases
      Evidence
      About
      FinalCTA

    ui/
      Button
      Container
      SectionLabel
      Divider
      DataPoint
      Reveal
      Tabs

  data/
    navigation
    capabilities
    useCases
    methodology

  styles/
    tokens
```

Adapt this to the existing repository instead of forcing the exact structure.

---

# Design tokens

Example starting point:

```css
:root {
  --bg: #f4f3ef;
  --surface: #ffffff;
  --surface-muted: #ebeae5;

  --text: #111111;
  --text-muted: #686863;

  --border: #d8d7d0;

  --accent: /* verified StatIQ brand accent */;
  --accent-contrast: #ffffff;

  --container: 1280px;

  --space-section: clamp(5rem, 10vw, 10rem);

  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
}
```

Do not copy these colors blindly. Inspect the existing brand assets and use the actual brand palette where available.

---

# Motion system

Use a small set of motions.

### Entrance

- opacity
- 8–24px translation
- 400–700ms

### Hover

- 150–250ms
- subtle transform or border/background change

### Section reveal

Use once per major section, not on every child.

### Data visualization

Animate values only when the animation helps users understand the data.

### Reduced motion

For:

```css
@media (prefers-reduced-motion: reduce) {
  /* disable non-essential motion */
}
```

---

# Responsive behavior

## Desktop

Use the full grid and asymmetrical composition.

## Tablet

Collapse complex split layouts carefully.

## Mobile

Do not simply stack desktop columns.

Recompose:

- hero visual below copy
- horizontal proof strip becomes a scrollable row or stacked facts
- complex data surfaces become simplified views
- navigation becomes compact
- typography remains strong
- CTA remains visible

Test at minimum:

- 390px
- 430px
- 768px
- 1024px
- 1440px

---

# Accessibility

Required:

- semantic headings
- keyboard navigation
- visible focus states
- sufficient color contrast
- descriptive link text
- alt text for meaningful images
- empty alt for decorative images
- no interaction dependent only on hover
- reduced-motion support
- accessible mobile navigation
- correct button/link semantics

---

# Performance

Do not sacrifice performance for visual effects.

Priorities:

1. Optimize hero media.
2. Use modern image formats where supported.
3. Lazy-load below-the-fold media.
4. Avoid oversized JavaScript dependencies.
5. Avoid loading multiple unnecessary font families.
6. Keep animation work on compositor-friendly properties where possible.
7. Prevent layout shifts.
8. Avoid client-side rendering for content that can be static/server-rendered.

---

# SEO

At minimum:

- unique title
- unique meta description
- canonical URL
- semantic H1
- correct heading hierarchy
- Open Graph metadata
- Twitter/X metadata if relevant
- favicon
- sitemap
- robots.txt
- structured data where applicable

Do not add fake schema claims.

---

# Definition of done

The redesign should pass this review:

### Design

- [ ] Does not look like an AI-generated template.
- [ ] Typography has a clear hierarchy.
- [ ] There is a coherent visual system.
- [ ] Sections do not all use identical cards.
- [ ] Decorative effects do not dominate the page.
- [ ] Product/data visualization is meaningful.
- [ ] Brand identity is visible without being loud.

### UX

- [ ] Visitor understands the product quickly.
- [ ] Primary CTA is obvious.
- [ ] Navigation is understandable.
- [ ] Mobile experience is intentionally designed.
- [ ] Content is scannable.

### Engineering

- [ ] Existing functionality preserved.
- [ ] Components are reusable where appropriate.
- [ ] No unnecessary dependencies.
- [ ] No console errors.
- [ ] No broken assets.
- [ ] Responsive layout tested.
- [ ] Accessibility basics implemented.
- [ ] Motion respects reduced-motion preference.
- [ ] Performance has been considered.

### Content integrity

- [ ] No fake statistics.
- [ ] No fake testimonials.
- [ ] No fake logos.
- [ ] No invented customers.
- [ ] No unsupported product claims.

## Implementation rule

Do not start by writing JSX.

First inspect the repository, identify the current architecture, audit the existing page, then implement the design system and page structure.

The quality target is:

> "This looks like a team has been maintaining and improving this product for years."

Not:

> "This looks like an AI generated landing page."
