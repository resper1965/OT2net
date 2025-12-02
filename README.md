# OT2net - Sistema de Gestão de Governança e Segurança de TO

Plataforma PMO Inteligente para projetos de consultoria em Governança e Segurança de Tecnologia Operacional.

## 🚀 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18** + **TypeScript**
- **TailwindCSS** + **shadcn/ui**
- **Supabase Auth** (autenticação)
- **Ness Design System**

### Backend
- **Express.js** + **TypeScript**
- **Prisma ORM** (PostgreSQL)
- **Supabase** (Auth, Storage, Realtime, PostgreSQL)
- **Claude API** (Anthropic) - Processamento com IA
- **Redis** (cache e jobs)

### Database
- **PostgreSQL** (via Supabase)
- **pgvector** (busca semântica)
- **Row Level Security (RLS)**

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker (para Redis local)
- Conta Supabase
- Conta Anthropic (Claude API)

## 🛠️ Setup Local

### 1. Clone o repositório

```bash
git clone https://github.com/resper1965/OT2net.git
cd OT2net
```

### 2. Configure variáveis de ambiente

#### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://hyeifxvxifhrapfdvfry.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_RMMpXpKBjUDFNQt9_X0aog_GzLv4jzd
```

#### Backend (`backend/.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://hyeifxvxifhrapfdvfry.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...
REDIS_URL=redis://localhost:6379
PORT=3001
NODE_ENV=development
```

### 3. Instale dependências

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 4. Configure Prisma

```bash
cd backend
npm run prisma:generate
# Quando tiver DATABASE_URL configurado:
# npm run prisma:migrate
# npm run prisma:seed
```

### 5. Inicie Redis (Docker)

```bash
docker-compose up -d redis
```

### 6. Inicie os servidores

```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

Acesse:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 📚 Documentação

- [Autenticação](./docs/authentication.md)
- [Supabase Setup](./docs/supabase-setup.md)
- [Prisma Setup](./docs/prisma-setup.md)
- [Deploy Vercel](./docs/vercel-deployment.md)
- [Supabase Auto REST APIs](./docs/supabase-auto-rest-apis.md)
- [Ness Design System](./docs/ness-design-system.md)

## 🚢 Deploy na Vercel

Veja [docs/vercel-deployment.md](./docs/vercel-deployment.md) para instruções completas.

### Quick Start

1. Conecte repositório na Vercel
2. Configure variáveis de ambiente
3. Deploy automático via Git push

## 📁 Estrutura do Projeto

```
OT2net/
├── frontend/          # Next.js App
│   ├── src/
│   │   ├── app/      # App Router pages
│   │   ├── lib/      # Utilities, Supabase clients
│   │   ├── contexts/ # React Contexts
│   │   └── types/    # TypeScript types
│   └── package.json
├── backend/           # Express API
│   ├── src/
│   │   ├── middleware/ # Auth, validation, errors
│   │   ├── routes/     # API routes
│   │   ├── services/   # Business logic (Claude API, etc)
│   │   └── utils/      # Helpers
│   ├── prisma/         # Prisma schema e migrations
│   └── package.json
├── docs/              # Documentação
├── specs/             # Especificações do projeto
└── docker-compose.yml # Redis local
```

## 🔐 Segurança

- ⚠️ **NUNCA** commite arquivos `.env.local`
- ⚠️ **NUNCA** exponha `SUPABASE_SERVICE_ROLE_KEY` no frontend
- ✅ Use Row Level Security (RLS) no Supabase
- ✅ Valide todas as entradas do usuário
- ✅ Use HTTPS em produção

## 📝 Scripts Úteis

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run lint         # Linter
npm run format       # Formatter
```

### Backend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build TypeScript
npm run start        # Produção
npm run prisma:generate  # Gerar Prisma Client
npm run prisma:migrate   # Executar migrations
npm run prisma:seed      # Popular banco
```

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feature/nova-feature`
2. Commit: `git commit -m 'feat: adiciona nova feature'`
3. Push: `git push origin feature/nova-feature`
4. Abra um Pull Request

## 📄 Licença

[Adicionar licença]

## 👥 Equipe

[Adicionar informações da equipe]
