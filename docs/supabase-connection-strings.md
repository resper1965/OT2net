# Como Obter Connection Strings do Supabase para Prisma

## Service Role Key

⚠️ **IMPORTANTE**: A Service Role Key não pode ser obtida via MCP por questões de segurança.

**Como obter manualmente:**

1. Acesse: https://app.supabase.com/project/hyeifxvxifhrapfdvfry/settings/api
2. Na seção "Project API keys", copie a **"service_role"** key (não a "anon" key)
3. Adicione no arquivo `backend/.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

## Connection Strings do Prisma

### DATABASE_URL (Connection Pooling)

1. Acesse: https://app.supabase.com/project/hyeifxvxifhrapfdvfry/settings/database
2. Na seção "Connection string", selecione:
   - **Connection pooling**: `Transaction` mode
   - **URI**: Copie a string

Formato esperado:
```
postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### DIRECT_URL (Conexão Direta)

1. Na mesma página, selecione:
   - **Direct connection**
   - **URI**: Copie a string

Formato esperado:
```
postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
```

### Adicionar no backend/.env.local

```env
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
```

⚠️ **IMPORTANTE**: 
- Substitua `[ref]`, `[password]`, `[region]` pelos valores reais
- A senha do banco está disponível no dashboard (Settings > Database > Database password)
- Se não souber a senha, você pode resetá-la no dashboard

## Verificação

Após configurar, teste a conexão:

```bash
cd backend
npm run prisma:generate
```

Se as connection strings estiverem corretas, o Prisma Client será gerado com sucesso.

