# ✅ Resumo da Configuração de Variáveis no Vercel

**Data**: 2025-01-27  
**Projeto**: ot-2net

## 📊 Status Atual

### ✅ Variáveis Configuradas

As seguintes variáveis foram configuradas via CLI:

| Variável | Production | Preview | Development |
|----------|-----------|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ | ✅ |
| `SUPABASE_URL` | ✅ | ✅ | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ⚠️ | ⚠️ |

### ❌ Variáveis Faltando

| Variável | Status | Ação Necessária |
|----------|--------|-----------------|
| `DATABASE_URL` | ❌ Não configurada | **OBRIGATÓRIA** - Ver instruções abaixo |
| `SUPABASE_SERVICE_ROLE_KEY` (Preview/Dev) | ⚠️ Parcial | Adicionar para Preview e Development |

---

## 🔑 Próximos Passos

### 1. Obter DATABASE_URL do Supabase

**Esta é a variável mais crítica para resolver o erro 500 em `/api/clientes`.**

1. Acesse: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt/settings/database
2. Role até a seção **"Connection string"**
3. Selecione o modo **"Transaction"** (não Session)
4. Copie a connection string completa
5. **⚠️ IMPORTANTE**: Use a porta **6543** (Transaction Pooler)

**Formato esperado:**
```
postgresql://postgres.qaekhnagfzpwprvaxqwt:[SENHA]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### 2. Configurar DATABASE_URL no Vercel

Execute os seguintes comandos (substitua `[DATABASE_URL]` pela connection string obtida):

```bash
cd /home/resper/OT2net

# Production
printf "[DATABASE_URL]\n" | vercel env add DATABASE_URL production

# Preview
printf "[DATABASE_URL]\n" | vercel env add DATABASE_URL preview

# Development
printf "[DATABASE_URL]\n" | vercel env add DATABASE_URL development
```

**Ou use o script Python:**
```bash
python3 scripts/configurar-vercel-env.py
```

### 3. Verificar SUPABASE_SERVICE_ROLE_KEY

Se a `SUPABASE_SERVICE_ROLE_KEY` não estiver configurada para Preview e Development:

1. Obtenha a chave em: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt/settings/api
2. Seção: **Project API keys** > **service_role** (secret)

```bash
# Preview
printf "[SUA_SERVICE_ROLE_KEY]\n" | vercel env add SUPABASE_SERVICE_ROLE_KEY preview

# Development
printf "[SUA_SERVICE_ROLE_KEY]\n" | vercel env add SUPABASE_SERVICE_ROLE_KEY development
```

---

## ✅ Verificar Configuração Completa

Após configurar todas as variáveis, verifique:

```bash
vercel env ls
```

Você deve ver todas as variáveis listadas para Production, Preview e Development.

---

## 🔄 Aplicar Mudanças (Redeploy)

**CRÍTICO**: Após configurar as variáveis, faça um redeploy:

### Opção 1: Via CLI (Recomendado)
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

## 🧪 Testar após Redeploy

Após o redeploy, teste:

1. **Health Check:**
   ```bash
   curl https://ot-2net-nessbr-projects.vercel.app/api/health
   ```
   Deve retornar: `{"status":"ok"}`

2. **API de Clientes** (com token de autenticação):
   ```bash
   curl -H "Authorization: Bearer [seu-token]" \
        https://ot-2net-nessbr-projects.vercel.app/api/clientes
   ```
   Não deve retornar erro 500.

---

## 📝 Checklist Final

- [x] `NEXT_PUBLIC_SUPABASE_URL` configurada (todos os ambientes)
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurada (todos os ambientes)
- [x] `SUPABASE_URL` configurada (todos os ambientes)
- [x] `SUPABASE_SERVICE_ROLE_KEY` configurada (Production)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurada (Preview e Development)
- [ ] `DATABASE_URL` configurada (todos os ambientes) ⚠️ **CRÍTICO**
- [ ] Redeploy realizado
- [ ] Testes realizados

---

## 🔗 Links Úteis

- **Supabase Dashboard**: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Projeto Vercel**: https://vercel.com/nessbr-projects/ot-2net
- **Documentação Completa**: [`CONFIGURAR-VARIAVEIS-VERCEL.md`](./CONFIGURAR-VARIAVEIS-VERCEL.md)

---

**Última atualização**: 2025-01-27

