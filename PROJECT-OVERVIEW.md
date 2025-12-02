# Overview do Projeto OT2net

**Data**: 2025-01-27  
**Status**: Planejamento e Especificação  
**Última Atualização**: 2025-01-27

---

## 📋 Resumo Executivo

O **OT2net** é um projeto de plataforma web administrativa inteligente para suportar a execução completa de projetos de consultoria em **Governança e Segurança de Tecnologia Operacional (TO)**. A plataforma utiliza IA (Claude API) para automatizar processamento de dados, análise e geração de documentação.

**Cliente**: Alupar/TBE  
**Consultoria**: ness.

---

## 🎯 Objetivo do Projeto

Criar uma plataforma PMO (Project Management Office) inteligente que:

- **Automatize** a coleta e processamento de informações operacionais
- **Estruture** dados de governança e segurança de TO
- **Facilite** a execução de projetos de consultoria em múltiplas fases
- **Gere** documentação e relatórios automaticamente
- **Monitore** progresso e conformidade com frameworks regulatórios

---

## 📁 Estrutura do Projeto

```
OT2net/
├── .specify/                    # Spec Kit - Ferramentas de Spec-Driven Development
│   ├── memory/
│   │   └── constitution.md      # Constituição do projeto
│   ├── scripts/bash/            # Scripts de automação
│   ├── templates/               # Templates para specs, plans, tasks
│   └── ...
├── .cursor/                     # Comandos do Cursor IDE
│   └── commands/                # Comandos speckit.*
├── specs/                       # Especificações de features
│   └── 001-governanca-to-pmo/   # Feature principal
│       ├── spec.md              # Especificação completa da feature
│       ├── template-synergy-analysis.md      # Análise do template shadcn-ui
│       ├── dashboard-detailed-analysis.md    # Análise detalhada de dashboards
│       ├── additional-components-analysis.md # Análise de componentes adicionais
│       └── questionarios-detailed-plan.md    # Planejamento de questionários
├── secure-ot-browser/           # Subprojeto relacionado (existente)
└── README.md                    # Documentação inicial
```

---

## ✅ O Que Já Foi Feito

### 1. Setup do Spec Kit
- ✅ Estrutura de diretórios do Spec Kit criada
- ✅ Constitution do projeto definida
- ✅ Templates para specs, plans, tasks criados
- ✅ Scripts bash de automação configurados
- ✅ Comandos do Cursor IDE criados

### 2. Especificação da Feature Principal
- ✅ Feature `001-governanca-to-pmo` criada
- ✅ Especificação completa com:
  - 6 User Stories priorizadas (P1 a P3)
  - 25 Functional Requirements (FR-001 a FR-025)
  - Entidades do modelo de dados definidas
  - Success Criteria estabelecidos
  - Edge Cases documentados

### 3. Análises Técnicas
- ✅ **Análise de Sinergia com Template**: Avaliação completa do template shadcn-ui-kit-dashboard
- ✅ **Análise de Dashboards**: Detalhamento de dashboards de gestão de projetos e controle de usuários
- ✅ **Análise de Componentes**: Kanban, File Management, Profile, Authentication, Error Pages, Settings, AI Chat v2, Todo List, Tasks, Calendar
- ✅ **Planejamento de Questionários**: Sistema completo de questionários/pesquisas (versão online)

---

## 📊 Especificação da Feature Principal

### User Stories (Priorizadas)

**P1 - Críticas (MVP):**
1. **Cadastramento e Onboarding do Cliente** - Fase -1
2. **Coleta de Descrições Operacionais Raw e Processamento Inteligente** - Fase 0
3. **Catálogo de Processos AS-IS e Visualização** - Fase 0

**P2 - Importantes:**
4. **Assessment de Maturidade e Análise de Conformidade** - Fase 1
5. **Plano Diretor com Iniciativas Priorizadas e Roadmap** - Fase 2

**P3 - Desejáveis:**
6. **PMO e Acompanhamento de Execução** - Fase 3

