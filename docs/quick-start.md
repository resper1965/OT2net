# Quick Start Guide

Guia rápido para começar a desenvolver no projeto OT2net.

## Pré-requisitos

- Node.js 18+ e npm
- Git
- Docker e Docker Compose (para Redis)
- Conta Supabase (já configurada)
- Conta Vercel (para deploy)

## Setup Inicial

### 1. Clonar Repositório

```bash
git clone https://github.com/resper1965/OT2net.git
cd OT2net
```

### 2. Instalar Dependências

```bash
# Instalar dependências do root (workspace)
npm install

# Instalar dependências do frontend
cd frontend
npm install

# Instalar dependências do backend
cd ../backend
npm install
```

### 3. Configurar Variáveis de Ambiente

```bash
# Root
cp .env.example .env.local

# Frontend
cd frontend
cp .env.example .env.local

# Backend
cd ../backend
cp .env.example .env.local
```

Preencha os valores em `.env.local` (veja `docs/env-setup.md` para detalhes).

### 4. Iniciar Redis (Docker)

```bash
# Na raiz do projeto
docker-compose up -d redis
```

### 5. Configurar Banco de Dados

```bash
cd backend

# Gerar Prisma Client
npm run prisma:generate

# Executar migrations (quando tiver DATABASE_URL configurado)
npm run prisma:migrate

# Popular com dados iniciais
npm run prisma:seed
```

### 6. Iniciar Servidores de Desenvolvimento

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```
Acesse: http://localhost:3000

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
API disponível em: http://localhost:3001

## Estrutura do Projeto

```
OT2net/
├── frontend/          # Next.js 14 + TypeScript
├── backend/           # Express.js + TypeScript
├── api/               # Serverless Functions (Vercel)
├── docs/              # Documentação
├── specs/             # Especificações e planos
└── docker-compose.yml # Redis
```

## Comandos Úteis

### Frontend
```bash
cd frontend
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run lint         # Linter
npm run format       # Formatar código
```

### Backend
```bash
cd backend
npm run dev          # Desenvolvimento
npm run build        # Build
npm run prisma:studio # Abrir Prisma Studio
npm run prisma:migrate # Criar migration
npm run prisma:seed  # Popular banco
```

### Scripts
```bash
# Importar frameworks regulatórios
cd backend
npm run scripts:import-frameworks
```

## Próximos Passos

1. **Configurar Supabase**:
   - Criar buckets de storage
   - Executar scripts SQL (ver `backend/scripts/`)
   - Habilitar Realtime

2. **Configurar Vercel**:
   - Conectar repositório
   - Configurar variáveis de ambiente
   - Deploy automático

3. **Começar Desenvolvimento**:
   - Ver `PROJECT-STATUS.md` para status atual
   - Ver `specs/001-governanca-to-pmo/tasks.md` para próximas tasks

## Troubleshooting

### Erro: "Missing Supabase environment variables"
- Verifique se `.env.local` existe e tem as variáveis corretas
- Certifique-se de usar `NEXT_PUBLIC_` prefix para variáveis do frontend

### Erro: "Prisma Client not generated"
```bash
cd backend
npm run prisma:generate
```

### Erro: "Cannot connect to database"
- Verifique `DATABASE_URL` e `DIRECT_URL` em `backend/.env.local`
- Certifique-se de que as connection strings estão corretas

### Redis não inicia
```bash
# Verificar se porta 6379 está livre
docker-compose down
docker-compose up -d redis
```

## Documentação Completa

- `docs/setup-complete.md` - Checklist completo de setup
- `docs/env-setup.md` - Detalhes de variáveis de ambiente
- `docs/supabase-setup.md` - Configuração Supabase
- `docs/vercel-deployment.md` - Deploy na Vercel
- `PROJECT-STATUS.md` - Status do projeto

## Suporte

Para dúvidas ou problemas, consulte a documentação em `docs/` ou abra uma issue no GitHub.



