# Deploy na Vercel

Este documento descreve como fazer deploy da aplicação OT2net na Vercel.

## Arquitetura de Deploy

### Frontend (Next.js)
- **Plataforma**: Vercel (otimizado para Next.js)
- **Build**: Automático via `npm run build`
- **Região**: `gru1` (São Paulo, Brasil)

### Backend (Express)
- **Opção 1**: Serverless Functions na Vercel (recomendado para APIs simples)
- **Opção 2**: Servidor dedicado (Railway, Render, etc.) para lógica complexa

## Pré-requisitos

1. Conta na Vercel: https://vercel.com
2. Repositório Git conectado (GitHub, GitLab, Bitbucket)
3. Variáveis de ambiente configuradas

## Passo 1: Conectar Repositório

1. Acesse https://vercel.com/new
2. Importe o repositório `OT2net`
3. Configure o projeto:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (automático)
   - **Output Directory**: `.next` (automático)

## Passo 2: Configurar Variáveis de Ambiente

No painel da Vercel, vá em **Settings > Environment Variables** e adicione:

### Frontend (Next.js)

```env
NEXT_PUBLIC_SUPABASE_URL=https://hyeifxvxifhrapfdvfry.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_RMMpXpKBjUDFNQt9_X0aog_GzLv4jzd
```

### Backend (se usando Serverless Functions)

```env
SUPABASE_URL=https://hyeifxvxifhrapfdvfry.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_Q8M0UN_iohXf16iB4j4H9A_-hY1vuEQ
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...
REDIS_URL=redis://...
```

⚠️ **IMPORTANTE**: 
- Variáveis `NEXT_PUBLIC_*` são expostas no frontend
- `SUPABASE_SERVICE_ROLE_KEY` é sensível - nunca exponha no frontend!
- Use Vercel Secrets para variáveis sensíveis

## Passo 3: Configurar Build Settings

### Frontend

O Vercel detecta automaticamente Next.js, mas você pode configurar:

- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/.next`
- **Install Command**: `cd frontend && npm install`

### Backend (Serverless Functions)

Se usar serverless functions, crie em `api/` na raiz do projeto:

```
api/
  projetos.ts
  clientes.ts
  ...
```

Ou configure rewrite no `vercel.json` para apontar para `backend/api/`.

## Passo 4: Deploy

1. **Deploy Automático**: Push para `main` branch faz deploy automático
2. **Deploy Manual**: Vercel Dashboard > Deployments > Deploy

## Configuração de Domínio

1. Vercel Dashboard > Settings > Domains
2. Adicione domínio customizado
3. Configure DNS conforme instruções da Vercel

## Variáveis de Ambiente por Ambiente

Configure variáveis diferentes para:
- **Production**: Produção
- **Preview**: Pull requests
- **Development**: Local

Exemplo:
```
NEXT_PUBLIC_SUPABASE_URL
  Production: https://hyeifxvxifhrapfdvfry.supabase.co
  Preview: https://hyeifxvxifhrapfdvfry.supabase.co
  Development: http://localhost:3000
```

## Backend como Servidor Dedicado (Alternativa)

Se o backend precisar de recursos mais robustos:

### Opção 1: Railway
1. Conecte repositório no Railway
2. Configure variáveis de ambiente
3. Deploy automático

### Opção 2: Render
1. Crie Web Service no Render
2. Configure build: `cd backend && npm install && npm run build`
3. Configure start: `cd backend && npm start`

### Opção 3: Vercel Serverless Functions
- Criar funções em `api/` ou `backend/api/`
- Cada arquivo exporta handler HTTP
- Vercel gerencia escalabilidade automaticamente

## Monitoramento

- **Vercel Analytics**: Habilitar em Settings > Analytics
- **Logs**: Vercel Dashboard > Deployments > [deployment] > Functions
- **Métricas**: Vercel Dashboard > Analytics

## Troubleshooting

### Build Fails

1. Verificar logs em Vercel Dashboard
2. Testar build local: `cd frontend && npm run build`
3. Verificar variáveis de ambiente

### API Routes não funcionam

1. Verificar se funções estão em `api/` ou configuradas em `vercel.json`
2. Verificar logs de runtime
3. Testar localmente com `vercel dev`

### Variáveis de ambiente não carregam

1. Verificar se variáveis estão configuradas no painel
2. Verificar se estão marcadas para ambiente correto (Production/Preview)
3. Fazer redeploy após adicionar variáveis

## Referências

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Serverless Functions](https://vercel.com/docs/functions)

