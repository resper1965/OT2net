# Planejamento: Gestão de Usuários

## 📋 Visão Geral

Este documento descreve o planejamento para implementação completa do sistema de gestão de usuários no OT2net, incluindo CRUD, perfis, permissões, integração com Supabase Auth e interface administrativa.

## 🎯 Objetivos

1. **Gestão Completa de Usuários**: CRUD completo com validações
2. **Sistema de Perfis**: Admin, Consultor e perfis customizados
3. **Permissões Granulares**: Controle fino por entidade e ação
4. **Integração com Auth**: Sincronização com Supabase Auth
5. **Interface Administrativa**: Painel completo para gestão
6. **Auditoria**: Rastreamento de ações e acessos
7. **Segurança**: Validações, sanitização e controle de acesso

## 📊 Estrutura Atual

### Schema Prisma Existente

```prisma
model Usuario {
  id              String    @id @default(uuid_generate_v4())
  supabase_user_id String?  @unique
  nome            String
  email           String    @unique
  perfil          String?   @default("Consultor")
  organizacao     String?
  status          String?   @default("ativo")
  ultimo_acesso   DateTime?
  created_at      DateTime? @default(now())
  updated_at      DateTime? @default(now())
  permissoes      Permissao[]
}

model Permissao {
  id              String    @id @default(uuid_generate_v4())
  usuario_id      String?
  entidade_tipo   String    // Ex: "projeto", "cliente", "empresa"
  acao            String    // Ex: "read", "write", "delete", "admin"
  created_at      DateTime? @default(now())
  usuario         Usuario?  @relation(...)
}
```

### Funcionalidades Existentes
- ✅ Schema de banco de dados definido
- ✅ Integração com Supabase Auth
- ✅ Autenticação funcionando
- ✅ RLS policies básicas

### Funcionalidades Faltantes
- ❌ CRUD completo de usuários
- ❌ Interface de gestão
- ❌ Sistema de convites
- ❌ Gestão de permissões
- ❌ Histórico de acessos
- ❌ Validações e regras de negócio

## 🏗️ Arquitetura Proposta

### Componentes do Sistema

#### 1. **Backend (API Routes)**

```
api/
├── usuarios/
│   ├── index.ts              # GET (listar), POST (criar)
│   ├── [id].ts               # GET, PATCH, DELETE
│   ├── [id]/permissões.ts    # GET, POST, DELETE permissões
│   ├── [id]/ativar.ts        # POST ativar usuário
│   ├── [id]/desativar.ts     # POST desativar usuário
│   └── convite.ts            # POST enviar convite
├── perfis/
│   └── index.ts              # GET listar perfis disponíveis
└── _helpers/
    ├── permissions.ts        # Helpers de permissões
    └── user-validation.ts    # Validações de usuário
```

#### 2. **Frontend (Pages e Components)**

```
src/
├── app/
│   └── dashboard/
│       └── usuarios/
│           ├── page.tsx              # Lista de usuários
│           ├── novo/
│           │   └── page.tsx          # Criar usuário
│           ├── [id]/
│           │   ├── page.tsx          # Detalhes do usuário
│           │   ├── editar/
│           │   │   └── page.tsx      # Editar usuário
│           │   └── permissoes/
│           │       └── page.tsx      # Gerenciar permissões
│           └── convites/
│               └── page.tsx          # Gerenciar convites
├── components/
│   └── usuarios/
│       ├── UserTable.tsx             # Tabela de usuários
│       ├── UserForm.tsx              # Formulário de usuário
│       ├── PermissionManager.tsx     # Gerenciador de permissões
│       ├── InviteForm.tsx            # Formulário de convite
│       ├── UserStatusBadge.tsx       # Badge de status
│       ├── ProfileSelector.tsx       # Seletor de perfil
│       └── AccessHistory.tsx         # Histórico de acessos
└── lib/
    ├── hooks/
    │   ├── useUsers.ts               # Hook para usuários
    │   ├── usePermissions.ts         # Hook para permissões
    │   └── useInvites.ts             # Hook para convites
    └── utils/
        ├── permissions.ts            # Utilitários de permissões
        └── user-validation.ts        # Validações frontend
```

## 🔐 Sistema de Perfis e Permissões

### Perfis Padrão

