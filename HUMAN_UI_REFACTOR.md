# STATIQONE Human UI Refactor

Use this brief to remove the generated-template feel from the public website while preserving its working routes, financial-data content, warm neutral palette, and terracotta accent.

## Remove from the rendered interface

- All numbered section eyebrows: `01 —` through `09 —`.
- Labels such as `FINANCIAL RESEARCH`, `PRODUCT SURFACE`, `CORE CAPABILITIES`, `PLATFORM ARCHITECTURE`, `SECTOR PATHWAYS`, `PLATFORM APPLICATION`, and `INSTITUTIONAL ACCESS` when the main heading already explains the section.
- `Editorial Numbered Architecture`, `WORKFLOW SPEC`, and copy that describes the design system to visitors.
- All `⌘ K`, Command, and `Ctrl K` visual hints in search controls. The shortcut may continue to work invisibly.
- `Spotlight` branding. Use `Search companies, filings, and datasets`.
- Internal placeholders, future-content notes, fake proof language, and statements such as `Zero Fabricated Client Claims`.
- Unsupported real-time, audit, certification, customer, scale, and performance claims.
- Decorative monospace, all-caps microcopy, repeated metadata chips, and unnecessary numbered cards.

## Replace with plain product language

| Current | Replace with |
|---|---|
| Sources used in the platform | Trusted data sources |
| Platform Architecture | How the data flows |
| Core Capabilities | Capabilities |
| Methodology & Integrity | How we verify data |
| Sector Pathways | Built for different research teams |
| Platform Application | Research workflows |
| About STATIQDATA | About STATIQONE |
| Spotlight search | Search |
| Request Institutional Access | Talk to our team |

## Design rules

- Each section gets one clear heading, one useful supporting paragraph, and only the actions it needs.
- Use sentence case for navigation, labels, buttons, tabs, and headings.
- Use monospace only for tickers, numeric data, timestamps, IDs, code, and file formats.
- Prefer alignment, whitespace, and thin dividers to a card around every item.
- Avoid repeating the same eyebrow + heading + paragraph + card-grid structure in every section.
- Keep body text at 16px or larger and make the page usable on mobile without horizontal scrolling.
- Do not describe the product as clean, premium, human-made, zero-noise, or developer-grade. Demonstrate quality through the interface.
- Track missing content in development issues, never in the rendered website.

## Files to update

Start with:

- `src/components/layout/Header.tsx`
- `src/components/layout/MobileNav.tsx`
- `src/components/sections/Hero.tsx`
- `src/components/sections/ProofStrip.tsx`
- `src/components/ui/SectionLabel.tsx`
- Every file under `src/components/sections/`
- `src/components/ui/SpotlightSearchModal.tsx`
- `src/pages/Pricing.tsx`

## Acceptance criteria

1. No visitor-facing numbered section labels remain.
2. No visible keyboard-shortcut badges remain.
3. Search is labelled plainly and still works.
4. No internal placeholder or anti-fabrication commentary is rendered.
5. No section explains the visual design to the visitor.
6. Navigation and visible UI use sentence case except genuine data identifiers.
7. Existing routes, interactions, responsive behavior, and accessibility remain functional.
8. TypeScript validation and the production build pass.

Run this scan before completion:

```bash
rg -n "[0-9]{2} —|WORKFLOW SPEC|CONTENT PLACEHOLDER|Zero Fabricated|Editorial Numbered|Spotlight|Command|⌘|Ctrl K|START WITH A QUESTION" src
```
