# 🔗 Como Obter as Connection Strings do Supabase

**Projeto**: `qaekhnagfzpwprvaxqwt`

## 📋 Passo a Passo

### 1. Acessar o Dashboard do Supabase

Acesse: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt/settings/database

### 2. Obter DATABASE_URL (Connection Pooling)

1. Role a página até a seção **"Connection string"**
2. Selecione o modo **"Transaction"** (não Session)
3. Copie a connection string completa
4. Cole no arquivo `backend/.env.local` na variável `DATABASE_URL`

**Formato esperado**:
```
postgresql://postgres.qaekhnagfzpwprvaxqwt:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### 3. Obter DIRECT_URL (Direct Connection)

1. Na mesma página, role até **"Connection string"**
2. Selecione **"Direct connection"**
3. Copie a connection string completa
4. Cole no arquivo `backend/.env.local` na variável `DIRECT_URL`

**Formato esperado**:
```
postgresql://postgres.qaekhnagfzpwprvaxqwt:[PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres
```

### 4. Atualizar o arquivo .env.local

Edite o arquivo `backend/.env.local` e substitua:

```bash
DATABASE_URL=OBTER_NO_DASHBOARD_SUPABASE
DIRECT_URL=OBTER_NO_DASHBOARD_SUPABASE
```

Pelos valores copiados do dashboard.

### 5. Verificar a Configuração

Após atualizar, execute:

```bash
cd backend
npx prisma db pull --print
```

Se funcionar, a conexão está configurada corretamente!

---

## ⚠️ Importante

- **Nunca** faça commit do arquivo `.env.local` no Git
- A senha do banco está na connection string - mantenha-a segura
- Use `DATABASE_URL` para operações normais (com pooling)
- Use `DIRECT_URL` apenas para migrations do Prisma

---

**Última atualização**: 2025-01-27