| Perfil | Descrição | Permissões Padrão |
|--------|-----------|-------------------|
| **Admin** | Acesso total ao sistema | Todas as permissões |
| **Consultor** | Usuário padrão | Leitura em projetos atribuídos, escrita limitada |
| **Visualizador** | Apenas leitura | Apenas leitura em todas as entidades |
| **Gerente** | Gestão de projetos | CRUD completo em projetos, leitura em outras entidades |

### Permissões por Entidade

#### Entidades Disponíveis
- `cliente` - Clientes
- `empresa` - Empresas
- `site` - Sites
- `projeto` - Projetos
- `processo` - Processos
- `risco` - Riscos
- `usuario` - Usuários (apenas admin)
- `configuracao` - Configurações (apenas admin)

#### Ações Disponíveis
- `read` - Visualizar
- `write` - Criar e editar
- `delete` - Excluir
- `admin` - Acesso total (inclui gestão de permissões)

### Matriz de Permissões

```
                    | Cliente | Empresa | Projeto | Processo | Usuario |
--------------------|---------|---------|---------|----------|---------|
Admin               |   ALL   |   ALL   |   ALL   |   ALL    |   ALL   |
Consultor           |   R     |   R     |   RW    |   RW     |   -     |
Gerente             |   R     |   R     |   ALL   |   RW     |   -     |
Visualizador        |   R     |   R     |   R     |   R      |   -     |
```

## 📝 Funcionalidades Detalhadas

### 1. Listagem de Usuários

**Funcionalidades:**
- Tabela com paginação
- Filtros: status, perfil, organização
- Busca por nome/email
- Ordenação por colunas
- Ações rápidas: editar, desativar, ver detalhes

**Colunas:**
- Nome
- Email
- Perfil (badge)
- Organização
- Status (ativo/inativo)
- Último acesso
- Ações

### 2. Criação de Usuário

**Opções:**
- **Criar diretamente**: Cria usuário no Supabase Auth e na tabela usuarios
- **Enviar convite**: Envia email com link de registro

**Campos:**
- Nome (obrigatório)
- Email (obrigatório, único, validado)
- Perfil (obrigatório, select)
- Organização (opcional)
- Status (padrão: ativo)
- Permissões customizadas (opcional)

**Validações:**
- Email válido e único
- Nome mínimo 3 caracteres
- Perfil válido
- Se criar diretamente: senha forte (8+ caracteres, maiúscula, número)

### 3. Edição de Usuário

**Campos editáveis:**
- Nome
- Perfil
- Organização
- Status (ativar/desativar)
- Permissões

**Restrições:**
- Não pode editar próprio perfil para admin (precisa de outro admin)
- Não pode desativar último admin
- Email não pode ser alterado (criar novo usuário)

### 4. Gestão de Permissões

**Interface:**
- Lista de entidades disponíveis
- Checkboxes para ações (read, write, delete, admin)
- Aplicar permissões padrão do perfil
- Permissões customizadas por entidade

**Regras:**
- Admin tem todas as permissões automaticamente
- Permissões do perfil podem ser sobrescritas
- Validação: não pode remover permissão de admin de si mesmo

### 5. Sistema de Convites

**Fluxo:**
1. Admin cria convite com email e perfil
2. Sistema gera token único
3. Email enviado com link de registro
4. Usuário clica no link e completa cadastro
5. Usuário é criado no Supabase Auth e na tabela usuarios

**Funcionalidades:**
- Listar convites pendentes
- Reenviar convite
- Cancelar convite
- Expiração automática (7 dias)

### 6. Histórico de Acessos

**Informações:**
- Último acesso
- IP de acesso
- Navegador/SO
- Ações realizadas (log de auditoria)

**Visualização:**
- Timeline de acessos
- Filtros por data
- Exportação de relatório

## 🔄 Integração com Supabase Auth

### Sincronização

**Ao criar usuário:**
1. Criar no Supabase Auth (se não existir)
2. Criar registro na tabela `usuarios`
3. Vincular `supabase_user_id`
4. Enviar email de boas-vindas

**Ao atualizar:**
1. Atualizar tabela `usuarios`
2. Se mudar email: atualizar Supabase Auth
3. Se desativar: desabilitar no Supabase Auth

