# Checklist de Implementação - Gestão de Usuários

## ✅ Pré-requisitos

### Backend
- [ ] Verificar schema Prisma (Usuario, Permissao)
- [ ] Verificar integração com Supabase Auth
- [ ] Criar helpers de validação
- [ ] Criar helpers de permissões

### Frontend
- [ ] Criar estrutura de pastas
- [ ] Criar componentes base
- [ ] Configurar hooks customizados

## 📊 Fase 1: Fundação

### API - Rotas Básicas
- [ ] `GET /api/usuarios` - Listar usuários
  - [ ] Filtros: status, perfil, organização
  - [ ] Busca por nome/email
  - [ ] Paginação
  - [ ] Ordenação
- [ ] `GET /api/usuarios/:id` - Obter usuário
- [ ] `POST /api/usuarios` - Criar usuário
  - [ ] Validação de email único
  - [ ] Validação de senha (se criar diretamente)
  - [ ] Criação no Supabase Auth
  - [ ] Criação na tabela usuarios
- [ ] `PATCH /api/usuarios/:id` - Atualizar usuário
- [ ] `DELETE /api/usuarios/:id` - Deletar (soft delete)

### Helpers
- [ ] `_helpers/permissions.ts`
  - [ ] `hasPermission(user, entidade, acao)`
  - [ ] `getUserPermissions(user)`
  - [ ] `applyProfilePermissions(perfil)`
- [ ] `_helpers/user-validation.ts`
  - [ ] `validateEmail(email)`
  - [ ] `validatePassword(password)`
  - [ ] `validateUserData(data)`

### Integração Supabase
- [ ] Função para criar usuário no Auth
- [ ] Função para atualizar usuário no Auth
- [ ] Função para desabilitar usuário no Auth
- [ ] Sincronização de supabase_user_id

### Frontend - Listagem
- [ ] Página `/dashboard/usuarios`
- [ ] Componente `UserTable`
- [ ] Filtros básicos
- [ ] Paginação
- [ ] Loading states
- [ ] Error states

## 🔧 Fase 2: CRUD Completo

### Formulários
- [ ] Componente `UserForm`
  - [ ] Campos: nome, email, perfil, organização
  - [ ] Validação frontend
  - [ ] Estados de loading
  - [ ] Mensagens de erro
- [ ] Página `/dashboard/usuarios/novo`
- [ ] Página `/dashboard/usuarios/[id]/editar`
- [ ] Página `/dashboard/usuarios/[id]` (detalhes)

### Funcionalidades
- [ ] Ativar usuário
- [ ] Desativar usuário
- [ ] Validação de regras de negócio
  - [ ] Não pode desativar último admin
  - [ ] Não pode editar próprio perfil para admin
  - [ ] Email único

### Componentes UI
- [ ] `StatusBadge` - Badge de status
- [ ] `ProfileBadge` - Badge de perfil
- [ ] `UserCard` - Card de usuário
- [ ] `DeleteConfirmDialog` - Diálogo de confirmação

## 🔐 Fase 3: Permissões

### API - Permissões
- [ ] `GET /api/usuarios/:id/permissoes`
- [ ] `POST /api/usuarios/:id/permissoes`
- [ ] `DELETE /api/usuarios/:id/permissoes/:permissao_id`
- [ ] `POST /api/usuarios/:id/permissoes/aplicar-perfil`
- [ ] `GET /api/perfis` - Listar perfis
- [ ] `GET /api/perfis/:nome/permissoes` - Permissões padrão

### Frontend - Permissões
- [ ] Página `/dashboard/usuarios/[id]/permissoes`
- [ ] Componente `PermissionManager`
- [ ] Componente `PermissionMatrix`
- [ ] Aplicar permissões do perfil
- [ ] Permissões customizadas

### Middleware
- [ ] `requireAdmin` - Verificar se é admin
- [ ] `requirePermission` - Verificar permissão específica
- [ ] Integrar nas rotas existentes
- [ ] Proteger rotas de usuários

## 📧 Fase 4: Convites e Auditoria

### Sistema de Convites
- [ ] Modelo de dados (tabela ou campo em usuarios)
- [ ] `POST /api/usuarios/convites` - Criar convite
- [ ] `GET /api/usuarios/convites` - Listar convites
- [ ] `POST /api/usuarios/convites/:id/reenviar`
- [ ] `DELETE /api/usuarios/convites/:id`
- [ ] Envio de email com link
- [ ] Página de registro via convite
- [ ] Validação de token
- [ ] Expiração automática

### Frontend - Convites
- [ ] Página `/dashboard/usuarios/convites`
- [ ] Componente `InviteForm`
- [ ] Componente `InviteCard`
- [ ] Lista de convites pendentes
- [ ] Ações: reenviar, cancelar

### Auditoria
- [ ] Campo `ultimo_acesso` atualizado
- [ ] Log de ações (opcional)
- [ ] Página de histórico de acessos
- [ ] Componente `AccessTimeline`

## 🎨 Fase 5: Refinamento

### Filtros Avançados
- [ ] Filtro por múltiplos perfis
- [ ] Filtro por organização
- [ ] Filtro por data de criação
- [ ] Filtro por último acesso
- [ ] Busca avançada

### Exportação
- [ ] Exportar lista para CSV
- [ ] Exportar lista para PDF
- [ ] Relatório de usuários

### UX/UI
- [ ] Animações suaves
- [ ] Feedback visual de ações
- [ ] Empty states
- [ ] Skeleton loaders
- [ ] Tooltips informativos
- [ ] Confirmações de ações destrutivas

### Performance
- [ ] Lazy loading de dados
- [ ] Memoization de componentes
- [ ] Virtualização de listas longas
- [ ] Debounce em buscas

### Testes
- [ ] Testes unitários de helpers
- [ ] Testes de componentes
- [ ] Testes de integração
- [ ] Testes E2E (opcional)

### Documentação
- [ ] Documentar API
- [ ] Documentar componentes
- [ ] Guia de uso
- [ ] README atualizado

## 🔍 Validação Final

### Funcional
- [ ] CRUD completo funcionando
- [ ] Permissões aplicadas corretamente
- [ ] Convites funcionando
- [ ] Integração com Auth sincronizada
- [ ] Validações funcionando
- [ ] Regras de negócio implementadas

### Segurança
- [ ] Autenticação obrigatória
- [ ] Controle de acesso funcionando
- [ ] Validação de inputs
- [ ] Sanitização de dados
- [ ] Proteção contra XSS
- [ ] Rate limiting

### Performance
- [ ] Listagem carrega em < 1s
- [ ] Criação/edição em < 2s
- [ ] Sem memory leaks
- [ ] Scroll suave

### Acessibilidade
- [ ] Navegação por teclado
- [ ] Screen reader friendly
- [ ] Contraste adequado
- [ ] Labels descritivos

### Compatibilidade
- [ ] Funciona em Chrome
- [ ] Funciona em Firefox
- [ ] Funciona em Safari
- [ ] Responsivo mobile

---

**Última atualização**: 2025-01-27

