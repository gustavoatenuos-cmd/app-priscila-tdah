-- Adiciona colunas do onboarding na tabela profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS life_friction_areas TEXT[] DEFAULT '{}';

-- Marca como concluido quem ja tem perfil preenchido (usuarios existentes)
UPDATE profiles
SET onboarding_completed = TRUE
WHERE interaction_tone IS NOT NULL AND interaction_tone != '';