### Fases do Projeto

- **Fase -1**: Onboarding e Cadastramento
- **Fase 0**: Descoberta Operacional AS-IS (foco atual)
- **Fase 1**: Assessment de Maturidade
- **Fase 2**: Plano Diretor
- **Fase 3**: PMO e Execução

### Stack Tecnológica Planejada

**Frontend:**
- React 18
- TypeScript
- TailwindCSS
- shadcn/ui
- React Router
- Zustand/React Context
- Recharts (gráficos)
- Mermaid.js (diagramas)
- React Hook Form
- Axios
- Vite ou Next.js

**Backend:**
- Node.js (LTS)
- Express.js
- TypeScript
- Joi/Zod (validação)
- JWT (autenticação)
- Prisma/Knex.js (ORM)
- Anthropic SDK (Claude API)
- Bull/BullMQ (Redis para jobs)
- AWS S3/MinIO (storage)
- Winston/Pino (logging)

**Database:**
- PostgreSQL 14+
- Extensões: uuid-ossp, pg_trgm, pg-pool

**Infraestrutura:**
- Docker, Docker Compose
- CI/CD (GitHub Actions/GitLab CI)
- Cloud: AWS/Azure/GCP/Digital Ocean
- Nginx, Let's Encrypt

---

## 🎨 Template Base

**Template Escolhido**: shadcn-ui-kit-dashboard (bundui)

**Sinergia**: ✅ **ALTA**
- Stack 100% compatível (React, TypeScript, TailwindCSS, shadcn/ui)
- Componentes prontos para dashboards, CRUD, formulários
- Redução estimada de 40-50% no tempo de desenvolvimento

**Componentes Identificados para Uso:**
- ✅ Dashboard de Gestão de Projetos
- ✅ Dashboard de Controle de Usuários
- ✅ Kanban Board
- ✅ File Management
- ✅ Profile
- ✅ Authentication
- ✅ Error Pages
- ✅ Settings
- ✅ Calendar
- ✅ Todo List
- ✅ Tasks

**Componentes que Precisam Desenvolvimento Customizado:**
- 🔧 Sistema de Questionários
- 🔧 Interface de Revisão Lado-a-Lado (IA)
- 🔧 Roadmap Gantt Interativo
- 🔧 Renderização Mermaid
- 🔧 Chat IA (versão futura)
- 🔧 Matrizes e Heatmaps

---

## 📝 Documentação Criada

### 1. `specs/001-governanca-to-pmo/spec.md`
Especificação completa da feature principal com:
- User Stories detalhadas
- Functional Requirements
- Entidades do modelo de dados
- Success Criteria
- Edge Cases

### 2. `specs/001-governanca-to-pmo/template-synergy-analysis.md`
Análise de compatibilidade e sinergia com o template shadcn-ui-kit-dashboard:
- Compatibilidade de stack
- Componentes reutilizáveis
- Componentes que precisam customização
- Plano de adoção em 4 fases

### 3. `specs/001-governanca-to-pmo/dashboard-detailed-analysis.md`
Análise detalhada de dashboards:
- Dashboard de Gestão de Projetos (métricas, gráficos, lista de iniciativas)
- Dashboard de Controle de Usuários (lista, estatísticas, perfil, permissões)
- Dashboard de Conformidade
- Dashboard de Custos de IA
- Estrutura de dados e endpoints de API

### 4. `specs/001-governanca-to-pmo/additional-components-analysis.md`
Análise de componentes adicionais:
- Kanban (iniciativas, revisão, exceções)
- File Management (organização hierárquica)
- Profile (perfil completo)
- Authentication (fluxo JWT, 2FA)
- Error Pages (404, 403, 401, 500, 503)
- Settings (configurações de usuário)
- AI Chat v2 (visão futura)
- Todo List, Tasks, Calendar

