# Human-Designed Web Application UI — Anti-Generic AI Cleanup Specification

## Purpose

Use this document when an existing web application looks like it was assembled by an AI UI generator, Claude, ChatGPT, v0, Lovable, or a similar tool.

The goal is **not** to make the interface more fashionable.

The goal is to make it look like a **real product built by a competent product/UI engineer**:

- clear hierarchy
- intentional layout
- useful information density
- restrained visual treatment
- real interaction patterns
- meaningful content
- consistent spacing
- fewer containers
- fewer decorative elements
- no invented product language
- no visual noise
- no "AI-generated landing page" fingerprints

The application should feel like someone made deliberate decisions about **what the user needs to see and do**, rather than filling a page with visually pleasing components.

---

# 1. Core Principle

## Build the interface around information and actions, not components.

Do not ask:

> "What cards, badges, sections, gradients, tabs, or widgets can be added here?"

Ask:

> "What does the user need to understand or accomplish on this screen?"

Every visual element must justify its existence.

If removing an element does not reduce understanding, functionality, or usability, **remove it**.

If two elements communicate the same thing, **merge them**.

If a section exists primarily because "landing pages normally have this section", **delete it**.

---

# 2. The Main AI-Generated UI Smells

The following patterns are common signs of AI-generated web interfaces.

## 2.1 Excessive rectangular containers

### Problem

AI-generated interfaces frequently put every piece of content inside its own:

- bordered rectangle
- rounded card
- white box
- elevated panel
- outlined tile
- nested card

This creates a page made from dozens of boxes.

### Rule

**Do not put content in a box unless the box has a functional reason.**

Use containers only when they represent a meaningful boundary such as:

- an independent interactive control
- a form
- a data table
- a pricing option
- a distinct dataset
- an alert
- a modal
- a clearly separated product module

Normal text does not need a card.

A heading and paragraph do not need a card.

A list does not automatically need a card.

Three related facts do not automatically need three cards.

### Strong preference

Prefer:

```text
Heading
Supporting explanation

Content

Heading
Supporting explanation

Content
```

over:

```text
┌─────────────────────┐
│ Heading             │
│ Text                │
└─────────────────────┘

┌─────────────────────┐
│ Heading             │
│ Text                │
└─────────────────────┘
```

---

# 3. Eliminate "Card Soup"

If a page contains many cards, perform a card audit.

For every card ask:

1. Does it represent a separate object?
2. Does it have a different action?
3. Does it contain information that must visually remain together?
4. Would the content still be understandable without the border?
5. Is the card only there to make the page look structured?

If the answer to #5 is yes, remove the card.

### Bad

```text
[ Card ]
[ Card ]
[ Card ]
[ Card ]
```

### Better

Use:

- typography
- spacing
- columns
- dividers
- alignment
- whitespace

to establish hierarchy.

---

# 4. Stop Nesting Containers Inside Containers

A particularly strong AI smell is:

```text
Page
 └── Section
      └── Card
           └── Inner Card
                └── Badge
                     └── Text
```

This produces visual clutter and excessive borders.

Avoid:

- card inside card
- panel inside panel
- badge inside card inside section
- bordered metric inside bordered card
- bordered CTA inside bordered CTA group

Use the minimum number of visual boundaries necessary.

---

# 5. Remove Decorative Section Numbering

Patterns such as:

```text
01 — ENTERPRISE INTELLIGENCE LAYER
02 — PLATFORM ARCHITECTURE
06 — SECTOR PATHWAYS
08 — ABOUT
09 — INSTITUTIONAL ACCESS
```

often look like artificial "premium SaaS landing page" decoration when they do not help navigation.

### Rule

Remove numbered section labels unless:

- the number has actual semantic meaning
- the page is a documented process
- the user must understand sequence
- the numbering is part of the product's established visual identity

Do not number sections merely to make them look designed.

Prefer:

```text
Enterprise intelligence

Enterprise Market Intelligence
```

over:

```text
01 — ENTERPRISE INTELLIGENCE LAYER

Enterprise Market Intelligence
```

---

# 6. Remove Generic Microcopy

AI interfaces often contain sophisticated-sounding phrases that communicate very little.

Examples of suspicious language:

- "Decision-grade intelligence"
- "Enterprise intelligence layer"
- "Built for the future of..."
- "Transforming raw data into..."
- "Powering the next generation of..."
- "Unlock powerful insights"
- "Seamless workflows"
- "Actionable intelligence"
- "Institutional-grade"
- "Developer-grade"
- "Mission-critical"
- "Accelerate your workflow"
- "Designed for modern teams"
- "Your trusted source for..."
- "From data to decisions"
- "Unparalleled visibility"
- "Built for scale"
- "The future of..."
- "Next-generation platform"

These phrases are not automatically forbidden.

They are forbidden when they are **not backed by specific information**.

### Rewrite principle

Replace marketing abstraction with concrete product information.

Instead of:

> Transform raw data into decision-grade intelligence.

Prefer:

> Search SEC filings, economic series, and company financials from one workspace.

Instead of:

> Accelerate your quantitative research workflow.

Prefer:

> Download historical series, compare sources, and export the results to Excel.

Instead of:

> Enterprise-grade infrastructure.

Prefer:

> REST API, WebSocket streaming, SSO, audit logs, and Parquet exports.

---

# 7. Remove Fake or Unverifiable Numbers

AI-generated sites frequently invent impressive statistics to make the product look established.

Examples:

- 3.5M+ datasets
- 250+ sectors
- 150+ economies
- 45K+ reports
- 99.99% uptime
- 24/7 support
- $30T+ coverage

Do not display numbers unless they are real and can be supported.

### Rule

If a number is not backed by actual product data or an authoritative source:

**remove it or clearly mark it as a demonstration value.**

Never use fabricated metrics merely to fill visual space.

---

# 8. Remove Fake "Trust" Signals

Avoid decorative trust elements such as:

```text
✓ SEC EDGAR
✓ IMF
✓ World Bank
✓ Federal Reserve
✓ Trusted by institutions
✓ Enterprise ready
✓ 24/7 support
```

when they are simply displayed as visual badges without useful context.

If the source is genuinely important, show it naturally.

For example:

```text
Sources

SEC EDGAR
IMF
World Bank
Federal Reserve
```

with actual source links or source information.

Do not turn every source into a pill-shaped badge.

---

# 9. Reduce Pills and Badges

AI-generated designs massively overuse pills.

Common examples:

```text
[ Most Popular ]
[ Unlimited Access ]
[ Sample Dataset ]
[ Global Scope ]
[ Updated Live ]
[ Taxonomy v4 ]
[ 1990–2026 ]
[ SEC EDGAR ]
```

### Rule

A badge should communicate a state that matters.

Good:

- `Beta`
- `Draft`
- `Live`
- `Required`
- `Optional`

Bad:

- decorative category labels
- marketing claims
- ordinary metadata that could simply be text
- every small piece of information wrapped in a rounded outline

If everything is a badge, nothing is important.

---

# 10. Stop Turning Metadata Into UI Components

AI frequently converts ordinary metadata into tiny boxes.

Example:

```text
[ SEC EDGAR ]
[ US Equities ]

[ 1990–2026 ]
[ Global Scope ]

[ Updated Live ]
```

Instead use normal typography:

```text
SEC EDGAR · US Equities · Updated daily
```

or:

```text
Source: SEC EDGAR
Coverage: US Equities
Updated: Daily
```

Use hierarchy, not decoration.

---

# 11. Remove Repetitive CTA Patterns

AI-generated pages often repeat:

- Request a demo
- Explore product
- Explore datasets
- Learn more
- Get started
- Request access
- Talk to sales

on almost every section.

### Rule

Every page should have a clear primary action.

Secondary actions should be used only when they represent genuinely different paths.

Do not place a CTA at the bottom of every section simply because the section is finished.

### Better

One strong CTA near the main decision point.

Then let the rest of the page provide evidence.

---

# 12. Avoid CTA Theater

Do not create decorative buttons that look interactive but do not perform meaningful actions.

Every button must:

- perform an action
- navigate somewhere useful
- submit something
- open a meaningful interface
- start a real workflow

If it does none of these, remove it.

---

# 13. Remove Unnecessary Icons

AI-generated interfaces often put an icon next to everything.

Examples:

- shield icon
- database icon
- chart icon
- sparkles
- checkmark
- arrow
- lightning bolt
- globe
- layers
- lock
- crown

Icons should not exist simply because an empty space feels boring.

### Use an icon when:

- it improves recognition
- it identifies a known action
- it represents a meaningful object
- it is part of an established interaction pattern

### Do not use an icon when:

- text already explains everything
- it is decorative
- it is repeated dozens of times
- it makes the interface feel like a template

---

# 14. Remove Fake Technical Language

