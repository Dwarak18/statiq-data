# StatIQ One Marketing Website Redesign Plan

## Architecture Strategy: 4-Phase Frontend Strategy

### Milestone 1: Reconnaissance & Existing-Site Audit
- **Objective**: Complete repository analysis (stack, routing, styling, assets, dependencies, components) and audit existing page (`Home.tsx`, `App.tsx`, `index.css`, `index.html`).
- **Tasks**:
  1. Inspect repo structure, Vite setup, Tailwind CSS v4 `@theme` configuration, Framer Motion v12 imports, `lucide-react` icons, `echarts` integration.
  2. Audit current `Home.tsx` and identify template / AI anti-patterns.
  3. Map `Problem → Why it hurts → Proposed fix → Implementation location`.
  4. Write `RECONNAISSANCE_AUDIT.md`.
- **Exit Criteria**: Explorer report delivered with full implementation note and audit matrix.

### Milestone 2: Design System & Token Foundation
- **Objective**: Extend design system in `src/index.css` and create UI primitive components.
- **Tasks**:
  1. Add layout tokens to CSS custom properties & Tailwind `@theme` (space-section, container, radii, borders, dark/light surface tokens, brand gold `#C8A45D`).
  2. Maintain existing tokens and typography classes (Plus Jakarta Sans, Inter, JetBrains Mono).
  3. Create reusable UI primitives (`Button`, `Container`, `SectionLabel`, `Divider`, `DataPoint`, `Reveal`, `Tabs`).
- **Exit Criteria**: `npm run lint` / build check passing on design token additions.

### Milestone 3: Component Architecture & 12-Section Implementation
- **Objective**: Build and compose the 12 required sections for `src/pages/Home.tsx`.
- **Tasks**:
  1. `Navigation`: Compact, hero transparent, scroll solid/blurred, mobile-safe.
  2. `Hero`: Editorial split layout (copy left, data visualization right), value-prop headline.
  3. `ProofStrip`: Horizontal typography-led signal strip with verified capabilities.
  4. `IntelligenceFlow`: Conceptual flow (`Sources → Intelligence Layer → Analysis → Output`).
  5. `ProductSurface`: Large interactive data canvas / intelligence workspace visualization.
  6. `Capabilities`: Editorial numbered list (`01 —`, `02 —`, `03 —`) with reveal interaction.
  7. `Methodology`: Technical research note, monospace labels, structured grid layout.
  8. `UseCases`: Tabbed selector (`Researchers | Businesses | Analysts | Decision Makers`).
  9. `Evidence`: "How the platform is used" framing.
  10. `About`: Concise team note, mission, and beliefs.
  11. `FinalCTA`: Action-connected CTA (`Request a demo`, `Explore platform`, `Talk to team`).
  12. `Footer`: Compact footer with logo, nav, contact, legal.
- **Exit Criteria**: All 12 sections implemented in `src/pages/Home.tsx` and passing TypeScript compilation.

### Milestone 4: Motion, Responsive Polish, Accessibility, SEO & Quality Audit
- **Objective**: Apply motion polish, responsive verification across all breakpoints, accessibility compliance, SEO tags, and forensic audit.
- **Tasks**:
  1. Motion polish: Opacity + 8-24px Y entrance, hover transforms, reduced motion fallback (`prefers-reduced-motion` & `useReducedMotion`).
  2. Responsive testing: 390px, 430px, 768px, 1024px, 1440px layout integrity.
  3. Accessibility: Single H1, focus rings, keyboard accessibility, ARIA tags, color contrast.
  4. SEO: Unique title tag, meta description, canonical URL, OG tags in `index.html`.
  5. Content integrity verification: Zero fake stats, fake logos, fake testimonials. Content placeholders where appropriate.
  6. Forensic Audit & Final Gates: Run `npm run lint` (`tsc --noEmit`), build verification, and `teamwork_preview_auditor` verification pass.
- **Exit Criteria**: All acceptance criteria satisfied, zero lint/build errors, forensic audit passed.
