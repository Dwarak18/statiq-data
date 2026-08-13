# Phase 1 Audit Report: Navigation & Scrolling Implementation (Requirement R4)

**Auditor:** Survey Subagent 3 (`teamwork_preview_explorer`)  
**Target Repository:** `C:\Users\Dwarak\Documents\GitHub\StatiQ`  
**Date:** 2026-08-12  

---

## 1. Executive Summary

A comprehensive Phase 1 Audit of the navigation, header positioning, active section tracking, and scrolling mechanisms was conducted across `src/pages/Home.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/MobileNav.tsx`, `src/components/sections/Hero.tsx`, `src/components/sections/ProductSurface.tsx`, `src/components/sections/Capabilities.tsx`, `src/components/sections/Methodology.tsx`, `src/components/sections/UseCases.tsx`, `src/components/sections/About.tsx`, and `src/index.css`.

The audit identified **6 primary root causes** behind the scroll positioning bug where destination sections land underneath the sticky header or fail to align correctly when triggered from different scroll offsets:

1. **Missing `scroll-margin-top` on Target Sections**: None of the section containers (`#product`, `#capabilities`, `#methodology`, `#use-cases`, `#about`) define `scroll-margin-top`, causing `scrollIntoView()` and native anchor navigation to place the section top edge at viewport `top: 0` underneath the 64px sticky header.
2. **Missing `data-site-header` Attribute**: The `<header>` element in `Header.tsx` lacks the `data-site-header` attribute required for programmatic dynamic header height calculations.
3. **Fragile Window Scroll Listener & Hardcoded Offsets**: Active section highlighting in `Home.tsx` relies on a `window.scrollY` event listener using a hardcoded `+ 200` magic offset and `element.offsetTop` (which is relative to positioned parents and inaccurate during layout shifts) rather than an `IntersectionObserver`.
4. **Direct `scrollIntoView({ behavior: 'smooth' })` Calls without Header Compensation**: Navigation click handlers in `Home.tsx`, `Header.tsx`, and `Hero.tsx` call `scrollIntoView` without adjusting for the header height.
5. **Unchecked JS Smooth Scrolling for Reduced Motion**: While CSS provides `@media (prefers-reduced-motion: reduce)`, direct JavaScript calls explicitly pass `{ behavior: 'smooth' }`, ignoring user motion preferences in certain browser engines.
6. **Unmanaged Hash Navigation on Direct Load**: Direct URL navigation to anchor hashes (e.g. `/#product` or page refresh) relies on standard browser anchoring without offset correction or layout stability checks.

---

## 2. Detailed Findings by Audit Category

### Finding 1: Scroll Handlers & Navigation Triggers
- **Location 1**: `src/pages/Home.tsx` (Lines 40–45)
  ```ts
  const handleNavigate = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  ```
  *Observation*: Standard `element.scrollIntoView({ behavior: 'smooth' })` places the element's upper boundary at top of viewport, ignoring the 64px fixed/sticky header.

- **Location 2**: `src/components/layout/Header.tsx` (Lines 43–61)
  ```ts
  const handleNavClick = (item: NavItem) => {
    setIsMobileMenuOpen(false);
    if (item.isHash) {
      if (location.pathname === '/') {
        if (onNavigate) {
          onNavigate(item.href);
        } else {
          const el = document.getElementById(item.href);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } else {
        navigate(`/#${item.href}`);
      }
    } else {
      navigate(item.href);
    }
  };
  ```
  *Observation*: Delegated click handler fallback uses `scrollIntoView` without header offset compensation.

- **Location 3**: `src/components/sections/Hero.tsx` (Lines 92–105)
  ```ts
  onClick={() => {
    const el = document.getElementById('product');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/statistics');
    }
  }}
  ```
  *Observation*: "Explore platform" CTA button triggers `scrollIntoView` directly to `#product`.

---

### Finding 2: Hardcoded Scroll Offsets & Unreliable Calculations
- **Location**: `src/pages/Home.tsx` (Lines 18–38)
  ```ts
  useEffect(() => {
    const sectionIds = ['product', 'capabilities', 'methodology', 'use-cases', 'about'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setCurrentSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  ```
  *Observations*:
  1. `scrollPosition = window.scrollY + 200`: `200` is an arbitrary magic offset that does not scale across mobile vs. desktop viewports or header state changes.
  2. `element.offsetTop`: Returns the top position relative to `offsetParent`. If an ancestor container has `position: relative`, `offsetTop` yields incorrect page-relative values.
  3. Window scroll listener fires frequently on scroll, causing unnecessary computations.

---

