# 🔧 Configurar Variáveis de Ambiente no Vercel

**Data**: 2025-01-27  
**Problema**: Erro 500 em `/api/clientes` devido à falta de variáveis de ambiente

## 🎯 Solução

O projeto usa **Vercel Serverless Functions** (na pasta `api/`) para o backend em produção. As variáveis de ambiente precisam ser configuradas no painel da Vercel para que as funções serverless funcionem corretamente.

---

## 📋 Variáveis Necessárias

### 1. **DATABASE_URL** (Obrigatória)
String de conexão do banco de dados PostgreSQL do Supabase usando **Transaction Pooler** (porta 6543).

**Como obter:**
1. Acesse: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt/settings/database
2. Role até a seção **"Connection string"**
3. Selecione o modo **"Transaction"** (não Session)
4. Copie a connection string completa

**Formato esperado:**
```
postgresql://postgres.qaekhnagfzpwprvaxqwt:[SENHA]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**⚠️ Importante:** Use a porta **6543** (Transaction Pooler) para serverless functions, não a porta 5432.

---

### 2. **SUPABASE_URL** (Obrigatória)
URL do projeto Supabase.

**Valor:**
```
https://qaekhnagfzpwprvaxqwt.supabase.co
```

---

### 3. **SUPABASE_SERVICE_ROLE_KEY** (Obrigatória)
Chave secreta (service_role) do Supabase. **NÃO** use a chave anon/public.

**Como obter:**
1. Acesse: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt/settings/api
2. Role até a seção **"Project API keys"**
3. Copie o valor de **"service_role"** (secret) - geralmente começa com `eyJ...` ou `sb_secret_...`

**⚠️ Importante:** Esta chave tem privilégios administrativos. Mantenha-a segura e nunca a exponha no frontend.

---

### 4. **NEXT_PUBLIC_SUPABASE_URL** (Opcional, mas recomendada)
URL do Supabase para uso no frontend. Pode ser a mesma que `SUPABASE_URL`.

**Valor:**
```
https://qaekhnagfzpwprvaxqwt.supabase.co
```

---

### 5. **NEXT_PUBLIC_SUPABASE_ANON_KEY** (Opcional, mas recomendada)
Chave pública (anon) do Supabase para uso no frontend.

**Como obter:**
1. Acesse: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt/settings/api
2. Role até a seção **"Project API keys"**
3. Copie o valor de **"anon"** ou **"publishable"** key

**Valor atual:**
```
sb_publishable_hbperspgh1KUnMYUn_RmOA_VNrEspo7
```

---

## 🚀 Passo a Passo: Configurar no Vercel

### Opção A: Via Dashboard (Recomendado)

1. **Acesse o Dashboard da Vercel:**
   - Vá para: https://vercel.com/dashboard
   - Selecione seu projeto

2. **Navegue até Environment Variables:**
   - Clique em **Settings** (no menu superior)
   - Clique em **Environment Variables** (no menu lateral)

3. **Adicione cada variável:**
   
   Para cada variável abaixo, clique em **"Add New"** e preencha:
   
   | Key | Value | Environment | Type |
   |-----|-------|-------------|------|
   | `DATABASE_URL` | `postgresql://postgres.qaekhnagfzpwprvaxqwt:[SENHA]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true` | Production, Preview, Development | Secret |
   | `SUPABASE_URL` | `https://qaekhnagfzpwprvaxqwt.supabase.co` | Production, Preview, Development | Secret |
   | `SUPABASE_SERVICE_ROLE_KEY` | `[sua service_role_key]` | Production, Preview, Development | Secret |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://qaekhnagfzpwprvaxqwt.supabase.co` | Production, Preview, Development | Plain Text |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_hbperspgh1KUnMYUn_RmOA_VNrEspo7` | Production, Preview, Development | Plain Text |

   **Importante:**
   - ✅ Marque `NEXT_PUBLIC_*` como **Plain Text** (visíveis no browser)
   - ✅ Marque as outras como **Secret** (privadas)
   - ✅ Selecione todos os ambientes: **Production**, **Preview**, **Development**

