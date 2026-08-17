# Backend Setup

## 1. Install dependencies
```bash
cd backend
npm install
```

## 2. Configure environment
```bash
cp .env.example .env
```
Fill in `.env`:
- `DATABASE_URL` — your PostgreSQL connection string
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — run `openssl rand -hex 64` for each (must be different)
- `PII_ENCRYPTION_KEY`, `PII_HMAC_KEY` — run `openssl rand -hex 32` for each (must be different from each other and from the JWT secrets)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → OAuth 2.0 Client ID → Web application. Add `http://localhost:4000/api/auth/google/callback` as an authorized redirect URI.
- `MICROSOFT_CLIENT_ID` / `MICROSOFT_CLIENT_SECRET` — from [Azure Portal](https://portal.azure.com) → App registrations → New registration. Add `http://localhost:4000/api/auth/microsoft/callback` as a redirect URI (platform: Web). Create a client secret under "Certificates & secrets".

## 3. Create the database and run migrations
```bash
createdb authdb   # or use your existing Postgres instance
npm run migrate
```

## 4. Start the server
```bash
npm run dev    # auto-restart on changes
# or
npm start
```
Health check: `curl http://localhost:4000/api/health`

## 5. Create your first admin
Sign up a normal account through the frontend, then run:
```bash
node scripts/promote-admin.js you@example.com
```

## Rotating secrets in production
Because `refresh_tokens` are stored only as SHA-256 hashes and `email_hash` is an HMAC keyed by `PII_HMAC_KEY`, **rotating `PII_HMAC_KEY` invalidates every existing login lookup** (users would still exist but couldn't be found by email). If you ever need to rotate it, plan a migration that re-computes `email_hash` for all rows using the old key to decrypt (`PII_ENCRYPTION_KEY` is independent and can be rotated separately with a similar re-encryption migration).
