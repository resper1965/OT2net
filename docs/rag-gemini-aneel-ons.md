# RAG com Gemini - Regras ANEEL, ONS e Normas BPMN 2.0

Esta documentação descreve a implementação do sistema de RAG (Retrieval-Augmented Generation) usando Google Gemini para inferir e consultar:
- Regras regulatórias da **ANEEL** (Agência Nacional de Energia Elétrica) e **ONS** (Operador Nacional do Sistema Elétrico) relacionadas a redes operativas
- Normas e especificações do **BPMN 2.0** (Business Process Model and Notation 2.0)

## Visão Geral

O sistema RAG permite:
- **Armazenar** regras regulatórias (ANEEL/ONS) e normas (BPMN 2.0) de forma vetorizada
- **Buscar** regras/normas similares usando busca semântica
- **Consultar** regras/normas de forma natural usando linguagem natural
- **Gerar respostas** contextualizadas baseadas nas regras/normas encontradas

## Arquitetura

### Componentes

1. **GeminiService** (`backend/src/services/gemini.ts`)
   - Integração com Google Gemini API
   - Geração de embeddings
   - Processamento de mensagens

2. **RAGService** (`backend/src/services/rag-service.ts`)
   - Gerenciamento de regras regulatórias
   - Busca semântica usando pgvector
   - Consulta RAG com contexto

3. **Rotas API** (`backend/src/routes/rag.ts`)
   - Endpoints REST para consultar e gerenciar regras

4. **Schema Prisma** (`backend/prisma/schema.prisma`)
   - Tabela `requisitos_framework` para armazenar regras
   - Suporte a embeddings via pgvector

## Configuração

### Variáveis de Ambiente

Adicione as seguintes variáveis ao arquivo `.env.local` do backend:

```env
# Google Gemini API
GEMINI_API_KEY=sua_chave_api_gemini_aqui

# Opcional: Usar Vertex AI para embeddings (mais preciso)
GEMINI_USE_VERTEX_AI=false

# Opcional: Usar OpenAI para embeddings como fallback
OPENAI_API_KEY=sua_chave_openai_aqui
```

### Obter Chave API do Gemini

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma nova chave API
3. Copie a chave e adicione ao `.env.local`

### Configuração do Banco de Dados

O sistema usa pgvector para busca semântica. Certifique-se de que a extensão está habilitada:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

O schema já está configurado para usar embeddings de 1536 dimensões (compatível com OpenAI) ou 768 dimensões (compatível com Gemini via fallback).

## Uso

### 1. Importar Regras e Normas

Use os scripts de importação para adicionar regras da ANEEL, ONS ou normas BPMN 2.0:

```bash
# Importar regras ANEEL/ONS (exemplos)
cd backend
tsx scripts/importar-regras-aneel-ons.ts data/exemplo-regras-aneel-ons.json

# Importar documentos ONS oficiais (recomendado)
tsx scripts/ingestir-documentos-ons.ts data/ons-documentos-metadados.json

# Importar com download e extração de PDFs (requer pdf-parse)
npm install pdf-parse
tsx scripts/ingestir-documentos-ons.ts data/ons-documentos-metadados.json --download

# Importar normas BPMN 2.0
tsx scripts/importar-regras-aneel-ons.ts data/exemplo-regras-bpmn-2.0.json
```

**Nota**: Para ingestão completa de documentos ONS, veja [Ingestão de Documentos ONS](./INGESTAO-ONS.md)

**Formato do arquivo JSON:**

```json
[
  {
    "framework": "ANEEL" | "ONS" | "BPMN",
    "codigo": "Código da regra/norma",
    "titulo": "Título da regra/norma",
    "descricao": "Descrição completa da regra/norma...",
    "categoria": "Categoria (opcional)",
    "versao": "Versão (opcional)"
  }
]
```

### 2. Consultar Regras via API

#### Consulta RAG (com resposta contextualizada)

```bash
POST /api/rag/consultar
Content-Type: application/json
Authorization: Bearer <token>

{
  "pergunta": "Quais são os requisitos de segurança para redes operativas?",
  "framework": "ANEEL",
  "maxRegras": 5,
  "includeContext": false
}

# Exemplo com BPMN 2.0
{
  "pergunta": "Como modelar tratamento de erros em BPMN?",
  "framework": "BPMN",
  "maxRegras": 5
}
```

**Resposta:**

```json
{
  "sucesso": true,
  "dados": {
    "resposta": "Baseado nas regras da ANEEL, as redes operativas devem...",
    "regrasEncontradas": [
      {
        "id": "uuid",
        "framework": "ANEEL",
        "codigo": "Módulo 3",
        "titulo": "Requisitos de Segurança",
        "similaridade": 0.92
      }
    ],
    "contexto": null
  }
}
```

#### Busca Semântica (apenas busca, sem RAG)

```bash
# Buscar regras ANEEL/ONS
GET /api/rag/buscar?q=segurança redes operativas&framework=ANEEL&limit=10&threshold=0.7
Authorization: Bearer <token>

# Buscar normas BPMN
GET /api/rag/buscar?q=gateways eventos&framework=BPMN&limit=10&threshold=0.7
Authorization: Bearer <token>
```

#### Listar Regras/Normas

```bash
# Listar regras ANEEL
GET /api/rag/regras?framework=ANEEL&limit=50&offset=0
Authorization: Bearer <token>

# Listar normas BPMN
GET /api/rag/regras?framework=BPMN&limit=50&offset=0
Authorization: Bearer <token>

# Listar todas (sem filtro)
GET /api/rag/regras?limit=50&offset=0
Authorization: Bearer <token>
```

