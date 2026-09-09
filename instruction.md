# StatIQ One Frontend Instructions

## Purpose

Build and maintain StatIQ One as a credible, human-designed intelligence and research product. The site should feel quiet, precise, useful, and maintained by an experienced product team.

Do not optimize for visual novelty or for making the site look "AI-generated". Use clear information architecture, strong typography, real product behavior, restrained motion, and accurate content.

## Project context

- Stack: React 19, TypeScript, Vite, Tailwind CSS v4, Motion, Lucide, and ECharts.
- Main marketing page: `src/pages/Home.tsx`.
- Routing and subdomain behavior: `src/App.tsx`.
- Global design tokens: `src/index.css`.
- Chart styling: `src/utils/chartTheme.ts`.
- Layout components: `src/components/layout/`.
- Marketing sections: `src/components/sections/`.
- Shared UI primitives: `src/components/ui/`.
- Product pages include dashboard, datasets, company, industry, country, search, statistics, workspace, pricing, authentication, and advertising.
- The `/`, `/nexdatalytix`, and `/about-nexdatalytix` routes have distinct content responsibilities. Preserve that distinction.

## Design direction

The visual language is **warm intelligence**:

- warm neutral canvas
- near-black typography
- quiet white surfaces
- thin borders
- one restrained clay accent
- muted sage/data tones
- editorial spacing
- meaningful data surfaces

The first impression should be almost monochromatic. Color should support hierarchy, not become the content.

### Canonical tokens

Use the variables in `src/index.css` instead of introducing new arbitrary colors:

| Role | Token |
|---|---|
| Page canvas | `--color-bg` |
| Surface | `--color-surface` |
| Raised surface | `--color-surface-raised` |
| Primary text | `--color-ink` |
| Secondary text | `--color-ink-soft` |
| Muted text | `--color-muted` |
| Border | `--color-border` |
| Accent | `--color-accent` |
| Secondary data tone | `--color-sage` |
| Chart primary | `--data-primary` |

Keep the existing palette unless a deliberate brand decision requires changing it. If a token is missing, add it centrally rather than scattering hex values through JSX.

## Human-designed interface rules

### Prefer

- clear hierarchy before decoration
- editorial rows and split layouts
- restrained card usage
- real product/data visualizations
- short, specific copy
- meaningful labels and source context
- asymmetry with a clear purpose
- hairline dividers and stable spacing
- subtle hover and focus states
- responsive recomposition rather than simple column stacking

### Avoid

- purple or neon "AI" gradients
- glowing borders, glassmorphism, blobs, particles, or cursor effects
- decorative dashboard screenshots that do not represent the product
- repeated rounded cards for every feature
- alternating beige/green/pink section backgrounds
- gradient text
- excessive pills and icons
- giant shadows or oversized corner radii
- fake metrics, testimonials, logos, awards, customers, or certifications
- generic copy such as "unlock the power of AI" or "transform your business"

## Typography and layout

- Let type, spacing, and composition carry the visual identity.
- Use the existing body and heading font tokens.
- Use display/serif treatment sparingly, only where it improves hierarchy.
- Keep body copy readable and generally within 60–75 characters per line.
- Use strong headings with controlled line length rather than oversized text with weak copy.
- Use the existing `Container` and layout primitives before adding new wrappers.
- Use restrained radii: 4px, 8px, and 14px are the normal scale.
- Prefer borders over shadows. Use shadows only when a surface genuinely needs elevation.

## Page composition

The home page should communicate the product in this order:

1. Navigation and clear brand identity.
2. Hero explaining what StatIQ One is and who it helps.
3. Verified proof or product signals.
4. Source-to-output intelligence model.
5. A credible product or research surface.
6. Capabilities shown as an editorial list or interactive detail view.
7. Methodology and evidence.
8. Use cases or sectors.
9. About and team context.
10. A specific next action.

Do not add a section merely to fill space. If verified content is unavailable, use a clear placeholder or omit the section.

## Content integrity

Never invent:

- customer names or logos
- user counts, revenue, coverage, or performance figures
- partnerships or certifications
- case studies or testimonials
- data sources or audit claims
- product capabilities that are not implemented

Use existing verified content from the repository. Keep copy direct and concrete. Content should explain the product rather than imitate startup marketing language.

## Navigation and scrolling

- Keep the header semantic and compact.
- `Header.tsx` must retain `data-site-header` because scroll positioning depends on it.
- Use the shared navigation callback and scroll helper in `Home.tsx`; do not add page-specific magic offsets.
- Keep section IDs stable and use `section[id]` scroll margins from `src/index.css`.
- Measure the live header height when JavaScript scrolling is required.
- Prefer links for navigation and buttons for state changes.
- Keep active section state driven by `IntersectionObserver`.
- Support direct hash navigation, browser back/forward, mobile navigation, and reduced motion.
- Do not add nested scroll containers unless the interaction genuinely requires one.

## Components and implementation

- Reuse existing components before creating new ones.
- Keep section-specific content in `src/components/sections/`.
- Keep shared behavior in `src/components/ui/` or an appropriate context/helper.
- Keep chart palette and chart defaults in `src/utils/chartTheme.ts`.
- Avoid large monolithic components and duplicated markup.
- Use semantic HTML, correct heading order, real links, and accessible button labels.
- Add `alt` text to meaningful images and empty alt text to decorative images.
- Preserve existing authentication, payments, routing, PWA, and product functionality while changing presentation.
- Do not make unrelated refactors during a visual change.

## Motion

Motion should explain interaction or establish hierarchy:

- use opacity and small translations for entrances
- keep hover transitions short and subtle
- animate data only when it helps comprehension
- do not animate every child independently
- respect `prefers-reduced-motion` in both CSS and JavaScript

## Responsive behavior

Design intentionally for at least:

- 390px
- 430px
- 768px
- 1024px
- 1440px

On mobile:

- keep the hero readable and put the product visual below the copy
- simplify dense data surfaces without hiding their meaning
- make navigation and controls keyboard/touch friendly
- avoid horizontal overflow except for deliberate, labeled scrollers
- preserve clear CTA visibility

## Required workflow for changes

1. Inspect the existing route, component, data, and token usage before editing.
2. Identify the smallest set of files that owns the behavior or visual system.
3. Reuse existing primitives and tokens.
4. Make a focused change; do not rewrite unrelated routes.
5. Check keyboard focus, reduced motion, responsive layout, and empty/loading/error states.
6. Run the smallest relevant validation command.
7. Check the diff for accidental hardcoded colors, fake content, broken links, and unrelated changes.

## Validation commands

Use the commands already defined in `package.json`:

```text
npm run lint
npm run build
npm run test
```

Use the narrowest command that covers the change. Run the full set when changing shared tokens, routing, layout primitives, or cross-page behavior.

## Definition of done

A change is ready when:

- the product purpose is clear without decorative explanation
- the page looks deliberate rather than templated
- typography and spacing establish hierarchy
- accent color is intentional and limited
- data surfaces represent real product concepts
- no unsupported claims were added
- responsive and keyboard behavior remain usable
- reduced-motion behavior is respected
- existing routes and functionality still work
- the implementation uses shared tokens and components
- lint/build/tests pass for the affected behavior
