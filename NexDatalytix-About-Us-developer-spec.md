# NexDatalytix Private Limited — About Us Page
## Production Frontend Design & Build Specification

**Reference:** https://wizdomedge.com/  
**Website contact:** `contact@statiqone.com`  
**Company:** NexDatalytix Private Limited  
**Source:** `NexDatalytix_Global_Research_Company_Profile.docx`

> This is a developer implementation specification, not a generic landing-page prompt.

---

## 1. Source-of-truth and naming

The supplied company profile uses **NexDatalytix Global Research Private Limited** in several places, while the requested website-facing name is **NexDatalytix Private Limited**. Do not silently invent or alter the legal identity. Use the requested name for the page, but flag the formal/legal naming for owner confirmation before publishing legal-company statements.

The profile describes a Chennai, Tamil Nadu based company incorporated in 2024, operating across data research, AI analytics, IT services and global publishing. It states that the company works at the convergence of data science, mathematical research, artificial intelligence and advanced IT services. fileciteturn0file0L41-L80

Do not publicly expose the placeholder-style CIN or the phone number marked "to be updated". Do not invent client names, employee counts, awards, certifications, revenue or leadership names.

The profile's vision and mission emphasize trusted data research/AI analytics, mathematical rigour, technology excellence and global knowledge creation. fileciteturn0file0L82-L90

---

## 2. Design objective

The About page must feel:

- quiet
- precise
- credible
- research-oriented
- human
- technical
- mature
- international

It must **not** feel like:

- an AI-generated company page
- a generic SaaS template
- a startup pitch deck
- a portfolio site
- a card-grid "About Us"
- a dark futuristic AI page

WizdomEdge is useful as a **narrative reference**: it positions the company through a point of view, cross-domain thinking, practical impact and a human closing invitation rather than just listing services. citeturn0search1

Do not copy its layout, copy, illustrations, typography or branding.

---

## 3. Visual direction

### Theme

Use **warm editorial technology**.

The visual hierarchy should be:

```text
warm ivory
    +
white
    +
near-black typography
    +
fine gray rules
    +
one restrained accent
    +
quiet data visuals
```

The page should still look strong with all animation disabled.

---

## 4. Color system

```css
:root {
  --nd-bg: #F7F6F2;
  --nd-surface: #FBFAF7;
  --nd-white: #FFFFFF;

  --nd-ink: #20201E;
  --nd-ink-soft: #4F4E49;
  --nd-muted: #77756E;
  --nd-faint: #9A9890;

  --nd-border: #DEDDD7;
  --nd-border-soft: #E9E7E1;

  --nd-accent: #B9684E;
  --nd-accent-hover: #A85B43;
  --nd-accent-soft: #EAD8D0;

  --nd-data: #7D8A82;
  --nd-data-soft: #DCE1DC;
}
```

Color is for hierarchy, not decoration.

Avoid:

- purple/blue AI gradients
- neon colors
- gradient text
- glassmorphism
- glowing borders
- colored blobs
- a different background color for every section

Target roughly 90% neutral surfaces/typography and only a small amount of accent/data color.

---

## 5. Typography

Do **not** default to generic combinations such as Poppins + Inter + Roboto.

First inspect the existing brand/project fonts.

If no approved brand font exists, choose:

### Body/UI
One family only:
- Geist Sans
- IBM Plex Sans
- Source Sans 3

### Editorial display
One family only:
- Instrument Serif
- Source Serif 4
- Newsreader

Do not use all options.

The serif should be an accent, not the whole identity.

Example:

```css
:root {
  --font-sans: "Geist", system-ui, sans-serif;
  --font-serif: "Instrument Serif", Georgia, serif;
}

.display {
  font-family: var(--font-sans);
  font-weight: 500;
  letter-spacing: -0.045em;
}

.editorial {
  font-family: var(--font-serif);
  font-weight: 400;
}

.body {
  font-family: var(--font-sans);
  font-weight: 400;
  line-height: 1.65;
}
```

Use only required weights. Prefer optimized/self-hosted fonts where licensing permits.

---

