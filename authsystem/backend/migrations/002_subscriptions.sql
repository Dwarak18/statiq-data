-- ==============================================================================
-- 002_subscriptions.sql
-- STATIQONE Tiered Subscriptions & Payment Gateways Schema Migration
-- Defines subscription tiers, quotas, subscriptions, and transaction invoices.
-- ==============================================================================

-- 1. Create Enums if they do not already exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_tier_enum') THEN
    CREATE TYPE subscription_tier_enum AS ENUM ('free', 'monthly', 'annual');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status_enum') THEN
    CREATE TYPE subscription_status_enum AS ENUM ('active', 'past_due', 'canceled', 'expired');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_gateway_enum') THEN
    CREATE TYPE payment_gateway_enum AS ENUM ('razorpay', 'ccavenue', 'paypal', 'system');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_status_enum') THEN
    CREATE TYPE invoice_status_enum AS ENUM ('pending', 'paid', 'failed', 'refunded');
  END IF;
END $$;

-- 2. Alter users table for subscription metadata and PDF quotas
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS subscription_tier subscription_tier_enum NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status subscription_status_enum NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS monthly_pdf_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pdf_count_reset_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users (subscription_tier);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users (subscription_status);

-- 3. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier subscription_tier_enum NOT NULL,
  status subscription_status_enum NOT NULL DEFAULT 'active',
  currency VARCHAR(3) NOT NULL,            -- 'INR' or 'USD'
  amount_cents INT NOT NULL,                -- 99900 (paise) or 1200 (cents)
  billing_interval VARCHAR(10) NOT NULL,    -- 'monthly' or 'annual'
  gateway payment_gateway_enum NOT NULL,
  gateway_customer_id TEXT,
  gateway_subscription_id TEXT,
  gateway_order_id TEXT,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions (status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_gateway ON subscriptions (gateway, gateway_subscription_id);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_subscriptions_updated_at'
  ) THEN
    CREATE TRIGGER trg_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

-- 4. Invoices & Transactions Table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. INV-202608-4FA8
  amount_cents INT NOT NULL,
  currency VARCHAR(3) NOT NULL,
  tier subscription_tier_enum NOT NULL,
  status invoice_status_enum NOT NULL DEFAULT 'pending',
  gateway payment_gateway_enum NOT NULL,
  gateway_order_id TEXT,
  gateway_payment_id TEXT,
  gateway_signature TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices (user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_gateway_order ON invoices (gateway, gateway_order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices (status);
