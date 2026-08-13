# Phase 1 — Repository Reconnaissance Report & Implementation Note
**Project**: StatIQ One Marketing Website Redesign  
**Date**: 2026-08-12  
**Author**: Explorer 1 (Repository Reconnaissance Expert)  
**Working Directory**: `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\explorer_1`

---

## 1. Executive Summary

StatIQ One is a React 19 + TypeScript web application built with Vite, Tailwind CSS v4, Motion (Framer Motion v12), Lucide React icons, ECharts, and React Router v7. The repository currently presents a functional financial statistics web application with multiple interactive sub-pages (`/statistics`, `/dashboard`, `/dataset`, `/company`, `/industry`, `/country`, `/search`, `/workspace`, `/pricing`, `/advertising`, `/login`, `/signup`). 

The home page (`src/pages/Home.tsx`) is currently implemented as a single 485-line monolithic component with embedded sections that rely on generic SaaS card layouts and dark-mode gradients. To meet the goals of `statiqone-redesign.md` and `PROJECT.md`, the marketing website must be restructured into 12 modular section components housed in `src/components/sections/`, supported by expanded design system tokens in `src/index.css` and reusable UI primitives in `src/components/ui/`.

---

## 2. Technical Stack & Build Setup

### 2.1 Framework & Core Infrastructure
- **Framework**: React `19.0.1` (`react`, `react-dom`).
- **Language**: TypeScript `~5.8.2` (Target: ES2022, bundler module resolution, strict type checking).
- **Build Tool**: Vite `^6.2.3` with `@vitejs/plugin-react` (`^5.0.4`) and `@tailwindcss/vite` (`^4.1.14`).
- **Routing**: `react-router-dom` `^7.18.1` (`BrowserRouter`, `Routes`, `Route`).
- **Path Alias**: `@/*` mapped to `./src/*` in both `tsconfig.json` and `vite.config.ts`.

### 2.2 Styling System
- **Tailwind CSS**: Tailwind CSS v4 (`tailwindcss` `^4.1.14` and `@tailwindcss/vite` `^4.1.14`).
- **Entry File**: `src/index.css` starting with `@import "tailwindcss";` and a custom `@theme` block.
- **Utility Helpers**: `clsx` (`^2.1.1`) and `tailwind-merge` (`^3.6.0`) composed via `src/utils/cn.ts`.
- **Brand Tokens**:
  - Gold Accent: `#C8A45D` (hover/light: `#E3C47A`, light-theme gold: `#B8913F`).
  - Dark Background: `#09090B` (surface: `#111111`, card: `#171717`, border: `#2A2A2A`).
  - Light Background: `#F8F8F6` (surface: `#FFFFFF`, card: `#F2F1EE`, border: `#E0DDD6`).
  - Fonts: Inter (`--font-sans`), Plus Jakarta Sans (`--font-heading`), JetBrains Mono (`--font-mono`).

### 2.3 Motion, Icons, and Data Visualization
- **Motion**: `motion` (`^12.23.24`), imported as `import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react'`.
- **Icons**: `lucide-react` (`^0.546.0`).
- **Charts**: `echarts` (`^6.1.0`) and `echarts-for-react` (`^3.0.6`). Chart options configured via `src/utils/chartTheme.ts`.

### 2.4 Scripts & Commands
- `npm run dev`: Starts Vite dev server on port 3000 (`vite --port=3000 --host=0.0.0.0`).
- `npm run build`: Executes `vite build` (with manual chunking for `vendor-echarts`, `vendor-react`, `vendor-icons`, `vendor-motion`).
- `npm run lint`: Executes `tsc --noEmit` (TypeScript typecheck).
- `npm run preview`: Executes `vite preview`.

---

## 3. Architecture & Routing Reconnaissance

