# Implementação RAG com Gemini - Resumo

## ✅ Implementação Concluída

A feature de RAG (Retrieval-Augmented Generation) usando Google Gemini para inferir regras da ANEEL, ONS sobre redes operativas e normas BPMN 2.0 foi implementada com sucesso.

## 📦 Componentes Criados

### 1. Serviços

- **`backend/src/services/gemini.ts`**
  - Integração com Google Gemini API
  - Geração de embeddings (com fallback para OpenAI ou método simples)
  - Processamento de mensagens com retry e logging

- **`backend/src/services/rag-service.ts`**
  - Gerenciamento de regras regulatórias (ANEEL/ONS) e normas (BPMN 2.0)
  - Busca semântica usando pgvector
  - Consulta RAG com contexto (adaptado por framework)
  - Importação e vetorização de regras/normas

### 2. Rotas API

- **`backend/src/routes/rag.ts`**
  - `POST /api/rag/consultar` - Consulta RAG com resposta contextualizada
  - `GET /api/rag/buscar` - Busca semântica de regras
  - `GET /api/rag/regras` - Lista regras
  - `POST /api/rag/regras` - Adiciona regra
  - `POST /api/rag/regras/:id/re-vetorizar` - Re-vetoriza regra
  - `POST /api/rag/regras/batch` - Processa regras em lote

### 3. Scripts

- **`backend/scripts/importar-regras-aneel-ons.ts`**
  - Script para importar regras de arquivo JSON
  - Validação e processamento em lote

- **`backend/data/exemplo-regras-aneel-ons.json`**
  - Arquivo de exemplo com regras da ANEEL e ONS
- **`backend/data/exemplo-regras-bpmn-2.0.json`**
  - Arquivo de exemplo com normas BPMN 2.0

### 4. Documentação

- **`docs/rag-gemini-aneel-ons.md`** - Documentação completa da feature
- **`docs/env-setup.md`** - Atualizado com variáveis do Gemini

## 🔧 Configuração Necessária

### Variáveis de Ambiente

Adicione ao `backend/.env.local`:

```env
# Google Gemini API (obrigatório)
GEMINI_API_KEY=sua_chave_aqui

# Opcional: OpenAI para embeddings mais precisos (recomendado)
OPENAI_API_KEY=sua_chave_openai_aqui

# Opcional: Usar Vertex AI
GEMINI_USE_VERTEX_AI=false
```

### Dependências Instaladas

- `@google/generative-ai` - SDK do Google Gemini

## 🚀 Como Usar

### 1. Importar Regras e Normas

```bash
cd backend

# Importar documentos ONS oficiais (recomendado)
tsx scripts/ingestir-documentos-ons.ts data/ons-documentos-metadados.json

# Importar com download e extração de PDFs (mais completo)
npm install pdf-parse
tsx scripts/ingestir-documentos-ons.ts data/ons-documentos-metadados.json --download

# Importar regras ANEEL/ONS (exemplos)
tsx scripts/importar-regras-aneel-ons.ts data/exemplo-regras-aneel-ons.json

# Importar normas BPMN 2.0
tsx scripts/importar-regras-aneel-ons.ts data/exemplo-regras-bpmn-2.0.json
```

**Nota**: Para detalhes sobre ingestão de documentos ONS, veja [docs/INGESTAO-ONS.md](./INGESTAO-ONS.md)

### 2. Consultar Regras/Normas via API

```bash
# Consultar regras ANEEL/ONS
POST /api/rag/consultar
{
  "pergunta": "Quais são os requisitos de segurança para redes operativas?",
  "framework": "ANEEL"
}

# Consultar normas BPMN 2.0
POST /api/rag/consultar
{
  "pergunta": "Como modelar tratamento de erros em BPMN?",
  "framework": "BPMN"
}
```

### 3. Buscar Regras

```bash
GET /api/rag/buscar?q=segurança redes&framework=ANEEL&limit=10
```

## 📊 Estrutura de Dados

As regras/normas são armazenadas na tabela `requisitos_framework` (já existente no schema Prisma):

- `framework`: "ANEEL", "ONS" ou "BPMN"
- `codigo`: Código da regra/norma
- `titulo`: Título da regra/norma
- `descricao`: Descrição completa
- `categoria`: Categoria (opcional)
- `versao`: Versão (opcional)
- `embedding`: Vetor de embedding (pgvector)

## 🎯 Frameworks Suportados

- **ANEEL**: Regras regulatórias sobre redes operativas
- **ONS**: Procedimentos de rede e coordenação do SIN
- **BPMN 2.0**: Normas e especificações de modelagem de processos

## ⚠️ Observações Importantes

1. **Embeddings**: O sistema funciona melhor com um serviço de embeddings dedicado:
   - **Recomendado**: Configure `OPENAI_API_KEY` para usar embeddings do OpenAI
   - **Alternativa**: Use Vertex AI Embeddings (requer configuração adicional)
   - **Fallback**: Sistema usa método simples baseado em hash (menos preciso)

2. **Dimensões do Embedding**: 
   - O schema atual suporta 1536 dimensões (OpenAI)
   - Para Gemini, pode ser necessário ajustar para 768 dimensões
   - O código atual adapta automaticamente

3. **Custos**: Cada consulta RAG gera custos na API do Gemini. Monitore através da tabela `chamadas_ia`.

## 🔄 Próximos Passos Sugeridos

1. **Integração com Fontes Oficiais**: Automatizar importação de regras dos sites da ANEEL e ONS
2. **Versionamento**: Implementar controle de versão de regras
3. **Notificações**: Alertar quando novas regras são publicadas
4. **Análise de Conformidade**: Integrar com análise automática de conformidade
5. **Interface Web**: Criar interface no frontend para consultar regras

## 📚 Documentação Completa

Veja `docs/rag-gemini-aneel-ons.md` para documentação detalhada.

## ✅ Status

- ✅ Serviço Gemini implementado
- ✅ Serviço RAG implementado
- ✅ Rotas API criadas
- ✅ Script de importação criado
- ✅ Documentação completa
- ✅ Exemplos de uso fornecidos

**Feature pronta para uso!**

