# Planejamento: Sistema de Notificações

## 📋 Visão Geral

Este documento descreve o planejamento para implementação de um sistema completo de notificações no OT2net, incluindo notificações em tempo real, toast notifications, centro de notificações e integração com Supabase Realtime.

## 🎯 Objetivos

1. **Notificações em Tempo Real**: Usando Supabase Realtime
2. **Toast Notifications**: Feedback imediato de ações
3. **Centro de Notificações**: Histórico e gestão de notificações
4. **Tipos de Notificação**: Sucesso, erro, aviso, info
5. **Persistência**: Armazenar notificações no banco
6. **Preferências**: Usuário pode configurar tipos de notificação
7. **Integração**: Notificações para eventos do sistema

## 📊 Estrutura Atual

### Funcionalidades Existentes
- ✅ Supabase Realtime configurado
- ✅ Hook `useRealtime.ts` com `useIAProcessingNotifications`
- ✅ Lucide-react com ícones (Bell, etc.)
- ❌ Sistema de toast não implementado (apenas `alert()` nativo)
- ❌ Centro de notificações não existe
- ❌ Persistência de notificações não implementada

### Necessidades Identificadas
- Substituir `alert()` por toast notifications
- Criar componente de centro de notificações
- Integrar com Supabase Realtime
- Criar schema de notificações no banco
- Sistema de preferências de usuário

## 🏗️ Arquitetura Proposta

### Stack Tecnológica

#### Opção 1: Sonner (Recomendado)
```json
{
  "sonner": "^1.4.0"
}
```
**Vantagens:**
- Leve e performático
- Suporte a dark mode
- Customizável
- TypeScript nativo
- Animações suaves

#### Opção 2: React Hot Toast
```json
{
  "react-hot-toast": "^2.4.1"
}
```
**Vantagens:**
- Popular e bem documentado
- Fácil de usar
- Boa performance

**Decisão: Usar Sonner** (mais moderno e melhor integração com Next.js)

### Schema de Banco de Dados

```prisma
model Notificacao {
  id              String    @id @default(dbgenerated("extensions.uuid_generate_v4()")) @db.Uuid
  usuario_id      String    @db.Uuid
  tipo            String    @db.Text  // "sucesso", "erro", "aviso", "info", "sistema"
  titulo          String    @db.Text
  mensagem        String?   @db.Text
  link            String?   @db.Text
  lida            Boolean   @default(false) @db.Boolean
  criada_em       DateTime  @default(now()) @db.Timestamptz(6)
  lida_em         DateTime? @db.Timestamptz(6)
  metadata        Json?     @db.JsonB  // Dados adicionais (projeto_id, etc.)
  
  usuario         Usuario?  @relation(fields: [usuario_id], references: [id], onDelete: Cascade)
  
  @@index([usuario_id])
  @@index([lida])
  @@index([criada_em])
  @@index([tipo])
  @@map("notificacoes")
}

model PreferenciaNotificacao {
  id              String    @id @default(dbgenerated("extensions.uuid_generate_v4()")) @db.Uuid
  usuario_id      String    @unique @db.Uuid
  email_ativo     Boolean   @default(true) @db.Boolean
  push_ativo      Boolean   @default(false) @db.Boolean
  tipos_habilitados String[] @db.Text  // ["sucesso", "erro", "aviso", "info", "sistema"]
  silenciar_ate   DateTime? @db.Timestamptz(6)
  
  usuario         Usuario?  @relation(fields: [usuario_id], references: [id], onDelete: Cascade)
  
  @@index([usuario_id])
  @@map("preferencias_notificacao")
}
```

### Componentes do Sistema

#### 1. **Toast Notifications (Sonner)**

```
src/
├── components/
│   ├── ui/
│   │   └── sonner.tsx          # Wrapper do Sonner
│   └── Toaster.tsx             # Provider do Toaster
├── lib/
│   ├── hooks/
│   │   └── useToast.ts         # Hook para exibir toasts
│   └── utils/
│       └── toast-helpers.ts    # Helpers para diferentes tipos
```

#### 2. **Centro de Notificações**

```
src/
├── components/
│   └── notifications/
│       ├── NotificationCenter.tsx    # Centro de notificações
│       ├── NotificationItem.tsx      # Item individual
│       ├── NotificationBell.tsx      # Badge com contador
│       └── NotificationDropdown.tsx  # Dropdown de notificações
├── app/
│   └── dashboard/
│       └── notificacoes/
│           └── page.tsx              # Página de histórico
```

#### 3. **Sistema de Notificações em Tempo Real**

