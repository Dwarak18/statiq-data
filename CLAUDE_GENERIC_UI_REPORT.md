# Generic Claude-Style UI Audit

## Summary

The project has a repeated compact-control language that makes parts of the site feel like a generated SaaS/AI template:

- many small rounded buttons
- pill-shaped badges and status labels
- uppercase monospace micro-copy
- segmented controls with filled active states
- chips for every source, format, sector, and capability
- icons inside nearly every control
- repeated `shadow-sm`, `rounded-xl`, and bordered white-card treatments
- labels such as `VERIFIED`, `PREMIUM`, `MOST POPULAR`, `REAL-TIME`, `INSTITUTIONAL`, and `UNLIMITED ACCESS`

This is not a criticism of using buttons or badges. The problem is repetition: too many controls have the same compact, rounded, high-density appearance, so the interface resembles a generic Claude/AI dashboard template instead of a distinct research product.

## What should be removed or reduced

### 1. Small pill buttons used as primary navigation — High priority

**Evidence**

- `src/components/ui/Tabs.tsx:80-125` uses compact uppercase monospace tabs, pill variants, segment variants, filled active states, and badge counters.
- `src/components/news/RegionTabs.tsx:37-64` uses a rounded container with small filled tab buttons and count pills.
- `src/components/sections/ProductSurface.tsx:140-170` uses dataset tabs as compact rounded buttons.
- `src/components/sections/UseCases.tsx:95-105` uses large underlined tabs, but the shared tab system still supports the same generic pill language.

**Why it feels generic**

This is a common AI dashboard pattern: a row of small rounded toggles with one colored active state. It gives every choice the same visual importance and looks like a component-library default.

**Recommended replacement**

- For page-level navigation: use plain text links with an active underline or a left rule.
- For dataset switching: use an editorial selector with a numbered label and a single visible active rule.
- For region switching: use a simple horizontal list with no enclosing rounded container.
- Reserve segmented controls for genuine mutually exclusive settings, not ordinary navigation.

**Avoid**

```text
[ AAPL ] [ US FED ] [ AI SPEND ]
```

**Prefer**

```text
01 Apple Inc.        02 Federal Reserve        03 AI infrastructure
   ─────────
```

---

### 2. Rounded badges everywhere — High priority

**Evidence**

- `src/components/ui/Badge.tsx:18-31` makes every badge `rounded-full`.
- `src/components/ui/PremiumExperience.tsx:24-31` creates `PremiumBadge`.
- `src/components/sections/ProductSurface.tsx:205-210` uses `VERIFIED` as a compact badge.
- `src/pages/Company.tsx:88-89` combines exchange/ticker and `Premium Analysis` badges.
- `src/pages/Pricing.tsx` uses `MOST POPULAR`, `UNLIMITED ACCESS`, and billing badges.
- `src/components/ui/InstitutionalTrustBar.tsx` places every source inside a bordered rounded chip.
- `src/pages/Workspace.tsx:199-201` uses several small badges inside each workspace card.

**Why it feels generic**

Pill badges are visually loud relative to their information value. When every fact is placed in a pill, the page looks like a template assembled from status components.

**Recommended replacement**

Use three forms only:

1. **Inline metadata** for ordinary facts:
   `NASDAQ · AAPL`
2. **Small square status marker** for state:
   `Verified`
3. **Plain label with a rule** for section context:
   `SOURCE / SEC EDGAR`

Change the default badge radius from `rounded-full` to a restrained 4px or remove the badge wrapper entirely for most uses. Keep pills only for filters, tags that users can remove, and compact system statuses.

---

### 3. Uppercase monospace micro-labels — High priority

**Evidence**

- `src/components/ui/SectionLabel.tsx:41-58` uses monospace, uppercase, tracking, dot, and optional line.
- `src/components/sections/*.tsx` repeatedly use labels such as `PRODUCT SURFACE`, `CORE CAPABILITIES`, `SECTOR PATHWAYS`, and `INSTITUTIONAL ACCESS`.
- `src/components/layout/Header.tsx:68-70` uses uppercase monospace navigation.
- `src/components/ui/PremiumExperience.tsx` uses monospace labels for nearly every metadata field.
- `src/pages/Advertising.tsx` uses `tracking-widest` uppercase micro-copy throughout.

