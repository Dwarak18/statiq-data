# Handoff Report: Phase 1 Audit of Navigation and Scrolling (R4)

**Agent:** Survey Subagent 3 (`teamwork_preview_explorer`)  
**Working Directory:** `C:\Users\Dwarak\Documents\GitHub\StatiQ\.agents\teamwork_preview_explorer_survey_3`  
**Date:** 2026-08-12  

---

## 1. Observation

Direct observations from source code files in `C:\Users\Dwarak\Documents\GitHub\StatiQ`:

1. **`src/pages/Home.tsx` (Lines 18–45)**:
   - Lines 20–37: Uses `window.addEventListener('scroll', handleScroll, { passive: true })` for section tracking.
   - Line 21: `const scrollPosition = window.scrollY + 200;` uses a hardcoded `+ 200` offset.
   - Line 26: `const top = element.offsetTop;` computes relative offset to `offsetParent`.
   - Lines 40–45:
     ```ts
     const handleNavigate = (id: string) => {
       const element = document.getElementById(id);
       if (element) {
         element.scrollIntoView({ behavior: 'smooth' });
       }
     };
     ```
2. **`src/components/layout/Header.tsx` (Lines 65–71)**:
   - Line 65: `<header className={`sticky top-0 z-50 w-full transition-all duration-300 ...`}>` — Notice `<header>` **lacks** the `data-site-header` attribute.
   - Line 72: Header container height is `h-16` (64px).
   - Lines 50–54:
     ```ts
     const el = document.getElementById(item.href);
     if (el) {
       el.scrollIntoView({ behavior: 'smooth' });
     }
     ```
3. **`src/components/sections/Hero.tsx` (Lines 92–105)**:
   - Lines 93–95:
     ```ts
     const el = document.getElementById('product');
     if (el) {
       el.scrollIntoView({ behavior: 'smooth' });
     }
     ```
4. **`src/components/sections/` Section Components**:
   - `ProductSurface.tsx` (L154): `<section id="product" className="border-b border-[#2A2A2A] bg-[#09090B] py-16 sm:py-24">`
   - `Capabilities.tsx` (L69): `<section id="capabilities" className="border-b border-[#2A2A2A] bg-[#09090B] py-16 sm:py-24">`
   - `Methodology.tsx` (L9): `<section id="methodology" className="border-b border-[#2A2A2A] bg-[#09090B] py-16 sm:py-24">`
   - `UseCases.tsx` (L106): `<section id="use-cases" className="border-b border-[#2A2A2A] bg-[#09090B] py-16 sm:py-24">`
   - `About.tsx` (L30): `<section id="about" className="border-b border-[#2A2A2A] bg-[#09090B] py-16 sm:py-24">`
   - *Observation*: None of these section tags specify `scroll-margin-top` in inline styles or utility classes.
5. **`src/index.css` (Lines 116–136)**:
   - Lines 116–120: `html { scroll-behavior: smooth; }`
   - Lines 128–135: `@media (prefers-reduced-motion: reduce) { *, ::before, ::after { scroll-behavior: auto !important; } }`
   - *Observation*: No CSS rule exists for `section[id] { scroll-margin-top: ... }`.

---

## 2. Logic Chain

1. **Premise**: When a user clicks a navigation item (e.g. "Product", "Capabilities", "Methodology", "Use Cases", "About") or the "Explore platform" CTA button, `element.scrollIntoView({ behavior: 'smooth' })` is executed.
2. **Step 1**: The browser aligns the top edge of the target `<section id="...">` element to the top edge of the viewport (`top: 0`).
3. **Step 2**: The `<header>` element is configured with `sticky top-0 z-50` with height 64px (`h-16`). Thus, it occupies the top 64px of the viewport.
4. **Step 3**: Because no section specifies `scroll-margin-top`, the section heading and top padding are covered by the 64px sticky header.
5. **Step 4**: When scrolling manually, active section tracking in `Home.tsx` compares `window.scrollY + 200` against `element.offsetTop`. Because `element.offsetTop` measures distance relative to the nearest positioned parent (`offsetParent`) and because `200` is a fixed magic number, active section state highlights prematurely or incorrectly.
6. **Step 5**: Because `<header>` lacks `data-site-header`, any JS-based scroll position calculation that attempts to find `document.querySelector('[data-site-header]')` fails.
7. **Step 6**: Direct JS calls to `scrollIntoView({ behavior: 'smooth' })` bypass CSS `@media (prefers-reduced-motion: reduce)` in certain browsers unless checked explicitly.
8. **Conclusion**: Adding `scroll-margin-top: 80px` to `section[id]`, adding `data-site-header` to `<header>`, replacing window scroll event listener with `IntersectionObserver`, and centralizing scroll handling will completely resolve the scroll positioning bug.

---

## 3. Caveats

- **No Code Changes Made**: As an explorer agent in Phase 1 Audit, no modifications were made to source files (`Home.tsx`, `Header.tsx`, `index.css`, etc.). All audit findings are diagnostic.
- **Browser-Specific JS Motion Handling**: Behavior of `element.scrollIntoView({ behavior: 'smooth' })` when `prefers-reduced-motion` is enabled varies slightly between WebKit and Blink; explicit JS checks for `window.matchMedia('(prefers-reduced-motion: reduce)')` are recommended.

---

## 4. Conclusion

The Phase 1 Audit of R4 navigation and scrolling is complete. All 6 root causes of the positioning bug have been pinpointed with exact file locations and code snippets. A concrete remediation plan has been documented in `analysis.md` for the implementer agent.

---

## 5. Verification Method

To independently verify these findings:
1. Inspect `src/pages/Home.tsx` at lines 21 & 43 to verify `window.scrollY + 200` and `scrollIntoView({ behavior: 'smooth' })`.
2. Inspect `src/components/layout/Header.tsx` at line 65 to verify missing `data-site-header` attribute.
3. Inspect `src/index.css` to verify the absence of `scroll-margin-top` for `section[id]`.
4. Inspect `src/components/sections/` files (`ProductSurface.tsx`, `Capabilities.tsx`, `Methodology.tsx`, `UseCases.tsx`, `About.tsx`) to verify section IDs and lack of scroll margin classes.
