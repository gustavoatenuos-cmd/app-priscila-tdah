-- ============================================================
-- TDAH Constante — Script de Migração Supabase
-- Execute este script no SQL Editor do Supabase
-- ============================================================

-- 1. TABELA PROFILES (Perfil do usuário)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  whatsapp TEXT,
  
  -- Mapeamento Neurocognitivo (Profissional)
  main_struggle TEXT,          -- Executive Dysfunction area
  energy_level TEXT,           -- Cognitive Load (alta/baixa)
  peak_time TEXT,              -- Performance peaks
  interaction_tone TEXT,       -- Support style (acolhedor/direto)
  mindset_profile TEXT,        -- Dominant state (criativa, sobrecarga, hiperfoco)
  
  streak_count INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. TABELA TASKS (Tarefas do Planner)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority_level TEXT DEFAULT 'importante', -- 'essencial' | 'importante' | 'opcional'
  completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON tasks(created_at);

-- 3. TABELA FOCUS_SESSIONS (Sessões de Deep Work)
CREATE TABLE IF NOT EXISTS focus_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  distractions_count INTEGER DEFAULT 0,
  emotion_post_focus TEXT, -- 'leve' | 'focada' | 'cansada'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS focus_sessions_user_id_idx ON focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS focus_sessions_created_at_idx ON focus_sessions(created_at);

-- 4. TABELA BRAIN_DUMP (Descarrego Mental)
CREATE TABLE IF NOT EXISTS brain_dump (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  category TEXT,    -- 'agora' | 'depois' | 'deixar_ir'
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS brain_dump_user_id_idx ON brain_dump(user_id);

-- 5. TABELA JOURNAL_ENTRIES (Diário de Gratidão)
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  gratitude_items TEXT[],   -- Array de 3 itens de gratidão
  learning TEXT,
  reading_book TEXT,
  reading_progress TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS journal_entries_user_id_idx ON journal_entries(user_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — Cada usuário só acessa seus dados
-- ============================================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own tasks" ON tasks;
CREATE POLICY "Users can manage own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);

-- Focus Sessions
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own focus_sessions" ON focus_sessions;
CREATE POLICY "Users can manage own focus_sessions" ON focus_sessions FOR ALL USING (auth.uid() = user_id);

-- Brain Dump
ALTER TABLE brain_dump ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own brain_dump" ON brain_dump;
CREATE POLICY "Users can manage own brain_dump" ON brain_dump FOR ALL USING (auth.uid() = user_id);

-- Journal Entries
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own journal_entries" ON journal_entries;
CREATE POLICY "Users can manage own journal_entries" ON journal_entries FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- FUNÇÃO para criar perfil automático ao registrar novo usuário
-- (Evita o problema de perfil não criado se o frontend falhar)
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  meta_full_name TEXT;
  meta_whatsapp TEXT;
BEGIN
  -- Extração segura de metadados
  IF NEW.raw_user_meta_data IS NOT NULL THEN
    meta_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '');
    meta_whatsapp := NEW.raw_user_meta_data->>'whatsapp';
  ELSE
    meta_full_name := '';
    meta_whatsapp := NULL;
  END IF;

  INSERT INTO public.profiles (id, full_name, email, whatsapp, streak_count, is_premium)
  VALUES (
    NEW.id,
    meta_full_name,
    NEW.email,
    meta_whatsapp,
    0,
    FALSE
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    whatsapp = COALESCE(EXCLUDED.whatsapp, profiles.whatsapp),
    updated_at = NOW();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
