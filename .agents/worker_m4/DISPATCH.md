## 2026-08-12T09:09:12Z

You are Worker 3 (Motion, Responsive, Accessibility & SEO Polish Engineer) for the StatIQ One Marketing Website Redesign.
Your working directory is: `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\worker_m4`

Read the following reference files before starting:
1. `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\ORIGINAL_REQUEST.md`
2. `C:\Users\Dwarak\Documents\GitHub\StatiQ\statiqone-redesign.md`
3. `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\skills\frontend-skill\SKILL.md`
4. `C:\Users\Dwarak\Documents\GitHub\StatiQ\PROJECT.md`
5. `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\orchestrator\RECONNAISSANCE_AUDIT.md`
6. `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\worker_m3\handoff.md`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Tasks (Milestone 4: Motion, Responsive Polish, Accessibility, SEO & Quality Audit):
1. SEO Tags in `index.html`:
   - Add unique `<title>StatIQ One — Enterprise Financial Research & Market Intelligence Platform</title>`.
   - Add `<meta name="description" content="..." />` matching StatIQ One positioning.
   - Add Open Graph meta tags (`og:title`, `og:description`, `og:type`, `og:url`, `og:site_name`).
   - Add Twitter Card meta tags (`twitter:card`, `twitter:title`, `twitter:description`).
   - Add canonical link (`<link rel="canonical" href="https://statiqone.com/" />`).

2. Motion System Polish:
   - Ensure Framer Motion (`motion/react`) section reveals use restrained 400-700ms entrance (opacity + 16px Y translation).
   - Ensure hover transforms are subtle (150-250ms).
   - Ensure all animated components handle `useReducedMotion()` or `@media (prefers-reduced-motion: reduce)`.
   - Prevent unnecessary wildcard transitions in `src/index.css`.

3. Responsive & Breakpoint Polish (390px, 430px, 768px, 1024px, 1440px):
   - Verify mobile hero layout (text stacked above visual).
   - Verify proof strip horizontal scroll behavior on 390px/430px mobile.
   - Verify mobile navigation drawer and toggle button semantics.
   - Hide desktop hotkey hints (`Cmd+K`, `Press ↵`) on mobile touch devices (`hidden md:inline-flex`).

4. Accessibility Polish:
   - Verify single `<h1>` on `Home.tsx` ("Enterprise Market Intelligence & Financial Research Platform").
   - Verify visible gold focus rings on interactive elements.
   - Verify descriptive `alt` text on images and `aria-label` on buttons.
   - Verify color contrast (gold `#C8A45D` background uses black `#000000` text).

5. Verification:
   - Run `npm run lint` (`npx tsc --noEmit`) and verify zero TypeScript errors.
   - Run `npm run build` to verify Vite build success.

Deliverable:
Write a comprehensive `handoff.md` in `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\worker_m4\handoff.md` documenting SEO updates, motion polish, responsive fixes, accessibility compliance, and build/lint execution results. Send a message to parent when finished.