4. **Salve as alterações**

---

### Opção B: Via CLI

```bash
# Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# Login
vercel login

# Adicionar variáveis (substitua [VALOR] pelos valores reais)
vercel env add DATABASE_URL production
# Cole o valor quando solicitado

vercel env add SUPABASE_URL production
# Cole: https://qaekhnagfzpwprvaxqwt.supabase.co

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Cole sua service_role_key

vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Cole: https://qaekhnagfzpwprvaxqwt.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Cole: sb_publishable_hbperspgh1KUnMYUn_RmOA_VNrEspo7

# Repetir para Preview e Development (ou usar --all)
vercel env add DATABASE_URL preview
vercel env add DATABASE_URL development
# ... (repetir para todas as variáveis)
```

---

## 🔄 Aplicar as Mudanças

Após adicionar as variáveis, você precisa fazer um **redeploy** para que elas entrem em vigor:

### Opção 1: Redeploy via Dashboard
1. Vá para a aba **Deployments**
2. Clique nos três pontos (`...`) do deployment mais recente
3. Selecione **"Redeploy"**
4. Confirme o redeploy

### Opção 2: Redeploy via Git
```bash
# Faça um commit vazio para triggerar novo deploy
git commit --allow-empty -m "Trigger redeploy para aplicar variáveis de ambiente"
git push origin main
```

### Opção 3: Redeploy via CLI
```bash
vercel --prod
```

---

## ✅ Verificar se Funcionou

Após o redeploy, verifique:

1. **Health Check:**
   ```bash
   curl https://seu-projeto.vercel.app/api/health
   ```
   Deve retornar: `{"status":"ok"}`

2. **Testar API de Clientes:**
   ```bash
   # Com token de autenticação
   curl -H "Authorization: Bearer [seu-token]" \
        https://seu-projeto.vercel.app/api/clientes
   ```
   Não deve retornar erro 500.

3. **Verificar Logs:**
   - No Dashboard da Vercel, vá em **Deployments** > Seu deployment > **Functions**
   - Clique em `/api/clientes`
   - Verifique os logs para erros relacionados a variáveis de ambiente

---

## 🐛 Troubleshooting

### Erro: "Missing Supabase environment variables"
**Causa:** Variáveis `SUPABASE_URL` ou `SUPABASE_SERVICE_ROLE_KEY` não configuradas.

**Solução:** Verifique se as variáveis foram adicionadas corretamente e se o redeploy foi feito.

---

### Erro: "Can't reach database server"
**Causa:** `DATABASE_URL` incorreta ou usando porta errada.

**Solução:** 
- Certifique-se de usar a porta **6543** (Transaction Pooler)
- Verifique se a senha está correta na connection string
- Teste a connection string localmente primeiro

---

### Erro: "Invalid API key"
**Causa:** `SUPABASE_SERVICE_ROLE_KEY` incorreta ou usando a chave anon.

**Solução:**
- Use a chave **service_role**, não a anon
- Verifique se copiou a chave completa (geralmente é longa)

---

### Variáveis não aparecem após redeploy
**Causa:** Variáveis adicionadas apenas para um ambiente específico.

**Solução:**
- Adicione as variáveis para todos os ambientes: Production, Preview, Development
- Ou use `vercel env add --all` no CLI

---

## 📝 Resumo das Variáveis

| Variável | Obrigatória | Tipo | Uso |
|----------|-------------|------|-----|
| `DATABASE_URL` | ✅ Sim | Secret | Prisma Client (serverless functions) |
| `SUPABASE_URL` | ✅ Sim | Secret | Supabase Admin Client (serverless functions) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Sim | Secret | Autenticação admin (serverless functions) |
| `NEXT_PUBLIC_SUPABASE_URL` | ⚠️ Recomendada | Plain Text | Supabase Client (frontend) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ⚠️ Recomendada | Plain Text | Supabase Client (frontend) |

---

## 🔗 Links Úteis

- **Supabase Dashboard**: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentação Vercel Env Vars**: https://vercel.com/docs/concepts/projects/environment-variables

---

**Última atualização**: 2025-01-27

