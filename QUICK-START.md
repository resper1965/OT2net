# 🚀 Quick Start - Próximos Passos

## ⚡ Ação Imediata Necessária

### 1. Obter Connection Strings do Supabase

**URL do Projeto**: https://hyeifxvxifhrapfdvfry.supabase.co

**Chaves disponíveis**:
- **Anon Key (Legacy)**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Publishable Key (Modern)**: `sb_publishable_RMMpXpKBjUDFNQt9_X0aog_GzLv4jzd`

**Para obter DATABASE_URL e DIRECT_URL**:
1. Acesse: https://app.supabase.com/project/hyeifxvxifhrapfdvfry/settings/database
2. Role até a seção "Connection string"
3. Copie:
   - **Connection pooling** → `DATABASE_URL`
   - **Direct connection** → `DIRECT_URL`

### 2. Configurar .env.local

Crie o arquivo `backend/.env.local`:

```bash
# Database
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Supabase
SUPABASE_URL="https://hyeifxvxifhrapfdvfry.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5ZWlmeHZ4aWZocmFwZmR2ZnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MjI0NzAsImV4cCI6MjA2OTQ5ODQ3MH0.IgMsVqAqnVxTit_FFzr1s8qEzTh4lo_YQbyT25sDq9k"
SUPABASE_SERVICE_ROLE_KEY="[obter no painel do Supabase]"

# Anthropic (Claude API)
ANTHROPIC_API_KEY="[sua chave da API]"

# API
PORT=3001
NODE_ENV=development
```

### 3. Executar Migrations

```bash
cd backend
npm run prisma:migrate
```

### 4. Executar Seeds

```bash
cd backend
npm run prisma:seed
```

### 5. Testar Localmente

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

Acesse: http://localhost:3000

---

## 📋 Checklist Rápido

- [ ] Obter DATABASE_URL e DIRECT_URL do Supabase
- [ ] Criar `backend/.env.local` com as variáveis
- [ ] Executar `npm run prisma:migrate` no backend
- [ ] Executar `npm run prisma:seed` no backend
- [ ] Testar backend: `npm run dev` e verificar http://localhost:3001/api/health
- [ ] Testar frontend: `npm run dev` e acessar http://localhost:3000
- [ ] Fazer login e testar criação de cliente

---

## 🎯 Próximo Passo Imediato

**Execute agora**:
```bash
# 1. Ir para o diretório backend
cd backend

# 2. Verificar se .env.local existe
ls -la .env.local

# 3. Se não existir, criar com as connection strings
# 4. Executar migrations
npm run prisma:migrate

# 5. Executar seeds
npm run prisma:seed
```

---

**Ver documentação completa**: `PROXIMOS-PASSOS.md`

