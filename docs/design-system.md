# Design System

StatIQ One uses a warm, restrained visual language intended to feel like a real intelligence product rather than a generic SaaS template.

## Visual Direction

- warm canvas backgrounds
- near-black text
- muted secondary text
- one restrained accent color
- minimal decorative noise
- borders over heavy shadows
- editorial spacing and typography

## Core Tokens

The canonical theme lives in `src/index.css`.

### Color

- `--color-bg`: `#F7F6F2`
- `--color-surface`: `#FBFAF7`
- `--color-surface-raised`: `#FFFFFF`
- `--color-ink`: `#20201E`
- `--color-ink-soft`: `#4F4E49`
- `--color-muted`: `#77756E`
- `--color-faint`: `#9A9890`
- `--color-border`: `#DEDDD7`
- `--color-border-soft`: `#E9E7E1`
- `--color-accent`: `#B9684E`
- `--color-accent-hover`: `#A85B43`
- `--color-accent-soft`: `#EAD8D0`
- `--color-sage`: `#7D8A82`
- `--color-sage-soft`: `#DCE1DC`
- `--color-success`: `#657B6C`
- `--color-warning`: `#A6845C`
- `--color-error`: `#9A5B55`

### Data Colors

- `--data-primary`: `#667A70`
- `--data-secondary`: `#B9684E`
- `--data-tertiary`: `#A8ADA4`
- `--data-neutral`: `#D7D5CE`

### Radius

- `--radius-sm`: `4px`
- `--radius-md`: `8px`
- `--radius-lg`: `14px`

## Typography

- Use a readable body family.
- Use a strong display treatment for headings.
- Keep line length comfortable.
- Keep hierarchy obvious through size, weight, and spacing more than color.

## Layout Rules

- Prefer editorial rows and split compositions over repeated card grids.
- Keep the home page grounded in warm neutral surfaces.
- Avoid alternating bright section colors.
- Use asymmetry with intent, not as decoration.

## Motion Rules

- Motion should be subtle and purposeful.
- Respect `prefers-reduced-motion`.
- Use hover and reveal motion sparingly.
- Avoid animated backgrounds, blobs, or noisy effects.

## Component Guidance

Recommended component areas:

- `src/components/layout/`
- `src/components/sections/`
- `src/components/ui/`

The most important reusable patterns are:

- containers
- section labels
- buttons
- data points
- tabs
- reveal states
- source badges

## Charts

ECharts styling should be kept in `src/utils/chartTheme.ts` so the data visualization palette remains consistent with the rest of the system.
