# Setup Completo - Checklist Final

Este documento lista todos os passos necessários para completar o setup do projeto OT2net.

## ✅ Fase 1: Setup Inicial (COMPLETO)

- [x] Repositório Git inicializado
- [x] Frontend Next.js configurado
- [x] Backend Express configurado
- [x] Prisma configurado
- [x] Variáveis de ambiente configuradas
- [x] Docker Compose para Redis

## ✅ Fase 2: Foundation (COMPLETO)

- [x] Schema Prisma completo
- [x] Índices de performance
- [x] Seeds básicos
- [x] Autenticação Supabase
- [x] Sistema de permissões
- [x] Middleware completo
- [x] Integração Claude API
- [x] Serviços de vetorização, storage e realtime

## ⏳ Configuração Manual no Supabase

### ✅ 1. Buckets de Storage (CONCLUÍDO)

Os buckets foram criados via MCP:
- ✅ `documentos` (privado, 50 MB) - PDFs e DOCX
- ✅ `questionarios` (privado, 10 MB) - Anexos de questionários
- ✅ `evidencias` (privado, 50 MB) - Evidências de conformidade
- ✅ `diagramas` (privado, 5 MB) - Diagramas Mermaid exportados

### ✅ 2. RLS Policies de Storage (CONCLUÍDO)

As policies foram criadas via migration:
- ✅ Policies para bucket `documentos` (upload, read, update, delete)
- ✅ Policies para bucket `questionarios` (upload, read)
- ✅ Policies para bucket `evidencias` (upload, read)
- ✅ Policies para bucket `diagramas` (upload, read)

### ✅ 3. Realtime Habilitado (CONCLUÍDO)

As seguintes tabelas estão habilitadas para Realtime:
- ✅ `chamadas_ia` - Notificações de processamento IA
- ✅ `iniciativas` - Updates de progresso e status
- ✅ `processos_normalizados` - Status de processamento
- ✅ `projetos` - Updates de progresso geral
- ✅ `respostas_questionario` - Novas respostas

### ✅ 4. Índice HNSW Criado (CONCLUÍDO)

- ✅ Índice `requisitos_framework_embedding_idx` criado para busca semântica

### ⏳ 5. Connection Strings do Prisma (PENDENTE)

1. Acesse: https://app.supabase.com/project/hyeifxvxifhrapfdvfry/settings/database
2. Copie:
   - **Connection pooling** (Transaction mode) → `DATABASE_URL`
   - **Direct connection** → `DIRECT_URL`
3. Adicione em `backend/.env.local`:
   ```env
   DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
   DIRECT_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
   ```
4. Copie também o arquivo `.env.example` para `.env.local`:
   ```bash
   cd backend
   cp .env.example .env.local
   # Edite .env.local e adicione as connection strings
   ```

### 6. Importar Frameworks Regulatórios

```bash
cd backend
npm run scripts:import-frameworks
```

## ⏳ Configuração na Vercel

### 1. Variáveis de Ambiente

No painel da Vercel, adicione:

**Frontend:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Backend (Serverless Functions):**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `DIRECT_URL`
- `ANTHROPIC_API_KEY`
- `REDIS_URL` (se usar Redis externo)

### 2. Deploy

- Push para `main` faz deploy automático
- Ou deploy manual via Vercel Dashboard

## 📋 Próximos Passos

Após completar o setup:

1. **Executar migrations do Prisma** (quando tiver DATABASE_URL):
   ```bash
   cd backend
   npm run prisma:migrate
   ```

2. **Popular banco com seeds**:
   ```bash
   npm run prisma:seed
   ```

3. **Importar frameworks regulatórios**:
   ```bash
   npm run scripts:import-frameworks
   ```

4. **Vetorizar requisitos** (quando implementar geração de embeddings):
   - Configurar serviço de embeddings (OpenAI, Cohere, etc.)
   - Executar vetorização em lote

5. **Começar implementação de User Stories** (Fase 3)

## 🎯 Status Atual

**Fase 1**: ✅ 100% Completo
**Fase 2**: ✅ 100% Completo
**Configuração Manual**: ⏳ Pendente (scripts criados)
**Fase 3**: ⏳ Pronto para começar

## 📚 Documentação

Toda documentação está em `docs/`:
- Setup e configuração
- Uso de serviços
- Deploy
- Troubleshooting



