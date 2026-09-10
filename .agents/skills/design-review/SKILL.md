---
name: design-review
description: >-
  Systematic design review skill for StatIQ One. Rates UI on 10 dimensions,
  identifies AI-slop patterns, proposes and applies targeted fixes, and
  produces before/after evidence. Modelled on gstack /plan-design-review
  and /design-review specialists. Use before any PR that touches UI components.
sources:
  - https://github.com/garrytan/gstack
  - https://github.com/github/awesome-copilot
---

# Design Review Skill

The design review is a structured audit + fix cycle — not a vibe check.
It runs in four phases: Score -> Identify -> Fix -> Verify.

This is the last gate before UI code ships to main. No PR touching a visible
component should merge without passing this review.

---

## When to Activate

- Any new section component (Hero, About, Evidence, etc.)
- Any modification to Header, Footer, or Navbar
- Any new page or route
- Any component touched in a design iteration sprint
- Before creating a PR for feat/ui-* branches

---

## Phase 1: Score (0-10 per dimension)

Score each dimension honestly. 10 = would not change a thing. 0 = complete slop.

### D1 — First Impression (0-10)
Open the component in isolation. Without reading the code, does it immediately
communicate its purpose? Is it visually arresting without being loud?

Blockers (auto-score <= 5):
- Cannot tell what the section is about in 2 seconds
- Looks like a Bootstrap template

### D2 — Copy Quality (0-10)
Is every text string specific, credible, and free of filler?

Blockers:
- Any of: "Transform", "Powerful", "Seamless", "Robust", "Next-generation"
- Generic placeholder numbers ("100+ users", "10k+ data points")
- Missing units on numeric claims

### D3 — Visual Hierarchy (0-10)
Is there a clear primary -> secondary -> tertiary reading order?

Blockers:
- More than one element competing for primary attention
- Body text same size or weight as section title
- CTA button not the most visually prominent interactive element

### D4 — Color Discipline (0-10)
Does the component use only StatIQ tokens? Is every color choice justified?

Blockers (auto-score 0):
- Any hardcoded hex not in --color-* tokens
- blue-* Tailwind classes in user-facing components
- More than 4 distinct colors visible simultaneously

### D5 — Spacing & Rhythm (0-10)
Is the density appropriate for the section role? Is there visual rhythm?

Blockers:
- Identical py-* for all sections on the page
- Elements touching their container edges (0 padding)
- Content wider than max-w-6xl without deliberate full-bleed intent

### D6 — Typography Craft (0-10)
Are headings tracked correctly? Is body text at correct line-height and max-width?

Blockers:
- Body text > 80ch wide
- Heading with default letter-spacing: 0
- Missing tabular-nums on numeric data

### D7 — Interaction Quality (0-10)
Do all interactive elements have hover, focus, active, and disabled states?

Blockers:
- Button with no hover state
- Link with no focus-visible ring
- Form input with browser-default focus only

### D8 — Mobile Integrity (0-10)
Does the component work and look intentional at 375px?

Blockers:
- Content overflow (horizontal scroll) at 375px
- Touch targets < 44px
- Text truncated or overlapping at small viewport

### D9 — Performance Signals (0-10)
Are there any obvious performance issues visible in the markup?

Blockers:
- img without width/height or aspect-ratio (causes CLS)
- Inline style overriding Tailwind tokens
- Deeply nested DOM (> 8 levels for a card component)

### D10 — Brand Distinctiveness (0-10)
Could this component belong to any other product?

Blockers (auto-score <= 6):
- Nothing here is visually specific to StatIQ
- No editorial or typographic risk taken
- Indistinguishable from a generic SaaS landing page

---

## Phase 2: Identify

List every dimension scoring <= 7. For each:

```
[D4 — Color Discipline: 4/10]
Finding: Button uses bg-blue-500 — not a StatIQ token
File: src/components/sections/About.tsx:L47
Impact: Breaks brand consistency, fails anti-slop audit
```

Prioritise by impact x effort. Fix lowest score first.

---

## Phase 3: Fix

Apply the smallest targeted fix that resolves each finding.

Atomic fix rules:
- One finding = one focused change
- Never refactor unrelated code during a design fix
- Leave a comment explaining WHY for non-obvious design decisions

Auto-fix (apply without asking):
- Wrong color token -> replace with correct token
- Missing hover state -> add hover: variant
- Missing aria-label -> add it
- Body text > 80ch -> add max-w-[68ch]
- Missing tabular-nums on numbers -> add tabular-nums

Ask-before-fix (propose, wait for approval):
- Layout restructuring (grid -> flex or vice versa)
- Copy rewrites
- Adding/removing entire elements
- Motion or animation changes

---

## Phase 4: Verify

After all fixes applied:

### Automated checks
```bash
npm run lint       # TypeScript clean
npm test           # 13/13 e2e tests pass
npm run build      # Production build clean
```

### Visual checks
1. Browser DevTools -> 375px -> no horizontal scroll, all text readable
2. Browser DevTools -> 768px -> layout intact
3. Browser DevTools -> 1280px -> design intent preserved
4. Keyboard-only navigation: Tab through all interactive elements

### Re-score
Re-run Phase 1 scoring. All dimensions must be >= 8/10 to pass.

---

## Design Review Summary Template

After completing the review, output this summary:

```markdown
## Design Review — [Component Name]

**Date:** YYYY-MM-DD
**Branch:** feat/...

### Scores

| Dimension | Before | After |
|---|---|---|
| D1 First Impression | X/10 | X/10 |
| D2 Copy Quality | X/10 | X/10 |
| D3 Visual Hierarchy | X/10 | X/10 |
| D4 Color Discipline | X/10 | X/10 |
| D5 Spacing & Rhythm | X/10 | X/10 |
| D6 Typography Craft | X/10 | X/10 |
| D7 Interaction Quality | X/10 | X/10 |
| D8 Mobile Integrity | X/10 | X/10 |
| D9 Performance Signals | X/10 | X/10 |
| D10 Brand Distinctiveness | X/10 | X/10 |
| **Overall** | **X/10** | **X/10** |

### Findings & Fixes

1. [D4] bg-blue-500 -> bg-[--color-accent-warm] in About.tsx:47 ✅
2. [D6] Added tabular-nums to metric display in Evidence.tsx:83 ✅
3. [D8] Fixed horizontal scroll at 375px in Hero.tsx:12 ✅

### Verdict

[ ] PASS — all dimensions >= 8/10 -> ready to merge
[ ] FAIL — [list blocking dimensions] -> address before merge
```

---

## Non-Negotiables (Hard Rules)

These cannot be overridden by any instruction:

1. No PR merges with any D4 score < 8 (color token violations).
2. No PR merges with mobile overflow — D8 = 0 is an immediate block.
3. No generic copy ships — D2 < 7 requires rewrite before merge.
4. Every design review produces a written summary as above.