## 6. Logo rules

The user has real company logos.

**Use those actual assets.**

Never:

- generate a replacement logo
- create a text logo from a generic font
- use an AI-generated logo
- redraw the mark in CSS
- add gradients/glows
- distort the original mark

Prefer SVG.

Suggested asset structure:

```text
/assets/brand/nexdatalytix/
  logo.svg
  logo-dark.svg
  logo-light.svg
  mark.svg
  favicon.svg
```

Adapt to the real repository.

If only one official logo exists, use it. Create monochrome variants only if brand guidelines permit.

Do not make the logo the largest visual element on the page.

---

## 7. No fake imagery

Priority:

1. actual company/team photos
2. actual office photos
3. actual research/product visuals
4. actual publication material
5. carefully designed data diagrams

Do not use generic stock offices, server rooms, businesspeople or AI-generated portraits.

If authentic imagery is unavailable, use typography, diagrams and information structures instead.

---

# 8. Page architecture

Do not make ten identical sections.

Recommended narrative:

```text
01 Opening statement
02 Who we are
03 The intersection
04 Vision + mission
05 Principles
06 What we build
07 Research + technology
08 Global reach
09 Why NexDatalytix
10 People
11 Compliance note
12 Closing invitation
```

Each section must have a distinct compositional role.

---

# 9. Opening / Hero

Goal: establish identity immediately.

Suggested structure:

```text
ABOUT NEXDATALYTIX

Data research.
AI analytics.
Technology for
complex questions.
```

Beside it: a short factual company statement.

Optional metadata:

```text
CHENNAI · INDIA
EST. 2024
```

Only publish the incorporation year after owner confirmation; the profile states 2024. fileciteturn0file0L41-L55

Do not use a giant stock image, carousel, particles or gradient background.

---

# 10. Who we are

Use the source profile's description: Chennai-headquartered data intelligence and IT services company working across data science, mathematical research, AI and advanced IT services. fileciteturn0file0L75-L80

Do not put this into a rounded card.

Use editorial composition:

```text
WHO WE ARE

                    [large paragraph]

                    NexDatalytix ...

────────────────────────────────────
```

Add a small side annotation:

```text
01
RESEARCH × TECHNOLOGY
```

---

# 11. The intersection

Make this a signature visual.

```text
             DATA
               │
               │
RESEARCH ─── NEXDATALYTIX ─── TECHNOLOGY
               │
               │
              AI
```

Do not use a generic Venn diagram.

Use fine lines and typography.

Supporting labels:

```text
DATA
Collection · analysis · publishing

RESEARCH
Mathematics · methodology · evidence

AI
Prediction · language · intelligent systems

TECHNOLOGY
Software · cloud · APIs · platforms
```

These areas are supported by the profile's service/capability sections. fileciteturn0file0L219-L274

---

# 12. Vision and mission

The profile gives a vision centered on trusted next-generation data research/AI analytics and a mission centered on data research, IT services and AI-powered analytics grounded in mathematical rigour and technology excellence. fileciteturn0file0L82-L90

Do not use three generic cards.

Use:

```text
VISION

To turn complex,
multi-domain data
into intelligence
people can act on.
```

Then show the full approved source-derived wording below if desired.

Follow with:

```text
MISSION
```

and the approved mission paragraph.

---

# 13. Principles

The source profile identifies:

- Rigour
- Innovation
- Global
- Integrity
- Scale

with supporting explanations. fileciteturn0file0L90-L107

Do not create five colorful icon cards.

Use a vertical editorial list:

```text
01   RIGOUR
     Mathematical precision in every dataset
     and research output.

────────────────────────────────────

02   INNOVATION
     AI-first thinking embedded in solutions.

03   GLOBAL
     Research and insight without borders.

04   INTEGRITY
     Transparent and responsible data practices.

05   SCALE
     Systems designed to grow with the organisation.
```

Use subtle hover transitions only.

---

# 14. What we build

The profile describes eight major areas:

