## 2026-08-12T14:28:05Z

You are Worker 1 (Design System & UI Primitives Engineer) for the StatIQ One Marketing Website Redesign.
Your working directory is: `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\worker_m2`

Read the following reference files before writing any code:
1. `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\ORIGINAL_REQUEST.md`
2. `C:\Users\Dwarak\Documents\GitHub\StatiQ\statiqone-redesign.md`
3. `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\skills\frontend-skill\SKILL.md`
4. `C:\Users\Dwarak\Documents\GitHub\StatiQ\PROJECT.md`
5. `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\orchestrator\RECONNAISSANCE_AUDIT.md`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Tasks (Milestone 2: Design System & UI Primitives Foundation):
1. Extend `src/index.css`:
   - Add CSS custom properties & Tailwind v4 `@theme` layout tokens:
     `--container: 1280px`
     `--space-section: clamp(5rem, 10vw, 10rem)`
     `--bg: #09090B`
     `--surface: #111111`
     `--surface-muted: #171717`
     `--text: #F4F4F5`
     `--text-muted: #A1A1AA`
     `--border: #2A2A2A`
     `--accent: #C8A45D`
     `--accent-contrast: #000000`
     `--accent-hover: #E3C47A`
     `--radius-sm: 6px`
     `--radius-md: 12px`
     `--radius-lg: 20px`
   - Preserve all existing fonts (Plus Jakarta Sans, Inter, JetBrains Mono) and utility classes.
   - Do NOT remove existing Tailwind imports or configuration.

2. Create Reusable UI Primitive Components in `src/components/ui/`:
   - `Button.tsx`: Variants (`primary` gold `#C8A45D` bg with `#000000` text, `secondary` dark bg with `#2A2A2A` border and white text, `ghost`, `outline`). Sizes (`sm`, `md`, `lg`). Accessible focus rings (`focus-visible:ring-2 focus-visible:ring-[#C8A45D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B]`). Handles both button and anchor (href) semantics.
   - `Container.tsx`: Responsive container primitive (`max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8`).
   - `SectionLabel.tsx`: Monospace editorial category tag (e.g., `01 — NAVIGATION`, `02 — HERO`). Monospace font, gold accent dot/line.
   - `Divider.tsx`: Clean horizontal grid rule (`border-b border-[#2A2A2A]`).
   - `DataPoint.tsx`: Editorial numerical/data anchor block (large value, label, optional unit, optional source citation badge).
   - `Reveal.tsx`: Motion entrance wrapper using Framer Motion (`import { motion, useReducedMotion } from 'motion/react'`). Fades in and translates Y by 16px with reduced-motion support.
   - `Tabs.tsx`: Accessible interactive tab selector primitive (`role="tablist"`, `role="tab"`, keyboard nav, active indicator in `#C8A45D`).

3. Verification:
   - Run `npm run lint` (`npx tsc --noEmit`) and verify zero TypeScript errors.
   - Run `npm run build` and verify build success.

Deliverable:
Write a detailed `handoff.md` in `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\worker_m2\handoff.md` documenting modified/created files, design token implementations, UI primitives created, and build/lint execution results. Send a message to parent when done.
