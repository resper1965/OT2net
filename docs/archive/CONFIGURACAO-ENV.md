# 🔧 Configuração de Variáveis de Ambiente

**Data**: 2025-01-27

## ✅ Frontend - Configurado

**Arquivo**: `frontend/.env.local`

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://qaekhnagfzpwprvaxqwt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_hbperspgh1KUnMYUn_RmOA_VNrEspo7
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_hbperspgh1KUnMYUn_RmOA_VNrEspo7

# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Status**: ✅ Criado

## ⏳ Backend - Pendente

**Arquivo**: `backend/.env.local`

**Variáveis necessárias**:

```bash
# Database (obter do Supabase Dashboard)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Supabase
SUPABASE_URL="https://qaekhnagfzpwprvaxqwt.supabase.co"
SUPABASE_ANON_KEY="sb_publishable_hbperspgh1KUnMYUn_RmOA_VNrEspo7"
SUPABASE_SERVICE_ROLE_KEY="[obter no painel do Supabase]"

# Anthropic (Claude API)
ANTHROPIC_API_KEY="[sua chave da API]"

# API
PORT=3001
NODE_ENV=development
```

**Como obter DATABASE_URL e DIRECT_URL**:
1. Acesse: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt/settings/database
2. Role até "Connection string"
3. Copie:
   - **Connection pooling** → `DATABASE_URL`
   - **Direct connection** → `DIRECT_URL`

**Como obter SUPABASE_SERVICE_ROLE_KEY**:
1. Acesse: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt/settings/api
2. Role até "Project API keys"
3. Copie **Service Role Key** (secret)

## 📋 Checklist

- [x] Frontend `.env.local` criado
- [ ] Backend `.env.local` criado (aguardando connection strings)
- [ ] Executar seeds após configurar backend
- [ ] Testar sistema localmente

## 🔍 Verificação

Para verificar se as variáveis estão configuradas:

**Frontend**:
```bash
cd frontend
cat .env.local
```

**Backend**:
```bash
cd backend
cat .env.local
```

## ⚠️ Nota

O projeto Supabase configurado é diferente do anterior:
- **Anterior**: `hyeifxvxifhrapfdvfry.supabase.co`
- **Atual**: `qaekhnagfzpwprvaxqwt.supabase.co`

Certifique-se de que as migrations e seeds foram executados no projeto correto.

---

**Última atualização**: 2025-01-27

