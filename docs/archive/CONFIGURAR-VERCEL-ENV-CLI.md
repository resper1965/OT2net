# 🚀 Configurar Variáveis de Ambiente no Vercel via CLI

**Projeto**: ot-2net  
**Data**: 2025-01-27

## 📋 Status Atual

Algumas variáveis já estão configuradas no Vercel, mas apenas para **Production**:
- ✅ `SUPABASE_SERVICE_ROLE_KEY` (Production)
- ✅ `SUPABASE_URL` (Production)
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Production)
- ✅ `NEXT_PUBLIC_SUPABASE_URL` (Production)

**Faltando:**
- ❌ `DATABASE_URL` (todas as environments)
- ❌ Variáveis para **Preview** e **Development**

---

## 🎯 Opções de Configuração

### Opção 1: Script Python Interativo (Recomendado)

```bash
cd /home/resper/OT2net
python3 scripts/configurar-vercel-env.py
```

O script irá:
1. Verificar se você está logado no Vercel
2. Solicitar `DATABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
3. Configurar todas as variáveis para Production, Preview e Development

---

### Opção 2: Script Bash Interativo

```bash
cd /home/resper/OT2net
./scripts/configurar-vercel-env.sh
```

---

### Opção 3: Manual via CLI

#### 1. Verificar variáveis existentes:
```bash
cd /home/resper/OT2net
vercel env ls
```

#### 2. Adicionar variáveis faltantes:

**DATABASE_URL** (obter do Supabase Dashboard):
```bash
# Production
echo "postgresql://postgres.qaekhnagfzpwprvaxqwt:[SENHA]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true" | vercel env add DATABASE_URL production

# Preview
echo "postgresql://postgres.qaekhnagfzpwprvaxqwt:[SENHA]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true" | vercel env add DATABASE_URL preview

# Development
echo "postgresql://postgres.qaekhnagfzpwprvaxqwt:[SENHA]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true" | vercel env add DATABASE_URL development
```

**Adicionar variáveis existentes para Preview e Development:**

```bash
# SUPABASE_URL
echo "https://qaekhnagfzpwprvaxqwt.supabase.co" | vercel env add SUPABASE_URL preview
echo "https://qaekhnagfzpwprvaxqwt.supabase.co" | vercel env add SUPABASE_URL development

# SUPABASE_SERVICE_ROLE_KEY (obter do Supabase Dashboard)
echo "[sua_service_role_key]" | vercel env add SUPABASE_SERVICE_ROLE_KEY preview
echo "[sua_service_role_key]" | vercel env add SUPABASE_SERVICE_ROLE_KEY development

# NEXT_PUBLIC_SUPABASE_URL
echo "https://qaekhnagfzpwprvaxqwt.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL preview
echo "https://qaekhnagfzpwprvaxqwt.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL development

# NEXT_PUBLIC_SUPABASE_ANON_KEY
echo "sb_publishable_hbperspgh1KUnMYUn_RmOA_VNrEspo7" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
echo "sb_publishable_hbperspgh1KUnMYUn_RmOA_VNrEspo7" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development
```

---

## 🔑 Como Obter as Variáveis Sensíveis

### DATABASE_URL

1. Acesse: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt/settings/database
2. Role até a seção **"Connection string"**
3. Selecione o modo **"Transaction"** (não Session)
4. Copie a connection string completa
5. **Importante**: Use a porta **6543** (Transaction Pooler) para serverless functions

**Formato esperado:**
```
postgresql://postgres.qaekhnagfzpwprvaxqwt:[SENHA]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### SUPABASE_SERVICE_ROLE_KEY

1. Acesse: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt/settings/api
2. Role até a seção **"Project API keys"**
3. Copie o valor de **"service_role"** (secret)
4. **⚠️ Importante**: Use a chave **service_role**, não a anon/public

---

## ✅ Verificar Configuração

Após configurar, verifique:

```bash
vercel env ls
```

Você deve ver todas as variáveis para Production, Preview e Development.

---

## 🔄 Aplicar Mudanças (Redeploy)

Após configurar as variáveis, faça um redeploy:

### Opção 1: Via CLI
```bash
vercel --prod
```

### Opção 2: Via Git
```bash
git commit --allow-empty -m "Trigger redeploy para aplicar variáveis de ambiente"
git push origin main
```

### Opção 3: Via Dashboard
1. Acesse: https://vercel.com/dashboard
2. Vá em **Deployments**
3. Clique nos três pontos (`...`) do deployment mais recente
4. Selecione **"Redeploy"**

---

## 🐛 Troubleshooting

### Erro: "Not logged in"
```bash
vercel login
```

### Erro: "Variable already exists"
Isso é normal. A variável já está configurada. Você pode atualizá-la com:
```bash
vercel env update VARIABLE_NAME production
```

### Verificar variáveis específicas
```bash
vercel env ls production
vercel env ls preview
vercel env ls development
```

---

## 📝 Resumo das Variáveis

| Variável | Tipo | Obrigatória | Ambientes |
|----------|------|-------------|-----------|
| `DATABASE_URL` | Secret | ✅ Sim | Production, Preview, Development |
| `SUPABASE_URL` | Secret | ✅ Sim | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | ✅ Sim | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_URL` | Plain Text | ⚠️ Recomendada | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Plain Text | ⚠️ Recomendada | Production, Preview, Development |

---

**Última atualização**: 2025-01-27

