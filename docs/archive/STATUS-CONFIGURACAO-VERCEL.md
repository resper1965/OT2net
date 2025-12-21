# ✅ Status da Configuração de Variáveis no Vercel

**Data**: 2025-01-27  
**Projeto**: ot-2net

## 📊 Resumo Executivo

### ✅ Variáveis Configuradas

| Variável | Production | Preview | Development | Status |
|----------|-----------|---------|-------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | ✅ | ✅ Completo |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ | ✅ | ✅ Completo |
| `SUPABASE_URL` | ✅ | ✅ | ✅ | ✅ Completo |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ⚠️ | ⚠️ | ⚠️ Parcial |
| `DATABASE_URL` | ❌ | ❌ | ❌ | ❌ **FALTANDO** |

### ⚠️ Ação Necessária

**CRÍTICO**: A variável `DATABASE_URL` é obrigatória para resolver o erro 500 em `/api/clientes`.

---

## 🎯 Próximo Passo: Configurar DATABASE_URL

### Opção 1: Script Rápido (Recomendado)

```bash
cd /home/resper/OT2net
./scripts/adicionar-database-url.sh
```

O script irá solicitar a DATABASE_URL e configurá-la para todos os ambientes.

### Opção 2: Manual

1. **Obter DATABASE_URL:**
   - Acesse: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt/settings/database
   - Role até "Connection string"
   - Selecione modo **"Transaction"** (porta 6543)
   - Copie a connection string

2. **Configurar no Vercel:**
   ```bash
   cd /home/resper/OT2net
   
   # Substitua [DATABASE_URL] pela connection string obtida
   printf "[DATABASE_URL]\n" | vercel env add DATABASE_URL production
   printf "[DATABASE_URL]\n" | vercel env add DATABASE_URL preview
   printf "[DATABASE_URL]\n" | vercel env add DATABASE_URL development
   ```

### Opção 3: Completar SUPABASE_SERVICE_ROLE_KEY também

Se você também quiser completar a `SUPABASE_SERVICE_ROLE_KEY` para Preview e Development:

```bash
cd /home/resper/OT2net
./scripts/adicionar-service-role-key.sh
```

---

## 🔄 Após Configurar: Redeploy

**OBRIGATÓRIO**: Faça um redeploy para aplicar as mudanças:

```bash
vercel --prod
```

---

## ✅ Verificar

```bash
vercel env ls
```

Você deve ver `DATABASE_URL` listada para Production, Preview e Development.

---

## 🧪 Testar

Após o redeploy, teste:

```bash
# Health check
curl https://ot-2net-nessbr-projects.vercel.app/api/health

# API de clientes (com token)
curl -H "Authorization: Bearer [seu-token]" \
     https://ot-2net-nessbr-projects.vercel.app/api/clientes
```

O erro 500 deve estar resolvido! ✅

---

## 📚 Documentação

- **Guia Completo**: [`CONFIGURAR-VARIAVEIS-VERCEL.md`](./CONFIGURAR-VARIAVEIS-VERCEL.md)
- **Instruções CLI**: [`CONFIGURAR-VERCEL-ENV-CLI.md`](./CONFIGURAR-VERCEL-ENV-CLI.md)
- **Resumo**: [`RESUMO-CONFIGURACAO-VERCEL.md`](./RESUMO-CONFIGURACAO-VERCEL.md)

---

**Última atualização**: 2025-01-27