- Data Research & Statistical Publishing
- AI & Machine Learning Analytics
- IT Services, App Development & Cloud Solutions
- Market Research & Business Consultancy
- Digital Media, Content & Research Publishing
- Financial & Insurance Data Services
- Health Data & Medical Informatics
- Education Technology & Professional Training fileciteturn0file0L219-L243

Do not make eight cards.

Use an editorial selector:

```text
DATA RESEARCH
AI & ML ANALYTICS
IT & CLOUD
MARKET RESEARCH
PUBLISHING
FINANCIAL DATA
HEALTH INFORMATICS
EDTECH
```

Selecting a row reveals a description on the opposite side.

Use real buttons/tabs, not clickable `<div>` elements.

---

# 15. Research + technology

The profile lists AI/ML, NLP, computer vision, statistics, data visualization, big data, cloud, databases, ETL, software engineering, APIs and mathematical/research capabilities. fileciteturn0file0L247-L274

Do not create a wall of technology logos.

Use a structured capability field:

```text
RESEARCH STACK

Artificial Intelligence
Machine Learning
Natural Language Processing
Computer Vision

────────────────────

DATA SYSTEMS

Big Data
Cloud
Databases
ETL

────────────────────

SOFTWARE

Web
Mobile
Enterprise
APIs

────────────────────

MATHEMATICAL RESEARCH

Optimisation
Stochastic Modelling
Biostatistics
Financial Mathematics
```

This should feel like a research report rather than a SaaS feature grid.

---

# 16. Global reach

The profile describes Chennai/India as the base and lists the USA, UK/EU, Singapore/APAC, Australia, Middle East and Southeast Asia as markets. fileciteturn0file0L317-L351

Do not use a glowing 3D globe.

Prefer:

```text
CHENNAI
INDIA

Primary base
      │
      ├── USA
      ├── UK / EU
      ├── APAC
      ├── AUSTRALIA
      ├── MIDDLE EAST
      └── SOUTHEAST ASIA
```

Or use a very subtle SVG map with one accent marker for Chennai.

No fake live data.

---

# 17. Why NexDatalytix

The profile lists:

- 19 registered business domains
- math-first, AI-native methodology
- research + technology capability
- global publishing infrastructure
- multi-sector expertise
- India-based/global delivery
- ethical data governance
- scalability from startup to enterprise. fileciteturn0file0L357-L386

Treat "19 registered business domains" as a source-derived claim requiring owner approval before marketing publication.

Composition:

```text
WHY NEXDATALYTIX

A research organisation
with the ability to ship.

01  Research + Technology
02  Math-first methodology
03  Multi-domain capability
04  Global delivery
```

Avoid a conventional "Why choose us?" card grid.

---

# 18. People

The profile describes a multidisciplinary structure spanning strategy, technology, data science, research/publishing, IT/app development, consulting, finance/health data and EdTech. It provides roles but not actual names. fileciteturn0file0L390-L428

Do not fabricate names.

Until actual names/photos are supplied:

```text
PEOPLE

A multidisciplinary organisation
built around research, engineering,
analysis and delivery.

Strategy
Technology
Data Science
Research
Engineering
Consulting
```

Never use AI-generated headshots.

---

# 19. Compliance

The profile separates regulatory/compliance statements from a "Target Certifications (Roadmap)" section. fileciteturn0file0L432-L445

Keep this distinction.

Never turn a target certification into a badge.

For example:

```text
CERTIFICATION ROADMAP

ISO 27001
ISO 9001
DSIR Recognition
NASSCOM Membership
DPIIT Startup India Recognition
```

If shown, label these explicitly as roadmap/target items.

Do not convert "GDPR-aligned" into "GDPR certified".

---

# 20. Closing CTA

Use the human invitation principle of the reference site. WizdomEdge ends with a connection-oriented invitation for partners, clients and collaborators rather than a generic product-sales CTA. citeturn0search1

Suggested structure:

```text
COMPLEX QUESTIONS
DESERVE BETTER
SYSTEMS.

If you are working with difficult data,
research problems or technology that needs
to move from idea to implementation,
talk to us.

contact@statiqone.com

[Start a conversation →]
```

The required email is:

