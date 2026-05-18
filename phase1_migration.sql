-- ============================================================
-- TDAH Constante — Fase 1 Migration
-- Execute no SQL Editor do Supabase
-- ============================================================

-- 1. Tabela de presença diária (365 dias)
CREATE TABLE IF NOT EXISTS presenca_diaria (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dia_numero INTEGER NOT NULL CHECK (dia_numero >= 1 AND dia_numero <= 365),
  completado BOOLEAN DEFAULT FALSE,
  completado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, dia_numero)
);

CREATE INDEX IF NOT EXISTS presenca_diaria_user_idx ON presenca_diaria(user_id);

-- RLS
ALTER TABLE presenca_diaria ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own presenca" ON presenca_diaria;
CREATE POLICY "Users manage own presenca" ON presenca_diaria
  FOR ALL USING (auth.uid() = user_id);

-- 2. Tabela de constância (registra cada dia que a pessoa apareceu)
CREATE TABLE IF NOT EXISTS constancia (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  apareceu BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, data)
);

CREATE INDEX IF NOT EXISTS constancia_user_idx ON constancia(user_id);
CREATE INDEX IF NOT EXISTS constancia_data_idx ON constancia(data);

-- RLS
ALTER TABLE constancia ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own constancia" ON constancia;
CREATE POLICY "Users manage own constancia" ON constancia
  FOR ALL USING (auth.uid() = user_id);
