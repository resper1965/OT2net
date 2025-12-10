# 🎯 Completar Configuração das Variáveis no Vercel

**Data**: 2025-01-27  
**Status**: ⚠️ Parcialmente configurado

## ✅ O que já foi configurado

As seguintes variáveis foram adicionadas com sucesso via CLI:

- ✅ `NEXT_PUBLIC_SUPABASE_URL` → Production, Preview, Development
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Production, Preview, Development  
- ✅ `SUPABASE_URL` → Production, Preview, Development
- ✅ `SUPABASE_SERVICE_ROLE_KEY` → Production

## ❌ O que ainda falta

### 1. DATABASE_URL (CRÍTICO - Resolve o erro 500)

Esta é a variável mais importante para resolver o erro 500 em `/api/clientes`.

**Como obter:**
1. Acesse: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt/settings/database
2. Role até **"Connection string"**
3. Selecione **"Transaction"** (não Session)
4. Copie a connection string completa
5. **⚠️ Use a porta 6543** (Transaction Pooler)

**Configurar no Vercel:**

```bash
cd /home/resper/OT2net

# Substitua [DATABASE_URL] pela connection string obtida
DATABASE_URL="postgresql://postgres.qaekhnagfzpwprvaxqwt:[SENHA]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Production
printf "$DATABASE_URL\n" | vercel env add DATABASE_URL production

# Preview
printf "$DATABASE_URL\n" | vercel env add DATABASE_URL preview

# Development
printf "$DATABASE_URL\n" | vercel env add DATABASE_URL development
```

### 2. SUPABASE_SERVICE_ROLE_KEY (Preview e Development)

Se você já tem a chave configurada em Production, use a mesma para Preview e Development:

**Como obter:**
1. Acesse: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt/settings/api
2. Role até **"Project API keys"**
3. Copie o valor de **"service_role"** (secret)

**Configurar no Vercel:**

```bash
cd /home/resper/OT2net

# Substitua [SERVICE_ROLE_KEY] pela chave obtida
SERVICE_ROLE_KEY="[sua_service_role_key]"

# Preview
printf "$SERVICE_ROLE_KEY\n" | vercel env add SUPABASE_SERVICE_ROLE_KEY preview

# Development
printf "$SERVICE_ROLE_KEY\n" | vercel env add SUPABASE_SERVICE_ROLE_KEY development
```

---

## 🚀 Método Rápido: Usar o Script Python

O script interativo facilita a configuração:

```bash
cd /home/resper/OT2net
python3 scripts/configurar-vercel-env.py
```

O script irá:
1. Solicitar `DATABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
2. Configurar todas as variáveis automaticamente
3. Aplicar para Production, Preview e Development

---

## ✅ Verificar após Configurar

```bash
vercel env ls
```

Você deve ver:
- `DATABASE_URL` → Production, Preview, Development
- `SUPABASE_SERVICE_ROLE_KEY` → Production, Preview, Development
- Todas as outras variáveis já configuradas

---

## 🔄 Redeploy (OBRIGATÓRIO)

Após configurar as variáveis, **faça um redeploy**:

```bash
vercel --prod
```

Ou via Git:
```bash
git commit --allow-empty -m "Aplicar variáveis de ambiente"
git push origin main
```

---

## 🧪 Testar

Após o redeploy, teste a API:

```bash
# Health check
curl https://ot-2net-nessbr-projects.vercel.app/api/health

# API de clientes (com token)
curl -H "Authorization: Bearer [seu-token]" \
     https://ot-2net-nessbr-projects.vercel.app/api/clientes
```

O erro 500 deve estar resolvido! ✅

---

## 📚 Documentação Completa

- **Guia Detalhado**: [`CONFIGURAR-VARIAVEIS-VERCEL.md`](./CONFIGURAR-VARIAVEIS-VERCEL.md)
- **Instruções CLI**: [`CONFIGURAR-VERCEL-ENV-CLI.md`](./CONFIGURAR-VERCEL-ENV-CLI.md)
- **Resumo**: [`RESUMO-CONFIGURACAO-VERCEL.md`](./RESUMO-CONFIGURACAO-VERCEL.md)

---

**Última atualização**: 2025-01-27

