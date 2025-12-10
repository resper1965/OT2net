# Configuração de Variáveis de Ambiente

Este documento descreve como configurar as variáveis de ambiente para o projeto OT2net.

## Estrutura de Arquivos

```
OT2net/
├── frontend/
│   ├── .env.example      # Template para frontend
│   └── .env.local        # Variáveis locais (não commitado)
└── backend/
    ├── .env.example      # Template para backend
    └── .env.local        # Variáveis locais (não commitado)
```

## Frontend (Next.js)

### 1. Copiar template

```bash
cd frontend
cp .env.example .env.local
```

### 2. Variáveis já configuradas

As variáveis do frontend já estão configuradas no `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hyeifxvxifhrapfdvfry.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ **Anon Key é pública e segura** - Pode ser commitada, respeita RLS.

### 3. Verificar

O arquivo `.env.local` deve conter as mesmas variáveis do `.env.example`.

## Backend (Express)

### 1. Copiar template

```bash
cd backend
cp .env.example .env.local
```

### 2. Obter Service Role Key

⚠️ **CRÍTICO**: A Service Role Key tem acesso total ao banco de dados!

1. Acesse: https://app.supabase.com/project/hyeifxvxifhrapfdvfry/settings/api
2. Na seção "Project API keys", copie a **"service_role"** key (não a "anon" key)
3. Cole no `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

### 3. Obter Connection Strings do Prisma

O Prisma precisa de duas URLs de conexão:

#### DATABASE_URL (Connection Pooling)

1. Acesse: https://app.supabase.com/project/hyeifxvxifhrapfdvfry/settings/database
2. Na seção "Connection string", selecione:
   - **Connection pooling**: `Transaction` mode
   - **URI**: Copie a string

Formato esperado:
```
postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

#### DIRECT_URL (Conexão Direta)

1. Na mesma página, selecione:
   - **Direct connection**
   - **URI**: Copie a string

Formato esperado:
```
postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
```

#### Adicionar no .env.local

```env
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
```

⚠️ **IMPORTANTE**: 
- Substitua `[ref]`, `[password]`, `[region]` pelos valores reais
- A senha do banco está disponível no dashboard (Settings > Database > Database password)
- Se não souber a senha, você pode resetá-la no dashboard

### 4. Configurar outras variáveis

```env
# Server
PORT=3001
NODE_ENV=development

# Claude API (opcional por enquanto)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Google Gemini API (para RAG de regras ANEEL/ONS)
GEMINI_API_KEY=your_gemini_api_key_here

# Opcional: Usar Vertex AI para embeddings (mais preciso)
GEMINI_USE_VERTEX_AI=false

# Opcional: Usar OpenAI para embeddings como fallback (recomendado para produção)
OPENAI_API_KEY=your_openai_api_key_here

# Redis (opcional por enquanto)
REDIS_URL=redis://localhost:6379
```

## Verificação

### Frontend

```bash
cd frontend
npm run dev
```

Se tudo estiver correto, o servidor Next.js deve iniciar sem erros.

### Backend

```bash
cd backend
npm run dev
```

Se tudo estiver correto, você deve ver:
```
🚀 Backend server running on http://localhost:3001
```

### Testar Prisma

```bash
cd backend
npm run prisma:generate
```

Se as connection strings estiverem corretas, o Prisma Client será gerado com sucesso.

## Segurança

### ✅ O que PODE ser commitado

- `.env.example` (templates sem valores sensíveis)
- `NEXT_PUBLIC_SUPABASE_URL` (pública)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (pública, respeita RLS)

### ❌ O que NUNCA deve ser commitado

- `.env.local` (já está no `.gitignore`)
- `SUPABASE_SERVICE_ROLE_KEY` (acesso total ao banco)
- `DATABASE_URL` com senha real
- `DIRECT_URL` com senha real
- `ANTHROPIC_API_KEY` (chave privada)
- `GEMINI_API_KEY` (chave privada)
- `OPENAI_API_KEY` (chave privada)

## Troubleshooting

### Erro: "Missing Supabase environment variables"

- Verifique se o arquivo `.env.local` existe
- Verifique se as variáveis estão com os nomes corretos
- Reinicie o servidor após alterar `.env.local`

### Erro: "Can't reach database server"

- Verifique se as connection strings estão corretas
- Verifique se a senha do banco está correta
- Verifique se o projeto Supabase está ativo

### Erro: "Invalid API key"

- Verifique se copiou a chave correta (service_role, não anon)
- Verifique se não há espaços extras na chave
- Verifique se a chave não expirou (raro, mas possível)

## Referências

- [Supabase Environment Variables](https://supabase.com/docs/guides/getting-started/local-development#environment-variables)
- [Prisma Connection URLs](https://www.prisma.io/docs/guides/database/connection-urls)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

