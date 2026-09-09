# StatIQ One Human-Design Audit

## Executive summary

StatIQ One does not look machine-made because of one isolated CSS rule. It looks machine-assembled in places because several visual systems, content strategies, and product claims are mixed together:

1. The homepage uses a warm editorial system, while older product pages and the advertising page still use dark backgrounds, gold accents, gradients, glowing effects, and oversized rounded cards.
2. The interface repeatedly uses the same “verified / institutional / audited / enterprise” language without always showing the underlying evidence or source state.
3. Many values are hardcoded demo data but are presented as live, real-time, audited, or operational.
4. The same visual recipe appears repeatedly: section label, rounded bordered card, icon, uppercase monospace label, metric, badge, CTA.
5. Several visible “content placeholder” messages expose the construction process to visitors.
6. The copy is often broad and impressive-sounding rather than specific about the product’s actual workflow.
7. The repository contains an active design-system migration: tokenized warm colors coexist with old arbitrary colors such as `#C8A45D`, `#09090B`, `#111111`, and `#2A2A2A`.

This is a design and content-integrity problem, not proof of how the code was produced. A human-designed site can use the same technologies. The practical goal should be to make every visual and claim intentional, evidenced, and consistent.

## Audit scope

Reviewed authored project material across:

- `src/` React pages, sections, UI components, services, data, contexts, and utilities
- root `index.html`, `metadata.json`, `package.json`, and project documentation
- `public/` application manifest/service worker references
- `authsystem/` frontend/backend structure where it affects the product experience
- test and deployment documentation where it reveals intended product behavior

Generated output and third-party dependencies were not treated as product design decisions:

- `node_modules/`
- `dist/`
- `.git/`

The audit focuses on signals that make a website feel templated, exaggerated, unfinished, inconsistent, or less credible to a real visitor.

## Severity scale

| Level | Meaning |
|---|---|
| P0 | Trust or product-positioning problem that should be fixed before visual polish |
| P1 | Strong contributor to the machine-made/template impression |
| P2 | Important consistency, accessibility, or maintainability issue |
| P3 | Refinement opportunity after the foundation is corrected |

## Main findings

### 1. Conflicting visual identities — P0

**Problem:** The project contains at least three competing identities:

- warm editorial StatIQ One homepage
- dark/gold institutional dashboard language in shared UI and product pages
- dark neon/glow marketing language on the Advertising page

**Evidence:**

- `src/index.css` defines the warm palette: `#F7F6F2`, `#20201E`, `#B9684E`, and `#7D8A82`.
- `src/components/sections/Hero.tsx`, `ProductSurface.tsx`, `Capabilities.tsx`, and `UseCases.tsx` use the warm palette but still hardcode it repeatedly.
- `src/components/ui/SectionLabel.tsx` still uses the old gold `#C8A45D`.
- `src/components/ui/Tabs.tsx` still uses old dark tokens `#09090B`, `#111111`, `#2A2A2A`, and `#C8A45D`.
- `src/components/ui/Card.tsx` defaults to `rounded-[16px]`, which conflicts with the restrained 4/8/14px radius system.
- `src/pages/Advertising.tsx` uses `#09090B`, purple/blue/gold ambient orbs, radial dots, glowing borders, gradient text, and animated effects.
- `src/pages/Pricing.tsx` uses large card shadows, `rounded-xl`, gold-like primary treatment, and a dotted dark visual background.
- `src/utils/chartTheme.ts` describes an “obsidian background” and “gold accent” even though the implementation has moved toward warm clay.

**Why it hurts:** A visitor cannot tell whether StatIQ One is a quiet research platform, a fintech terminal, or a generic premium technology agency. The inconsistency feels like independent generated screens assembled without a single art direction.

**Best fix:** Establish one canonical product identity and migrate every page and shared component to it. Use warm canvas, white surfaces, near-black text, clay accent, and sage/data colors everywhere unless a route has a documented reason to be a separate product.

**Implementation locations:**

- `src/index.css`
- `src/components/ui/SectionLabel.tsx`
- `src/components/ui/Tabs.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Button.tsx`
- `src/utils/chartTheme.ts`
- `src/pages/Advertising.tsx`
- `src/pages/Pricing.tsx`
- all product pages under `src/pages/`

---

### 2. Static demo data presented as live or audited — P0

**Problem:** Hardcoded examples are labelled as live, real-time, audited, verified, operational, or accurate.

**Evidence:**