```
src/
├── lib/
│   ├── hooks/
│   │   ├── useNotifications.ts       # Hook para notificações
│   │   └── useRealtimeNotifications.ts  # Hook para Realtime
│   └── services/
│       └── notification-service.ts   # Serviço de notificações
```

## 🔔 Tipos de Notificações

### Por Tipo

| Tipo | Ícone | Cor | Uso |
|------|-------|-----|-----|
| **Sucesso** | CheckCircle | Verde | Ações concluídas com sucesso |
| **Erro** | AlertCircle | Vermelho | Erros e falhas |
| **Aviso** | AlertTriangle | Amarelo | Alertas e advertências |
| **Info** | Info | Azul | Informações gerais |
| **Sistema** | Bell | Cinza | Notificações do sistema |

### Por Contexto

#### Projetos
- Projeto criado/atualizado
- Projeto atribuído ao usuário
- Prazo próximo/vencido
- Status alterado
- Novo membro adicionado

#### Processos
- Processo normalizado
- Processo aprovado/rejeitado
- Processo requer revisão
- Processamento de IA concluído

#### Tarefas
- Tarefa atribuída
- Tarefa concluída
- Comentário adicionado
- Prazo alterado

#### Sistema
- Novo usuário cadastrado
- Convite enviado
- Senha alterada
- Backup realizado

## 📐 Estrutura de Componentes

### 1. Toast Provider

```typescript
// components/Toaster.tsx
import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
    />
  )
}
```

### 2. Hook useToast

```typescript
// lib/hooks/useToast.ts
import { toast } from "sonner"

export function useToast() {
  return {
    success: (message: string, title?: string) => 
      toast.success(title || "Sucesso", { description: message }),
    error: (message: string, title?: string) => 
      toast.error(title || "Erro", { description: message }),
    warning: (message: string, title?: string) => 
      toast.warning(title || "Aviso", { description: message }),
    info: (message: string, title?: string) => 
      toast.info(title || "Informação", { description: message }),
  }
}
```

### 3. Centro de Notificações

```typescript
// components/notifications/NotificationCenter.tsx
- Dropdown com últimas notificações
- Badge com contador de não lidas
- Marcar como lida
- Link para página completa
- Filtros por tipo
```

## 🔄 Integração com Supabase Realtime

### Canal de Notificações

```typescript
// lib/hooks/useRealtimeNotifications.ts
const channel = supabase
  .channel('notifications')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notificacoes',
      filter: `usuario_id=eq.${userId}`
    },
    (payload) => {
      // Exibir toast
      // Atualizar contador
      // Adicionar à lista
    }
  )
  .subscribe()
```

### Triggers no Banco

```sql
-- Função para criar notificação
CREATE OR REPLACE FUNCTION criar_notificacao(
  p_usuario_id UUID,
  p_tipo TEXT,
  p_titulo TEXT,
  p_mensagem TEXT DEFAULT NULL,
  p_link TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_notificacao_id UUID;
BEGIN
  INSERT INTO notificacoes (
    usuario_id, tipo, titulo, mensagem, link, metadata
  ) VALUES (
    p_usuario_id, p_tipo, p_titulo, p_mensagem, p_link, p_metadata
  ) RETURNING id INTO v_notificacao_id;
  
  RETURN v_notificacao_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger para notificar quando projeto é atribuído
CREATE OR REPLACE FUNCTION notificar_atribuicao_projeto()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM criar_notificacao(
    NEW.usuario_id,
    'sistema',
    'Novo projeto atribuído',
    'Você foi adicionado ao projeto: ' || (SELECT nome FROM projetos WHERE id = NEW.projeto_id),
    '/dashboard/projetos/' || NEW.projeto_id,
    jsonb_build_object('projeto_id', NEW.projeto_id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_membro_equipe_created
  AFTER INSERT ON membros_equipe
  FOR EACH ROW
  EXECUTE FUNCTION notificar_atribuicao_projeto();
```

## 📱 API de Notificações

### Endpoints

```typescript
// Listar notificações
GET /api/notificacoes
  ?lida=true|false
  ?tipo=sucesso|erro|aviso|info|sistema
  ?limit=number
  ?offset=number

// Obter notificação
GET /api/notificacoes/:id

// Marcar como lida
PATCH /api/notificacoes/:id/lida

// Marcar todas como lidas
POST /api/notificacoes/marcar-todas-lidas

// Deletar notificação
DELETE /api/notificacoes/:id

// Contador de não lidas
GET /api/notificacoes/contador

// Preferências
GET /api/notificacoes/preferencias
PATCH /api/notificacoes/preferencias
```

## 🎨 Interface de Usuário

### 1. Badge de Notificações (Header/Sidebar)

```
┌─────────────────┐
│  🔔 (3)         │  ← Badge com contador
└─────────────────┘
```

