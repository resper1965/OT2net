-- Script SQL para criar índice HNSW no Supabase
-- Executar no Supabase SQL Editor

-- Criar índice HNSW para busca rápida de embeddings
-- HNSW (Hierarchical Navigable Small World) é um índice especializado para busca vetorial

CREATE INDEX IF NOT EXISTS requisitos_framework_embedding_idx
ON requisitos_framework
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Parâmetros:
-- m = 16: Número de conexões bidirecionais (maior = mais preciso, mais lento)
-- ef_construction = 64: Tamanho da lista dinâmica durante construção

-- Verificar se o índice foi criado
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'requisitos_framework'
AND indexname = 'requisitos_framework_embedding_idx';

-- Nota: A criação do índice pode demorar dependendo do número de registros
-- Para grandes volumes, considere criar o índice em horário de baixo tráfego



