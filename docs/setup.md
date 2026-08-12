# Setup and Scripts

## Prerequisites

- Node.js
- A Gemini API key for local development

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` and set:

```bash
GEMINI_API_KEY=your_key_here
```

3. Run the app:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - start the Vite dev server on port 3000
- `npm run build` - create a production build
- `npm start` - run `server.js`
- `npm run preview` - preview the Vite build
- `npm run lint` - run TypeScript checking with `tsc --noEmit`
- `npm test` - run the E2E verification script
- `npm run test:e2e` - same as `npm test`
- `npm run clean` - remove `dist` and `server.js`

## Runtime Notes

- The dev server binds to `0.0.0.0` on port `3000`.
- Production entry behavior is controlled by `server.js`.
- Environment values should stay out of source control.
