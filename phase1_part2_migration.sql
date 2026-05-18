-- ============================================================
-- TDAH Constante — Fase 1 Part 2 Migration
-- Execute no SQL Editor do Supabase
-- ============================================================

-- 1. Tabela de Tarefas Diárias
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dia_numero INTEGER NOT NULL CHECK (dia_numero >= 1 AND dia_numero <= 365),
  task_number INTEGER NOT NULL CHECK (task_number >= 1 AND task_number <= 3),
  description TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, dia_numero, task_number)
);

CREATE INDEX IF NOT EXISTS tasks_user_idx ON tasks(user_id);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own tasks" ON tasks;
CREATE POLICY "Users manage own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);

-- 2. Tabela de Check Emocional
CREATE TABLE IF NOT EXISTS emotional_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dia_numero INTEGER NOT NULL CHECK (dia_numero >= 1 AND dia_numero <= 365),
  level INTEGER NOT NULL CHECK (level >= 0 AND level <= 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, dia_numero)
);

CREATE INDEX IF NOT EXISTS emotional_checks_user_idx ON emotional_checks(user_id);

ALTER TABLE emotional_checks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own emotional checks" ON emotional_checks;
CREATE POLICY "Users manage own emotional checks" ON emotional_checks
  FOR ALL USING (auth.uid() = user_id);