Do not use technical terminology just to make a product sound sophisticated.

Suspicious examples:

- "developer-grade"
- "decision-grade"
- "institutional-grade"
- "primary-source lineage"
- "quantitative intelligence layer"
- "automated alignment engine"
- "research infrastructure"

Technical language is appropriate when the feature actually exists.

The interface should describe:

- what data exists
- what the user can search
- what the user can export
- what APIs exist
- what sources are available
- what actions the user can perform

Specificity beats sophistication.

---

# 15. Do Not Manufacture Product Architecture

AI often creates sections such as:

```text
Ingestion Layer
↓
Normalization Layer
↓
Intelligence Layer
↓
Decision Layer
```

even when the user does not need to understand the internal architecture.

Do not expose architecture merely because it sounds impressive.

Show architecture only when:

- developers need it
- customers genuinely care
- it explains an important product capability
- it builds justified trust

Otherwise, simplify.

---

# 16. Stop Over-Sectioning Pages

A long landing page does not need 8–12 named sections.

Before keeping a section ask:

> What new information does this section provide?

If the answer is:

- "more proof"
- "another way to explain the same thing"
- "visual variety"
- "another CTA"
- "it makes the page longer"

remove it.

### Prefer

A few strong sections:

1. Product/value proposition
2. Main product experience
3. Important capabilities
4. Evidence / sources / trust
5. Pricing or access
6. Final action

rather than 10–15 artificial sections.

---

# 17. Avoid Repeating the Same Information

The screenshots show the same concepts repeated in multiple places:

- sources
- audited data
- institutional users
- API access
- financial research
- SEC filings
- datasets
- "decision-grade" outputs

Do not explain the same feature three different times.

One clear explanation is stronger than three slightly different marketing versions.

---

# 18. Use Whitespace as a Layout Tool

Whitespace should create hierarchy.

Do not fill every area with:

- cards
- borders
- labels
- statistics
- decorative graphics

A professional interface can have large empty areas.

Empty space is not a missing component.

---

# 19. Use Borders Sparingly

Borders should communicate structure.

Use borders for:

- tables
- input fields
- clear interactive controls
- selected states
- important boundaries
- dense data structures

Do not put a border around every block.

### Recommended visual hierarchy

1. Typography
2. Spacing
3. Alignment
4. Subtle dividers
5. Background changes
6. Borders
7. Shadows

Do not reverse this order.

---

# 20. Reduce Border Radius

AI-generated SaaS interfaces commonly use large rounded corners everywhere.

Avoid a page where everything is:

```text
╭────────────╮
│            │
╰────────────╯
```

Use modest radii consistently.

Large radii should be reserved for controls where they actually improve usability or are part of a deliberate design language.

---

# 21. Remove Excessive Shadows

Do not use shadows to make every element float.

Most professional information-heavy applications need very little shadow.

Prefer:

- flat surfaces
- subtle borders
- spacing
- contrast

over:

- floating cards
- glowing cards
- dramatic shadows

---

# 22. Avoid Gradients Unless They Have a Purpose

Do not add gradients because "modern websites use gradients."

Avoid:

- purple-blue SaaS gradients
- orange-pink gradients
- glowing radial backgrounds
- gradient text
- gradient borders

unless the brand specifically requires them.

For a financial/data product, restrained color and typography usually communicate credibility better.

---

# 23. Avoid Glassmorphism by Default

Do not use:

- translucent cards
- backdrop blur
- frosted glass
- glowing blobs
- floating glass panels

unless the product's visual language genuinely requires them.

For data-heavy products, clarity usually matters more than visual effects.

---

# 24. Do Not Add Decorative Background Noise

Remove unnecessary:

- dot grids
- giant blurred circles
- abstract blobs
- random grid patterns
- floating particles
- decorative SVGs
- fake data visualizations
- meaningless line patterns

Background graphics should support the product.

They should not exist to make a screenshot look more "designed."

---

# 25. Make Navigation Look Real

Navigation should contain the actual primary destinations.

Do not create:

```text
Product
Capabilities
Methodology
Use Cases
About
Pricing
```

just because that is a common SaaS navigation structure.

If the product only has four meaningful destinations, use four.

Do not create pages or navigation items solely to satisfy a template.

### Good navigation

- Products
- Data
- Research
- Pricing

if those are actual product areas.

---

# 26. Search Should Be Functional

A large search bar is often used as a hero decoration.

If search exists:

- it should search something real
- autocomplete should be meaningful
- results should be useful
- empty states should be intentional
- keyboard interaction should work