### 5. `specs/001-governanca-to-pmo/questionarios-detailed-plan.md`
Planejamento completo do sistema de questionários:
- Arquitetura (Frontend + Backend)
- Página de criação/edição (4 abas)
- 10 tipos de questões
- Interface de preenchimento (desktop, tablet, mobile)
- Processamento e análise de respostas
- Dashboard de resultados
- **Nota**: Suporte offline será implementado em versão futura

---

## 🚀 Próximos Passos

### Imediatos (Próxima Sessão)
1. **Revisar e Validar Especificações**
   - Revisar `spec.md` com stakeholders
   - Validar user stories e requirements
   - Ajustar prioridades se necessário

2. **Criar Plano Técnico**
   - Executar `/speckit.plan` para gerar `plan.md`
   - Definir arquitetura técnica detalhada
   - Escolher stack final (Vite vs Next.js)
   - Definir estrutura de pastas

3. **Criar Breakdown de Tarefas**
   - Executar `/speckit.tasks` para gerar `tasks.md`
   - Priorizar tarefas por fase
   - Estimar esforço

### Curto Prazo (1-2 semanas)
4. **Setup do Projeto**
   - Inicializar repositório Git (se ainda não feito)
   - Setup do template shadcn-ui-kit-dashboard
   - Configurar ambiente de desenvolvimento
   - Setup do backend (Node.js + Express)
   - Configurar banco de dados (PostgreSQL)

5. **Implementação da Fase -1 (Onboarding)**
   - CRUD de Cliente, Empresa, Stakeholder, Site
   - Formulários de cadastramento
   - Geração de Relatório de Onboarding (PDF)

### Médio Prazo (3-8 semanas)
6. **Implementação da Fase 0 (Descoberta)**
   - Formulário de coleta de descrições raw
   - Integração com Claude API para processamento
   - Interface de revisão lado-a-lado
   - Geração de diagramas Mermaid
   - Catálogo de processos AS-IS

7. **Sistema de Questionários**
   - Criador de questionários
   - Interface de preenchimento
   - Dashboard de resultados
   - Processamento com IA (opcional)

8. **Dashboards e Visualizações**
   - Dashboard executivo
   - Dashboard da Fase 0
   - Kanban de iniciativas
   - Roadmap Gantt

### Longo Prazo (9+ semanas)
9. **Fases 1, 2 e 3**
   - Assessment de maturidade
   - Plano Diretor
   - PMO e execução

10. **Funcionalidades Avançadas**
    - Chat IA
    - Suporte offline (versão futura)
    - Integrações externas

---

## 📈 Status por Área

| Área | Status | Progresso | Observações |
|------|--------|-----------|-------------|
| **Especificação** | ✅ Completo | 100% | Spec completa, análises detalhadas |
| **Planejamento Técnico** | ⏳ Pendente | 0% | Aguardando `/speckit.plan` |
| **Breakdown de Tarefas** | ⏳ Pendente | 0% | Aguardando `/speckit.tasks` |
| **Setup do Projeto** | ⏳ Pendente | 0% | Aguardando início da implementação |
| **Frontend** | ⏳ Pendente | 0% | Template escolhido, aguardando setup |
| **Backend** | ⏳ Pendente | 0% | Stack definida, aguardando implementação |
| **Database** | ⏳ Pendente | 0% | Modelo de dados definido, aguardando schema |
| **Integração IA** | ⏳ Pendente | 0% | Claude API definida, aguardando implementação |

---

## 🎯 Decisões Técnicas

✅ **Decisões Tomadas:**

1. **Framework Frontend**: ✅ **Next.js**
   - Aproveita melhor o template shadcn-ui-kit-dashboard
   - SSR e otimizações nativas
   - API Routes integradas

2. **ORM**: ✅ **Prisma**
   - Type-safe, migrations automáticas
   - Melhor DX (Developer Experience)
   - Geração automática de tipos TypeScript

3. **Estado Global**: ✅ **React Context**
   - Nativo do React
   - Simples e suficiente para o escopo inicial
   - Pode migrar para Zustand se necessário no futuro

4. **Autenticação**: ✅ **JWT**
   - Stateless, escalável
   - Adequado para API REST
   - Refresh tokens para segurança