### Finding 3: Container Overflow Properties
- **Location**: `src/index.css` (Line 143)
  ```css
  body {
    overflow-x: hidden;
  }
  ```
- **Location**: Section containers in `Hero.tsx` (L50), `Methodology.tsx` (L26), `ProductSurface.tsx` (L222), `About.tsx` (L50), `FinalCTA.tsx` (L13): `overflow-hidden`.
- **Location**: Horizontal scrollers in `ProofStrip.tsx` (L40) and `MarketTicker.tsx` (L37): `overflow-x-auto`.
- *Observation*: The primary scrolling context is `window` (`documentElement`). Section level `overflow-hidden` prevents horizontal layout bleed but does not clip vertical scroll targets. However, care must be taken so `scroll-margin-top` is applied to root `<section id="...">` elements rather than nested child divs.

---

### Finding 4: Header Height, Sticky Behavior & Missing Attributes
- **Location**: `src/components/layout/Header.tsx` (Lines 65–71)
  ```tsx
  <header
    className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled
        ? 'bg-[#09090B]/90 backdrop-blur-xl border-b border-[#2A2A2A] shadow-md'
        : 'bg-transparent border-b border-transparent'
    }`}
  >
  ```
  *Observations*:
  1. **Missing `data-site-header`**: `<header>` lacks `data-site-header` attribute.
  2. **Dimensions**: Header height is fixed to `h-16` (64px). When `isScrolled` becomes true (`window.scrollY > 20`), visual styling changes (border/background blur appear), but layout height remains 64px.
  3. **Absence of CSS Scroll Margin**: None of the section components (`#product`, `#capabilities`, `#methodology`, `#use-cases`, `#about`) set `scroll-margin-top`. Recommended value: `scroll-margin-top: 80px` (or `96px` desktop / `72px` mobile).

---

### Finding 5: Active Section Tracking
- **Current Mechanism**: Window scroll listener in `Home.tsx` checking `window.scrollY + 200 >= element.offsetTop`.
- **Deficiencies**:
  - Does not adapt to viewport height differences.
  - Fails when scrolling quickly or when section height is small.
  - Violates spec requirement 21, which recommends replacing scroll listeners with `IntersectionObserver`:
    ```ts
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-80px 0px -50% 0px",
        threshold: 0,
      }
    );
    ```

---

### Finding 6: Toggle-and-Scroll & Section Tabs
- **ProductSurface.tsx** Dataset Tabs (`aapl`, `fed`, `ai`): Pure state toggle (`activeKey`). Does not trigger scroll.
- **UseCases.tsx** Sector Tabs (`researchers`, `businesses`, `analysts`, `executives`): Pure state toggle (`activeTab`). Does not trigger scroll.
- **Header Navigation Buttons**:
  - Hash links (`product`, `capabilities`, `methodology`, `use-cases`, `about`).
  - When clicked from another route, redirects to `/#<hash>`. Native browser scroll executes before DOM layout stabilizes or font assets render.
  - Recommended fix: Add layout-stable scrolling in `useEffect` for hash URLs using `requestAnimationFrame`.

---

### Finding 7: Reduced-Motion Support for Scrolling
- **CSS Rule**: `src/index.css` (Lines 128–135)
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      scroll-behavior: auto !important;
    }
  }
  ```
- **JS Hazard**: Direct calls to `element.scrollIntoView({ behavior: 'smooth' })` ignore CSS rules in some WebKit/Blink versions.
- **Recommended fix**: Centralized `scrollToSection` helper should check:
  ```ts
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior = prefersReduced ? 'auto' : 'smooth';
  ```

---

## 3. Recommended Remediation Plan for Phase 2 (Implementation)

1. **CSS Scroll Margin**: Add global scroll margin rule in `src/index.css`:
   ```css
   section[id] {
     scroll-margin-top: 80px;
   }
   @media (max-width: 768px) {
     section[id] {
       scroll-margin-top: 72px;
     }
   }
   ```
2. **Add Header Marker**: Add `data-site-header` to `<header>` in `Header.tsx`:
   ```tsx
   <header data-site-header className="...">
   ```
3. **Centralized Scroll Helper**: Create `scrollToSection(id: string)` in `src/utils/navigation.ts` or `Home.tsx` that accounts for header height and `prefers-reduced-motion`.
4. **IntersectionObserver**: Replace `handleScroll` in `Home.tsx` with `IntersectionObserver` using `rootMargin: "-80px 0px -55% 0px"`.
5. **Initial Hash Scroll**: Add an effect in `Home.tsx` to handle direct URL hashes (`window.location.hash`) after initial render and `requestAnimationFrame`.
