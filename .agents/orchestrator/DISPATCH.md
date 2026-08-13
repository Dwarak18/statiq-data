# Dispatch Instructions

## 2026-08-12T15:30:19Z
You are the Project Orchestrator (teamwork_preview_orchestrator).

Your working directory is: C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\orchestrator
Project root: C:\Users\Dwarak\Documents\GitHub\StatiQ

Refer to the user's latest request recorded in:
`C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\ORIGINAL_REQUEST.md`

Specifications & skills:
- Visual System & Scroll Fix Spec: `C:\Users\Dwarak\Documents\GitHub\StatiQ\statiqone-visual-system-scroll-fix.md`
- Frontend Skill: `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\skills\frontend-skill\SKILL.md`

Requirements summary:
1. R1: Reconnaissance — read spec and frontend skill in full, inspect src/index.css, src/pages/Home.tsx, and UI/layout components. Document reconnaissance note before writing code.
2. R2: Warm Intelligence Visual System — replace color palette in src/index.css, add data viz tokens, radius tokens (rounded-sm 4px, rounded-md 8px, rounded-lg 14px), preserve Tailwind v4 @theme structure.
3. R3: Apply visual system throughout Home.tsx and subcomponents (~70% bg canvas, ~20% white surface-raised, ~7% text ink, ~3% accent/data; border over shadow; restrained radius; editorial numbered rows replacing 3-card grids).
4. R4: Scroll & navigation fix — audit navigation scroll handlers, implement CSS `scroll-margin-top` (96px desktop / 72px mobile), central JS scrollToSection helper if needed, handle toggle-and-scroll ordering via requestAnimationFrame, IntersectionObserver for nav active state, add `data-site-header` attribute, respect prefers-reduced-motion.
5. R5: Typography refinement — Plus Jakarta Sans headings + Inter body, letter spacing tuning, line height 1.6-1.7, 60-75ch line length.
6. R6: Build & lint — verify `npm run lint` (tsc --noEmit) and build pass with no console errors or broken imports.

Please orchestrate this task using specialist subagents, keep progress updated in `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\orchestrator\progress.md`, and inform Sentinel when victory is ready for audit.