---

## 📚 Documentação de Referência

### Frameworks e Compliance
- **ANEEL 964/21**: Resolução Normativa sobre segurança cibernética
- **ONS RO-CB.BR.01**: Requisitos operacionais
- **CIS Controls v8.1**: Controles de segurança
- **ISA IEC 62443**: Segurança de sistemas de automação industrial
- **NIST SP 800-82**: Guia de segurança para sistemas de controle industrial

### Templates e Bibliotecas
- **shadcn-ui-kit-dashboard**: Template base escolhido
- **shadcn/ui**: Biblioteca de componentes
- **Mermaid.js**: Geração de diagramas
- **Recharts**: Gráficos e visualizações

---

## 🔄 Workflow do Spec Kit

O projeto utiliza **Spec-Driven Development** com o Spec Kit do GitHub:

1. **`/speckit.specify`**: Criar/atualizar especificação (`spec.md`)
2. **`/speckit.plan`**: Gerar plano técnico (`plan.md`)
3. **`/speckit.tasks`**: Criar breakdown de tarefas (`tasks.md`)
4. **`/speckit.implement`**: Implementar funcionalidade
5. **`/speckit.analyze`**: Analisar código
6. **`/speckit.clarify`**: Esclarecer dúvidas

**Status Atual**: ✅ Spec criada, aguardando Plan e Tasks

---

## 🎨 Design System

**Cores:**
- Tema escuro primário (slate-950 a slate-900)
- Accent color: cyan da ness (#00ade8)
- Paleta Slate da TailwindCSS

**Tipografia:**
- **Montserrat** (títulos) - Medium
- **Inter** (corpo)
- Logo "ness" com ponto "." em cyan (#00ade8)

**Componentes:**
- Base: shadcn/ui
- Customizações: Tema escuro, paleta específica

---

## 📊 Métricas do Projeto

- **Especificação**: 199 linhas (`spec.md`)
- **Análises Técnicas**: 4 documentos detalhados
- **User Stories**: 6 (3 P1, 2 P2, 1 P3)
- **Functional Requirements**: 25
- **Entidades**: 15+ definidas
- **Componentes Analisados**: 10+

---

## 🚨 Riscos e Dependências

### Riscos Identificados
1. **Complexidade de Relacionamentos**: Muitas entidades com relacionamentos complexos
2. **Performance com Grandes Volumes**: Muitos processos, ativos, iniciativas
3. **Processamento Assíncrono de IA**: Pode demorar, precisa feedback em tempo real
4. **Custos de IA**: Pode exceder orçamento se não controlado

### Dependências Externas
- **Claude API**: Essencial para processamento inteligente
- **Template shadcn-ui-kit-dashboard**: Base do frontend
- **PostgreSQL**: Banco de dados principal
- **S3/MinIO**: Armazenamento de arquivos

---

## 📞 Contatos e Recursos

- **Repositório**: `/home/resper/OT2net`
- **Spec Kit**: `.specify/`
- **Especificações**: `specs/001-governanca-to-pmo/`
- **Constitution**: `.specify/memory/constitution.md`

---

## ✅ Checklist de Próximas Ações

- [ ] Revisar especificação com stakeholders
- [ ] Executar `/speckit.plan` para gerar plano técnico
- [ ] Executar `/speckit.tasks` para criar breakdown de tarefas
- [ ] Decidir Vite vs Next.js
- [ ] Decidir Prisma vs Knex.js
- [ ] Decidir Zustand vs React Context
- [ ] Decidir JWT vs Session
- [ ] Inicializar repositório Git (se necessário)
- [ ] Setup do template shadcn-ui-kit-dashboard
- [ ] Configurar ambiente de desenvolvimento
- [ ] Setup do backend
- [ ] Configurar banco de dados
- [ ] Criar schema inicial do banco

---

**Última Atualização**: 2025-01-27  
**Próxima Revisão**: Após geração do `plan.md` e `tasks.md`