```text
contact@statiqone.com
```

Use:

```html
<a href="mailto:contact@statiqone.com">
```

---

# 21. Header

Inherit the main StatIQ One navigation.

Do not invent a separate About-page navigation.

If the product/company relationship is confirmed, make it subtle:

```text
NEXDATALYTIX
Research & Technology

STATIQ ONE
```

Do not create competing brand marks.

---

# 22. Layout system

Use a 12-column desktop grid.

```css
--container: min(1280px, calc(100vw - 64px));
--gutter: 32px;
```

Use asymmetric compositions:

```text
8 columns content
4 columns annotation
```

Tablet: 8 columns.

Mobile: 4 columns.

Do not use the same centered `max-width + text-align:center` layout for every section.

---

# 23. Spacing

```css
--section-space: clamp(96px, 12vw, 180px);
--section-space-small: clamp(64px, 8vw, 120px);
```

Whitespace should separate ideas, not artificially lengthen the page.

---

# 24. Surfaces

Prefer borders over shadows:

```css
border: 1px solid var(--nd-border);
```

If a raised surface is required:

```css
box-shadow: 0 8px 30px rgba(20, 20, 18, 0.06);
```

Keep radii restrained:

```css
4px
8px
10px
14px maximum for major surfaces
```

Avoid `rounded-3xl` everywhere.

---

# 25. Icons

Do not use emoji as UI.

Avoid:

```text
🤖 AI
📊 Data
🌎 Global
⚡ Innovation
```

Use typography, numbering and rules as the primary visual language.

If icons are necessary, use one consistent SVG system.

---

# 26. Motion

Motion is optional enhancement.

Recommended:

```text
Entrance:
opacity 0 → 1
translateY 16px → 0
450–700ms

Hover:
150–250ms
```

Do not animate every word or card.

Avoid:

- floating blobs
- infinite gradient animation
- particles
- cursor-following graphics
- 3D globe
- scroll-jacking
- constantly moving text
- bouncing cards

Respect:

```css
@media (prefers-reduced-motion: reduce) {
  /* disable non-essential animation */
}
```

---

# 27. Responsive design

## Desktop

Use editorial typography, asymmetry, side annotations and horizontal rules.

## Tablet

Collapse side annotations into labels above content.

## Mobile

Recompose rather than simply stacking desktop columns:

```text
hero
↓
statement
↓
intersection
↓
vision/mission
↓
principles
↓
services
↓
research stack
↓
global
↓
people
↓
CTA
```

Test:

```text
390px
430px
768px
1024px
1440px
```

---

# 28. Mobile typography

Starting point:

```css
h1 {
  font-size: clamp(3rem, 11vw, 5rem);
}

h2 {
  font-size: clamp(2rem, 7vw, 3.5rem);
}

body {
  font-size: 1rem;
}
```

Tune against the selected font.

Do not make the mobile hero a stack of giant disconnected words merely for visual effect.

---

# 29. Accessibility

Required:

- semantic `<main>`
- one logical `<h1>`
- proper heading hierarchy
- keyboard-accessible service selector
- visible focus states
- sufficient contrast
- descriptive links
- meaningful alt text
- decorative images with empty alt
- no hover-only information
- reduced-motion support
- accessible mobile navigation

---

# 30. SEO

Suggested starting metadata:

```text
Title:
About NexDatalytix Private Limited | Data Research & AI Analytics

Description:
Learn about NexDatalytix Private Limited, a Chennai-based organisation working across data research, AI analytics, technology and research-driven services.
```

Verify all claims before publishing.

Include:

- canonical URL
- Open Graph title/description/image
- favicon
- appropriate Organization structured data

Do not create fake review, award, employee or rating schema.

---

# 31. Performance

- optimize images
- use SVG for logos/diagrams
- lazy-load below-fold images
- preload only critical fonts
- avoid unused font weights
- avoid heavy background video
- avoid unnecessary client-side state
- prevent layout shift
- do not add Three.js or another heavy library merely for "premium" visuals

---

# 32. Component architecture

If the project uses React, adapt the existing architecture rather than forcing a rewrite.

