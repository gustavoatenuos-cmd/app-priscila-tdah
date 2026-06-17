-- TDAH Constante: Banco de Dados Supabase (Schema Inicial)

-- 1. Criar Tabela Profiles
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name text,
  email text,
  subscription_status text DEFAULT 'inactive'::text,
  trial_ends_at timestamp with time zone,
  stripe_customer_id text,
  asaas_customer_id text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Segurança (O usuário só pode ver e alterar o próprio perfil)
CREATE POLICY "Usuários podem ver o próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar o próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 4. Função para criar perfil automaticamente no Cadastro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, trial_ends_at)
  VALUES (
    new.id, 
    new.email, 
    timezone('utc'::text, now()) + interval '7 days' -- Calcula os 7 dias grátis
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger do Cadastro (Auth)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Exemplo: Criar tabela para o "Descarrego Mental" (Tasks)
CREATE TABLE public.tasks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  is_completed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem suas próprias tasks"
  ON public.tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários criam suas próprias tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários atualizam suas próprias tasks"
  ON public.tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários deletam suas próprias tasks"
  ON public.tasks FOR DELETE
  USING (auth.uid() = user_id);
