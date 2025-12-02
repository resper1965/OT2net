# OT2net Project

Sistema de Gestão de Governança e Segurança de TO - Plataforma PMO Inteligente

## Stack Tecnológica

- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Express.js, TypeScript, Prisma
- **Database**: Supabase (PostgreSQL gerenciado + pgvector)
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth
- **Realtime**: Supabase Realtime
- **IA**: Claude API (Anthropic)
- **Jobs**: Bull/Redis

## Configuração Inicial

### 1. Variáveis de Ambiente

Copie `.env.example` para `.env.local` e configure:

```bash
cp .env.example .env.local
```

**Credenciais Supabase já configuradas:**
- URL: `https://hyeifxvxifhrapfdvfry.supabase.co`
- Publishable Key (Anon Key): `sb_publishable_RMMpXpKBjUDFNQt9_X0aog_GzLv4jzd`
  - ✅ Segura para frontend - Pode ser commitada (é pública)
  - ✅ Respeita políticas RLS

⚠️ **CRÍTICO - SEGURANÇA**: 
- A `SUPABASE_SERVICE_ROLE_KEY` **NUNCA** deve ser commitada no git!
- Ela tem acesso total ao banco de dados, bypassando RLS
- Mantenha apenas em `.env.local` (que está no `.gitignore`)
- Obtenha a Service Role Key no dashboard do Supabase:
  1. Acesse: https://app.supabase.com/project/hyeifxvxifhrapfdvfry/settings/api
  2. Copie a "service_role" key
  3. Adicione em `.env.local` (nunca commite!)

### 2. Instalar Dependências

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

### 3. Configurar Supabase

Siga o guia completo em: [docs/supabase-setup.md](./docs/supabase-setup.md)

**Resumo rápido:**
1. Habilitar extensões no Supabase (pgvector, uuid-ossp, pg_trgm)
2. Configurar RLS policies
3. Criar buckets de storage

### 4. Executar Migrations

```bash
cd backend
npx prisma migrate dev
```

### 5. Iniciar Desenvolvimento

```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev

# Terminal 3 - Redis (para Bull jobs)
docker-compose up redis
```

## Estrutura do Projeto

```
ot2net/
├── frontend/          # Next.js App
├── backend/           # Express API
├── shared/            # Tipos compartilhados
├── docker/            # Docker configs
├── docs/              # Documentação
└── specs/             # Spec Kit (especificações)
```

## Documentação

- [Plano Técnico](./specs/001-governanca-to-pmo/plan.md)
- [Tarefas](./specs/001-governanca-to-pmo/tasks.md)
- [Setup Supabase](./docs/supabase-setup.md)
- [Avaliação Supabase](./specs/001-governanca-to-pmo/supabase-evaluation.md)

## Links Úteis

- **Supabase Dashboard**: https://app.supabase.com/project/hyeifxvxifhrapfdvfry
- **Supabase Docs**: https://supabase.com/docs
