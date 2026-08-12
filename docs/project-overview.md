# Project Overview

StatIQ One is a React 19 + TypeScript + Vite application that presents a warm, editorial intelligence experience for a data and research product.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- `lucide-react`
- `echarts` and `echarts-for-react`

## App Shape

The main page is assembled in `src/pages/Home.tsx` from a set of modular sections:

- `Header`
- `Hero`
- `ProofStrip`
- `IntelligenceFlow`
- `ProductSurface`
- `Capabilities`
- `Methodology`
- `UseCases`
- `Evidence`
- `About`
- `FinalCTA`
- `Footer`

## Key Architectural Rules

- Theme tokens live in `src/index.css` and should stay centralized.
- Chart colors should be maintained in `src/utils/chartTheme.ts`.
- Section navigation should use a shared scroll helper instead of ad hoc offsets.
- Active navigation state should be driven by viewport observation, not manual scroll arithmetic.
- Section content should remain modular and reusable inside `src/components/sections/`.

## Important Files

- `src/pages/Home.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/index.css`
- `src/utils/chartTheme.ts`
- `src/components/sections/*`

## Product Intent

The experience should feel:

- quiet
- intelligent
- premium
- technical
- restrained
- trustworthy

The page should communicate the product clearly before trying to impress the visitor.
