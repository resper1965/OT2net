-- Script SQL para criar buckets no Supabase Storage
-- Executar no Supabase SQL Editor ou via Supabase Dashboard

-- Nota: Buckets devem ser criados via Supabase Dashboard ou API
-- Este script é apenas para referência das configurações recomendadas

-- Buckets a criar:
-- 1. documentos - Documentos do projeto (PDFs, DOCX)
-- 2. questionarios - Anexos de questionários
-- 3. evidencias - Evidências de conformidade
-- 4. diagramas - Diagramas Mermaid exportados

-- Como criar via Dashboard:
-- 1. Acesse: https://app.supabase.com/project/hyeifxvxifhrapfdvfry/storage/buckets
-- 2. Clique em "New bucket"
-- 3. Configure cada bucket:

-- Bucket: documentos
-- - Name: documentos
-- - Public bucket: false (privado)
-- - File size limit: 50 MB
-- - Allowed MIME types: application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document

-- Bucket: questionarios
-- - Name: questionarios
-- - Public bucket: false (privado)
-- - File size limit: 10 MB
-- - Allowed MIME types: (deixe vazio para permitir todos)

-- Bucket: evidencias
-- - Name: evidencias
-- - Public bucket: false (privado)
-- - File size limit: 50 MB
-- - Allowed MIME types: (deixe vazio para permitir todos)

-- Bucket: diagramas
-- - Name: diagramas
-- - Public bucket: false (privado)
-- - File size limit: 5 MB
-- - Allowed MIME types: image/png,image/svg+xml,image/jpeg

-- RLS Policies serão criadas separadamente (ver docs/supabase-storage-setup.md)

