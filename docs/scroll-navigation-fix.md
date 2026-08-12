# Scroll and Navigation Fix

This document captures the scroll-position and active-navigation behavior that the app depends on.

## Problem Statement

When a user scrolls partway down the page and clicks a navigation control, the destination can land at the wrong viewport position if the scroll logic ignores header height, layout reflow, or mode changes.

## Preferred Approach

### 1. Use anchored sections where possible

Prefer semantic anchors like:

```html
<a href="#web">Web</a>
```

### 2. Use `scroll-margin-top`

Give anchored sections stable offsets in CSS:

```css
section[id] {
  scroll-margin-top: 96px;
}

@media (max-width: 768px) {
  section[id] {
    scroll-margin-top: 72px;
  }
}
```

### 3. Centralize JavaScript scrolling when needed

If script-based scrolling is required, use one shared helper that measures the actual header height.

### 4. Drive active state with `IntersectionObserver`

Do not infer the active section from arbitrary `window.scrollY` thresholds.

## Implementation Contracts

- The site header should expose `data-site-header`.
- Section IDs should be stable and predictable.
- Scroll behavior should respect reduced-motion preferences.
- Any toggle that also triggers navigation should wait for layout stability before scrolling.

## Things to Avoid

- hardcoded per-button offsets
- duplicated scroll logic
- `scrollIntoView()` without offset awareness when a fixed or sticky header is present
- scroll state derived from magic numbers

## Manual Checks

- clicking a nav item from top of page
- clicking a nav item mid-scroll
- clicking after repeated scroll state changes
- testing on desktop and mobile
- testing reduced motion
- testing direct hash navigation

## Related Files

- `src/components/layout/Header.tsx`
- `src/pages/Home.tsx`
- `src/index.css`
