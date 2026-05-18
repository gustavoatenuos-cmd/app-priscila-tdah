-- ============================================================
-- TDAH Constante — Pagamentos Stripe (cartão + Pix)
-- Adiciona campos de assinatura à tabela profiles e tabelas auxiliares.
-- ============================================================

-- 1. Colunas em profiles para gerenciar a assinatura Stripe.
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT,
  -- 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | null
  ADD COLUMN IF NOT EXISTS plan TEXT,
  -- 'monthly' | 'yearly' | null
  ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx
  ON profiles(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

-- 2. payment_events: log auditável de eventos do Stripe (idempotência).
-- O webhook usa o event.id como chave única para não processar duas vezes.
CREATE TABLE IF NOT EXISTS payment_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_customer_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS payment_events_user_idx ON payment_events(user_id);
CREATE INDEX IF NOT EXISTS payment_events_customer_idx ON payment_events(stripe_customer_id);
CREATE INDEX IF NOT EXISTS payment_events_type_idx ON payment_events(event_type);

-- Sem RLS aqui — a tabela é só servidor (service role).
-- O cliente nunca lê payment_events.

-- 3. Helper: começar trial automaticamente no signup.
-- 30 dias grátis, sem cartão. Quando criar checkout, o Stripe respeita esse fim de trial.
CREATE OR REPLACE FUNCTION init_user_trial()
RETURNS TRIGGER AS $$
BEGIN
  -- Se ainda não tem trial e ainda não é premium
  IF NEW.trial_ends_at IS NULL AND COALESCE(NEW.is_premium, FALSE) = FALSE THEN
    NEW.trial_ends_at := NOW() + INTERVAL '30 days';
    NEW.subscription_status := 'trialing';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_init_trial ON profiles;
CREATE TRIGGER profiles_init_trial
  BEFORE INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION init_user_trial();

-- 4. Atualiza perfis existentes que ainda não têm trial.
UPDATE profiles
SET trial_ends_at = COALESCE(trial_ends_at, NOW() + INTERVAL '30 days'),
    subscription_status = COALESCE(subscription_status,
      CASE WHEN is_premium THEN 'active' ELSE 'trialing' END)
WHERE trial_ends_at IS NULL;
