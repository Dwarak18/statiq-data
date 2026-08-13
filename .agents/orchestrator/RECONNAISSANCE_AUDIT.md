# StatIQ One — Reconnaissance & Existing-Site Audit Master Report

## 1. Implementation Note (Phase 1 Reconnaissance)

### Tech Stack Confirmed
- **Framework**: React 19 (`react` 19.0.1, `react-dom` 19.0.1) + TypeScript ~5.8.2 + Vite 6.2.3
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss"` in `src/index.css`) with `@tailwindcss/vite` plugin.
  - Utility helpers: `clsx` 2.1.1 + `tailwind-merge` 3.0.2 via `src/utils/cn.ts` (`cn(...)`).
- **Animation**: `motion` v12.23.24 (Import statement: `import { motion } from 'motion/react'`).
- **Icons**: `lucide-react` 0.546.0.
- **Charts / Visualizations**: `echarts` 6.1.0 + `echarts-for-react` 3.0.6 (configured via `src/utils/chartTheme.ts`).
- **Routing**: `react-router-dom` v7.18.1 (12 active routes in `src/App.tsx`).
- **Typography**: Inter (sans), Plus Jakarta Sans (headings), JetBrains Mono (monospace). Loaded via Google Fonts in `index.html`.
- **Brand Colors**: Primary gold `#C8A45D`, hover gold `#E3C47A`, background `#09090B`, dark surface `#111111`, card `#171717`, border `#2A2A2A`.

### Verification Commands
- `npm run lint` -> Runs `tsc --noEmit`
- `npm run build` -> Runs Vite build
- `npm run dev` -> Runs Vite development server

---

## 2. Existing-Site Flaw & Audit Matrix (Phase 2 Audit)

| # | Flaw / Problem | Why it hurts | Proposed Fix | Target Location |
|---|----------------|--------------|--------------|-----------------|
| 1 | Missing 7 of 12 required sections | User cannot evaluate product capabilities or methodology; page fails spec | Implement missing sections 04, 05, 06, 07, 08, 09, 10 in modular components | `src/components/sections/` |
| 2 | Generic AI radial dot background & purple/blue glowing gradients | Gives cheap, template-generated AI landing page impression | Remove radial dots & glowing blobs; replace with clean dark surfaces (`#09090B`, `#111111`) & thin rules (`#2A2A2A`) | `src/index.css`, `Home.tsx` |
| 3 | Hero copy uses generic AI SaaS buzzwords ("Next-Gen Intelligence") | Reduces technical credibility; fails requirement R4 | Replace with editorial split hero stating explicit value proposition | `src/components/sections/Hero.tsx` |
| 4 | Hero visual is static abstract cards rather than real product visualization | Misses opportunity to showcase real market data canvas | Build interactive ECharts market data canvas with SEC citation metadata | `src/components/sections/ProductSurface.tsx` |
| 5 | Three/four identical generic feature cards grid | Template anti-pattern; low content density | Replace with editorial numbered list (`01 —`, `02 —`, `03 —`) with active reveal | `src/components/sections/Capabilities.tsx` |
| 6 | Fake pulsing "REAL-TIME DATA" badges | Misleading; violates content integrity | Replace with qualitative proof strip & verified platform coverage | `src/components/sections/ProofStrip.tsx` |
| 7 | Download CTA triggers browser `alert()` popups | Broken UX; unprofessional | Replace with action-connected links (`/request-access`, modal, or contact anchors) | `src/components/sections/FinalCTA.tsx`, `Header.tsx` |
| 8 | Gold text on white/light background violates WCAG AA contrast | Unreadable text; accessibility failure | Enforce `#C8A45D` gold text ONLY on dark surfaces (`#09090B`), use `#000000` text on gold buttons | `src/index.css`, `src/components/ui/Button.tsx` |
| 9 | Heading hierarchy level skips (H1 -> H3 -> H4) | Breaks screen reader navigation and SEO structure | Restructure to strict H1 -> H2 -> H3 hierarchy with single H1 per page | `src/pages/Home.tsx`, all section components |
| 10| Keyboard hints (`Cmd+K`, `Press ↵`) rendered on mobile touch devices | Irrelevant UI clutter on touchscreens | Hide desktop hotkey hints on mobile (`hidden md:inline-flex`) | `src/components/sections/Hero.tsx` |
| 11| Unlabelled form inputs & missing focus rings | Keyboard navigation failure | Add `aria-label`, visible gold focus rings (`focus-visible:ring-2 focus-visible:ring-[#C8A45D]`) | `src/components/ui/` primitives |
| 12| Raw SVG `onClick` handlers without keyboard access | Non-interactive for keyboard/screen reader users | Use native `<button>` elements with `type="button"` and ARIA labels | `src/components/layout/Navbar.tsx` |
| 13| Missing index.html SEO tags | Reduced search engine discoverability and social previews | Add Open Graph tags, Twitter cards, meta description, and canonical URL | `index.html` |
| 14| Lack of design system tokens in `index.css` | Inconsistent spacing, container widths, and colors | Add CSS custom properties & Tailwind `@theme` layout tokens | `src/index.css` |