**Ao deletar:**
1. Marcar como deletado (soft delete)
2. Desabilitar no Supabase Auth
3. Manter histórico para auditoria

### Triggers e Funções

**Função SQL (Supabase):**
```sql
-- Sincronizar criação de usuário no Auth
CREATE OR REPLACE FUNCTION sync_user_from_auth()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO usuarios (supabase_user_id, email, nome, status)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email), 'ativo')
  ON CONFLICT (supabase_user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION sync_user_from_auth();
```

## 🛡️ Segurança e Validações

### Validações Backend

**Criação:**
- Email único e válido
- Senha forte (se criar diretamente)
- Perfil válido
- Verificar se usuário tem permissão para criar usuários

**Edição:**
- Não pode editar próprio perfil para admin
- Não pode desativar último admin
- Validar permissões antes de alterar

**Deleção:**
- Soft delete (marcar como deletado)
- Não pode deletar último admin
- Manter histórico

### Controle de Acesso

**Middleware:**
```typescript
// Verificar se é admin
export async function requireAdmin(req: AuthenticatedRequest) {
  const user = await getUsuarioBySupabaseId(req.userId);
  if (user?.perfil !== 'admin') {
    throw new Error('Acesso negado: requer perfil admin');
  }
}

// Verificar permissão específica
export async function requirePermission(
  req: AuthenticatedRequest,
  entidade: string,
  acao: string
) {
  const user = await getUsuarioBySupabaseId(req.userId);
  if (!hasPermission(user, entidade, acao)) {
    throw new Error(`Acesso negado: ${acao} em ${entidade}`);
  }
}
```

### Sanitização

- Sanitizar inputs (XSS prevention)
- Validar tipos de dados
- Limitar tamanho de campos
- Validar formato de email

## 📊 Interface de Usuário

### Página Principal (/dashboard/usuarios)

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  Usuários                    [+ Novo Usuário]   │
├─────────────────────────────────────────────────┤
│  [Filtros: Status | Perfil | Busca]            │
├─────────────────────────────────────────────────┤
│  [Tabela de Usuários]                           │
│  ┌───────────────────────────────────────────┐ │
│  │ Nome | Email | Perfil | Status | Ações   │ │
│  ├───────────────────────────────────────────┤ │
│  │ ...                                       │ │
│  └───────────────────────────────────────────┘ │
│  [Paginação]                                    │
└─────────────────────────────────────────────────┘
```

### Formulário de Usuário

**Campos:**
- Nome (text input)
- Email (email input, disabled se edição)
- Perfil (select com badges)
- Organização (text input, opcional)
- Status (toggle ativo/inativo)
- Seção de Permissões (expandível)

### Gerenciador de Permissões

**Interface:**
```
┌─────────────────────────────────────────┐
│  Permissões Customizadas                │
├─────────────────────────────────────────┤
│  Cliente    [✓] Read [✓] Write [ ] Del │
│  Empresa    [✓] Read [ ] Write [ ] Del │
│  Projeto    [✓] Read [✓] Write [✓] Del │
│  ...                                     │
│  [Aplicar Permissões do Perfil]         │
│  [Salvar Permissões]                    │
└─────────────────────────────────────────┘
```

## 📅 Fases de Implementação

### Fase 1: Fundação (Semana 1-2)
- [ ] Criar rotas API básicas (GET, POST, PATCH, DELETE)
- [ ] Implementar validações backend
- [ ] Criar helpers de permissões
- [ ] Integrar com Supabase Auth
- [ ] Criar página de listagem básica

**Entregáveis:**
- API funcional
- Listagem de usuários
- Validações básicas

### Fase 2: CRUD Completo (Semana 3-4)
- [ ] Formulário de criação
- [ ] Formulário de edição
- [ ] Página de detalhes
- [ ] Ativação/desativação
- [ ] Validações frontend

**Entregáveis:**
- CRUD completo funcional
- Interface de gestão básica

### Fase 3: Permissões (Semana 5-6)
- [ ] Gerenciador de permissões
- [ ] Aplicar permissões padrão do perfil
- [ ] Permissões customizadas
- [ ] Middleware de verificação
- [ ] Integrar permissões nas rotas existentes

**Entregáveis:**
- Sistema de permissões funcional
- Controle de acesso implementado

### Fase 4: Convites e Auditoria (Semana 7-8)
- [ ] Sistema de convites
- [ ] Envio de emails
- [ ] Página de convites pendentes
- [ ] Histórico de acessos
- [ ] Logs de auditoria

**Entregáveis:**
- Sistema de convites completo
- Auditoria básica

### Fase 5: Refinamento (Semana 9-10)
- [ ] Filtros avançados
- [ ] Exportação de relatórios
- [ ] Melhorias de UX
- [ ] Testes automatizados
- [ ] Documentação

**Entregáveis:**
- Sistema completo e testado
- Documentação atualizada

## 🔌 Endpoints da API

### Usuários

```typescript
// Listar usuários
GET /api/usuarios
  ?status=ativo|inativo
  ?perfil=admin|Consultor
  ?organizacao=string
  ?search=string
  ?page=number
  ?limit=number

