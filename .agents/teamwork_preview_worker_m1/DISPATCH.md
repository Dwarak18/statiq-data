## 2026-08-12T10:03:08Z
You are Milestone 1 Worker (teamwork_preview_worker).
Your working directory is: C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\teamwork_preview_worker_m1

Task:
Implement Milestone 1: Warm Intelligence Tokens & CSS Global Setup.

Write Ownership (Exclusive):
- `src/index.css`
- `src/utils/chartTheme.ts`

Inputs:
1. ORIGINAL_REQUEST.md: C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\ORIGINAL_REQUEST.md
2. PROJECT.md: C:\Users\Dwarak\Documents\GitHub\StatiQ\PROJECT.md
3. Spec: C:\Users\Dwarak\Documents\GitHub\StatiQ\statiqone-visual-system-scroll-fix.md
4. M1 Explorer Analysis: C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\teamwork_preview_explorer_m1\analysis.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Instructions:
1. Read M1 Explorer analysis report for exact replacement details.
2. Update `src/index.css`:
   - Replace `@theme` block and `:root` custom properties with Warm Intelligence tokens (`--color-bg: #F7F6F2`, `--color-surface: #FBFAF7`, `--color-surface-raised: #FFFFFF`, `--color-ink: #20201E`, `--color-ink-soft: #4F4E49`, `--color-muted: #77756E`, `--color-faint: #9A9890`, `--color-border: #DEDDD7`, `--color-border-soft: #E9E7E1`, `--color-accent: #B9684E`, `--color-accent-hover: #A85B43`, `--color-accent-soft: #EAD8D0`, `--color-sage: #7D8A82`, `--color-sage-soft: #DCE1DC`, `--color-success: #657B6C`, `--color-warning: #A6845C`, `--color-error: #9A5B55`).
   - Add Data Visualization tokens (`--data-primary: #667A70`, `--data-secondary: #B9684E`, `--data-tertiary: #A8ADA4`, `--data-neutral: #D7D5CE`).
   - Add Radius tokens (`--radius-sm: 4px`, `--radius-md: 8px`, `--radius-lg: 14px`).
   - Add global CSS rule:
     `section[id] { scroll-margin-top: 96px; }`
     `@media (max-width: 768px) { section[id] { scroll-margin-top: 72px; } }`
   - Preserve Tailwind v4 `@theme` structure and legacy fallback aliases (`--color-primary`, `--color-background`, `--color-text`, `--color-card`).
3. Update `src/utils/chartTheme.ts`:
   - Update constants (`GOLD_PRIMARY` -> `#B9684E`, `GOLD_HOVER` -> `#A85B43`, `GRAPHITE_BORDER` -> `#DEDDD7`, `CARD_BACKGROUND` -> `#FBFAF7`, `TEXT_MUTED` -> `#77756E`, `TEXT_MAIN` -> `#20201E`, `COLOR_SUCCESS` -> `#657B6C`, `COLOR_DANGER` -> `#9A5B55`).
   - Update line series gradient stops to `rgba(185, 104, 78, 0.35)`.
4. Run `npm run lint` (`npx tsc --noEmit`) to verify no TypeScript compilation errors.
5. Record build and test results in handoff report at `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\teamwork_preview_worker_m1\handoff.md`. Send message to parent when finished.