### 3.1 Application Layout & Navigation Flow
- **Main Container**: `src/components/layout/Layout.tsx` wraps all pages with `<Navbar />` header and `<Footer />` footer.
- **Router Tree** (`src/App.tsx`):
  - `/` -> `Home.tsx` (Target for redesign)
  - `/statistics` -> `Statistics.tsx`
  - `/login` -> `AuthPage.tsx (login)`
  - `/signup` -> `AuthPage.tsx (signup)`
  - `/dashboard` -> `Dashboard.tsx`
  - `/dataset` -> `Dataset.tsx`
  - `/company` -> `Company.tsx`
  - `/industry` -> `Industry.tsx`
  - `/country` -> `Country.tsx`
  - `/search` -> `Search.tsx`
  - `/workspace` -> `Workspace.tsx`
  - `/pricing` -> `Pricing.tsx`
  - `/advertising` -> `Advertising.tsx`

### 3.2 Existing Components Audit (`src/components/`)
- **Layout**:
  - `Navbar.tsx`: Sticky top navbar with logo, 7 main navigation links, spotlight search trigger, notifications trigger, theme toggle, and mobile menu drawer.
  - `Footer.tsx`: 5-column institutional footer with SEC EDGAR / API sync callouts and navigation links.
  - `Layout.tsx`: Standard page wrapper.
- **UI Primitives**:
  - `Button.tsx`: Custom button supporting `default`, `outline`, `ghost`, `link`, `primary`, `secondary` variants.
  - `Card.tsx`, `Badge.tsx`, `Modal.tsx`, `ThemeToggle.tsx`, `SpotlightSearchModal.tsx`, `InstitutionalTrustBar.tsx`, `MarketTicker.tsx`, `PremiumExperience.tsx`, `ResearchGlyph.tsx`, `SourceBadge.tsx`, `CustomIcons.tsx`, `ExportDropdown.tsx`.

---

## 4. Existing-Site Audit & Redesign Gap Analysis

| Component / Feature | Current Implementation | Redesign Requirement (Spec & Skill) | Recommended Action |
|---|---|---|---|
| **Design System Tokens** (`src/index.css`) | Basic `@theme` with primary gold and background colors. | Needs layout tokens: `--container` (1280px), `--space-section` (`clamp(4rem, 8vw, 8rem)`), `--surface-muted`, custom typography scale, border & radius tokens. | Extend `@theme` and `:root` variables in `src/index.css` without removing existing tokens. |
| **SEO Metadata** (`index.html`) | Title tag: `STATIQDATA - Global Data & Research Intelligence Platform`. | Unique title, meta description, Open Graph, Twitter Cards, canonical URL, favicon. | Update `index.html` with complete meta tags and structured header tags. |
| **Header / Nav** (`Navbar.tsx`) | Sticky navbar with blur backdrop. | Needs hero transparency, scroll background shift, compact mobile nav, keyboard shortcuts. | Refactor `Navbar.tsx` to handle transparent-to-solid scroll state and mobile safety. |
| **Hero Section** (`Section 02`) | Monolithic split hero in `Home.tsx` with live market indicators. | Editorial split layout: text block left, real intelligence/data canvas right; strong typographic headline. | Create modular `src/components/sections/Hero.tsx`. |
| **Proof Strip** (`Section 03`) | 4 generic stat metric boxes in `Home.tsx`. | Horizontal, typography-led proof strip of verified coverage & signals (no invented metrics). | Create modular `src/components/sections/ProofStrip.tsx`. |
| **What StatIQ One Does** (`Section 04`) | Missing. | Conceptual flow diagram: `Sources → Intelligence Layer → Analysis → Output` with real IA. | Create modular `src/components/sections/IntelligenceFlow.tsx`. |
| **Product Surface** (`Section 05`) | Missing centerpiece. | Large, visually dominant centerpiece: Option A (Interactive Data Canvas / ECharts/SVG workspace). | Create modular `src/components/sections/ProductSurface.tsx`. |
| **Capabilities** (`Section 06`) | 4 stat cards in `Home.tsx`. | Editorial numbered list (`01 —`, `02 —`, `03 —`) with accordion reveal. | Create modular `src/components/sections/Capabilities.tsx`. |
| **Research / Methodology** (`Section 07`) | Missing technical note. | Structured research note with monospace labels, data source verification, subtle grid rulers. | Create modular `src/components/sections/Methodology.tsx`. |
| **Use Cases / Sectors** (`Section 08`) | Grid of industry links. | Tabbed selector (`Researchers | Businesses | Analysts | Decision Makers`) with dynamic view. | Create modular `src/components/sections/UseCases.tsx`. |
| **Evidence / Case Studies** (`Section 09`) | Generic executive briefings cards. | "How the platform is used" framing with problem, approach, and verified output. | Create modular `src/components/sections/Evidence.tsx`. |
| **About / Team** (`Section 10`) | Missing team context. | Concise section: who built it, why it exists, core methodology beliefs. | Create modular `src/components/sections/About.tsx`. |
| **Final CTA** (`Section 11`) | Newsletter box. | Action-connected conversion CTA (`Request a demo`, `Explore platform`, `Talk to team`). | Create modular `src/components/sections/FinalCTA.tsx`. |
| **Footer** (`Section 12`) | 5-column dark footer. | Compact, logo, nav, contact, legal, copyright. | Refactor `Footer.tsx` for cleaner typography & alignment. |
| **UI Primitives** (`src/components/ui/`) | Basic buttons & cards. | Need dedicated primitives: `Container`, `SectionLabel`, `Divider`, `DataPoint`, `Reveal`, `Tabs`. | Build reusable UI primitives in `src/components/ui/`. |
| **Motion System** (`R6`) | Basic `motion.div` in `Home.tsx`. | Entrance (opacity + Y translate 8-24px, 400-700ms), hover transforms, `useReducedMotion()`. | Standardize motion variants across section components with reduced motion fallback. |

