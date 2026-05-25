-- Adiciona coluna onboarding_completed na tabela profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Marca como concluído quem já tem perfil preenchido (usuários existentes)
UPDATE profiles
SET onboarding_completed = TRUE
WHERE interaction_tone IS NOT NULL AND interaction_tone != '';
