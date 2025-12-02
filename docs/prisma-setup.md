# Configuração do Prisma com Supabase

Este documento descreve como configurar o Prisma para trabalhar com o Supabase PostgreSQL.

## Connection String do Supabase

O Prisma precisa de duas URLs de conexão (Prisma 6):

1. **DATABASE_URL**: Para queries (usa connection pooling via PgBouncer)
2. **DIRECT_URL**: Para migrations (conexão direta ao PostgreSQL)

**Versão do Prisma**: 6.x (estável e compatível com Supabase)

### Como Obter as Connection Strings

1. Acesse o Supabase Dashboard: https://app.supabase.com/project/hyeifxvxifhrapfdvfry/settings/database

2. Na seção "Connection string", selecione:
   - **Connection pooling**: `Transaction` mode
   - **URI**: Copie a string (formato: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`)

3. Para **DIRECT_URL**, use a connection string **sem pooling**:
   - Selecione "Direct connection"
   - Copie a string (formato: `postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres`)

### Configuração no `.env.local`

Crie o arquivo `.env.local` no diretório `backend/`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hyeifxvxifhrapfdvfry.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# Database Connection (Prisma)
# DATABASE_URL usa connection pooling (PgBouncer) para queries
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true

# DIRECT_URL usa conexão direta para migrations
DIRECT_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres

# Server Configuration
PORT=3001
NODE_ENV=development

# Claude API (Anthropic)
ANTHROPIC_API_KEY=sua_anthropic_api_key_aqui

# Redis (para Bull jobs)
REDIS_URL=redis://localhost:6379
```

⚠️ **IMPORTANTE**: 
- Substitua `[ref]`, `[password]`, `[region]` pelos valores reais do seu projeto
- A senha do banco está disponível no dashboard do Supabase (Settings > Database > Database password)
- **NUNCA** commite o arquivo `.env.local` (já está no `.gitignore`)

## Comandos Prisma

### Gerar Cliente Prisma

```bash
cd backend
npm run prisma:generate
```

### Criar Migration

```bash
npm run prisma:migrate
```

### Aplicar Schema sem Migration (desenvolvimento)

```bash
npm run prisma:push
```

### Introspectar Banco Existente

Se o banco já existe no Supabase e você quer gerar o schema a partir dele:

```bash
npm run prisma:pull
```

### Abrir Prisma Studio

Interface visual para visualizar e editar dados:

```bash
npm run prisma:studio
```

## Estrutura do Schema

O schema Prisma está em `backend/prisma/schema.prisma`. Ele será expandido conforme o desenvolvimento do projeto.

## Row Level Security (RLS)

⚠️ **ATENÇÃO**: O Prisma **bypassa RLS do Supabase** porque se conecta diretamente ao PostgreSQL.

**Implicações**:
- Queries do Prisma não respeitam políticas RLS
- Você precisa implementar autorização manualmente no backend Express
- Use middleware para verificar permissões antes de executar queries

**Exemplo de Middleware**:

```typescript
import { verifySupabaseToken } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  const user = await verifySupabaseToken(token)
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid token' })
  }
  
  req.user = user
  next()
}

// Uso no controller
app.get('/api/projetos', requireAuth, async (req, res) => {
  // Verificar se usuário tem permissão para ver projetos
  const projetos = await prisma.projeto.findMany({
    where: {
      // Filtrar por permissões do usuário
      membros_equipe: {
        some: {
          usuario_id: req.user.id
        }
      }
    }
  })
  
  res.json(projetos)
})
```

## Próximos Passos

1. ✅ Prisma instalado e configurado
2. ⏳ Obter connection strings do Supabase
3. ⏳ Configurar `.env.local` com as credenciais
4. ⏳ Criar schema Prisma completo (T012)
5. ⏳ Executar primeira migration

## Referências

- [Prisma + Supabase Guide](https://supabase.com/docs/guides/database/prisma)
- [Prisma Connection URLs](https://www.prisma.io/docs/guides/database/connection-urls)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)

