# Autenticação - Supabase Auth

Este documento descreve como a autenticação funciona no projeto OT2net usando **Supabase Auth**.

## Arquitetura

A autenticação é **100% gerenciada pelo Supabase Auth**, sem necessidade de implementar backend customizado para autenticação.

### Frontend (Next.js)

- **Cliente Supabase**: `frontend/src/lib/supabase/client.ts`
  - Usa `@supabase/supabase-js` para operações client-side
  - Configurado com `autoRefreshToken`, `persistSession`, `detectSessionInUrl`

- **Server Client**: `frontend/src/lib/supabase/server.ts`
  - Usa `@supabase/ssr` para operações server-side (Server Components, Server Actions)
  - Gerencia cookies automaticamente para manter sessão

- **Auth Context**: `frontend/src/contexts/AuthContext.tsx`
  - Gerencia estado global de autenticação
  - Escuta mudanças via `onAuthStateChange`
  - Hook `useAuth()` para acessar dados do usuário

- **Middleware**: `frontend/src/middleware.ts`
  - Protege rotas automaticamente
  - Atualiza sessão em cada requisição
  - Redireciona não autenticados para `/login`

### Backend (Express)

- **Admin Client**: `backend/src/lib/supabase.ts`
  - Usa **Service Role Key** para operações administrativas
  - Função `verifySupabaseToken()` para validar tokens JWT
  - Bypassa RLS quando necessário (apenas no backend)

## Fluxo de Autenticação

### 1. Registro (Apenas por Convite)

⚠️ **Registro público desabilitado** - Usuários só podem se registrar através de convites.

**Sistema de convites (a implementar):**
- Administradores geram links de convite
- Links contêm token único
- Usuário acessa `/invite/[token]` para criar conta
- Token é validado antes de permitir registro

**Fluxo futuro:**
```typescript
// Página de registro via convite (a criar)
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      nome,
      invite_token: token, // Token do convite
    },
  },
})
```

### 2. Login

```typescript
// frontend/src/app/(auth)/login/page.tsx
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
})
```

**O que acontece:**
1. Supabase valida credenciais
2. Cria sessão JWT
3. Armazena token em cookies (gerenciado pelo `@supabase/ssr`)
4. Retorna `user` e `session`

### 3. Verificação de Sessão

```typescript
// Middleware e AuthContext verificam automaticamente
const { data: { session } } = await supabase.auth.getSession()
const { data: { user } } = await supabase.auth.getUser()
```

### 4. Logout

```typescript
// frontend/src/contexts/AuthContext.tsx
await supabase.auth.signOut()
```

**O que acontece:**
1. Remove sessão do Supabase
2. Limpa cookies
3. Redireciona para `/login`

## Proteção de Rotas

### Frontend (Middleware)

O middleware protege automaticamente as seguintes rotas:

- `/dashboard`
- `/projetos`
- `/clientes`
- `/configuracoes`

**Comportamento:**
- Se não autenticado → redireciona para `/login?redirect=/rota-original`
- Se autenticado em `/login` → redireciona para `/dashboard`

### Backend (Express)

Para proteger rotas no backend, use o helper:

```typescript
import { verifySupabaseToken } from '@/lib/supabase'

app.get('/api/protected', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  const user = await verifySupabaseToken(token)
  
  if (!user) {
    return res.status(401).json({ error: 'Token inválido' })
  }

  // Usuário autenticado, continuar...
  res.json({ message: 'Acesso autorizado', userId: user.id })
})
```

## Sincronização com Tabela `usuarios`

Quando um usuário se registra no Supabase Auth, ele é criado na tabela `auth.users`, mas **não automaticamente** na tabela `usuarios` do Prisma.

**Solução recomendada:**

1. **Trigger no Supabase** (recomendado):
   ```sql
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS trigger AS $$
   BEGIN
     INSERT INTO public.usuarios (supabase_user_id, email, nome, perfil)
     VALUES (
       NEW.id,
       NEW.email,
       COALESCE(NEW.raw_user_meta_data->>'nome', 'Usuário'),
       'Consultor'
     );
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
   ```

2. **Ou criar manualmente via API** após registro:
   ```typescript
   // Após signUp bem-sucedido
   if (data.user) {
     await fetch('/api/usuarios/sync', {
       method: 'POST',
       body: JSON.stringify({ supabase_user_id: data.user.id }),
     })
   }
   ```

## Recuperação de Senha

```typescript
// frontend/src/app/(auth)/forgot-password/page.tsx
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`,
})
```

**Fluxo:**
1. Usuário solicita recuperação
2. Supabase envia email com link
3. Link redireciona para `/reset-password` com hash
4. Usuário define nova senha

## OAuth (Futuro - T021)

Para adicionar OAuth (Google, GitHub):

1. Configurar providers no Supabase Dashboard
2. Adicionar botões nas páginas de auth:
   ```typescript
   await supabase.auth.signInWithOAuth({
     provider: 'google',
     options: {
       redirectTo: `${window.location.origin}/dashboard`,
     },
   })
   ```

## Variáveis de Ambiente

### Frontend

```env
NEXT_PUBLIC_SUPABASE_URL=https://hyeifxvxifhrapfdvfry.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

### Backend

```env
NEXT_PUBLIC_SUPABASE_URL=https://hyeifxvxifhrapfdvfry.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
```

⚠️ **NUNCA** exponha a `SUPABASE_SERVICE_ROLE_KEY` no frontend!

## Referências

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

