# Full-Stack Auth System

Production-grade authentication system.

- **Backend:** Node.js + Express + PostgreSQL (raw SQL via `pg`, no ORM magic to obscure the queries)
- **Frontend:** React + Vite + Tailwind CSS
- **Password hashing:** Argon2id
- **Email/username at rest:** AES-256-GCM (reversible) + a separate HMAC-SHA256 blind index for lookups
- **Sessions:** short-lived JWT access token (httpOnly cookie) + long-lived rotating refresh token (httpOnly cookie, hashed in DB, revocable)
- **OAuth:** Google OAuth 2.0 and Microsoft OAuth 2.0 (Azure AD v2 endpoint) via Passport
- **Authorization:** `user` / `admin` roles enforced by middleware

See `backend/README.md` and `frontend/README.md` for setup instructions.

## Why "encrypted at rest" AND a hash column?

AES-256-GCM with a random IV produces different ciphertext every time you encrypt the same email — that's a security feature (it defeats pattern analysis), but it also means you **cannot** do `WHERE email_encrypted = ?` to log a user in. So this system stores two things per identity field:

1. `email_encrypted` — AES-256-GCM ciphertext, decrypted only when the app needs to display/use the real value (e.g. sending mail). This is what protects the data if the DB is exfiltrated.
2. `email_hash` — an HMAC-SHA256 of the normalized (lowercased/trimmed) email, using a **separate secret key**. This is deterministic, so it can be indexed and used for O(1) login lookups, but it's one-way — it can't be reversed to recover the email, and without the HMAC key an attacker can't build a rainbow table against it.

This is the standard pattern for "encrypted but still queryable" PII and is what you should tell anyone who asks why there are two columns for one field.
