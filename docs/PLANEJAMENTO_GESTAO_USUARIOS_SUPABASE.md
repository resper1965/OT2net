# Planejamento: Gestão de Usuários via Supabase Auth

## 📋 Visão Geral

Este documento descreve o planejamento para gestão de usuários no OT2net, considerando que **os usuários serão administrados pelo sistema de autenticação do Supabase**. O sistema OT2net sincronizará dados adicionais na tabela `usuarios` e gerenciará permissões e perfis.

## 🎯 Objetivos

1. **Sincronização com Supabase Auth**: Usuários criados/gerenciados no Supabase
2. **Dados Extendidos**: Perfis, permissões e metadados na tabela `usuarios`
3. **Interface de Gestão**: Visualização e edição de dados estendidos
4. **Permissões Granulares**: Sistema de permissões por entidade e ação
5. **Integração Transparente**: Usuário não percebe a separação

## 🔄 Arquitetura de Sincronização

### Fluxo de Criação de Usuário

```
1. Admin cria usuário no Supabase Auth
   ↓
2. Trigger no Supabase cria registro em `usuarios`
   ↓
3. Sistema OT2net sincroniza dados adicionais
   ↓
4. Permissões e perfil são atribuídos
```

### Fluxo de Atualização

```
1. Admin atualiza usuário no Supabase Auth
   ↓
2. Trigger atualiza `usuarios` (email, status)
   ↓
3. Sistema OT2net atualiza dados estendidos
   (perfil, permissões, organização)
```

## 📊 Estrutura de Dados

### Supabase Auth (Gerenciado pelo Supabase)
- Email
- Senha (hash)
- Status (ativo/inativo)
- Metadata (raw_user_meta_data)
- Último login
- Email verificado

### Tabela `usuarios` (Gerenciado pelo OT2net)
- `supabase_user_id` (FK para auth.users)
- `nome`
- `perfil` (admin, Consultor, etc.)
- `organizacao`
- `status` (sincronizado com auth)
- `ultimo_acesso`
- `permissoes` (relação)

## 🔐 Sistema de Perfis e Permissões

### Perfis Padrão

| Perfil | Descrição | Gerenciado em |
|--------|-----------|---------------|
| **Admin** | Acesso total | Tabela `usuarios.perfil` |
| **Consultor** | Usuário padrão | Tabela `usuarios.perfil` |
| **Gerente** | Gestão de projetos | Tabela `usuarios.perfil` |
| **Visualizador** | Apenas leitura | Tabela `usuarios.perfil` |

### Permissões

Armazenadas na tabela `permissoes`:
- `entidade_tipo`: cliente, empresa, projeto, etc.
- `acao`: read, write, delete, admin

## 🛠️ Implementação

### 1. Triggers no Supabase

```sql
-- Sincronizar criação de usuário
CREATE OR REPLACE FUNCTION sync_user_from_auth()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO usuarios (
    supabase_user_id,
    email,
    nome,
    status,
    perfil
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
    CASE WHEN NEW.banned_until IS NULL THEN 'ativo' ELSE 'inativo' END,
    COALESCE(NEW.raw_user_meta_data->>'perfil', 'Consultor')
  )
  ON CONFLICT (supabase_user_id) 
  DO UPDATE SET
    email = EXCLUDED.email,
    status = CASE WHEN NEW.banned_until IS NULL THEN 'ativo' ELSE 'inativo' END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_from_auth();

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_from_auth();
```

### 2. API de Gestão

#### Listar Usuários
```typescript
GET /api/usuarios
// Busca na tabela usuarios (já sincronizada)
// Inclui dados do Supabase Auth via supabase_user_id
```

#### Obter Usuário
```typescript
GET /api/usuarios/:id
// Retorna dados da tabela usuarios
// + dados do Supabase Auth (se necessário)
```

#### Atualizar Dados Estendidos
```typescript
PATCH /api/usuarios/:id
Body: {
  nome?: string
  perfil?: string
  organizacao?: string
  // NÃO atualiza email/senha (feito no Supabase)
}
```

#### Atualizar no Supabase Auth
```typescript
POST /api/usuarios/:id/atualizar-auth
Body: {
  email?: string
  senha?: string
  metadata?: object
}
// Usa Supabase Admin API
```

### 3. Interface de Gestão

#### Página de Usuários
- Lista usuários da tabela `usuarios`
- Mostra dados sincronizados do Supabase
- Permite editar dados estendidos
- Link para gerenciar no Supabase (se admin)

#### Formulário de Edição
- Campos editáveis: nome, perfil, organização
- Campos somente leitura: email (gerenciado no Supabase)
- Botão "Gerenciar no Supabase" (abre painel admin)

## 🔄 Sincronização Bidirecional

### Supabase → OT2net
- **Automático via Triggers**: Criação, atualização de email/status
- **Manual via API**: Atualizar dados estendidos

### OT2net → Supabase
- **Via Admin API**: Atualizar email, senha, metadata
- **Via Dashboard Supabase**: Gerenciamento completo

## 📝 Funcionalidades

### 1. Visualização de Usuários
- Lista todos os usuários
- Filtros: perfil, status, organização
- Busca por nome/email
- Dados sincronizados em tempo real

### 2. Edição de Dados Estendidos
- Editar: nome, perfil, organização
- Gerenciar permissões
- Não edita: email, senha (Supabase)

### 3. Gestão de Permissões
- Sistema de permissões granular
- Aplicar permissões do perfil
- Permissões customizadas

### 4. Integração com Supabase Dashboard
- Link para painel admin do Supabase
- Sincronização automática de mudanças
- Status sempre atualizado

## 🛡️ Segurança

### Controle de Acesso
- Apenas admins podem gerenciar usuários
- Validação de permissões em todas as rotas
- Logs de auditoria

### Sincronização Segura
- Triggers validam dados
- API valida permissões
- Não permite edição direta de auth.users

## 📅 Fases de Implementação

### Fase 1: Triggers e Sincronização (Semana 1)
- [ ] Criar triggers no Supabase
- [ ] Testar sincronização automática
- [ ] Criar função de sincronização manual
- [ ] Documentar fluxo

### Fase 2: API de Gestão (Semana 2)
- [ ] Rotas para listar/obter usuários
- [ ] Rota para atualizar dados estendidos
- [ ] Rota para atualizar no Supabase (Admin API)
- [ ] Validações e segurança

### Fase 3: Interface (Semana 3)
- [ ] Página de listagem
- [ ] Página de detalhes
- [ ] Formulário de edição
- [ ] Integração com API

### Fase 4: Permissões (Semana 4)
- [ ] Gerenciador de permissões
- [ ] Aplicar permissões do perfil
- [ ] Integrar com rotas existentes

### Fase 5: Refinamento (Semana 5)
- [ ] Melhorias de UX
- [ ] Sincronização em tempo real
- [ ] Testes e documentação

## 🚀 Próximos Passos

1. **Criar triggers no Supabase**
2. **Testar sincronização**
3. **Criar API básica**
4. **Implementar interface**
5. **Integrar permissões**

---

**Versão**: 1.0  
**Data**: 2025-01-27  
**Autor**: Equipe OT2net