- `src/components/sections/Hero.tsx` hardcodes market values such as `5,842.10`, `4.21%`, `$74.50/bbl`, and `3,542,109 Series Active`.
- `src/components/sections/ProofStrip.tsx` presents `3.5M+`, `250+`, `150+`, and `45K+` as institutional proof metrics.
- `src/components/sections/ProductSurface.tsx` labels static datasets as `VERIFIED` and gives them `Grade AAA // 99.8%`, `99.9%`, or `99.7%`.
- `src/components/sections/Methodology.tsx` displays `Grade AAA // 99.8% Accuracy`, `PIPELINE VERSION 4.2.0`, named source channels, and “ISO-27001 Data Governance Protocol”.
- `src/components/sections/FinalCTA.tsx` claims `3.5 million+ audited series`, `Instant API v4 Key Generation`, and `24/7 Data Desk Support`.
- `src/components/layout/Footer.tsx` shows `3,542,109 Series Syncing`, `API v4 Operational`, and `SEC EDGAR Audited`.
- `src/components/ui/InstitutionalTrustBar.tsx` states `3.5M+ Series Directly Ingested & Audited Real-Time`.
- `src/components/sections/Evidence.tsx` calls examples “Real quantitative workflows” even though the examples are local constants.

**Why it hurts:** Repeated precise numbers and certification-like badges create the impression of fabricated proof when the interface does not expose a verifiable data source, timestamp, API response, or audit record. This is more damaging than having fewer claims.

**Best fix:**

1. Separate `demo`, `sample`, `live`, and `verified` states in the data model.
2. Only use “live”, “audited”, “verified”, “real-time”, “ISO”, “SOC2”, or “accuracy” when a real backend/source can support the claim.
3. Add source, timestamp, methodology, and scope beside metrics.
4. Replace unsupported metrics with honest product descriptions until the data pipeline is connected.
5. Never display “Grade AAA” or accuracy percentages without a defined methodology.

**Implementation locations:**

- `src/components/sections/Hero.tsx`
- `src/components/sections/ProofStrip.tsx`
- `src/components/sections/ProductSurface.tsx`
- `src/components/sections/Methodology.tsx`
- `src/components/sections/Evidence.tsx`
- `src/components/sections/FinalCTA.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/ui/InstitutionalTrustBar.tsx`
- `src/services/dataService.ts`
- `src/services/liveConnectors.ts`

---

### 3. Visible content placeholders — P0

**Problem:** Internal content-production notes are rendered directly in the public UI.

**Evidence:**

- `src/components/sections/ProofStrip.tsx`: `[CONTENT PLACEHOLDER: Institutional Client Logos & Partner Organizations]`
- `src/components/sections/Evidence.tsx`: `[CONTENT PLACEHOLDER: Quantified Enterprise Case Study Organization & Verified Portfolio Impact]`
- `src/components/sections/Methodology.tsx`: `[CONTENT PLACEHOLDER: Specific Security Compliance Audit ID & SOC2 Type II Certification Number]`

**Why it hurts:** This immediately reveals an unfinished template and breaks trust. It is one of the strongest “not production-designed” signals in the repository.

**Best fix:** Remove the rows entirely until the content exists. If the team needs an internal reminder, keep it in a content brief or issue, never in JSX rendered to visitors.

---

### 4. Generic institutional/AI marketing copy — P1

**Problem:** Many headings and descriptions use category language that could belong to any enterprise AI or fintech product.

**Evidence:**

- `src/components/sections/Hero.tsx`: “Enterprise Market Intelligence & Financial Research Platform”
- `src/components/sections/Capabilities.tsx`: “Engineered for Rigorous Quantitative Research”
- `src/components/sections/UseCases.tsx`: “Tailored Solutions Across the Investment Ecosystem”
- `src/components/sections/FinalCTA.tsx`: “Accelerate Your Quantitative Research Workflow.”
- `src/pages/Advertising.tsx`: “Technology That Transforms Your Business”
- `src/pages/Pricing.tsx`: “Institutional Data Plans for Every Enterprise”
- repeated phrases include “institutional”, “enterprise”, “audited”, “AI-powered”, “developer-grade”, “real-time”, and “decision-grade”.

**Why it hurts:** The copy announces prestige instead of explaining a real task. Repetition makes the site sound generated from a keyword list rather than written for a specific audience.

**Best fix:** Rewrite each section around a concrete user action:

- Find a company filing and inspect the source line.
- Compare a macro series across countries.
- Export a clean dataset.
- Build a watchlist or report.
- Understand the limitations and update schedule.

