-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE auth_provider AS ENUM ('local', 'google', 'microsoft');

CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Email is stored two ways: see README "Why encrypted at rest AND a hash column?"
    email_encrypted     TEXT NOT NULL,        -- AES-256-GCM ciphertext (base64: iv.tag.ciphertext)
    email_hash          CHAR(64) NOT NULL,    -- HMAC-SHA256(normalized email), hex, used for lookups
    email_last4         VARCHAR(8) NOT NULL,  -- last 4 chars of the email domain-safe display hint, e.g. for UI ("...@gmail.com") - optional convenience, non-sensitive

    -- Display name is also PII; encrypted the same way. Nullable (OAuth may not provide one).
    display_name_encrypted TEXT,

    -- Password auth (NULL for OAuth-only accounts)
    password_hash       TEXT,

    -- OAuth linkage
    provider             auth_provider NOT NULL DEFAULT 'local',
    provider_account_id  TEXT,                -- the 'sub'/'id' returned by the OAuth provider

    role                 user_role NOT NULL DEFAULT 'user',

    is_email_verified    BOOLEAN NOT NULL DEFAULT FALSE,
    is_active             BOOLEAN NOT NULL DEFAULT TRUE,
    failed_login_attempts SMALLINT NOT NULL DEFAULT 0,
    locked_until          TIMESTAMPTZ,

    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- One account per email regardless of how many provider rows point at it
    CONSTRAINT uq_users_email_hash UNIQUE (email_hash),
    -- One account per (provider, provider_account_id) pair
    CONSTRAINT uq_users_provider_account UNIQUE (provider, provider_account_id)
);

CREATE INDEX idx_users_email_hash ON users (email_hash);
CREATE INDEX idx_users_provider_account ON users (provider, provider_account_id);

-- Refresh tokens are stored hashed (SHA-256) so a DB leak doesn't hand out live sessions.
-- Rotated on every use ("refresh token rotation") and can be revoked individually or by user.
CREATE TABLE refresh_tokens (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash    CHAR(64) NOT NULL UNIQUE, -- SHA-256 hex of the raw refresh token
    user_agent    TEXT,
    ip_address    INET,
    expires_at    TIMESTAMPTZ NOT NULL,
    revoked_at    TIMESTAMPTZ,
    replaced_by   UUID REFERENCES refresh_tokens(id),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens (token_hash);

-- Trigger to keep updated_at current
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Seed a bootstrap admin flag is intentionally NOT done here with a real password.
-- Promote a user to admin after signup, e.g.:
--   UPDATE users SET role = 'admin' WHERE email_hash = encode(hmac(lower('you@example.com'), '<PII_HMAC_KEY as bytes>', 'sha256'), 'hex');
-- In practice, use the provided `scripts/promote-admin.js` instead of doing this by hand.
