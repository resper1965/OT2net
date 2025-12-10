# 🚀 Configuração de Variáveis de Ambiente no Vercel - Resumo Executivo

**Data**: 2025-01-27  
**Problema**: Erro 500 em `/api/clientes`  
**Solução**: Configurar variáveis de ambiente no Vercel

---

## ✅ Status Atual

### Variáveis Configuradas (via CLI)

| Variável | Production | Preview | Development |
|----------|-----------|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ | ✅ |
| `SUPABASE_URL` | ✅ | ✅ | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ⚠️ | ⚠️ |
| `DATABASE_URL` | ❌ | ❌ | ❌ |

---

## ⚠️ Ação Necessária

### 1. Configurar DATABASE_URL (CRÍTICO)

Esta variável é **obrigatória** para resolver o erro 500.

**Opção A: Script Rápido**
```bash
cd /home/resper/OT2net
./scripts/adicionar-database-url.sh
```

**Opção B: Manual**
```bash
# Obter em: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt/settings/database
# Modo: Transaction (porta 6543)

DATABASE_URL="postgresql://postgres.qaekhnagfzpwprvaxqwt:[SENHA]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

printf "$DATABASE_URL\n" | vercel env add DATABASE_URL production
printf "$DATABASE_URL\n" | vercel env add DATABASE_URL preview
printf "$DATABASE_URL\n" | vercel env add DATABASE_URL development
```

### 2. Completar SUPABASE_SERVICE_ROLE_KEY

**Opção A: Script Rápido**
```bash
cd /home/resper/OT2net
./scripts/adicionar-service-role-key.sh
```

**Opção B: Manual**
```bash
# Obter em: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt/settings/api
# Seção: Project API keys > service_role

SERVICE_ROLE_KEY="[sua_service_role_key]"

printf "$SERVICE_ROLE_KEY\n" | vercel env add SUPABASE_SERVICE_ROLE_KEY preview
printf "$SERVICE_ROLE_KEY\n" | vercel env add SUPABASE_SERVICE_ROLE_KEY development
```

---

## 🎯 Método Completo (Recomendado)

Use o script Python interativo que configura tudo de uma vez:

```bash
cd /home/resper/OT2net
python3 scripts/configurar-vercel-env.py
```

---

## 🔄 Após Configurar: Redeploy

**OBRIGATÓRIO**: Faça um redeploy para aplicar as mudanças:

```bash
vercel --prod
```

Ou via Git:
```bash
git commit --allow-empty -m "Aplicar variáveis de ambiente"
git push origin main
```

---

## ✅ Verificar

```bash
# Listar todas as variáveis
vercel env ls

# Deve mostrar DATABASE_URL e SUPABASE_SERVICE_ROLE_KEY para todos os ambientes
```

---

## 🧪 Testar

Após o redeploy:

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
- **Completar Configuração**: [`COMPLETAR-CONFIGURACAO-VERCEL.md`](./COMPLETAR-CONFIGURACAO-VERCEL.md)
- **Resumo**: [`RESUMO-CONFIGURACAO-VERCEL.md`](./RESUMO-CONFIGURACAO-VERCEL.md)

---

## 🛠️ Scripts Disponíveis

- `scripts/configurar-vercel-env.py` - Script Python interativo completo
- `scripts/configurar-vercel-env.sh` - Script Bash interativo
- `scripts/adicionar-database-url.sh` - Adicionar apenas DATABASE_URL
- `scripts/adicionar-service-role-key.sh` - Adicionar apenas SERVICE_ROLE_KEY

---

**Última atualização**: 2025-01-27

