# Supabase Auto REST APIs

O Supabase gera automaticamente APIs REST para todas as tabelas do banco de dados, permitindo operações CRUD simples sem necessidade de código backend customizado.

## Configuração

As APIs REST são automaticamente habilitadas quando você usa o Supabase. Elas estão disponíveis em:

```
https://hyeifxvxifhrapfdvfry.supabase.co/rest/v1/{table_name}
```

## Autenticação

Todas as requisições devem incluir o header:

```
Authorization: Bearer {ANON_KEY ou JWT_TOKEN}
```

- **Anon Key**: Para operações que respeitam RLS (Row Level Security)
- **JWT Token**: Token do usuário autenticado (obtido via `supabase.auth.getSession()`)

## Uso no Frontend

### Exemplo: Listar Projetos

```typescript
import { supabase } from '@/lib/supabase/client'

// Listar todos os projetos (respeita RLS)
const { data, error } = await supabase
  .from('projetos')
  .select('*')
  .order('created_at', { ascending: false })
```

### Exemplo: Criar Projeto

```typescript
const { data, error } = await supabase
  .from('projetos')
  .select('*')
  .insert({
    nome: 'Novo Projeto',
    cliente_id: 'uuid-do-cliente',
    fase_atual: 'fase-0',
  })
```

### Exemplo: Atualizar Projeto

```typescript
const { data, error } = await supabase
  .from('projetos')
  .update({ progresso_geral: 50 })
  .eq('id', 'uuid-do-projeto')
```

### Exemplo: Deletar Projeto

```typescript
const { error } = await supabase
  .from('projetos')
  .delete()
  .eq('id', 'uuid-do-projeto')
```

## Filtros e Queries

### Filtros

```typescript
// Igualdade
.eq('status', 'ativo')

// Maior que
.gt('progresso_geral', 50)

// Menor que
.lt('created_at', '2024-01-01')

// Contém (para arrays)
.contains('sistemas_principais', ['SCADA'])

// Busca de texto (usando pg_trgm)
.ilike('nome', '%energia%')
```

### Relacionamentos

```typescript
// Incluir relacionamentos
.select(`
  *,
  cliente:clientes(*),
  membros_equipe:membros_equipe(*)
`)
```

### Paginação

```typescript
// Limite e offset
.range(0, 9) // Primeira página (10 itens)

// Ou usar limit/offset
.limit(10)
.offset(20) // Página 3
```

## Quando Usar Auto REST vs Express

### Use Auto REST APIs quando:
- ✅ Operações CRUD simples (create, read, update, delete)
- ✅ Filtros e queries básicas
- ✅ Não há lógica de negócio complexa
- ✅ RLS é suficiente para controle de acesso

### Use Express (backend customizado) quando:
- ❌ Lógica de negócio complexa
- ❌ Processamento com IA (Claude API)
- ❌ Validações complexas
- ❌ Integrações externas
- ❌ Cálculos e transformações de dados
- ❌ Operações em lote complexas

## Exemplos de Uso no Projeto

### Frontend: Listar Clientes

```typescript
// app/projetos/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState([])

  useEffect(() => {
    async function loadProjetos() {
      const { data, error } = await supabase
        .from('projetos')
        .select('*, cliente:clientes(nome, cnpj)')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao carregar projetos:', error)
        return
      }

      setProjetos(data || [])
    }

    loadProjetos()
  }, [])

  return (
    <div>
      {projetos.map((projeto) => (
        <div key={projeto.id}>
          <h3>{projeto.nome}</h3>
          <p>Cliente: {projeto.cliente?.nome}</p>
        </div>
      ))}
    </div>
  )
}
```

## Row Level Security (RLS)

⚠️ **IMPORTANTE**: Configure RLS policies no Supabase para controlar acesso aos dados.

Exemplo de policy:

```sql
-- Permitir que usuários vejam apenas projetos onde são membros da equipe
CREATE POLICY "Users can view projects they are members of"
ON projetos FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM membros_equipe
    WHERE membros_equipe.projeto_id = projetos.id
    AND membros_equipe.usuario_id = auth.uid()::text
  )
);
```

## Referências

- [Supabase Client Library](https://supabase.com/docs/reference/javascript/introduction)
- [PostgREST API](https://postgrest.org/en/stable/api.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

