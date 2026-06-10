-- Campos Pagar.me para assinaturas
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS pagarme_customer_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS pagarme_subscription_id TEXT;

CREATE INDEX IF NOT EXISTS profiles_pagarme_customer_id_idx
  ON profiles(pagarme_customer_id)
  WHERE pagarme_customer_id IS NOT NULL;
