---
name: frontend-design
description: >-
  Frontend design skill for StatIQ One. Teaches component architecture,
  real-time notification UI patterns (Novu), agentic workflow interfaces
  (DeerFlow), design system authoring, and production-quality React/Tailwind
  development. Use when building, reviewing, or improving any StatIQ UI.
sources:
  - https://github.com/novuhq/novu
  - https://github.com/bytedance/deer-flow
---

# Frontend Design Skill

Synthesised from Novu (open-source notification infrastructure) and DeerFlow
(ByteDance agentic workflow UI). Apply these principles to every StatIQ
frontend task.

---

## 1. Component Architecture Principles

### Composition over configuration
- Build **small, focused primitives** — Badge, Button, Card, DataPoint — then compose them into sections.
- Avoid mega-components with 20+ props. If a component needs that many options, split it.
- Every section (`Hero`, `ProofStrip`, `Evidence`) is **independently renderable and testable**.

### Co-location
- Keep component logic, styles (Tailwind classes), and types in the **same file** for components < 200 LOC.
- Extract to `hooks/`, `utils/` only when logic is genuinely reused across 3+ components.

---

## 2. Novu-Inspired Notification & Feed UI Patterns

Source: [novuhq/novu](https://github.com/novuhq/novu)

### Inbox / Feed Components
Rules:
- Always show **unread state** visually (dot, bold text, background tint).
- Every item must have a **relative timestamp** ("2 min ago").
- Provide **mark-all-read** control when list > 3 items.
- Animate new items in with `motion/react` `AnimatePresence`.

### Toast Notifications
- Max 3 toasts visible simultaneously — queue the rest.
- Auto-dismiss after 4s for info/success; keep error toasts until dismissed.
- Position: `bottom-right` desktop, `top-center` mobile.

---

## 3. DeerFlow-Inspired Agentic Interface Patterns

Source: [bytedance/deer-flow](https://github.com/bytedance/deer-flow)

### Streaming / Progressive Disclosure
Show skeleton → partial content → complete. Never show blank states.

### Agentic Task Cards
For long-running operations (report generation, screener updates):
1. **Initiation** — button + description of what will happen.
2. **Running** — spinner + real-time status text.
3. **Complete** — result preview + primary CTA.
4. **Error** — human-readable message + retry button.

### Session Context Indicators
Show active session / data freshness with a status badge:
`● Live · Last updated 2 min ago · India Market Open`

### Layout for Data-Dense Interfaces
- Split-panel layouts for compare/analyse flows (left: filters, right: results).
- Sidebar collapses to icons on screens < 1280px.
- Tables need sticky headers and row hover states.
- Always provide empty states with actionable next steps.

---

## 4. Design Token System

All StatIQ components MUST use CSS custom properties. Never hardcode hex values.

```css
--color-canvas:          #F7F6F2   /* page background */
--color-ink:             #20201E   /* primary text */
--color-accent-warm:     #C8722A   /* primary CTA, highlights */
--color-accent-sage:     #5C7A5C   /* secondary / success */
--color-surface-raised:  #EFEDE8   /* card backgrounds */
--color-border:          #D9D6CF   /* dividers, borders */
--color-data-positive:   #2D6A4F   /* gains */
--color-data-negative:   #C0392B   /* losses */
```

---

## 5. Typography Rules

| Role | Font | Class |
|---|---|---|
| Display / Hero | Plus Jakarta Sans | `font-heading text-5xl font-bold` |
| Section title | Plus Jakarta Sans | `font-heading text-3xl font-semibold` |
| Body | System sans | `font-sans text-base leading-relaxed` |
| Data / Numbers | Monospace | `font-mono tabular-nums` |
| Labels | System sans | `text-sm font-medium tracking-wide` |

---

## 6. Motion & Animation

Use `motion/react` for all animations. Always respect `prefers-reduced-motion`.

- Duration: 200-400ms micro-interactions, 400-600ms page transitions.
- Easing: `easeOut` for entrances, `easeIn` for exits.
- Never animate `width`/`height` — animate `opacity` + `transform` only.

```tsx
<motion.section
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
```

---

## 7. Responsive Checklist

- [ ] 375px (iPhone SE) — no overflow, touch targets >= 44px
- [ ] 768px (iPad) — layout intact
- [ ] 1280px (laptop) — design intent preserved
- [ ] 1920px (wide) — max-width container respected

---

## 8. Accessibility Non-Negotiables

- All interactive elements: `aria-label` or visible label.
- Focus ring: `focus-visible:ring-2` on all interactive elements.
- Color contrast: >= 4.5:1 normal text, >= 3:1 large text.
- `<img>`: always has `alt` attribute.
- Dynamic content: `aria-live="polite"` for status updates.

---

## 9. Verification

```bash
npm run lint    # TypeScript clean
npm test        # 13/13 e2e tests pass
npm run build   # Production build succeeds
```
