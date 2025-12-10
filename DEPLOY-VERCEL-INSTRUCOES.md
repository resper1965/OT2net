# 🚀 Instruções de Deploy no Vercel

## Status Atual

✅ Configurações preparadas:
- `vercel.json` configurado
- `frontend/next.config.ts` com rewrites para API
- `frontend/src/lib/api.ts` adaptado para Vercel
- Serverless functions helpers criados
- Build script atualizado

## Passo 1: Configurar Variáveis de Ambiente

⚠️ **CRÍTICO**: As variáveis de ambiente são obrigatórias para que as serverless functions funcionem. Sem elas, você receberá erro 500 em rotas como `/api/clientes`.

📖 **Para instruções detalhadas, consulte**: [`CONFIGURAR-VARIAVEIS-VERCEL.md`](./CONFIGURAR-VARIAVEIS-VERCEL.md)

### Via Dashboard Vercel (Recomendado)

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto ou crie um novo
3. Vá em **Settings** > **Environment Variables**
4. Adicione as seguintes variáveis:

#### Variáveis Obrigatórias (Serverless Functions)

| Variável | Valor | Tipo | Como Obter |
|----------|-------|------|------------|
| `DATABASE_URL` | `postgresql://postgres.qaekhnagfzpwprvaxqwt:[SENHA]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true` | Secret | Supabase Dashboard > Settings > Database > Connection string (Transaction mode, porta 6543) |
| `SUPABASE_URL` | `https://qaekhnagfzpwprvaxqwt.supabase.co` | Secret | URL do projeto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `[sua service_role_key]` | Secret | Supabase Dashboard > Settings > API > service_role key |

#### Variáveis Recomendadas (Frontend)

| Variável | Valor | Tipo |
|----------|-------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qaekhnagfzpwprvaxqwt.supabase.co` | Plain Text |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_hbperspgh1KUnMYUn_RmOA_VNrEspo7` | Plain Text |

**Importante:**
- ✅ Marque `NEXT_PUBLIC_*` como **Plain Text** (visíveis no browser)
- ✅ Marque as outras como **Secret** (privadas)
- ✅ Selecione todos os ambientes: **Production**, **Preview**, **Development**
- ⚠️ **Use a porta 6543** (Transaction Pooler) para `DATABASE_URL` em serverless functions
- ⚠️ **Após adicionar**, faça um **Redeploy** para aplicar as mudanças

### Via CLI

```bash
# Adicionar variáveis
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_URL production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production

# Ver variáveis
vercel env ls
```

## Passo 2: Deploy

### Opção A: Deploy via CLI (Primeira vez)

```bash
cd /home/resper/OT2net

# Login (se necessário)
vercel login

# Deploy (seguir prompts)
vercel

# Deploy em produção
vercel --prod
```

### Opção B: Deploy via Git (Recomendado)

1. **Conecte o repositório:**
   - Acesse: https://vercel.com/new
   - Importe seu repositório Git
   - Configure:
     - **Root Directory**: `frontend`
     - **Framework Preset**: Next.js
     - **Build Command**: `npm run build` (já configurado no package.json)
     - **Output Directory**: `.next`
     - **Install Command**: `npm install`

2. **Configure variáveis de ambiente** (Passo 1)

3. **Faça push:**
   ```bash
   git add .
   git commit -m "Configuração para deploy no Vercel"
   git push origin main
   ```

## Passo 3: Verificar Deploy

Após o deploy, verifique:

1. ✅ Página inicial carrega
2. ✅ `/api/health` retorna `{"status":"ok"}`
3. ✅ Login funciona (Supabase Auth)
4. ✅ Dados são carregados do banco

## Estrutura de Deploy

- **Frontend**: Next.js app em `frontend/`
- **API Routes**: Serverless functions em `api/`
- **Região**: `gru1` (São Paulo, Brasil)
- **Runtime**: Node.js 20.x

## Troubleshooting

### Erro: "Module not found: @prisma/client"
**Solução**: O build precisa gerar o Prisma Client. O script `postinstall` já faz isso.

### Erro: "Environment variable not found" ou Erro 500 em `/api/clientes`
**Solução**: 
- Verifique se todas as variáveis obrigatórias estão configuradas no Vercel Dashboard
- Certifique-se de fazer um **Redeploy** após adicionar as variáveis
- Consulte [`CONFIGURAR-VARIAVEIS-VERCEL.md`](./CONFIGURAR-VARIAVEIS-VERCEL.md) para instruções detalhadas

### Erro: "Database connection failed"
**Solução**: 
- Verifique as connection strings
- Certifique-se de que a senha está correta
- Verifique se o IP do Vercel está permitido (geralmente não é necessário)

### Build falha
**Solução**: 
- Verifique os logs: `vercel logs [deployment-url]`
- Teste localmente: `cd frontend && npm run build`

## Próximos Passos

Após o deploy bem-sucedido:

1. ✅ Testar todas as funcionalidades
2. ✅ Configurar domínio customizado (opcional)
3. ✅ Configurar CI/CD (já funciona com Git)
4. ✅ Monitorar logs e performance

## Comandos Úteis

```bash
# Ver logs
vercel logs

# Ver deployments
vercel ls

# Remover deployment
vercel remove [deployment-url]

# Ver variáveis
vercel env ls

# Adicionar variável
vercel env add VARIABLE_NAME

# Remover variável
vercel env rm VARIABLE_NAME
```