Use one strong claim per section, then demonstrate it with the interface.

---

### 5. Repeated card-and-badge composition — P1

**Problem:** The same visual pattern appears across the marketing page, pricing, dashboards, datasets, verification panels, and product previews:

`rounded container → icon → uppercase label → bold metric → muted description → badge → CTA`

**Evidence:**

- `src/components/ui/Card.tsx` is a generic card primitive with a large radius and shadow.
- `src/components/ui/PremiumExperience.tsx` repeats verification grids, locked previews, upgrade cards, and format cards.
- `src/components/sections/ProductSurface.tsx` contains a chart card, citation card, metric-selector pills, and format chips.
- `src/components/sections/UseCases.tsx` places the entire experience inside a large rounded panel with a second metric card.
- `src/pages/Pricing.tsx` renders three large pricing cards with popular/unlimited badges.
- `src/components/ui/InstitutionalTrustBar.tsx` renders source chips in bordered rounded containers.

**Why it hurts:** Card repetition is the visual signature of a landing-page generator. It also makes every piece of information appear equally important.

**Best fix:** Assign each content type a different presentation:

- hero: editorial split
- proof: one horizontal source rail
- capabilities: numbered list
- methodology: one annotated process diagram
- data product: one credible workspace
- pricing: a compact comparison table with one emphasized recommendation
- evidence: one real workflow story, not two identical cards

Use cards only when grouping is meaningful, not as the default wrapper.

---

### 6. Arbitrary styling bypasses the design system — P1

**Problem:** Brand values are repeatedly hardcoded in JSX instead of using the existing token system.

**Evidence:**

- Search across `src/` found hundreds of hardcoded color/style usages, including `#C8A45D`, `#09090B`, `#111111`, `#2A2A2A`, `#B9684E`, `#DEDDD7`, and `#F7F6F2`.
- `src/components/ui/Button.tsx` hardcodes focus ring, background, border, and offset colors.
- `src/components/layout/Header.tsx` hardcodes nearly every warm color in class strings.
- `src/components/sections/*` repeat the same border/background/accent values independently.
- `src/components/ui/Tabs.tsx` and `src/components/ui/SectionLabel.tsx` are visibly on the old palette.

**Why it hurts:** A design system cannot be refined reliably when components have private copies of the brand. This creates visual drift and makes the site feel assembled from prompts or snippets.

**Best fix:** Create semantic Tailwind aliases backed by the CSS variables, then migrate shared primitives first. Avoid adding a new arbitrary hex value in a component. Keep chart colors in `chartTheme.ts`.

---

### 7. Advertising page is a separate template — P0

**Problem:** `src/pages/Advertising.tsx` does not look like the rest of StatIQ One.

**Evidence:**

- `FloatingOrb` adds blurred animated colored circles.
- The hero uses a dark `#09090B` background, gold/blue/purple orbs, a radial dot grid, glowing rules, gradient text, and an animated pulse.
- The headline uses generic “Technology That Transforms Your Business” language.
- The page contains eight color-coded services and several large rounded/glowing CTA elements.

**Why it hurts:** This is the clearest visual example of a generic AI agency landing page. It weakens the product brand and makes the repository look like multiple generated templates were merged.

**Best fix:** Decide whether Advertising belongs inside StatIQ One or is a separate NexDatalytix corporate page. If it belongs to StatIQ One, rebuild it using the warm editorial system and a service index. If it is corporate, give it a clearly separate brand shell and do not mix its components into the product marketing system.

**Implementation location:** `src/pages/Advertising.tsx`

---

### 8. About NexDatalytix and StatIQ One are not clearly separated — P1

**Problem:** The app serves both StatIQ One and NexDatalytix content, but the route shell and design language overlap.

**Evidence:**

- `src/App.tsx` switches the root route based on hostname or query parameter.
- `src/pages/AboutNexDatalytix.tsx` uses separate components but shares the product’s warm colors and general layout infrastructure.
- `src/components/about-nexdatalytix/*` includes corporate services, research, technology, and capability content.
- `src/pages/Advertising.tsx` appears to describe the broader company while using a third visual identity.

**Why it hurts:** Visitors may not know whether they are buying a product, reading about a parent company, or hiring a services agency.

**Best fix:** Define an explicit brand architecture:

- **StatIQ One:** product, data workspace, research, pricing, account, reports.
- **NexDatalytix:** company, services, research organization, contact.

Use separate navigation labels and, if necessary, separate shells/tokens while preserving shared primitives.

