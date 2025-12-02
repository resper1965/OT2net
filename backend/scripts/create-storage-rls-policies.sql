-- Script SQL para criar RLS Policies no Supabase Storage
-- Executar no Supabase SQL Editor

-- ============================================
-- Bucket: documentos
-- ============================================

-- Permitir upload apenas para usuários autenticados do projeto
CREATE POLICY "Users can upload project documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documentos' AND
  EXISTS (
    SELECT 1 FROM projetos p
    JOIN membros_equipe me ON me.projeto_id = p.id
    WHERE me.usuario_id = auth.uid()::text
    AND (storage.foldername(name))[1] = p.id::text
  )
);

-- Permitir leitura para membros da equipe do projeto
CREATE POLICY "Team members can read project documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documentos' AND
  EXISTS (
    SELECT 1 FROM projetos p
    JOIN membros_equipe me ON me.projeto_id = p.id
    WHERE me.usuario_id = auth.uid()::text
    AND (storage.foldername(name))[1] = p.id::text
  )
);

-- Permitir atualização para membros da equipe
CREATE POLICY "Team members can update project documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documentos' AND
  EXISTS (
    SELECT 1 FROM projetos p
    JOIN membros_equipe me ON me.projeto_id = p.id
    WHERE me.usuario_id = auth.uid()::text
    AND (storage.foldername(name))[1] = p.id::text
  )
);

-- Permitir deleção para membros da equipe
CREATE POLICY "Team members can delete project documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documentos' AND
  EXISTS (
    SELECT 1 FROM projetos p
    JOIN membros_equipe me ON me.projeto_id = p.id
    WHERE me.usuario_id = auth.uid()::text
    AND (storage.foldername(name))[1] = p.id::text
  )
);

-- ============================================
-- Bucket: questionarios
-- ============================================

CREATE POLICY "Users can upload questionnaire attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'questionarios' AND
  EXISTS (
    SELECT 1 FROM questionarios q
    JOIN projetos p ON p.id = q.projeto_id
    JOIN membros_equipe me ON me.projeto_id = p.id
    WHERE me.usuario_id = auth.uid()::text
    AND (storage.foldername(name))[1] = q.id::text
  )
);

CREATE POLICY "Users can read questionnaire attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'questionarios' AND
  EXISTS (
    SELECT 1 FROM questionarios q
    JOIN projetos p ON p.id = q.projeto_id
    JOIN membros_equipe me ON me.projeto_id = p.id
    WHERE me.usuario_id = auth.uid()::text
    AND (storage.foldername(name))[1] = q.id::text
  )
);

-- ============================================
-- Bucket: evidencias
-- ============================================

CREATE POLICY "Users can upload evidence files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'evidencias' AND
  EXISTS (
    SELECT 1 FROM projetos p
    JOIN membros_equipe me ON me.projeto_id = p.id
    WHERE me.usuario_id = auth.uid()::text
    AND (storage.foldername(name))[1] = p.id::text
  )
);

CREATE POLICY "Users can read evidence files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'evidencias' AND
  EXISTS (
    SELECT 1 FROM projetos p
    JOIN membros_equipe me ON me.projeto_id = p.id
    WHERE me.usuario_id = auth.uid()::text
    AND (storage.foldername(name))[1] = p.id::text
  )
);

-- ============================================
-- Bucket: diagramas
-- ============================================

CREATE POLICY "Users can upload diagrams"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'diagramas' AND
  EXISTS (
    SELECT 1 FROM processos_normalizados pn
    JOIN descricoes_operacionais_raw dor ON dor.id = pn.descricao_raw_id
    JOIN projetos p ON p.id = dor.projeto_id
    JOIN membros_equipe me ON me.projeto_id = p.id
    WHERE me.usuario_id = auth.uid()::text
    AND (storage.foldername(name))[1] = pn.id::text
  )
);

CREATE POLICY "Users can read diagrams"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'diagramas' AND
  EXISTS (
    SELECT 1 FROM processos_normalizados pn
    JOIN descricoes_operacionais_raw dor ON dor.id = pn.descricao_raw_id
    JOIN projetos p ON p.id = dor.projeto_id
    JOIN membros_equipe me ON me.projeto_id = p.id
    WHERE me.usuario_id = auth.uid()::text
    AND (storage.foldername(name))[1] = pn.id::text
  )
);

