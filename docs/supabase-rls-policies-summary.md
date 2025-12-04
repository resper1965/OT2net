# RLS Policies Criadas - Resumo

**Data**: 2025-01-27  
**Status**: ✅ Todas as RLS policies criadas via MCP

## 📊 Estatísticas

- **Total de tabelas com RLS**: 20+
- **Total de policies criadas**: 60+
- **Tabelas protegidas**: Todas as tabelas principais do sistema

## 🔒 Policies por Tabela

### Tabelas Principais

| Tabela | Policies | Descrição |
|--------|----------|-----------|
| `projetos` | 3 | Membros da equipe podem ver/atualizar projetos |
| `clientes` | 3 | Acesso baseado em projetos relacionados |
| `empresas` | 3 | Acesso baseado em clientes e projetos |
| `sites` | 3 | Acesso baseado em empresas, clientes e projetos |

### Tabelas de Projeto

| Tabela | Policies | Descrição |
|--------|----------|-----------|
| `membros_equipe` | 3 | Membros podem ver outros membros do mesmo projeto |
| `stakeholders` | 3 | Acesso baseado em projeto |
| `descricoes_operacionais_raw` | 3 | Acesso baseado em projeto |
| `processos_normalizados` | 3 | Acesso baseado em descrição raw e projeto |
| `processo_etapas` | 2 | Acesso baseado em processo normalizado |
| `ativos` | 2 | Acesso baseado em site e projeto |
| `dificuldades_operacionais` | 2 | Acesso baseado em processo normalizado |
| `workarounds` | 2 | Acesso baseado em processo normalizado |

### Questionários

| Tabela | Policies | Descrição |
|--------|----------|-----------|
| `questionarios` | 3 | Acesso baseado em projeto |
| `questoes` | 2 | Acesso baseado em questionário e projeto |
| `respostas_questionario` | 3 | Usuários podem criar suas próprias respostas |
| `respostas_questao` | 2 | Acesso baseado em resposta e questionário |

### Outras Tabelas

| Tabela | Policies | Descrição |
|--------|----------|-----------|
| `riscos` | 2 | Acesso baseado em projeto |
| `iniciativas` | 2 | Acesso baseado em projeto |
| `indicadores` | 2 | Acesso público para autenticados (globais) |
| `usuarios` | 3 | Usuários podem ver/atualizar apenas seu próprio perfil |
| `permissoes` | 2 | Usuários podem ver suas próprias permissões |
| `chamadas_ia` | 2 | Todos autenticados podem ver (auditoria) |
| `requisitos_framework` | 2 | Acesso público para leitura (análise de conformidade) |
| `analises_conformidade` | 2 | Acesso baseado em entidade (processo ou ativo) |

## 🔐 Estratégia de Segurança

### Princípios Aplicados

1. **Princípio do Menor Privilégio**: Usuários só têm acesso aos dados dos projetos dos quais são membros
2. **Isolamento por Projeto**: Dados são isolados por projeto através de `membros_equipe`
3. **Acesso Baseado em Relacionamentos**: Policies seguem a hierarquia Cliente → Empresa → Site → Projeto
4. **Autenticação Obrigatória**: Todas as policies requerem `authenticated` role

### Regras de Acesso

#### Para Tabelas Relacionadas a Projetos:
- **SELECT**: Membros da equipe do projeto
- **INSERT/UPDATE/DELETE**: Membros da equipe do projeto

#### Para Tabelas de Usuários:
- **SELECT/UPDATE**: Apenas o próprio usuário
- **INSERT**: Usuário pode criar seu próprio perfil

#### Para Tabelas Globais:
- **SELECT**: Todos autenticados
- **INSERT/UPDATE/DELETE**: Validado no backend (service role)

## 🛠️ Funções Helper

### `is_project_member(project_id uuid, user_id uuid)`

Função helper criada para verificar se um usuário é membro de um projeto.

```sql
CREATE OR REPLACE FUNCTION is_project_member(project_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
```

**Uso**: Pode ser usada em policies futuras para simplificar verificações.

## ⚠️ Avisos de Segurança Restantes

### Não Críticos (Avisos)

1. **Extension in Public Schema**: `pg_trgm` está no schema público
   - **Impacto**: Baixo
   - **Ação**: Pode ser movido para outro schema se necessário

2. **Leaked Password Protection**: Desabilitado
   - **Impacto**: Médio
   - **Ação**: Habilitar no Supabase Dashboard (Settings > Auth > Password)

### Corrigidos

- ✅ **Function Search Path**: Função `is_project_member` agora tem `SET search_path = public`
- ✅ **RLS Enabled No Policy**: Todas as tabelas agora têm policies

## 📝 Notas Importantes

1. **Service Role**: Algumas operações (como inserir chamadas IA) devem ser feitas via service role no backend
2. **Validação Adicional**: As policies são a primeira camada de segurança. Validação adicional deve ser feita no backend
3. **Testes**: Recomenda-se testar as policies com diferentes usuários e cenários

## 🔗 Referências

- [Supabase RLS Documentation](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [RLS Policies Best Practices](https://supabase.com/docs/guides/database/postgres/row-level-security#best-practices)





