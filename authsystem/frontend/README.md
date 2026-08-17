# Frontend Setup

## 1. Install dependencies
```bash
cd frontend
npm install
```

## 2. Configure environment
```bash
cp .env.example .env
```
Set `VITE_API_BASE_URL` to point at the backend (default `http://localhost:4000/api` matches the backend's default `.env.example`).

## 3. Run
```bash
npm run dev
```
Opens on `http://localhost:5173`. This must match `APP_ORIGIN` in the backend's `.env` (used for CORS and OAuth redirect targets).

## 4. Build for production
```bash
npm run build
```
Outputs static files to `dist/` — serve with any static host (Vercel, Netlify, nginx, S3+CloudFront, etc). Since the backend issues httpOnly cookies scoped by `COOKIE_DOMAIN`, the frontend and backend should share a parent domain in production (e.g. `app.example.com` and `api.example.com` with `COOKIE_DOMAIN=.example.com`), or you'll need to adjust the cookie `sameSite`/`domain` settings.