---

## 3. Brand & Content Integrity Specification (Phase 3 & 4 Input)

### R5 Enforcement (Zero Fabricated Facts)
- **Verified Facts**: 3,542,109 active series, 250+ sectors, 150+ global markets, SEC EDGAR, FRED, IMF, World Bank, Eurostat, OECD feeds.
- **Placeholders**: `[CONTENT PLACEHOLDER: Client Logos]`, `[CONTENT PLACEHOLDER: Customer Count]`, `[CONTENT PLACEHOLDER: Specific Case Study Organization]`, `[CONTENT PLACEHOLDER: Executive Leadership Bios]`.

### Gold Accent (`#C8A45D` / `#E3C47A`) Rules
- `#C8A45D` on `#09090B` background = **6.81:1** contrast ratio (Passes WCAG AA/AAA).
- Primary Gold Button: Gold background (`#C8A45D`) MUST use black text (`#000000`) = **11.23:1** contrast ratio. White text on gold is forbidden (2.12:1 failure).

---

## 4. Architectural Roadmap for Milestones 2–4

1. **Milestone 2 (Design Tokens & UI Primitives)**:
   - Extend `src/index.css` with layout tokens (`--container: 1280px`, `--space-section`, `--surface-muted`, custom radii, border colors).
   - Create UI primitives in `src/components/ui/`: `Button.tsx`, `Container.tsx`, `SectionLabel.tsx`, `Divider.tsx`, `DataPoint.tsx`, `Reveal.tsx`, `Tabs.tsx`.

2. **Milestone 3 (12-Section Component Architecture & Page Assembly)**:
   - Create section components in `src/components/sections/`:
     - `Header.tsx` / `MobileNav.tsx` (Section 01)
     - `Hero.tsx` (Section 02)
     - `ProofStrip.tsx` (Section 03)
     - `IntelligenceFlow.tsx` (Section 04)
     - `ProductSurface.tsx` (Section 05)
     - `Capabilities.tsx` (Section 06)
     - `Methodology.tsx` (Section 07)
     - `UseCases.tsx` (Section 08)
     - `Evidence.tsx` (Section 09)
     - `About.tsx` (Section 10)
     - `FinalCTA.tsx` (Section 11)
     - `Footer.tsx` (Section 12)
   - Recompose `src/pages/Home.tsx`.

3. **Milestone 4 (Motion, Responsive, Accessibility, SEO & Audit)**:
   - Integrate Framer Motion (`motion/react`) with reduced-motion support.
   - Responsive polish across 390px, 430px, 768px, 1024px, 1440px.
   - SEO metadata in `index.html`.
   - Run `npm run lint` (`tsc --noEmit`), Vite build, and `teamwork_preview_auditor` verification pass.
