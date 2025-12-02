# Configuração Supabase Realtime

Este documento descreve como configurar e usar o Supabase Realtime para atualizações em tempo real.

## Habilitar Realtime

1. Acesse: https://app.supabase.com/project/hyeifxvxifhrapfdvfry/database/replication
2. Habilite Realtime para as tabelas necessárias:
   - `chamadas_ia` - Notificações de processamento
   - `iniciativas` - Updates de progresso
   - `respostas_questionario` - Novas respostas
   - `processos_normalizados` - Status de processamento

## Uso no Frontend

### Hook useRealtime

```typescript
import { useRealtime } from '@/hooks/useRealtime'

function ProjetosList() {
  const [projetos, setProjetos] = useState([])

  useRealtime({
    table: 'projetos',
    onInsert: (payload) => {
      setProjetos((prev) => [...prev, payload.new])
    },
    onUpdate: (payload) => {
      setProjetos((prev) =>
        prev.map((p) => (p.id === payload.new.id ? payload.new : p))
      )
    },
  })

  return <div>...</div>
}
```

### Hook Específico: Notificações IA

```typescript
import { useIAProcessingNotifications } from '@/hooks/useRealtime'

function ProcessamentoIA({ projetoId }) {
  const { notifications, isConnected } = useIAProcessingNotifications(projetoId)

  return (
    <div>
      {notifications.map((notif) => (
        <div key={notif.id}>
          {notif.funcionalidade}: {notif.sucesso ? 'Sucesso' : 'Erro'}
        </div>
      ))}
    </div>
  )
}
```

### Hook Específico: Updates de Iniciativas

```typescript
import { useIniciativasUpdates } from '@/hooks/useRealtime'

function IniciativasList({ projetoId }) {
  const { updates, isConnected } = useIniciativasUpdates(projetoId)

  // Atualizar lista quando houver updates
  useEffect(() => {
    if (updates.length > 0) {
      // Refetch ou atualizar estado
    }
  }, [updates])

  return <div>...</div>
}
```

## Configuração de RLS

Realtime respeita RLS policies. Certifique-se de que as policies permitem que usuários vejam os dados:

```sql
-- Exemplo: Permitir que membros da equipe vejam iniciativas do projeto
CREATE POLICY "Team members can view initiatives"
ON iniciativas FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM membros_equipe
    WHERE membros_equipe.projeto_id = iniciativas.projeto_id
    AND membros_equipe.usuario_id = auth.uid()::text
  )
);
```

## Referências

- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Realtime Subscriptions](https://supabase.com/docs/guides/realtime/subscriptions)