**Why it feels generic**

The combination of tiny text, uppercase, tracking, and monospace is now a recognizable AI/technical-template style. It also makes the site feel like a terminal regardless of whether the content is technical.

**Recommended replacement**

- Keep monospace only for ticker symbols, source IDs, timestamps, API paths, and code.
- Use a normal sans-serif for section labels.
- Use sentence case instead of all caps for most navigation and headings.
- Remove decorative dots and rules when they do not add meaning.
- Limit one eyebrow label per major section.

**Example**

Instead of:

```text
● 04 — CORE CAPABILITIES
```

Use:

```text
Capabilities
```

with a thin rule or number set in the heading layout.

---

### 4. Small outlined CTA buttons — Medium priority

**Evidence**

- `src/components/ui/Button.tsx:25-52` defines a large set of generic `primary`, `secondary`, `outline`, `ghost`, and `link` variants.
- `src/components/sections/Capabilities.tsx:84-91` uses `Browse Capabilities`.
- `src/components/sections/ProductSurface.tsx:260-270` uses `Open Full Dataset Workspace`.
- `src/components/sections/UseCases.tsx:148-157` uses `Explore Role Pathway`.
- `src/pages/Company.tsx:112-116` uses `AI Explainer`.
- `src/pages/Workspace.tsx` uses several small action buttons inside cards.

**Why it feels generic**

The page repeatedly presents low-priority actions as compact outlined buttons. This creates visual noise and weakens the one action that should matter in each section.

**Recommended replacement**

- One primary action per section.
- Secondary actions become text links with an arrow.
- Use buttons only for an immediate state-changing action.
- Use links for navigation to another route or section.
- Remove “Browse”, “Explore”, “View”, and “Open” buttons when the whole row or title can be a link.

**Preferred hierarchy**

```text
Primary action: filled button
Secondary action: text link →
Metadata action: icon button with accessible label
```

Do not show three equivalent CTAs in a single block unless the user is genuinely choosing between three workflows.

---

### 5. Icon inside every button or badge — Medium priority

**Evidence**

- `src/components/sections/FinalCTA.tsx` uses icons in all three CTA buttons.
- `src/components/sections/Capabilities.tsx` uses icons in proof tags and actions.
- `src/components/ui/PremiumExperience.tsx` uses `ShieldCheck`, `Lock`, `Sparkles`, `Award`, `KeyRound`, and format icons throughout compact panels.
- `src/pages/Advertising.tsx` assigns icons to every service and capability.
- `src/components/ui/InstitutionalTrustBar.tsx` uses `CheckCircle2` in every source chip.

**Why it feels generic**

The icon density resembles a generated component catalogue. Icons become decoration rather than helping recognition.

**Recommended replacement**

- Use icons for actions that need recognition: search, download, close, external link.
- Remove icons from ordinary headings, badges, and proof labels.
- Use one visual language for data/source status, not a different icon for every row.
- Prefer typographic numbering for capabilities and process stages.

---

### 6. Card-within-card-within-card composition — High priority

**Evidence**

- `src/components/ui/Card.tsx:6-9` defaults to a rounded card with border and shadow.
- `src/components/ui/PremiumExperience.tsx` nests cards for verification, locked previews, upgrades, and download formats.
- `src/components/sections/ProductSurface.tsx` nests a chart card, metric controls, citation panel, and format chips.
- `src/components/sections/UseCases.tsx` nests a large panel, metric card, output rows, and button.
- `src/pages/Workspace.tsx` nests workspace cards, preview blocks, badges, and action buttons.

**Why it feels generic**

Large rounded white containers with smaller rounded white containers inside are a familiar AI/SaaS template pattern. It also flattens the information hierarchy because every layer looks like a separate component.