// Obter usuário
GET /api/usuarios/:id

// Criar usuário
POST /api/usuarios
Body: {
  nome: string
  email: string
  perfil: string
  organizacao?: string
  senha?: string  // Se criar diretamente
  enviar_convite?: boolean
}

// Atualizar usuário
PATCH /api/usuarios/:id
Body: {
  nome?: string
  perfil?: string
  organizacao?: string
  status?: "ativo" | "inativo"
}

// Deletar usuário (soft delete)
DELETE /api/usuarios/:id

// Ativar usuário
POST /api/usuarios/:id/ativar

// Desativar usuário
POST /api/usuarios/:id/desativar
```

### Permissões

```typescript
// Listar permissões do usuário
GET /api/usuarios/:id/permissoes

// Adicionar permissão
POST /api/usuarios/:id/permissoes
Body: {
  entidade_tipo: string
  acao: string
}

// Remover permissão
DELETE /api/usuarios/:id/permissoes/:permissao_id

// Aplicar permissões do perfil
POST /api/usuarios/:id/permissoes/aplicar-perfil
```

### Convites

```typescript
// Listar convites
GET /api/usuarios/convites
  ?status=pending|accepted|expired

// Criar convite
POST /api/usuarios/convites
Body: {
  email: string
  perfil: string
  organizacao?: string
}

// Reenviar convite
POST /api/usuarios/convites/:id/reenviar

// Cancelar convite
DELETE /api/usuarios/convites/:id
```

### Perfis

```typescript
// Listar perfis disponíveis
GET /api/perfis

// Obter permissões padrão do perfil
GET /api/perfis/:nome/permissoes
```

## 🎨 Design System

### Componentes UI Necessários

- **UserTable**: Tabela com ações
- **UserForm**: Formulário reutilizável
- **PermissionMatrix**: Matriz de permissões
- **StatusBadge**: Badge de status (ativo/inativo)
- **ProfileBadge**: Badge de perfil (admin/Consultor)
- **InviteCard**: Card de convite pendente
- **AccessTimeline**: Timeline de acessos

### Cores e Estados

- **Ativo**: Verde
- **Inativo**: Cinza
- **Admin**: Azul (#00ade8)
- **Consultor**: Laranja
- **Pendente**: Amarelo
- **Expirado**: Vermelho

## 📈 Métricas de Sucesso

### Funcional
- ✅ CRUD completo funcional
- ✅ Permissões aplicadas corretamente
- ✅ Convites funcionando
- ✅ Integração com Auth sincronizada

### Performance
- Listagem carrega em < 1s
- Criação/edição em < 2s
- Sem memory leaks

### Segurança
- Validações em todas as entradas
- Controle de acesso funcionando
- Logs de auditoria completos

### UX
- Interface intuitiva
- Feedback claro de ações
- Mensagens de erro descritivas

## 🚀 Próximos Passos Imediatos

1. **Aprovação do Planejamento**: Revisar e aprovar
2. **Setup Inicial**: Criar estrutura de pastas
3. **API Básica**: Implementar rotas GET e POST
4. **Interface Básica**: Criar página de listagem
5. **Iteração**: Refinar baseado em feedback

## 📚 Referências

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Prisma Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [Next.js App Router](https://nextjs.org/docs/app)
- [RBAC Best Practices](https://en.wikipedia.org/wiki/Role-based_access_control)

---

**Versão**: 1.0  
**Data**: 2025-01-27  
**Autor**: Equipe OT2net

