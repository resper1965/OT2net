# 🚀 Deploy no Vercel - OT2net

## Pré-requisitos

1. Conta no Vercel (https://vercel.com)
2. Projeto no Supabase configurado
3. Git repository configurado

## Passo 1: Configurar Variáveis de Ambiente no Vercel

Acesse o dashboard do Vercel e configure as seguintes variáveis de ambiente:

### Variáveis Públicas (NEXT_PUBLIC_*)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://qaekhnagfzpwprvaxqwt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_hbperspgh1KUnMYUn_RmOA_VNrEspo7
```

### Variáveis Privadas (para Serverless Functions)

```bash
# Supabase
SUPABASE_URL=https://qaekhnagfzpwprvaxqwt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_Q8M0UN_iohXf16iB4j4H9A_-hY1vuEQ

# Database (Prisma)
DATABASE_URL=postgresql://postgres.qaekhnagfzpwprvaxqwt:[SENHA]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.qaekhnagfzpwprvaxqwt:[SENHA]@aws-0-us-east-1.pooler.supabase.com:5432/postgres

# Claude API (Anthropic)
ANTHROPIC_API_KEY=sua_chave_aqui
```

**Como configurar:**
1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto (ou crie um novo)
3. Vá em **Settings** > **Environment Variables**
4. Adicione cada variável acima
5. Selecione os ambientes (Production, Preview, Development)

## Passo 2: Deploy via CLI

```bash
# Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# Login no Vercel
vercel login

# Deploy (primeira vez - seguir prompts)
cd /home/resper/OT2net
vercel

# Deploy em produção
vercel --prod
```

## Passo 3: Deploy via Git (Recomendado)

1. Conecte seu repositório Git ao Vercel:
   - Acesse: https://vercel.com/new
   - Importe seu repositório
   - Configure:
     - **Root Directory**: `frontend`
     - **Framework Preset**: Next.js
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`
     - **Install Command**: `npm install`

2. Configure as variáveis de ambiente (Passo 1)

3. Faça push para o branch principal:
   ```bash
   git push origin main
   ```

## Estrutura de Deploy

- **Frontend Next.js**: Deployado como aplicação Next.js
- **API Routes**: Serverless functions em `/api/*`
- **Região**: `gru1` (São Paulo, Brasil)

## Verificação Pós-Deploy

1. Acesse a URL do deploy (fornecida pelo Vercel)
2. Verifique:
   - ✅ Página inicial carrega
   - ✅ Login funciona (Supabase Auth)
   - ✅ API routes respondem (`/api/health`)
   - ✅ Dados do banco são carregados

## Troubleshooting

### Erro: "Module not found"
- Verifique se todas as dependências estão no `package.json`
- Execute `npm install` localmente para verificar

### Erro: "Environment variable not found"
- Verifique se todas as variáveis estão configuradas no Vercel
- Certifique-se de que as variáveis `NEXT_PUBLIC_*` estão marcadas como públicas

### Erro: "Database connection failed"
- Verifique as connection strings do Supabase
- Certifique-se de que o IP do Vercel está permitido no Supabase (se necessário)

### Build falha
- Verifique os logs do build no Vercel
- Execute `npm run build` localmente para reproduzir o erro

## Notas Importantes

1. **Serverless Functions**: As rotas em `/api/*` são automaticamente convertidas em serverless functions
2. **Prisma**: Execute `prisma generate` no build (adicionar ao `package.json` se necessário)
3. **Database Migrations**: Execute migrations manualmente ou via script de deploy
4. **Secrets**: Nunca commite senhas ou chaves no código

## Comandos Úteis

```bash
# Ver logs do deploy
vercel logs

# Ver variáveis de ambiente
vercel env ls

# Adicionar variável de ambiente
vercel env add VARIABLE_NAME

# Remover variável
vercel env rm VARIABLE_NAME
```