**Recommended replacement**

- Use full-width editorial rows with dividers.
- Use one raised surface only for the main product interaction.
- Use whitespace and rules instead of nested boxes.
- Let tables, lists, and chart frames carry structure.
- Remove default `shadow-sm` from generic cards.

The `Card` primitive should not automatically decide the visual treatment for every page. Make `Card` neutral and let page-level components decide whether a surface needs elevation.

---

### 7. Generic status language — High priority

**Evidence**

The code repeatedly uses labels such as:

- `VERIFIED`
- `REAL-TIME`
- `PREMIUM`
- `MOST POPULAR`
- `UNLIMITED ACCESS`
- `Institutional Trust & Source Integrity`
- `Enterprise Verification`
- `Premium Analysis`
- `Workspace Preview`
- `Enterprise Ready`
- `AI Deep Financial Insights`

Relevant locations include:

- `src/components/sections/ProductSurface.tsx`
- `src/components/sections/ProofStrip.tsx`
- `src/components/ui/PremiumExperience.tsx`
- `src/components/ui/InstitutionalTrustBar.tsx`
- `src/pages/Pricing.tsx`
- `src/pages/Company.tsx`
- `src/pages/Workspace.tsx`
- `src/pages/Dashboard.tsx`

**Why it feels generic**

These words are common conversion-template signals. They claim importance rather than explaining what the user can inspect or do.

**Recommended replacement**

Use operational wording:

- `Source: SEC EDGAR`
- `Updated: 22 Jul 2026`
- `Preview`
- `Requires account`
- `Available in Professional`
- `Sample data`
- `Last checked`

The interface should describe state, not perform prestige.

---

### 8. Repeated floating or popover controls — Medium priority

**Evidence**

- `src/components/ui/ThemeToggle.tsx:35-56` uses a rounded button and floating rounded dropdown with large shadow.
- `src/components/ui/SpotlightSearchModal.tsx` provides a command-style overlay.
- `src/pages/Advertising.tsx` uses floating badges and decorative positioned elements.
- `src/components/ui/PremiumExperience.tsx:86-94` places an overlay upgrade panel over blurred content.

**Why it feels generic**

Command palettes, floating badges, blurred locked previews, and elevated dropdowns are strongly associated with AI-product templates. They can be useful, but the project currently uses too many of them at once.

**Recommended replacement**

- Keep Spotlight search only if it is a core workflow.
- Make it look like a research search panel, not a generic command palette.
- Replace floating upgrade overlays with a clear inline access explanation.
- Keep dropdown shadows subtle and rectangular.

---

### 9. Tiny labels inside dense data cards — Medium priority

**Evidence**

- `src/pages/Company.tsx:170-178` uses 10px uppercase monospace labels for stats.
- `src/pages/Workspace.tsx:164-165` uses 10px uppercase labels.
- `src/components/ui/PremiumExperience.tsx:47-54` uses 9px uppercase labels.
- `src/components/sections/Hero.tsx` uses 10px/11px monospace status labels in the macro card.
- `src/components/sections/ProductSurface.tsx` uses 10px and 11px metadata labels throughout.

**Why it feels generic**

Excessive micro-type creates a “dashboard mockup” appearance. It also makes the site harder to read and gives every piece of metadata the same visual treatment.

**Recommended replacement**

- Minimum normal UI label size: 12px.
- Use 10px only for source IDs, timestamps, or compact chart axes.
- Use sentence case.
- Increase line height and reduce tracking.
- Merge label/value pairs into clearer typographic blocks.

---

### 10. Generic compact “premium” treatment — High priority

**Evidence**

- `src/components/ui/PremiumExperience.tsx` uses blurred locked content, gradient overlays, lock icons, `Premium Required`, and upgrade cards.
- `src/pages/Dashboard.tsx`, `Company.tsx`, `Country.tsx`, `Industry.tsx`, `Dataset.tsx`, and `Workspace.tsx` use locked previews and upgrade prompts.
- `src/pages/Pricing.tsx` uses popular-plan badges, icon cards, and animated hover elevation.

