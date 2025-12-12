-- Migration: Consolidate Stakeholder into MembroEquipe
-- This migration combines the stakeholder and membros_equipe tables

-- Step 1: Add new columns to membros_equipe
ALTER TABLE membros_equipe
  ADD COLUMN IF NOT EXISTS organizacao_id UUID,
  ADD COLUMN IF NOT EXISTS nome TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS cargo TEXT,
  ADD COLUMN IF NOT EXISTS departamento TEXT,
  ADD COLUMN IF NOT EXISTS telefone TEXT,
  ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'EQUIPE_INTERNA',
  ADD COLUMN IF NOT EXISTS poder_influencia TEXT,
  ADD COLUMN IF NOT EXISTS nivel_interesse TEXT,
  ADD COLUMN IF NOT EXISTS estrategia_engajamento TEXT,
  ADD COLUMN IF NOT EXISTS expertise TEXT,
  ADD COLUMN IF NOT EXISTS localizacao TEXT,
  ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS observacoes TEXT;

-- Step 2: Change consultado and informado from TEXT to BOOLEAN
ALTER TABLE membros_equipe
  ALTER COLUMN consultado TYPE BOOLEAN USING (consultado IS NOT NULL AND consultado != ''),
  ALTER COLUMN consultado SET DEFAULT false,
  ALTER COLUMN informado TYPE BOOLEAN USING (informado IS NOT NULL AND informado != ''),
  ALTER COLUMN informado SET DEFAULT false;

-- Step 3: Migrate data from stakeholders to membros_equipe
INSERT INTO membros_equipe (
  id,
  tenant_id,
  projeto_id,
  organizacao_id,
  nome,
  email,
  cargo,
  telefone,
  tipo,
  papel,
  poder_influencia,
  expertise,
  localizacao,
  created_at,
  updated_at
)
SELECT 
  id,
  tenant_id,
  projeto_id,
  NULL as organizacao_id, -- stakeholders were only linked to projects
  COALESCE(identificacao_pessoal->>'nome', 'N/A') as nome,
  COALESCE(contatos->>'email', identificacao_pessoal->>'email') as email,
  COALESCE(vinculo_profissional->>'cargo', identificacao_pessoal->>'cargo') as cargo,
  contatos->>'telefone' as telefone,
  'STAKEHOLDER_EXTERNO' as tipo,
  papel_no_projeto as papel,
  poder_influencia,
  expertise,
  localizacao,
  created_at,
  updated_at
FROM stakeholders
WHERE NOT EXISTS (
  SELECT 1 FROM membros_equipe me WHERE me.id = stakeholders.id
);

-- Step 4: Add foreign key constraints
ALTER TABLE membros_equipe
  ADD CONSTRAINT fk_membros_equipe_organizacao 
  FOREIGN KEY (organizacao_id) REFERENCES organizacoes(id) ON DELETE CASCADE;

-- Step 5: Add indexes
CREATE INDEX IF NOT EXISTS idx_membros_equipe_organizacao_id ON membros_equipe(organizacao_id);
CREATE INDEX IF NOT EXISTS idx_membros_equipe_tipo ON membros_equipe(tipo);

-- Step 6: Drop stakeholders table
DROP TABLE IF EXISTS stakeholders CASCADE;

-- Step 7: Update nome to be NOT NULL after migration
ALTER TABLE membros_equipe
  ALTER COLUMN nome SET NOT NULL;