---

## 5. Phase 1 Implementation Plan & Target Component Map

To align with `PROJECT.md` and `statiqone-redesign.md`, the implementation will proceed across the following structure:

```text
src/
├── index.css                     # Extended Tailwind v4 @theme & layout tokens
├── pages/
│   └── Home.tsx                  # Redesigned page orchestrating the 12 sections
├── components/
│   ├── ui/                       # Design system primitives
│   │   ├── Button.tsx
│   │   ├── Container.tsx
│   │   ├── SectionLabel.tsx
│   │   ├── Divider.tsx
│   │   ├── DataPoint.tsx
│   │   ├── Reveal.tsx
│   │   └── Tabs.tsx
│   ├── layout/                   # Layout wrappers & global navigation
│   │   ├── Header.tsx / Navbar.tsx
│   │   ├── MobileNav.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   └── sections/                 # 12 Modular Marketing Sections
│       ├── Hero.tsx              # 02 Hero (Editorial split)
│       ├── ProofStrip.tsx        # 03 Verified Signal / Proof Strip
│       ├── IntelligenceFlow.tsx  # 04 Conceptual Architecture Diagram
│       ├── ProductSurface.tsx    # 05 Interactive Data Canvas / Workspace Visual
│       ├── Capabilities.tsx      # 06 Editorial Numbered Accordion List
│       ├── Methodology.tsx       # 07 Technical Research Note
│       ├── UseCases.tsx         # 08 Sector / Role Tabbed Selector
│       ├── Evidence.tsx          # 09 Platform Use Evidence
│       ├── About.tsx             # 10 Team & Mission
│       ├── FinalCTA.tsx          # 11 Action-Connected CTA
│       └── Footer.tsx            # 12 Compact Footer (or inside layout)
```

---

## 6. Phase 1 Verification Summary

- **Dependencies Verified**: All required packages (`motion` v12, `lucide-react`, `echarts`, `echarts-for-react`, `tailwindcss` v4, `react-router-dom` v7) are installed and configured in `package.json`.
- **Pathing & Build Setup Verified**: `@/*` alias correctly resolves to `./src/*` in both TypeScript compiler options and Vite bundler configuration.
- **Lint & Build Script Mapping**: `"lint": "tsc --noEmit"` and `"build": "vite build"` are standard, functional scripts configured in `package.json`.