Possible structure:

```text
src/
  pages/
    AboutNexDatalytix/

  components/
    about/
      AboutHero
      CompanyStatement
      IntelligenceIntersection
      PrinciplesList
      CapabilityExplorer
      ResearchStack
      GlobalReach
      LeadershipOverview
      ComplianceNote
      AboutCTA

    brand/
      NexDatalytixLogo

    ui/
      SectionLabel
      EditorialRule
      Button
      Container
      Reveal
```

Avoid `Section1`, `Card2`, `Component3` naming.

---

# 33. Content/data separation

Keep repeated structured content separate from JSX:

```ts
const principles = [
  {
    number: "01",
    title: "Rigour",
    description: "..."
  }
];
```

This makes later content verification and editing safer.

---

# 34. Content integrity

The company profile contains claims concerning:

- 19 registered business activities
- global markets
- industry sectors
- compliance
- target certifications
- research capabilities
- leadership structure

These are source-derived.

Use:

```text
VERIFY → APPROVE → PUBLISH
```

Do not strengthen claims during copywriting.

Example:

```text
"GDPR-aligned"
```

must never become:

```text
"GDPR certified"
```

without explicit evidence.

---

# 35. Anti-AI-template rejection checklist

Reject the implementation if it contains several of:

- gradient hero
- "future of..." headline
- three-column service cards
- excessive rounded cards
- purple/blue AI palette
- fake dashboard
- stock business imagery
- AI portraits
- animated blobs
- glassmorphism
- giant glowing globe
- fake client-logo wall
- fake testimonials
- fake statistics
- generic "Why choose us?"
- invented company timeline
- excessive icons
- oversized CTA
- excessive scroll animation

---

# 36. What makes the page authentic

Use details specific to the company:

```text
Chennai
Data research
Mathematical research
AI analytics
IT services
Global publishing
Research methodology
Financial mathematics
Health informatics
Data engineering
Global delivery
```

Specificity is more convincing than generic claims such as:

```text
Innovation
Excellence
Transformation
Future
Possibilities
```

without evidence.

---

# 37. Developer workflow

Do not begin by writing JSX.

### Step 1 — inspect repository
- current routes
- existing StatIQ One header/footer
- current tokens
- fonts
- logo/image assets
- animation system
- routing

### Step 2 — inspect real NexDatalytix logo assets
Determine:
- SVG/raster
- light/dark variants
- wordmark
- symbol
- aspect ratio
- clear-space requirements

### Step 3 — build content map from the DOCX

### Step 4 — create wireframe/information hierarchy

### Step 5 — implement visual tokens

### Step 6 — implement sections

### Step 7 — implement responsive behavior

### Step 8 — accessibility/performance/SEO

### Step 9 — visual QA with animation disabled

If the design is weak without animation, fix the layout rather than adding more motion.

---

# 38. Final acceptance criteria

- [ ] Feels like a real company's About page.
- [ ] Does not resemble a generic AI-generated landing page.
- [ ] Real NexDatalytix logo assets are used.
- [ ] No AI-generated logo.
- [ ] Typography has deliberate hierarchy.
- [ ] Fonts are limited and purposeful.
- [ ] Warm neutral palette is consistent.
- [ ] Accent color is restrained.
- [ ] Editorial layouts replace default card grids.
- [ ] Company-specific information drives the design.
- [ ] No unsupported claims are invented.
- [ ] Leadership names are not fabricated.
- [ ] Certification claims are not overstated.
- [ ] `contact@statiqone.com` is used for the requested CTA.
- [ ] Mobile is intentionally composed.
- [ ] Accessibility is handled.
- [ ] SEO is handled.
- [ ] Performance is handled.
- [ ] Animation is enhancement, not a dependency.
- [ ] The page remains strong with animation disabled.

---

# 39. Design north star

The page should communicate this without literally saying it:

> **NexDatalytix is not another company selling "AI solutions."**
>
> **It is a research-and-technology organisation built around data, analytical thinking and the ability to turn that thinking into working systems.**

Everything on the page should support that idea.
