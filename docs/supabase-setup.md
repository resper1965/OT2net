# Configuração do Supabase

Este documento descreve como configurar e usar o Supabase no projeto OT2net.

## Credenciais Configuradas

As credenciais do Supabase já estão configuradas no projeto:

- **URL**: `https://hyeifxvxifhrapfdvfry.supabase.co`
- **Publishable Key (Anon Key)**: `sb_publishable_RMMpXpKBjUDFNQt9_X0aog_GzLv4jzd`
  - ✅ **Segura para frontend** - Pode ser commitada (é pública)
  - ✅ Respeita políticas RLS (Row Level Security)
  - ✅ Limitada pelas permissões configuradas

## Variáveis de Ambiente

### Frontend (Next.js)

```env
NEXT_PUBLIC_SUPABASE_URL=https://hyeifxvxifhrapfdvfry.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_RMMpXpKBjUDFNQt9_X0aog_GzLv4jzd
```

✅ **Publishable Key é segura para frontend** - Pode ser commitada no `.env.example` pois é pública e respeita RLS.

### Backend (Express)

```env
NEXT_PUBLIC_SUPABASE_URL=https://hyeifxvxifhrapfdvfry.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<obter_em_dashboard_supabase>
```

⚠️ **CRÍTICO - SEGURANÇA**: 

**A Service Role Key NUNCA deve ser commitada no git!**

Ela tem acesso total ao banco de dados, bypassando todas as políticas RLS. Se exposta, permite acesso completo aos dados.

**Como configurar:**
1. Acesse: https://app.supabase.com/project/hyeifxvxifhrapfdvfry/settings/api
2. Copie a "service_role" key (não a "anon" key)
3. Adicione em `.env.local` (que está no `.gitignore`)
4. **NUNCA** adicione em arquivos que serão commitados
5. **NUNCA** compartilhe essa chave publicamente

**Verificação:**
- ✅ `.env.local` está no `.gitignore`
- ✅ `.env.example` não contém a chave real
- ✅ Apenas a URL e Anon Key (pública) estão no `.env.example`

## Clientes Supabase

### Frontend - Client Component

```typescript
import { supabase } from '@/lib/supabase/client'

// Usar em componentes React
const { data, error } = await supabase
  .from('clientes')
  .select('*')
```

### Frontend - Server Component

```typescript
import { createServerClient } from '@/lib/supabase/server'

// Usar em Server Components e Server Actions
const supabase = createServerClient()
const { data } = await supabase.from('clientes').select('*')
```

### Backend - Express

```typescript
import { supabaseAdmin, verifySupabaseToken } from '@/lib/supabase'

// Verificar token em middleware
const user = await verifySupabaseToken(req.headers.authorization)

// Usar admin client (bypass RLS quando necessário)
const { data } = await supabaseAdmin.from('clientes').select('*')
```

## Próximos Passos

1. ✅ Credenciais configuradas
2. ✅ Extensões habilitadas (uuid-ossp, pg_trgm, pgvector)
3. ⏳ Obter Service Role Key do dashboard
4. ⏳ Configurar variáveis de ambiente (ver `docs/env-setup.md`)
5. ⏳ Configurar RLS policies
6. ⏳ Criar buckets de storage

## Extensões Necessárias

✅ **Todas as extensões já estão habilitadas**:

- ✅ `uuid-ossp` (v1.1) - Geração de UUIDs
- ✅ `pg_trgm` (v1.6) - Busca de similaridade de texto
- ✅ `vector` (v0.8.0) - pgvector para embeddings e busca semântica

Verificado via MCP Supabase em 2025-01-27.

## Storage Buckets

Criar os seguintes buckets no Supabase Storage:

1. `documentos` - Documentos do projeto (PDFs, DOCX)
2. `questionarios` - Anexos de questionários
3. `evidencias` - Evidências de conformidade
4. `diagramas` - Diagramas Mermaid exportados

## Referências

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