Do not put:

> "Spotlight search..."

on the page merely because command palettes are trendy.

---

# 27. Tabs Must Represent Real State

Do not create tabs just to divide content visually.

Good tabs:

```text
Overview | Revenue | Profitability | Cash Flow
```

Bad tabs:

```text
Researchers | Businesses | Analysts | Decision Makers
```

when switching tabs only swaps marketing copy.

Tabs should represent different views of the same underlying object or workflow.

---

# 28. Tables Beat Cards for Structured Data

If users need to compare:

- companies
- metrics
- dates
- prices
- datasets
- sources
- financial values

consider a table.

Do not convert every row of structured information into a card.

Cards are poor at comparison.

Tables are often better for professional/data-heavy products.

---

# 29. Use Real Product Interfaces

If the application claims to be a research/data platform, show the actual workflow.

Better:

```text
Search
→ Select dataset
→ Filter
→ View data
→ Compare
→ Export
```

Worse:

```text
Beautiful card describing how powerful the platform is.
```

The product itself should provide evidence of the product.

---

# 30. Pricing Pages Should Be Especially Clean

Do not make pricing look like a collection of marketing cards.

Each plan should answer:

- Who is it for?
- What does it cost?
- What is included?
- What limits exist?
- What happens after choosing it?

Avoid excessive labels such as:

```text
MOST POPULAR
UNLIMITED ACCESS
BEST VALUE
ENTERPRISE READY
```

unless they provide actual decision value.

Do not invent prices, limits, SLAs, seats, or support promises.

---

# 31. Copywriting Rules

## Every sentence should pass this test:

> Could a real customer use this sentence to understand the product?

If not, rewrite it.

### Remove:

- filler adjectives
- corporate jargon
- vague claims
- repeated value propositions
- unnecessary adjectives
- exaggerated claims

### Prefer:

- nouns
- verbs
- numbers that are real
- actual capabilities
- actual limitations
- source names
- supported formats
- concrete actions

---

# 32. Typography

Typography should do most of the visual work.

Use a clear hierarchy:

```text
Page title
Section heading
Subheading
Body
Metadata
```

Do not make every heading huge.

Avoid:

- oversized hero headings occupying half the viewport
- excessive all-caps labels
- tiny mono text everywhere
- random font switching
- decorative typography

Use monospace only where it has semantic value:

- code
- identifiers
- tickers
- API endpoints
- technical values

Do not use monospace for every tiny label to create a "developer aesthetic."

---

# 33. Color

Use a restrained palette.

A professional product normally needs:

- background
- primary text
- secondary text
- border/divider
- one accent
- semantic colors for states

Do not introduce a new accent color for every section.

Do not use color merely to make cards visually different.

Color should communicate meaning.

---

# 34. Responsive Design

The desktop layout must not simply collapse into a pile of cards on mobile.

On smaller screens:

- remove secondary navigation where appropriate
- reduce unnecessary metadata
- simplify dense layouts
- make tables horizontally scrollable or provide a mobile representation
- maintain readable type
- preserve primary actions
- remove decorative elements first

Do not solve mobile layout by simply stacking every desktop card.

---

# 35. Interaction Quality

A human-built application feels intentional because interactions behave predictably.

Check:

- hover states
- focus states
- disabled states
- loading states
- empty states
- error states
- success states
- keyboard navigation
- form validation
- destructive-action confirmation

Do not add animations everywhere.

Animation should communicate:

- state change
- progress
- hierarchy
- continuity

not decoration.

---

# 36. Animation Rules

Remove:

- floating card animations
- perpetual movement
- parallax for no reason
- bouncing icons
- glowing buttons
- excessive entrance animations
- random hover transformations

Prefer short, subtle transitions for:

- buttons
- menus
- tabs
- dialogs
- loading states

A serious product should not feel like a portfolio animation demo.

---

# 37. The "Real Developer" Test

After cleanup, ask:

### Content

- Is every claim real?
- Is every number defensible?
- Is every sentence useful?
- Is there repeated copy?

### Layout

- Can any section disappear without hurting comprehension?
- Are there unnecessary cards?
- Are there nested cards?
- Are there excessive dividers?

### Components

- Does every component have a purpose?
- Are buttons actually functional?
- Are tabs actually useful?
- Are badges meaningful?

### Visuals

- Is anything decorative without a purpose?
- Are there excessive shadows?
- Are there excessive rounded containers?
- Are there unnecessary gradients?
- Are icons being used as decoration?