**Why it feels generic**

Blurred content plus a lock badge is a common AI/SaaS monetization pattern. Repeating it across every product route makes the application feel like a template with artificial gating rather than a real research tool.

**Recommended replacement**

Use transparent access boundaries:

```text
This view contains a 5-row public preview.
Sign in to save searches and compare full history.
```

Show the accessible part clearly. Explain the exact upgrade value. Avoid blurring the entire useful result.

## Priority cleanup list

### Remove immediately

- All visible `[CONTENT PLACEHOLDER: ...]` messages.
- Unnecessary `MOST POPULAR`, `UNLIMITED ACCESS`, `TRUSTED`, and `VERIFIED` decorations.
- Decorative floating badges and non-semantic icon dots.
- Generic “premium” lock overlays where the underlying preview is static.
- Small CTA buttons that merely navigate to another route.
- Dark/gold segmented controls that conflict with the warm system.

### Redesign next

- `src/components/ui/Button.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Tabs.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/SectionLabel.tsx`
- `src/components/ui/PremiumExperience.tsx`
- `src/components/ui/InstitutionalTrustBar.tsx`
- `src/components/news/RegionTabs.tsx`
- `src/pages/Advertising.tsx`
- `src/pages/Pricing.tsx`

### Keep, but use less

- `SpotlightSearchModal`
- `ThemeToggle`
- `Reveal`
- `lucide-react` icons
- chart tooltips and source badges

These are not inherently generic. Their frequency and styling are the problem.

## Recommended replacement system

### Buttons

Use only three visible action styles:

1. **Primary:** one filled clay button per decision area.
2. **Secondary:** text link with arrow.
3. **Utility:** borderless icon button with tooltip/accessible label.

Remove `secondary` unless there is a real destructive or high-contrast action. Remove `asChild` from `ButtonProps` or implement it properly; an unused API makes the primitive feel copied from a component library.

### Labels

Use:

- normal sans-serif section labels
- sentence case
- one label per section
- no decorative dot by default

### Tabs

Use:

- underline or rule for navigation
- no rounded outer container
- no shadow
- no all-caps monospace
- no badge counters unless the count is essential to the choice

### Badges

Use rectangular 4px status labels only for:

- sample
- live
- updated
- requires sign-in
- source type

Do not use badges to communicate generic prestige.

### Cards

Use cards only for:

- a product workspace
- a form
- a distinct data panel
- a clearly bounded interactive tool

Use rows and dividers for:

- capabilities
- sources
- navigation
- methodology steps
- feature comparisons

### Icons

Use icons only when they improve scanning or explain an action. Remove icons from every static label.

## How to make the page feel human-designed

1. Reduce the number of visible controls by at least one third.
2. Give each section one dominant action.
3. Replace compact pills with typography and rules.
4. Replace repeated cards with lists and editorial rows.
5. Use real data states instead of “verified” decoration.
6. Let one chart or workspace carry the visual interest.
7. Use sentence-case copy and fewer marketing adjectives.
8. Keep whitespace, but make it support reading and comparison.
9. Use asymmetry based on content importance, not random card placement.
10. Make the interface explain provenance, dates, and limitations directly.

## Acceptance checklist

- [ ] No generic pill group is used for ordinary navigation.
- [ ] Badges are limited to real status or filter semantics.
- [ ] Section labels are not all uppercase monospace.
- [ ] Small outlined buttons have been replaced by links where appropriate.
- [ ] Icons are not repeated inside every label.
- [ ] Nested cards have been flattened into rows or one primary surface.
- [ ] “Premium”, “verified”, and “institutional” labels are evidence-backed.
- [ ] Static samples are labelled as samples.
- [ ] The shared button, badge, tab, card, and label primitives use the canonical warm tokens.
- [ ] Mobile controls remain readable without becoming rows of pills.
- [ ] Each section has one clear action and one clear hierarchy.
