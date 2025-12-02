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

### 1. Connection Strings do Prisma

1. Acesse: https://app.supabase.com/project/hyeifxvxifhrapfdvfry/settings/database
2. Copie:
   - **Connection pooling** (Transaction mode) → `DATABASE_URL`
   - **Direct connection** → `DIRECT_URL`
3. Adicione em `backend/.env.local`

### 2. Criar Buckets de Storage

1. Acesse: https://app.supabase.com/project/hyeifxvxifhrapfdvfry/storage/buckets
2. Criar buckets:
   - `documentos` (privado, 50 MB)
   - `questionarios` (privado, 10 MB)
   - `evidencias` (privado, 50 MB)
   - `diagramas` (privado, 5 MB)

Ou execute o script SQL: `backend/scripts/create-storage-buckets.sql`

### 3. Configurar RLS Policies para Storage

Execute: `backend/scripts/create-storage-rls-policies.sql` no Supabase SQL Editor

### 4. Habilitar Realtime

Execute: `backend/scripts/enable-realtime.sql` no Supabase SQL Editor

### 5. Criar Índice HNSW

Execute: `backend/scripts/create-hnsw-index.sql` no Supabase SQL Editor

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

