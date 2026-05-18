-- ============================================================
-- TDAH Constante — Companheiro Diário (Mês 1)
-- Pivot ADR-002: app simples e diário, não planner completo.
-- ============================================================

-- 1. user_journey: rastreia em que dia do 365 cada usuária está.
CREATE TABLE IF NOT EXISTS user_journey (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  current_day INTEGER NOT NULL DEFAULT 1,
  last_unlock_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS user_journey_user_id_idx ON user_journey(user_id);

DROP TRIGGER IF EXISTS update_user_journey_updated_at ON user_journey;
CREATE TRIGGER update_user_journey_updated_at
  BEFORE UPDATE ON user_journey
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE user_journey ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_journey self" ON user_journey;
CREATE POLICY "user_journey self" ON user_journey FOR ALL USING (auth.uid() = user_id);

-- 2. day_completions: marca que o usuário viu/concluiu o dia N.
CREATE TABLE IF NOT EXISTS day_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day_index INTEGER NOT NULL CHECK (day_index BETWEEN 1 AND 365),
  did_action BOOLEAN DEFAULT FALSE,
  note TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, day_index)
);
CREATE INDEX IF NOT EXISTS day_completions_user_id_idx ON day_completions(user_id);
ALTER TABLE day_completions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "day_completions self" ON day_completions;
CREATE POLICY "day_completions self" ON day_completions FOR ALL USING (auth.uid() = user_id);

-- 3. daily_tasks: até 3 tarefas/dia (essencial, leve, opcional).
-- Substitui a tabela tasks antiga para o novo modelo; tasks fica em modo legado.
CREATE TABLE IF NOT EXISTS daily_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_date DATE NOT NULL DEFAULT CURRENT_DATE,
  slot TEXT NOT NULL CHECK (slot IN ('essencial','leve','opcional')),
  title TEXT NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  done_minimum BOOLEAN DEFAULT FALSE, -- "fiz mesmo que mínimo"
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, task_date, slot)
);
CREATE INDEX IF NOT EXISTS daily_tasks_user_date_idx ON daily_tasks(user_id, task_date);
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "daily_tasks self" ON daily_tasks;
CREATE POLICY "daily_tasks self" ON daily_tasks FOR ALL USING (auth.uid() = user_id);

-- 4. daily_checkins: humor / energia / fez o mínimo.
CREATE TABLE IF NOT EXISTS daily_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood TEXT CHECK (mood IN ('leve','neutra','pesada','exausta','animada')),
  energy SMALLINT CHECK (energy BETWEEN 1 AND 5),
  did_minimum BOOLEAN,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, checkin_date)
);
CREATE INDEX IF NOT EXISTS daily_checkins_user_date_idx ON daily_checkins(user_id, checkin_date);
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "daily_checkins self" ON daily_checkins;
CREATE POLICY "daily_checkins self" ON daily_checkins FOR ALL USING (auth.uid() = user_id);

-- 5. presence_sessions: registros do "Momento Presença" (2, 5 ou 10 min).
CREATE TABLE IF NOT EXISTS presence_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  duration_minutes SMALLINT NOT NULL CHECK (duration_minutes IN (2,5,10)),
  completed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS presence_sessions_user_idx ON presence_sessions(user_id);
ALTER TABLE presence_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "presence_sessions self" ON presence_sessions;
CREATE POLICY "presence_sessions self" ON presence_sessions FOR ALL USING (auth.uid() = user_id);

-- 6. travei_logs: registra cliques no botão "Travei" e a saída escolhida.
CREATE TABLE IF NOT EXISTS travei_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exit_chosen TEXT CHECK (exit_chosen IN ('um_minuto','respirar','minimo')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS travei_logs_user_idx ON travei_logs(user_id);
ALTER TABLE travei_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "travei_logs self" ON travei_logs;
CREATE POLICY "travei_logs self" ON travei_logs FOR ALL USING (auth.uid() = user_id);

-- 7. recomeco_logs: registra cliques em "Recomeçar".
CREATE TABLE IF NOT EXISTS recomeco_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS recomeco_logs_user_idx ON recomeco_logs(user_id);
ALTER TABLE recomeco_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "recomeco_logs self" ON recomeco_logs;
CREATE POLICY "recomeco_logs self" ON recomeco_logs FOR ALL USING (auth.uid() = user_id);

-- 8. weekly_presence (view): dias da semana em que a usuária apareceu.
CREATE OR REPLACE VIEW weekly_presence AS
WITH presence_dates AS (
  SELECT user_id, checkin_date AS d FROM daily_checkins
  UNION
  SELECT user_id, task_date AS d FROM daily_tasks WHERE done OR done_minimum
  UNION
  SELECT user_id, (completed_at AT TIME ZONE 'America/Sao_Paulo')::date AS d FROM day_completions
  UNION
  SELECT user_id, (created_at AT TIME ZONE 'America/Sao_Paulo')::date AS d FROM presence_sessions
)
SELECT
  user_id,
  date_trunc('week', d)::date AS week_start,
  array_agg(DISTINCT d ORDER BY d) AS present_days
FROM presence_dates
GROUP BY user_id, date_trunc('week', d);

-- 9. user_journey é criada automaticamente no signup.
CREATE OR REPLACE FUNCTION handle_new_user_journey()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_journey (user_id, start_date, current_day)
  VALUES (NEW.id, CURRENT_DATE, 1)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_user_created_make_journey ON auth.users;
CREATE TRIGGER on_user_created_make_journey
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_journey();

-- 10. handle_new_user fix: não sobrescrever full_name em re-auths (bug pré-existente).
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  meta_full_name TEXT;
  meta_whatsapp TEXT;
BEGIN
  IF NEW.raw_user_meta_data IS NOT NULL THEN
    meta_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '');
    meta_whatsapp := NEW.raw_user_meta_data->>'whatsapp';
  ELSE
    meta_full_name := '';
    meta_whatsapp := NULL;
  END IF;

  INSERT INTO public.profiles (id, full_name, email, whatsapp, streak_count, is_premium)
  VALUES (NEW.id, meta_full_name, NEW.email, meta_whatsapp, 0, FALSE)
  ON CONFLICT (id) DO UPDATE SET
    -- Só atualiza full_name se o atual está vazio (evita sobrescrever em re-auth)
    full_name = CASE
      WHEN profiles.full_name IS NULL OR profiles.full_name = ''
        THEN EXCLUDED.full_name
        ELSE profiles.full_name
      END,
    whatsapp = COALESCE(profiles.whatsapp, EXCLUDED.whatsapp),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