### Product

- Can I understand what the product actually does within seconds?
- Can I find the primary action?
- Can I see the actual product workflow?
- Does the interface demonstrate the product instead of merely describing it?

### Credibility

- Does anything look fabricated?
- Are statistics real?
- Are customer claims real?
- Are support/SLA claims real?
- Are integrations actually implemented?

If the interface looks impressive but fails these tests, it is still bad product UI.

---

# 38. Refactoring Procedure

When applying this specification to an existing application, follow this order.

## Step 1 — Inventory

List:

- pages
- sections
- components
- cards
- badges
- CTAs
- icons
- decorative elements
- statistics
- marketing copy
- navigation items

Do not change code yet.

---

## Step 2 — Identify the Product's Real Jobs

Determine:

- who uses the application
- what they are trying to accomplish
- what information they need
- what actions they take
- what information is secondary

If this is unclear, do not invent a UX story.

Use the existing application functionality and requirements.

---

## Step 3 — Delete Before Redesigning

Remove:

- filler sections
- repeated explanations
- decorative labels
- fake statistics
- meaningless badges
- redundant CTAs
- unnecessary icons
- decorative backgrounds
- duplicated cards

Do not redesign unnecessary content.

---

## Step 4 — Flatten the UI

Convert:

```text
Section
→ Card
→ Inner Card
→ Badge
→ Text
```

into:

```text
Section
→ Content
```

where possible.

---

## Step 5 — Group Related Information

Instead of:

```text
[Card A]

[Card B]

[Card C]

[Card D]
```

consider:

```text
Heading

A
B
C
D
```

with spacing and typography.

---

## Step 6 — Rebuild the Hierarchy

Use:

- page structure
- headings
- spacing
- alignment
- typography
- dividers

to create hierarchy.

Do not use boxes as the primary hierarchy mechanism.

---

## Step 7 — Restore Functional Components

Keep or build components that provide actual value:

- search
- filters
- tables
- forms
- charts
- navigation
- data selectors
- pagination
- export controls
- dialogs
- alerts

These are product UI.

---

## Step 8 — Validate Every Claim

Remove or replace unsupported:

- metrics
- customer counts
- uptime
- coverage numbers
- pricing
- support promises
- "trusted by" claims

Do not fabricate content to make the interface look complete.

---

## Step 9 — Test the Application

Verify:

- every button
- every link
- every tab
- every search field
- every form
- every filter
- every navigation item
- mobile behavior
- loading states
- error states

A visually clean application with broken functionality is not a successful cleanup.

---

# 39. Definition of Done

The web application is ready when:

- there are noticeably fewer boxes
- cards are used only where justified
- nested containers have been eliminated where possible
- section numbering is gone unless meaningful
- generic marketing language has been replaced with concrete language
- fake metrics are removed
- unnecessary badges are gone
- unnecessary icons are gone
- repetitive CTAs are removed
- decorative gradients are removed unless intentional
- decorative background effects are removed
- unnecessary shadows are removed
- typography creates hierarchy
- whitespace creates structure
- actual product functionality is easy to find
- structured data is presented in appropriate tables/lists
- navigation represents real product destinations
- every visible interaction has a purpose
- responsive behavior is deliberate
- the interface feels calm, credible, and maintainable

---

# 40. Important Constraint

## Do NOT turn this cleanup into another AI redesign.

This is critical.

Do not respond to excessive AI design by replacing it with a different AI design trend.

Do not introduce:

- new gradients
- new glassmorphism
- new card layouts
- new decorative blobs
- new animated backgrounds
- new oversized typography
- new "premium SaaS" sections
- new fake statistics
- new marketing copy
- new unnecessary components

The objective is **subtraction and refinement**, not visual reinvention.

---

# 41. Final Instruction to the Coding Agent

When modifying the application, behave like a senior frontend/product engineer taking over an existing production application.

**Do not optimize for how impressive the screenshot looks.**

Optimize for:

1. clarity
2. usability
3. information hierarchy
4. real functionality
5. credibility
6. maintainability
7. accessibility
8. responsive behavior
9. visual restraint

Before adding any UI element, ask:

> "Would a real product team need this?"

If not, do not add it.

Before keeping any existing UI element, ask:

> "Does this help the user understand something, decide something, or do something?"

If not, remove it.

The finished application should look like it was built by a thoughtful developer who understands the product — **not like an AI trying to prove that it can design a website.**