#### Adicionar Regra/Norma Manualmente

```bash
POST /api/rag/regras
Content-Type: application/json
Authorization: Bearer <token>

# Exemplo: Regra ANEEL
{
  "framework": "ANEEL",
  "codigo": "Resolução 964/2021",
  "titulo": "Requisitos de Conformidade",
  "descricao": "Descrição completa...",
  "categoria": "Conformidade",
  "versao": "2021"
}

# Exemplo: Norma BPMN
{
  "framework": "BPMN",
  "codigo": "BPMN 2.0 - Seção 10.2",
  "titulo": "Atividades (Activities)",
  "descricao": "Atividades representam trabalho que é executado...",
  "categoria": "Elementos de Processo",
  "versao": "2.0"
}
```

### 3. Re-vetorizar Regra

Se uma regra foi atualizada, você pode re-vetorizá-la:

```bash
POST /api/rag/regras/:id/re-vetorizar
Authorization: Bearer <token>
```

## Embeddings

### Modelos Suportados

O sistema suporta múltiplas opções para geração de embeddings:

1. **OpenAI Embeddings** (recomendado para produção)
   - Modelo: `text-embedding-3-small` (1536 dimensões)
   - Mais preciso e confiável
   - Requer `OPENAI_API_KEY`

2. **Vertex AI Embeddings** (Google Cloud)
   - Mais integrado com Gemini
   - Requer configuração do Vertex AI
   - Ativar com `GEMINI_USE_VERTEX_AI=true`

3. **Fallback Simples** (temporário)
   - Usado quando nenhuma API de embeddings está configurada
   - Baseado em hash do texto
   - **Não recomendado para produção**

### Recomendação

Para produção, configure pelo menos uma das seguintes opções:
- `OPENAI_API_KEY` (mais simples)
- Vertex AI Embeddings (mais integrado)

## Permissões

As rotas requerem as seguintes permissões:

- **Consultar/Buscar/Listar**: `requisito_framework:view`
- **Adicionar/Re-vetorizar**: `requisito_framework:create` / `requisito_framework:update`

## Exemplos de Uso

### Exemplo 1: Consulta sobre Segurança

```javascript
const resposta = await fetch('/api/rag/consultar', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    pergunta: "Quais são os requisitos de cibersegurança para redes operativas?",
    framework: "ANEEL"
  })
})

const dados = await resposta.json()
console.log(dados.dados.resposta)
```

### Exemplo 2: Busca de Regras Específicas

```javascript
// Buscar regras ONS
const resultados = await fetch('/api/rag/buscar?q=comunicação redes&framework=ONS', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

// Buscar normas BPMN
const resultadosBPMN = await fetch('/api/rag/buscar?q=gateways paralelos&framework=BPMN', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

const dados = await resultados.json()
console.log(dados.dados) // Array de regras/normas similares
```

### Exemplo 3: Consulta BPMN 2.0

```javascript
const resposta = await fetch('/api/rag/consultar', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    pergunta: "Como modelar subprocessos reutilizáveis em BPMN 2.0?",
    framework: "BPMN"
  })
})

const dados = await resposta.json()
console.log(dados.dados.resposta) // Resposta contextualizada sobre BPMN
```

## Limitações e Considerações

1. **Embeddings**: O sistema funciona melhor com um serviço de embeddings dedicado (OpenAI ou Vertex AI)

2. **Custo**: Cada consulta RAG gera custos na API do Gemini. Monitore o uso através da tabela `chamadas_ia`

3. **Precisão**: A precisão das respostas depende da qualidade e quantidade de regras importadas

4. **Atualização**: Regras regulatórias mudam frequentemente. Mantenha o sistema atualizado

## Troubleshooting

### Erro: "GEMINI_API_KEY não configurada"
- Verifique se a variável está no `.env.local`
- Reinicie o servidor após adicionar a variável

### Erro: "Erro ao gerar embedding"
- Configure `OPENAI_API_KEY` para usar embeddings mais confiáveis
- Verifique os logs para mais detalhes

### Respostas imprecisas
- Verifique se há regras suficientes no banco
- Ajuste o `threshold` na busca (valores mais baixos = mais resultados)
- Re-vetorize regras atualizadas

## Frameworks Suportados

### ANEEL (Agência Nacional de Energia Elétrica)
- Regras regulatórias sobre redes operativas
- Requisitos de segurança e operação
- Normas técnicas e procedimentos

### ONS (Operador Nacional do Sistema Elétrico)
- Procedimentos de rede
- Requisitos de comunicação
- Coordenação e controle do SIN

### BPMN 2.0 (Business Process Model and Notation 2.0)
- Elementos de modelagem (atividades, eventos, gateways)
- Notação e símbolos BPMN
- Padrões de modelagem e boas práticas
- Semântica e execução de processos
- Subprocessos, transações e compensação

## Próximos Passos

1. **Integração com Fontes Oficiais**: Automatizar importação de regras dos sites da ANEEL e ONS
2. **Importação BPMN**: Integrar com especificação oficial BPMN 2.0
3. **Versionamento**: Implementar controle de versão de regras/normas
4. **Notificações**: Alertar quando novas regras/normas são publicadas
5. **Análise de Conformidade**: Integrar com análise automática de conformidade
6. **Validação de Modelos BPMN**: Criar validador de modelos BPMN baseado nas normas

## Referências

- [Google Gemini API](https://ai.google.dev/docs)
- [pgvector](https://github.com/pgvector/pgvector)
- [ANEEL](https://www.aneel.gov.br/)
- [ONS](https://www.ons.org.br/)

