-- ============================================================
-- TDAH Constante — Migração Planner Terapêutico
-- ============================================================

-- 1. TABELA THERAPEUTIC_PLANS
-- Armazena o planejamento estruturado mensal e semanal
CREATE TABLE IF NOT EXISTS therapeutic_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'monthly' | 'weekly'
  period_identifier TEXT NOT NULL, -- Ex: '2024-05' ou '2024-W20'
  data JSONB NOT NULL DEFAULT '{}'::jsonb, -- { priorities: [], habits: [], draining_tasks: [], forgettings: [], delegatable: [] }
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS therapeutic_plans_user_id_idx ON therapeutic_plans(user_id);
CREATE INDEX IF NOT EXISTS therapeutic_plans_type_idx ON therapeutic_plans(type);

-- 2. TABELA EXERCISE_LOGS
-- Registra o progresso nos exercícios terapêuticos diários
CREATE TABLE IF NOT EXISTS exercise_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_id TEXT NOT NULL,
  category TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS exercise_logs_user_id_idx ON exercise_logs(user_id);

-- 3. TABELA REFLECTIONS
-- Respostas de fechamento e reflexão
CREATE TABLE IF NOT EXISTS reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  period_type TEXT NOT NULL, -- 'weekly' | 'monthly'
  responses JSONB NOT NULL DEFAULT '{}'::jsonb, -- { constant: "", new: "", forward: "", leave_behind: "" }
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS reflections_user_id_idx ON reflections(user_id);

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE therapeutic_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
DROP POLICY IF EXISTS "Users can manage own therapeutic_plans" ON therapeutic_plans;
CREATE POLICY "Users can manage own therapeutic_plans" ON therapeutic_plans FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own exercise_logs" ON exercise_logs;
CREATE POLICY "Users can manage own exercise_logs" ON exercise_logs FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own reflections" ON reflections;
CREATE POLICY "Users can manage own reflections" ON reflections FOR ALL USING (auth.uid() = user_id);
