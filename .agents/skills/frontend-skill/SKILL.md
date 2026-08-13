---
name: frontend-skill
description: >-
  Senior frontend engineering and UI development skill for StatIQ One.
  Use when designing, building, reviewing, or modifying frontend UI components, page layouts, editorial designs, and styling for the StatIQ website.
---

# Frontend Web Development Skill — StatIQ One

## Role

Act as a senior frontend engineer and product-minded UI developer working on an existing production website.

The goal is **not** to generate a generic AI landing page. The goal is to make StatIQ One look like a real product/company website that has been designed, implemented, reviewed, tested, and maintained by an experienced frontend team.

Reference site: https://statiqone.com/

## Core principles

1. **Understand before changing**
   - Inspect the existing repository, routes, components, assets, dependencies, and styling system before editing.
   - Reuse working infrastructure where it is sensible.
   - Do not rewrite the entire project merely because a redesign is requested.

2. **Design with intent**
   - Every section needs a job: explain, prove, differentiate, or convert.
   - Avoid stacking generic sections such as "Trusted by", "Our Services", "Why Us", "Testimonials", and "FAQ" just because AI landing pages commonly use them.
   - Remove visual elements that do not communicate anything.

3. **Prefer editorial/product design over template design**
   - Use strong typography, meaningful whitespace, asymmetric composition, restrained motion, real imagery/data, and clear hierarchy.
   - Avoid excessive gradients, glowing borders, glassmorphism, floating blobs, random 3D objects, oversized rounded cards, and decorative noise.
   - Do not make every section look like a collection of cards.

4. **Use the brand's actual content**
   - Do not invent customers, metrics, awards, partnerships, employees, certifications, product capabilities, or claims.
   - If information is missing, create a clearly marked content placeholder rather than fabricating facts.
   - Preserve important existing business meaning unless the redesign explicitly changes the content strategy.

5. **Build a system, not a screenshot**
   - Establish design tokens first.
   - Create reusable components for repeated patterns.
   - Keep page-specific composition separate from reusable primitives.
   - Avoid copy-pasted CSS and duplicated component logic.

6. **Motion must communicate**
   - Use animation for hierarchy, transitions, progressive disclosure, data visualization, and spatial relationships.
   - Avoid animation on every element.
   - Respect `prefers-reduced-motion`.
   - No perpetual distracting motion.

## Required workflow

### Phase 1 — Repository reconnaissance

Before writing UI code:

- Identify framework and build tool.
- Identify routing.
- Identify styling strategy.
- Identify UI/component libraries.
- Identify animation libraries.
- Identify image/font/icon handling.
- Identify existing API/data integrations.
- Identify page entry points.
- Identify mobile breakpoints.
- Identify existing SEO metadata.
- Identify analytics or tracking.
- Identify deployment constraints.

Output a short implementation note before making structural changes.

### Phase 2 — Existing-site audit

Review:

- Header/navigation
- Hero
- Above-the-fold hierarchy
- Content density
- Typography
- Color system
- CTA strategy
- Section ordering
- Images
- Icons
- Footer
- Mobile behavior
- Accessibility
- Performance
- SEO

For every major problem, record:

`Problem → Why it hurts → Proposed fix → Implementation location`

### Phase 3 — Design system

Define tokens for:

- Backgrounds
- Text colors
- Borders
- Accent colors
- Typography scale
- Font weights
- Container widths
- Section spacing
- Radius
- Shadows
- Motion durations/easing
- Breakpoints

Use CSS variables or the project's existing token mechanism.

### Phase 4 — Page architecture

Design the page around the user's journey:

1. What is StatIQ One?
2. Why should I care?
3. What exactly does it do?
4. How does it work?
5. What evidence supports it?
6. Who is it for?
7. What should I do next?

Do not force this exact order if the product's actual information architecture suggests a better sequence.

### Phase 5 — Implementation

Implement in this order:

1. Global styles/tokens
2. Typography
3. Navigation
4. Hero
5. Primary content sections
6. Product/data visualization
7. Proof/evidence sections
8. CTA
9. Footer
10. Responsive behavior
11. Accessibility
12. Motion polish
13. Performance optimization
14. SEO metadata

### Phase 6 — Quality pass

Before considering the work finished:

- Test desktop, tablet, and mobile.
- Test keyboard navigation.
- Test focus states.
- Test reduced motion.
- Check text contrast.
- Check overflowing content.
- Check long headings.
- Check images without fixed dimensions.
- Check loading states.
- Check hover states.
- Check buttons and links.
- Check console errors.
- Check broken assets.
- Check Lighthouse/Core Web Vitals where possible.

## Anti-AI design rules

The following are warning signs and should trigger a redesign review:

- "Big gradient headline + floating cards" hero
- Excessive `rounded-3xl`
- Every section inside a centered max-width card
- Purple/blue AI gradient used everywhere
- Generic "Unlock / Transform / Revolutionize" copy
- Three identical feature cards
- Random glassmorphism
- Decorative blobs with no semantic purpose
- Fake dashboard screenshots
- Fake logos
- Fake statistics
- Excessive scroll animations
- Random icon selection
- Stock images that do not represent the product
- Huge empty areas used only to look premium
- Mobile layout treated as an afterthought

## Real-developer code standards

- Components should have one clear responsibility.
- Name components by purpose, not appearance.
- Avoid `Component1`, `Section2`, `Card3`, etc.
- Keep content/data separate from layout where practical.
- Prefer semantic HTML.
- Use accessible buttons and links.
- Do not use clickable `<div>` elements.
- Do not hide important content behind animation.
- Avoid unnecessary dependencies.
- Do not introduce a library for something that can be implemented cleanly with existing project tools.
- Preserve existing functionality unless there is a reason to change it.
- Keep diffs reviewable.
- Do not create speculative abstractions.

## React-specific guidance

If the project uses React:

- Prefer functional components.
- Keep state local unless it genuinely belongs in shared state.
- Do not add global state for simple UI toggles.
- Avoid unnecessary `useEffect`.
- Use stable keys.
- Keep data transformations outside JSX when they become complex.
- Prefer composition over deeply nested conditional rendering.
- Use `aria-*` only when native semantics are insufficient.

## Tailwind-specific guidance

If Tailwind is already used:

- Use Tailwind for layout and component styling.
- Do not create huge repeated utility strings when a component/token abstraction is clearer.
- Do not fight the design system with arbitrary values everywhere.
- Centralize brand colors and typography.
- Use responsive variants deliberately.
- Keep visual rhythm consistent.

## Animation guidance

If GSAP, Framer Motion, Motion, or another animation system exists:

- Reuse the existing library.
- Establish a small motion vocabulary.
- Prefer:
  - entrance transitions
  - section reveals
  - image masking
  - number/data transitions
  - subtle hover states
  - navigation transitions
- Avoid:
  - continuous floating objects
  - excessive parallax
  - cursor-following effects everywhere
  - animation that delays access to content

## Definition of done

The redesign is successful only if:

- It feels intentionally art-directed rather than generated from a landing-page template.
- A developer can understand the component structure.
- A designer can understand the visual system.
- A content editor can identify where content belongs.
- The mobile version is deliberately designed.
- The page communicates StatIQ One within the first few seconds.
- Visual hierarchy is stronger than decorative effects.
- No unsupported claims were invented.
- The site remains maintainable after the redesign.