---

### 9. “Live” functionality is sometimes simulated in static UI — P1

**Problem:** The interface uses operational language and status indicators for local constants or client-only state.

**Evidence:**

- `src/components/sections/Hero.tsx` uses a pulsing dot beside a static series count.
- `src/components/layout/Footer.tsx` uses “Series Syncing” and “API v4 Operational”.
- `src/components/ui/InstitutionalTrustBar.tsx` states real-time ingestion without exposing a request status.
- `src/components/sections/ProductSurface.tsx` presents static arrays as an interactive data canvas.
- `src/pages/Advertising.tsx` uses animated counters for company capability totals.

**Why it hurts:** Motion and status language imply a system that is currently doing work. When nothing is actually queried, the UI feels like a mockup.

**Best fix:** Use labels such as `Sample dataset`, `Illustrative preview`, or `Last updated: YYYY-MM-DD` until a real endpoint supplies the state. Only pulse when the status is backed by a live health check.

---

### 10. Some claims are too specific for the visible evidence — P0

**Problem:** The copy includes highly specific standards, coverage, performance, and compliance claims that need product/legal verification.

**Examples:**

- `src/components/sections/Methodology.tsx`: “ISO-27001 Data Governance Protocol”
- `src/components/sections/Methodology.tsx`: “99.8% Accuracy”
- `src/components/sections/Capabilities.tsx`: “full cryptographic lineage”
- `src/components/sections/Capabilities.tsx`: “real-time updates as soon as regulatory filings hit EDGAR”
- `src/components/sections/FinalCTA.tsx`: “24/7 Data Desk Support”
- `src/pages/Pricing.tsx`: `100k req/min`, SAML/Okta, “99.99% Guaranteed SLA”
- `src/components/layout/Footer.tsx`: “SEC EDGAR Audited Lineage”

**Why it hurts:** These claims can look generated because they are polished, precise, and repeated without a visible evidence trail. They also create legal and trust risk.

**Best fix:** Create a claims register before redesigning:

| Claim | Owner | Source/evidence | Allowed wording | Expiry |
|---|---|---|---|---|

Delete unsupported claims. Downgrade uncertain wording to accurate language such as “supports”, “preview”, “intended for”, or “source-linked”.

---

### 11. Product experience is hidden behind marketing terminology — P1

**Problem:** The website describes many capabilities but does not consistently show the actual user journey.

**Evidence:**

- Home sections prioritize labels such as “Enterprise Intelligence Layer”, “Institutional Trust & Source Integrity”, and “Platform Standard”.
- `ProductSurface.tsx` shows a chart and citation panel, but the surrounding copy uses broad product claims rather than explaining the task flow.
- `UseCases.tsx` changes copy and metrics when tabs change, but does not show a real output or workflow result.
- `Evidence.tsx` describes workflows but uses static narrative cards instead of a real before/after interface.

**Why it hurts:** A real product site earns trust by demonstrating what a visitor can do. Abstract capability language feels generated when it is not anchored to interaction.

**Best fix:** Build the homepage around one primary task:

`search → inspect source → compare → save/export → return to workspace`

Show this as a single product story, then link to the full product routes.

---

### 12. Route and page consistency is incomplete — P2

**Problem:** Shared primitives are not consistently applied across all pages, and some routes retain older styling conventions.

**Evidence:**

- `src/components/ui/Card.tsx` uses `rounded-[16px]`, while `src/index.css` defines 4/8/14px.
- `src/components/ui/Tabs.tsx` uses obsolete dark tokens.
- `src/pages/Advertising.tsx` uses a separate palette and motion vocabulary.
- `src/pages/Pricing.tsx` uses `container`/`bg-background`/`text-text-main` aliases alongside the homepage’s direct warm hex values.
- Product pages use gold chart colors in several places instead of the centralized chart helper.

**Why it hurts:** Navigating between pages feels like moving between different products.

**Best fix:** Create a page-shell matrix and migrate route by route. Do not redesign individual screens in isolation.

---

### 13. Accessibility and semantic polish need a full pass — P2

**Observed risks:**

- `src/components/sections/Hero.tsx` uses `scrollIntoView()` directly for the product CTA instead of the centralized scroll helper.
- `src/pages/AboutNexDatalytix.tsx` duplicates scroll calculations and does not check reduced motion in its helper.
- `src/components/sections/ProductSurface.tsx` uses `formatter: (params: any[])`, weakening type safety.
- Some navigation controls are buttons that behave as section links.
- Dense tables, pills, and status labels need contrast and mobile overflow review.
- Several interactive panels rely on hover styles for additional emphasis.
- `src/components/ui/Button.tsx` casts props between button and anchor types and exposes an `asChild` prop that is not implemented.

