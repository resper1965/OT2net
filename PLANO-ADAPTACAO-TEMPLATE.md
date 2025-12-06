# 📋 Plano de Adaptação ao Template de Dashboard

**Data**: 2025-01-27  
**Template**: https://github.com/resper1965/clone

## 🎯 Objetivo

Adaptar a aplicação OT2net para seguir o padrão do template de dashboard, mantendo todas as funcionalidades existentes.

## 📊 Estrutura do Template

### Layout
- `app/dashboard/(auth)/layout.tsx` - Layout para páginas autenticadas
- `app/dashboard/(guest)/layout.tsx` - Layout para páginas de convidados
- Usa `SidebarProvider`, `AppSidebar`, `SiteHeader` do shadcn/ui

### Componentes Principais
- `components/layout/sidebar/app-sidebar.tsx` - Sidebar principal
- `components/layout/sidebar/nav-main.tsx` - Navegação principal
- `components/layout/sidebar/nav-user.tsx` - Menu do usuário na sidebar
- `components/layout/header/index.tsx` - Header com search, notifications, theme
- `components/layout/header/user-menu.tsx` - Menu do usuário no header

## 🔄 Mudanças Necessárias

### 1. Reorganizar Estrutura de Rotas
- [ ] Mover páginas autenticadas para `app/dashboard/(auth)/`
- [ ] Mover páginas de convidados para `app/dashboard/(guest)/`
- [ ] Atualizar imports e links

### 2. Criar Componentes de Layout
- [ ] Copiar/adaptar `AppSidebar` do template
- [ ] Criar `NavMain` adaptado com itens de menu da OT2net
- [ ] Adaptar `NavUser` para usar dados do Supabase
- [ ] Criar `SiteHeader` adaptado
- [ ] Adaptar `UserMenu` para usar dados do Supabase

### 3. Adaptar Menu de Navegação
Itens de menu da OT2net:
- Dashboard
- Clientes
- Empresas
- Sites
- Projetos
- Processos
  - Descrições Raw
  - Catálogo
- Equipe
- Stakeholders
- Usuários
- Configurações

### 4. Atualizar Dependências
- [ ] Verificar se todas as dependências do template estão instaladas
- [ ] Atualizar componentes UI se necessário

### 5. Adaptar Autenticação
- [ ] Integrar NavUser com AuthContext
- [ ] Adaptar UserMenu para logout do Supabase

## 📝 Checklist de Implementação

- [ ] 1. Copiar componentes de layout do template
- [ ] 2. Adaptar NavMain com itens da OT2net
- [ ] 3. Adaptar NavUser e UserMenu para Supabase
- [ ] 4. Criar layout (auth) adaptado
- [ ] 5. Reorganizar rotas
- [ ] 6. Testar navegação
- [ ] 7. Testar autenticação
- [ ] 8. Verificar responsividade

---

**Status**: Em andamento