### 2. Dropdown de Notificações

```
┌─────────────────────────────────────┐
│  Notificações          [Ver todas]  │
├─────────────────────────────────────┤
│  ✓ Projeto criado                   │
│    Há 5 minutos                     │
├─────────────────────────────────────┤
│  ⚠ Prazo próximo                    │
│    Projeto X vence em 2 dias        │
├─────────────────────────────────────┤
│  ℹ Processo normalizado             │
│    Processo Y foi normalizado       │
└─────────────────────────────────────┘
```

### 3. Página de Notificações

```
┌─────────────────────────────────────┐
│  Notificações                       │
│  [Filtros: Todas | Não lidas]       │
├─────────────────────────────────────┤
│  [Lista de notificações]            │
│  - Paginação                        │
│  - Marcar todas como lidas          │
│  - Deletar lidas                    │
└─────────────────────────────────────┘
```

## 📅 Fases de Implementação

### Fase 1: Fundação (Semana 1)
- [ ] Instalar Sonner
- [ ] Criar componente Toaster
- [ ] Criar hook useToast
- [ ] Substituir `alert()` por toast
- [ ] Adicionar Toaster no layout

**Entregáveis:**
- Toast notifications funcionando
- Substituição de alerts básicos

### Fase 2: Schema e API (Semana 2)
- [ ] Adicionar modelo Notificacao no Prisma
- [ ] Adicionar modelo PreferenciaNotificacao
- [ ] Criar migrations
- [ ] Criar rotas API básicas
- [ ] Criar helpers de criação de notificações

**Entregáveis:**
- Schema de notificações
- API funcional

### Fase 3: Centro de Notificações (Semana 3)
- [ ] Componente NotificationBell
- [ ] Componente NotificationDropdown
- [ ] Página de notificações
- [ ] Integração com API
- [ ] Marcar como lida

**Entregáveis:**
- Centro de notificações funcional
- Histórico de notificações

### Fase 4: Realtime (Semana 4)
- [ ] Hook useRealtimeNotifications
- [ ] Integrar com Supabase Realtime
- [ ] Triggers no banco
- [ ] Notificações automáticas
- [ ] Testes de tempo real

**Entregáveis:**
- Notificações em tempo real
- Triggers funcionando

### Fase 5: Integração e Refinamento (Semana 5)
- [ ] Integrar notificações em eventos do sistema
- [ ] Preferências de usuário
- [ ] Filtros avançados
- [ ] Melhorias de UX
- [ ] Testes e documentação

**Entregáveis:**
- Sistema completo
- Documentação

## 🔌 Integração com Eventos

### Eventos que Disparam Notificações

#### Projetos
```typescript
// Quando projeto é criado
notificarUsuario(usuarioId, {
  tipo: 'sucesso',
  titulo: 'Projeto criado',
  mensagem: `Projeto "${nome}" foi criado com sucesso`,
  link: `/dashboard/projetos/${id}`
})

// Quando projeto é atribuído
notificarUsuario(usuarioId, {
  tipo: 'sistema',
  titulo: 'Novo projeto atribuído',
  mensagem: `Você foi adicionado ao projeto "${nome}"`,
  link: `/dashboard/projetos/${id}`
})
```

#### Processos
```typescript
// Quando processo é normalizado
notificarUsuario(usuarioId, {
  tipo: 'info',
  titulo: 'Processo normalizado',
  mensagem: `Processo "${nome}" foi normalizado com sucesso`,
  link: `/dashboard/processos/${id}`
})
```

## 🎨 Design System

### Cores por Tipo
- **Sucesso**: Verde (#10b981)
- **Erro**: Vermelho (#ef4444)
- **Aviso**: Amarelo (#f59e0b)
- **Info**: Azul (#3b82f6)
- **Sistema**: Cinza (#6b7280)

### Componentes UI
- Badge com contador animado
- Dropdown com scroll
- Lista de notificações
- Empty state
- Loading states

## 📈 Métricas de Sucesso

### Funcional
- ✅ Toast notifications funcionando
- ✅ Centro de notificações funcional
- ✅ Realtime funcionando
- ✅ Persistência funcionando

### Performance
- Notificações aparecem em < 100ms
- Centro carrega em < 500ms
- Sem memory leaks

### UX
- Feedback claro e imediato
- Não intrusivo
- Fácil de gerenciar

## 🚀 Próximos Passos Imediatos

1. **Instalar Sonner**
2. **Criar componente Toaster**
3. **Substituir alerts básicos**
4. **Criar schema de notificações**
5. **Implementar API básica**

---

**Versão**: 1.0  
**Data**: 2025-01-27  
**Autor**: Equipe OT2net