**Best fix:** Treat semantics and focus states as part of the redesign, not a final cosmetic pass. Use real links for navigation, typed ECharts parameters, consistent reduced-motion behavior, and explicit keyboard testing.

---

### 14. SEO/social metadata is incomplete — P2

**Evidence:**

- `index.html` has title, description, canonical, Open Graph title/description, and Twitter title/description.
- It does not define `og:image` or `twitter:image`.
- `metadata.json` has an empty name and description.
- Route-level pages mostly do not appear to establish unique metadata except `AboutNexDatalytix.tsx` changing `document.title` and description in an effect.

**Why it hurts:** The product is harder to understand when shared links lack a credible preview, and route metadata can be wrong after client navigation.

**Best fix:** Establish a route metadata map and update document title/description/canonical consistently. Add a real social image only when one exists.

---

### 15. Font loading and type system are over-specified — P2

**Problem:** `index.html` loads four font families: Instrument Serif, Inter, JetBrains Mono, and Plus Jakarta Sans.

**Why it hurts:** Multiple families can look designed in isolation but inconsistent in use. In this project, monospace is used widely for labels, badges, metrics, sources, and navigation, which gives ordinary marketing copy a “generated data terminal” tone.

**Best fix:** Use:

- one primary sans-serif for UI/body
- one heading/display family if genuinely needed
- monospace only for technical identifiers, timestamps, code, and data values

Reduce font loading to the families used by the final system.

## Page-by-page assessment

### Home

**Good foundation:**

- logical section order
- reusable section components
- warm neutral base
- visible product surface
- central section navigation concept

**Needs correction:**

- too many institutional claims above the fold
- static market snapshot presented as live
- repetitive bordered cards
- direct hex values throughout the page
- product story is less clear than the category language
- hero CTA uses a separate scrolling implementation

**Recommended role:** Make this a concise product overview that demonstrates one real research workflow, not a catalogue of every capability.

### Product pages

**Good foundation:**

- routes correspond to real product concepts
- charts, filters, reports, datasets, and account flows exist
- shared components can support a real design system

**Needs correction:**

- old dark/gold tokens remain in shared UI and charts
- locked previews and upgrade cards overuse artificial scarcity
- static sample data can be mistaken for live data
- product and marketing shells are not clearly distinguished

**Recommended role:** Give these pages a calmer application shell with dense but honest data presentation. The marketing site should link to them rather than simulate all of them.

### Pricing

**Good foundation:**

- plan comparison is more useful than a generic CTA
- billing and seat interactions provide real utility

**Needs correction:**

- claims such as SLA, API rate limits, SSO, support, and source coverage require verification
- three large cards and “MOST POPULAR / UNLIMITED ACCESS” badges feel like a SaaS template
- pricing page visual language differs from the homepage

**Recommended role:** Use a comparison table first, then a single recommended plan and a clear contact path. Avoid selling unsupported enterprise promises.

### Advertising

**Good foundation:**

- service taxonomy is explicit
- the page has a clear CTA and contact interaction

**Needs correction:**

- strongest generic AI-agency visual signals in the repository
- unrelated dark/glow/gold/purple visual language
- generic headline and benefit copy
- animated counters and floating orbs communicate decoration, not evidence

**Recommended role:** Either rebuild as a restrained corporate capabilities page or move it into a clearly separate NexDatalytix corporate brand.

### About NexDatalytix

**Good foundation:**

- clearer company-purpose content than the advertising page
- dedicated component namespace
- distinct company route

**Needs correction:**

- duplicated scroll helper
- shared product styling can blur the company/product boundary
- content should be separated from UI data and claims should be verified

**Recommended role:** Make this the human/company page with people, origin, research areas, and real contact details—not another product capability catalogue.

## Recommended target architecture

### Brand architecture

Define two explicit surfaces:

#### StatIQ One

- product marketing
- search and datasets
- company/industry/country research
- reports
- pricing
- authentication
- workspace

#### NexDatalytix

- organization/about
- services
- research and technology
- company principles
- contact

Share only infrastructure and neutral primitives. Do not share visual tone blindly.

### Homepage information architecture

Replace the current catalogue effect with this user journey:

