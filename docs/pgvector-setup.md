# Configuração pgvector no Supabase

Este documento descreve como configurar e usar pgvector para busca semântica no Supabase.

## Status Atual

✅ **Extensão `vector` já habilitada** no Supabase (verificado via MCP)

## Estrutura do Banco

### Tabela `requisitos_framework`

A tabela já possui o campo `embedding` do tipo `vector(1536)`:

```sql
CREATE TABLE requisitos_framework (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  framework TEXT NOT NULL,
  codigo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  categoria TEXT,
  versao TEXT,
  embedding vector(1536),  -- pgvector para embeddings
  data_vetorizacao TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Índice HNSW (Recomendado)

Para busca rápida, criar índice HNSW:

```sql
-- Criar índice HNSW para busca rápida
CREATE INDEX ON requisitos_framework 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

**Parâmetros:**
- `m = 16`: Número de conexões bidirecionais (maior = mais preciso, mais lento)
- `ef_construction = 64`: Tamanho da lista dinâmica durante construção

## Funções SQL Úteis

### Busca por Similaridade

```sql
-- Buscar requisitos similares (cosine similarity)
SELECT 
  id,
  framework,
  codigo,
  titulo,
  1 - (embedding <=> $1::vector) as similaridade
FROM requisitos_framework
WHERE embedding IS NOT NULL
ORDER BY embedding <=> $1::vector
LIMIT 10;
```

**Operadores pgvector:**
- `<=>`: Distância cosseno (1 - similaridade)
- `<->`: Distância euclidiana
- `<#>`: Distância produto interno negativo

### Função Helper no Supabase

```sql
-- Criar função para busca semântica
CREATE OR REPLACE FUNCTION match_requisitos(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10,
  filter_framework text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  framework text,
  codigo text,
  titulo text,
  descricao text,
  similaridade float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.framework,
    r.codigo,
    r.titulo,
    r.descricao,
    1 - (r.embedding <=> query_embedding) as similaridade
  FROM requisitos_framework r
  WHERE
    r.embedding IS NOT NULL
    AND (1 - (r.embedding <=> query_embedding)) >= match_threshold
    AND (filter_framework IS NULL OR r.framework = filter_framework)
  ORDER BY r.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

## Geração de Embeddings

### Opção 1: OpenAI Embeddings (Recomendado)

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: text,
    dimensions: 1536, // Mesmo tamanho do vector(1536)
  })

  return response.data[0].embedding
}
```

### Opção 2: Cohere Embeddings

```typescript
import { CohereClient } from 'cohere-ai'

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
})

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await cohere.embed({
    texts: [text],
    model: 'embed-english-v3.0',
    inputType: 'search_document',
    embeddingTypes: ['float'],
  })

  return response.embeddings.float[0]
}
```

## Processo de Vetorização

### 1. Importar Requisitos dos Frameworks

```typescript
// Script de importação
const frameworks = [
  { nome: 'REN_964_21', arquivo: 'ren-964-21.json' },
  { nome: 'ONS_RO_CB_BR_01', arquivo: 'ons-ro-cb-br-01.json' },
  // ...
]

for (const framework of frameworks) {
  const requisitos = await loadRequisitos(framework.arquivo)
  
  for (const req of requisitos) {
    // Criar requisito
    const requisito = await prisma.requisitoFramework.create({
      data: {
        framework: framework.nome,
        codigo: req.codigo,
        titulo: req.titulo,
        descricao: req.descricao,
        categoria: req.categoria,
        versao: req.versao,
      },
    })

    // Gerar embedding
    const texto = `${req.titulo}\n\n${req.descricao}`
    const embedding = await generateEmbedding(texto)

    // Atualizar com embedding
    await prisma.$executeRaw`
      UPDATE requisitos_framework
      SET embedding = ${embedding}::vector,
          data_vetorizacao = NOW()
      WHERE id = ${requisito.id}::uuid
    `
  }
}
```

### 2. Vetorização em Lote

```typescript
// Usar VectorService
const requisitos = await prisma.requisitoFramework.findMany({
  where: { embedding: null },
})

const resultados = await VectorService.processarVetorizacaoEmLote(
  requisitos.map((r) => ({
    id: r.id,
    texto: `${r.titulo}\n\n${r.descricao}`,
  })),
  10 // batch size
)
```

## Busca Semântica

### Exemplo de Uso

```typescript
// Buscar requisitos similares a um processo
const processo = await prisma.processoNormalizado.findUnique({
  where: { id: processoId },
})

const texto = `${processo.nome}\n\n${processo.objetivo}`
const embedding = await generateEmbedding(texto)

const similares = await VectorService.buscarRequisitosSimilares(
  embedding,
  10, // limit
  0.7 // threshold
)
```

## Análise de Conformidade

```typescript
// Analisar conformidade de um processo
const analises = await VectorService.analisarConformidade(
  'processo',
  processoId,
  textoDoProcesso
)

// Resultado: Array de AnaliseConformidade com:
// - requisito_id
// - similaridade (0-1)
// - status (atendido, parcialmente_atendido, nao_atendido)
```

## Performance

### Otimizações

1. **Índice HNSW**: Essencial para busca rápida em grandes volumes
2. **Batch Processing**: Processar embeddings em lotes
3. **Caching**: Cachear embeddings gerados
4. **Threshold**: Ajustar threshold para balancear precisão/recall

### Limites

- **Dimensões**: 1536 (compatível com OpenAI text-embedding-3-large)
- **Tamanho máximo**: pgvector suporta até 16.000 dimensões
- **Performance**: HNSW index melhora busca em 100x+

## Referências

- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [Supabase pgvector Guide](https://supabase.com/docs/guides/ai/vector-columns)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [Cohere Embeddings](https://docs.cohere.com/docs/embeddings)