1. **What it is:** one sentence naming StatIQ One and the primary user.
2. **Try the product:** one real or clearly labelled sample search.
3. **Inspect evidence:** show source, date, identifier, and data lineage.
4. **Compare or export:** demonstrate one useful output.
5. **Understand the method:** concise, evidence-backed methodology.
6. **Choose a path:** researcher, analyst, business, or executive only if those paths are truly supported.
7. **Take one next step:** explore, sign up, request access, or contact.

Remove sections that cannot provide verified content.

### Visual system

Use one token system:

- canvas: `--color-bg`
- surface: `--color-surface` and `--color-surface-raised`
- ink: `--color-ink` and `--color-ink-soft`
- border: `--color-border`
- accent: `--color-accent`
- data: `--data-primary`, `--data-secondary`, `--data-tertiary`, `--data-neutral`

Recommended visual ratios:

- 70% warm neutral
- 20% white/raised surfaces
- 7% text/structure
- 3% accent and data emphasis

Use 4px/8px/14px radii. Remove the default 16px card radius unless the product surface genuinely needs it.

### Component system

Prioritize these shared primitives:

- `PageShell`
- `Container`
- `SectionHeader`
- `ActionLink`
- `DataSource`
- `Metric`
- `DataTable`
- `ChartFrame`
- `EmptyState`
- `LoadingState`
- `ErrorState`
- `DisclosureList`
- `ComparisonTable`

Retire or refactor components whose only purpose is to add “premium” styling, such as generic upgrade/verification wrappers.

## Recommended implementation order

### Phase 0 — Claims and content inventory

1. Create a claims register.
2. Label every data value as live, sourced sample, illustrative, or placeholder.
3. Remove all visible placeholders.
4. Verify pricing, compliance, SLA, support, coverage, and API claims.

### Phase 1 — One design system

1. Replace obsolete gold/dark tokens in shared components.
2. Remove arbitrary colors from `src/components/ui/`.
3. Update `chartTheme.ts` and all direct ECharts colors.
4. Normalize radii, borders, shadows, and type usage.
5. Reduce monospace use.

### Phase 2 — Route shells

1. Build a StatIQ product shell.
2. Build a NexDatalytix company shell.
3. Migrate Home, Pricing, and product pages intentionally.
4. Decide the final role of Advertising.

### Phase 3 — Homepage reconstruction

1. Rewrite the hero around the real user problem.
2. Replace the static market snapshot with a truthful product preview.
3. Reduce the number of sections.
4. Replace repeated cards with a process narrative and one product surface.
5. Use one specific CTA.

### Phase 4 — Product credibility

1. Connect status labels to real endpoints or rename them as samples.
2. Add source/date/identifier metadata to charts and tables.
3. Make loading, empty, error, and offline states visually consistent.
4. Add real export/search/report flows where promised.

### Phase 5 — Quality pass

1. Test 390px, 430px, 768px, 1024px, and 1440px.
2. Test keyboard and reduced motion.
3. Check contrast and screen-reader labels.
4. Verify route metadata and social previews.
5. Run `npm run lint`, `npm run build`, and `npm run test`.

## Practical “best way” recommendation

Do not start by adding more animations, more sections, or another visual theme. The strongest path is:

1. **Remove unsupported claims and visible placeholders.**
2. **Choose one brand boundary between StatIQ One and NexDatalytix.**
3. **Migrate shared UI and charts to the existing warm token system.**
4. **Rebuild the homepage around one genuine research workflow.**
5. **Use real product states and label samples honestly.**
6. **Reduce cards, badges, pills, and decorative motion.**
7. **Only then refine typography, responsive composition, and polish.**

The target should be: “a small product team has made careful decisions about what to show and what not to claim,” not “a large page contains every possible enterprise keyword.”

## Acceptance checklist

- [ ] One coherent visual identity across all intended StatIQ routes
- [ ] StatIQ One and NexDatalytix have clear brand boundaries
- [ ] No visible content placeholders
- [ ] No unsupported live, audited, certified, SLA, or accuracy claims
- [ ] Sample data is explicitly labelled
- [ ] No obsolete gold/dark palette in shared UI
- [ ] No generic glow/orb/gradient hero on the product site
- [ ] Cards are used selectively
- [ ] Monospace is reserved for technical/data content
- [ ] Product workflow is understandable within the first screen
- [ ] Navigation uses the shared scroll behavior
- [ ] Mobile layout is intentionally recomposed
- [ ] Keyboard focus and reduced motion work
- [ ] Route metadata is intentional
- [ ] Lint, build, and tests pass
