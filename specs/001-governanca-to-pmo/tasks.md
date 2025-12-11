# Task Breakdown — 001-governanca-to-pmo

**Branch**: `001-governanca-to-pmo` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Overview

Este documento quebra a implementação do Sistema de Gestão de Governança e Segurança de TO em tarefas acionáveis, organizadas por fases e prioridades. As tarefas seguem a ordem de dependências e podem ser executadas em paralelo quando indicado com [P].

---

## Phase 1: Setup e Infraestrutura Base (Blocking Prerequisites)

**Purpose**: Configuração inicial do projeto, ambiente de desenvolvimento, e infraestrutura que DEVE estar completa antes de qualquer user story ser implementada.

**⚠️ CRITICAL**: Nenhum trabalho de user story pode começar até esta fase estar completa.

### Setup do Projeto

- [ ] T001 [P] Inicializar repositório Git (se ainda não feito)
- [ ] T002 [P] Setup do template shadcn-ui-kit-dashboard no diretório `frontend/`
- [ ] T003 [P] Configurar Next.js 14 com App Router, TypeScript, TailwindCSS
- [ ] T004 [P] Configurar ESLint, Prettier, e scripts de lint/format
- [ ] T005 [P] Setup do backend Express.js com TypeScript no diretório `backend/`
- [ ] T006 [P] Configurar estrutura de pastas do backend (routes, controllers, services, middleware)
- [ ] T007 [P] Criar projeto Supabase (free tier para desenvolvimento)
- [ ] T007A [P] Configurar Supabase: habilitar extensões (uuid-ossp, pg_trgm, pgvector)
- [ ] T007B [P] Configurar variáveis de ambiente Supabase (.env.local com SUPABASE_URL e SUPABASE_ANON_KEY)
- [ ] T008 [P] Configurar Prisma: instalar, inicializar, configurar schema básico (conectado ao Supabase PostgreSQL)
- [ ] T009 [P] Setup do Redis (Docker Compose) para cache e filas (Bull jobs)
- [ ] T010 [P] Configurar variáveis de ambiente (.env.example, .env.local)
- [ ] T011 [P] Setup do Docker Compose para ambiente de desenvolvimento completo (Redis apenas)

**Checkpoint**: Ambiente de desenvolvimento funcional, frontend e backend rodando localmente, banco de dados acessível.

---

## Phase 2: Fundação (Blocking Prerequisites)

**Purpose**: Infraestrutura core que DEVE estar completa antes de QUALQUER user story ser implementada.

**⚠️ CRITICAL**: Nenhum trabalho de user story pode começar até esta fase estar completa.

### Database Schema e Migrations

- [ ] T012 [P] Criar schema Prisma completo com todas as entidades principais:
  - Cliente, Empresa, Site, Stakeholder
  - Projeto, MembroEquipe
  - DescricaoOperacionalRaw, ProcessoNormalizado, ProcessoEtapa
  - Ativo, DificuldadeOperacional, Workaround
  - Questionario, Questao, RespostaQuestionario, RespostaQuestao
  - Iniciativa, Tarefa, Marco
  - Usuario, Permissao
  - ChamadaIA
- [ ] T013 [P] Configurar relacionamentos entre entidades no Prisma
- [ ] T014 [P] Adicionar índices para campos frequentemente consultados
- [ ] T015 [P] Criar migration inicial do banco de dados
- [ ] T016 [P] Configurar seeds básicos (usuário admin, dados de teste)

### Autenticação e Autorização (Supabase Auth)

- [ ] T017 [P] Instalar e configurar Supabase Client no frontend
- [ ] T018 [P] Criar páginas de autenticação usando Supabase Auth (login, register, forgot-password)
- [ ] T019 [P] Implementar React Context para autenticação (usando Supabase Auth state)
- [ ] T020 [P] Criar middleware de proteção de rotas no Next.js (verificando sessão Supabase)
- [ ] T021 [P] Configurar providers OAuth no Supabase (Google, GitHub - opcional)
- [ ] T022 [P] Implementar sistema de permissões granulares (modelo Permissao + RLS policies)
  - Criar tabela Permissao no Prisma
  - Configurar RLS policies no Supabase para controle de acesso
  - Middleware de autorização no Express (para rotas customizadas)
- [ ] T023 [P] Criar helper para verificar token Supabase no backend Express

### API Base e Middleware

- [ ] T024 [P] Configurar estrutura de rotas da API (Express) - apenas para lógica complexa
- [ ] T025 [P] Implementar middleware de tratamento de erros
- [ ] T026 [P] Implementar middleware de validação (usando Zod)
- [ ] T027 [P] Implementar middleware de rate limiting
- [ ] T028 [P] Configurar CORS adequadamente
- [ ] T029 [P] Implementar logging estruturado (Winston/Pino)
- [ ] T030 [P] Configurar Supabase Auto REST APIs (para CRUD simples via frontend)

### Integração Base com Gemini Pro API

- [ ] T031 [P] Configurar cliente Google Vertex AI SDK
- [ ] T032 [P] Criar serviço base de integração com Gemini Pro API
- [ ] T033 [P] Implementar retry logic e tratamento de erros
- [ ] T034 [P] Implementar tracking de custos (tokens, custo por chamada)
- [ ] T035 [P] Criar modelo ChamadaIA no Prisma para auditoria

### Vetorização de Frameworks Regulatórios

- [ ] T036A [P] Criar modelo Prisma: RequisitoFramework (com campo embedding)
- [ ] T036B [P] Criar modelo Prisma: AnaliseConformidade
- [ ] T036C [P] Habilitar extensão pgvector no Supabase (via SQL migration)
- [ ] T036D [P] Criar serviço de vetorização (VectorService)
- [ ] T036E [P] Implementar geração de embeddings usando Gemini Pro API
- [ ] T036F [P] Criar script de importação de requisitos dos frameworks (REN 964/21, ONS, CIS, ISA, NIST)
- [ ] T036G [P] Implementar processo de vetorização em lote dos requisitos
- [ ] T036H [P] Criar índice HNSW no Supabase PostgreSQL para busca rápida
- [ ] T036I [P] Implementar função de busca semântica (buscarRequisitosSimilares)
- [ ] T036J [P] Implementar função de análise de conformidade semântica

### File Storage (Supabase Storage)

- [ ] T037 [P] Criar buckets no Supabase Storage (documentos, questionarios, evidencias, diagramas)
- [ ] T038 [P] Configurar RLS policies para controle de acesso aos buckets
- [ ] T039 [P] Implementar serviço de upload/download usando Supabase Client
- [ ] T040 [P] Implementar geração de URLs temporárias (signed URLs) para downloads
- [ ] T041 [P] Criar helper para gerenciar organização de arquivos (pastas por projeto/entidade)

### Realtime (Supabase Realtime)

- [ ] T042 [P] Configurar Supabase Realtime no frontend
- [ ] T043 [P] Implementar subscriptions para notificações de processamento IA
- [ ] T044 [P] Implementar subscriptions para updates de iniciativas (progresso, status)
- [ ] T045 [P] Implementar subscriptions para novas respostas de questionários
- [ ] T046 [P] Criar hook React para gerenciar subscriptions Realtime

**Checkpoint**: Fundação pronta - implementação de user stories pode começar em paralelo.

---

## Phase 3: User Story 1 - Cadastramento e Onboarding (Priority: P1) 🎯 MVP

**Goal**: Permitir cadastramento completo do cliente e estrutura organizacional, gerando relatório de onboarding em PDF.

**Independent Test**: Cadastrar cliente completo e gerar PDF com todas as informações.

### Models e Database

- [ ] T037 [P] [US1] Implementar modelos Prisma: Cliente, Empresa, Site, Stakeholder, MembroEquipe
- [ ] T038 [P] [US1] Criar migrations para entidades de cadastramento
- [ ] T039 [US1] Implementar validações Zod para entidades de cadastramento

### Backend - API de Cadastramento

- [ ] T040 [US1] Criar rotas API para Cliente (CRUD)
- [ ] T040 [US1] Criar rotas API para Empresa (CRUD, vinculada a Cliente)
- [ ] T041 [US1] Criar rotas API para Site (CRUD, vinculada a Empresa)
- [ ] T042 [US1] Criar rotas API para Stakeholder (CRUD, vinculado a Projeto)
- [ ] T043 [US1] Criar rotas API para MembroEquipe (CRUD, vinculado a Projeto)
- [ ] T044 [US1] Implementar controllers com validação e tratamento de erros
- [ ] T045 [US1] Implementar serviços de negócio para cada entidade

### Frontend - Interface de Cadastramento

- [ ] T050 [US1] Criar página de cadastro de Cliente (formulário completo, usando Supabase Client)
- [ ] T051 [US1] Criar página de listagem de Clientes (tabela com filtros, usando Supabase queries)
- [ ] T052 [US1] Criar página de cadastro de Empresa (formulário, seleção de Cliente, Supabase Client)
- [ ] T053 [US1] Criar página de listagem de Empresas (Supabase queries)
- [ ] T054 [US1] Criar página de cadastro de Site (formulário, seleção de Empresa, Supabase Client)
- [ ] T055 [US1] Criar página de listagem de Sites (Supabase queries)
- [ ] T056 [US1] Criar página de cadastro de Stakeholder (formulário completo, Supabase Client)
- [ ] T057 [US1] Criar página de listagem de Stakeholders (Supabase queries)
- [ ] T058 [US1] Criar página de gestão de Equipe do Projeto (matriz RASCI, Supabase Client)
- [ ] T059 [US1] Implementar navegação entre entidades relacionadas

### Geração de Relatório PDF

- [ ] T060 [US1] Implementar serviço de geração de PDF (usando biblioteca como pdfkit ou puppeteer)
- [ ] T061 [US1] Criar template de Relatório de Onboarding
- [ ] T062 [US1] Implementar endpoint API Express para gerar relatório
- [ ] T063 [US1] Implementar upload do PDF gerado para Supabase Storage
- [ ] T064 [US1] Implementar download de PDF no frontend (via Supabase Storage signed URL)

**Checkpoint**: User Story 1 funcional e testável independentemente.

---

## Phase 4: User Story 2 - Coleta e Processamento de Descrições Raw (Priority: P1) 🎯 MVP

**Goal**: Coletar descrições operacionais raw de operadores e processar com IA para extrair processos normalizados estruturados.

**Independent Test**: Coletar descrição raw, processar com IA, validar extração de entidades com taxa de acerto > 80%.

### Models e Database

- [ ] T060 [P] [US2] Implementar modelo Prisma: DescricaoOperacionalRaw
- [ ] T061 [P] [US2] Implementar modelo Prisma: ProcessoNormalizado
- [ ] T062 [P] [US2] Implementar modelo Prisma: ProcessoEtapa
- [ ] T063 [P] [US2] Implementar modelo Prisma: Ativo
- [ ] T064 [P] [US2] Implementar modelo Prisma: DificuldadeOperacional
- [ ] T065 [P] [US2] Implementar modelo Prisma: Workaround
- [ ] T066 [US2] Criar migrations para entidades da Fase 0

### Backend - Processamento com IA

- [ ] T067 [US2] Criar serviço de processamento de descrições raw com Gemini Pro API
  - Prompt especializado de normalização
  - Extração de processo com etapas sequenciais
  - Identificação de ativos (formais e informais)
  - Mapeamento de localizações e contextos de rede
  - Identificação de dificuldades e workarounds
- [ ] T068 [US2] Implementar parsing de resposta JSON da IA
- [ ] T069 [US2] Implementar criação automática de entidades a partir do processamento
- [ ] T070 [US2] Implementar job assíncrono para processamento (Bull/Redis)
- [ ] T071 [US2] Criar rotas API para descrições raw (CRUD)
- [ ] T072 [US2] Criar rota API para processar descrição raw (POST /api/descricoes-raw/:id/processar)
- [ ] T073 [US2] Criar rotas API para processos normalizados (CRUD, aprovar, reprocessar)

### Frontend - Interface de Coleta

- [ ] T075 [US2] Criar formulário simples de coleta de descrição raw (usando Supabase Client)
  - Campos: título, descrição (texto livre), frequência, impacto, dificuldades
  - Captura automática de metadata (pessoa, site, cargo, data, turno)
- [ ] T076 [US2] Criar página de listagem de descrições raw (tabela com status, Supabase queries)
- [ ] T077 [US2] Implementar indicador de progresso de processamento (usando Realtime subscription)

### Frontend - Interface de Revisão Lado-a-Lado

- [ ] T078 [US2] Criar componente de revisão lado-a-lado (usando Supabase Client para queries)
  - Coluna esquerda: Descrição raw original com highlights
  - Coluna central: Resultado normalizado editável
  - Coluna direita: Ações (editar, aprovar, solicitar clarificação, reprocessar)
- [ ] T079 [US2] Implementar highlights mostrando mapeamento original → normalizado
- [ ] T080 [US2] Implementar edição inline do processo normalizado (Supabase updates)
- [ ] T081 [US2] Implementar funcionalidade de aprovação (via API Express)
- [ ] T082 [US2] Implementar funcionalidade de solicitar clarificação (Supabase + notificação Realtime)
- [ ] T083 [US2] Implementar funcionalidade de reprocessar com ajustes (via API Express)

### Geração de Diagramas Mermaid

- [ ] T084 [US2] Integrar biblioteca Mermaid.js no frontend
- [ ] T085 [US2] Criar serviço para gerar diagramas Mermaid a partir de processo normalizado
  - Flowchart simples
  - Swimlane
  - BPMN completo
  - Data flow
  - User journey
- [ ] T086 [US2] Implementar validação de sintaxe Mermaid
- [ ] T087 [US2] Criar componente de renderização de diagramas com zoom e controles
- [ ] T088 [US2] Implementar exportação de diagramas (PNG, SVG) e upload para Supabase Storage
- [ ] T089 [US2] Implementar regeneração de diagramas quando processo é editado (via Realtime)

**Checkpoint**: User Story 2 funcional e testável independentemente.

---

## Phase 5: User Story 3 - Catálogo de Processos AS-IS (Priority: P2)

**Goal**: Navegar processos normalizados, visualizar diagramas, consolidar processos similares, e gerar inventário de ativos.

**Independent Test**: Navegar catálogo, visualizar processos, consolidar processos similares, gerar inventário.

### Backend - Consolidação de Processos

- [ ] T089 [US3] Implementar serviço de similaridade de processos (usando embeddings)
- [ ] T090 [US3] Criar rota API para buscar processos similares
- [ ] T091 [US3] Implementar serviço de consolidação de processos similares
- [ ] T092 [US3] Criar rota API para consolidar processos
- [ ] T093 [US3] Criar rota API para inventário de ativos (agrupado por tipo, site, etc.)

### Frontend - Catálogo de Processos

- [ ] T094 [US3] Criar página de catálogo de processos (grid/lista com filtros)
- [ ] T095 [US3] Criar página de detalhes de processo (visualização completa)
- [ ] T096 [US3] Implementar visualização de diagramas na página de detalhes
- [ ] T097 [US3] Implementar filtros (por site, tipo, criticidade, status)
- [ ] T098 [US3] Implementar busca de processos

### Frontend - Consolidação

- [ ] T099 [US3] Criar interface para visualizar processos similares
- [ ] T100 [US3] Implementar funcionalidade de consolidar processos
- [ ] T101 [US3] Criar interface de drill-down (consolidado → detalhes)

### Frontend - Inventário de Ativos

- [ ] T102 [US3] Criar página de inventário de ativos (tabela com filtros)
- [ ] T103 [US3] Implementar agrupamento de ativos (por tipo, site, categoria)
- [ ] T104 [US3] Implementar visualização de ativos informais vs formais

**Checkpoint**: User Story 3 funcional e testável independentemente.

---

## Phase 6: Sistema de Questionários (Priority: P2)

**Goal**: Sistema completo de questionários/pesquisas para coleta escalável de feedback.

**Independent Test**: Criar questionário, publicar, coletar respostas, visualizar resultados.

### Models e Database

- [ ] T105 [P] [Questionarios] Implementar modelos Prisma: Questionario, Questao, RespostaQuestionario, RespostaQuestao
- [ ] T106 [Questionarios] Criar migrations para entidades de questionários

### Backend - API de Questionários

- [ ] T107 [Questionarios] Criar rotas API para Questionario (CRUD)
- [ ] T108 [Questionarios] Criar rotas API para Questao (CRUD, vinculada a Questionario)
- [ ] T109 [Questionarios] Implementar lógica de geração de link público único
- [ ] T110 [Questionarios] Criar rota API para publicar questionário
- [ ] T111 [Questionarios] Criar rota API para acessar questionário por link público (GET /api/questionarios/:link/responder)
- [ ] T112 [Questionarios] Criar rotas API para RespostaQuestionario (CRUD)
- [ ] T113 [Questionarios] Implementar validação de respostas (obrigatórias, formato)
- [ ] T114 [Questionarios] Criar serviço de análise estatística de respostas
- [ ] T115 [Questionarios] Criar rota API para resultados e análises (GET /api/questionarios/:id/resultados)

### Frontend - Criador de Questionários

- [ ] T116 [Questionarios] Criar página de criação/edição de questionário (4 abas: Configuração, Questões, Preview, Distribuição)
- [ ] T117 [Questionarios] Implementar editor de questões com 10 tipos diferentes
- [ ] T118 [Questionarios] Implementar drag-and-drop para reordenar questões
- [ ] T119 [Questionarios] Implementar lógica condicional de questões
- [ ] T120 [Questionarios] Implementar preview do questionário
- [ ] T121 [Questionarios] Implementar geração de QR Code para link público

### Frontend - Interface de Preenchimento

- [ ] T122 [Questionarios] Criar página de preenchimento de questionário (rota pública, Supabase Client)
- [ ] T123 [Questionarios] Implementar renderização de todos os tipos de questão
- [ ] T124 [Questionarios] Implementar validação em tempo real
- [ ] T125 [Questionarios] Implementar navegação entre questões (anterior, próxima)
- [ ] T126 [Questionarios] Implementar barra de progresso
- [ ] T127 [Questionarios] Implementar salvamento de progresso (Supabase upsert)
- [ ] T128 [Questionarios] Implementar design responsivo (desktop, tablet, mobile)
- [ ] T128A [Questionarios] Implementar upload de arquivos em questões (via Supabase Storage)

### Frontend - Dashboard de Resultados

- [ ] T129 [Questionarios] Criar página de resultados de questionário
- [ ] T130 [Questionarios] Implementar gráficos por questão (pizza, barras, etc.)
- [ ] T131 [Questionarios] Implementar análise de texto livre (nuvem de palavras, temas)
- [ ] T132 [Questionarios] Implementar comparações (por site, cargo, turno)
- [ ] T133 [Questionarios] Implementar exportação de resultados (Excel, CSV, PDF)

**Checkpoint**: Sistema de questionários funcional e testável.

---

## Phase 7: Dashboards e Visualizações (Priority: P2)

**Goal**: Dashboards executivos e visualizações para acompanhamento do projeto.

### Dashboard Executivo

- [ ] T134 [Dashboards] Criar página de dashboard executivo
- [ ] T135 [Dashboards] Implementar cards de métricas principais (8 cards)
- [ ] T136 [Dashboards] Implementar gráficos de evolução (linha, área)
- [ ] T137 [Dashboards] Implementar lista de iniciativas com status
- [ ] T138 [Dashboards] Implementar timeline de atividades recentes
- [ ] T139 [Dashboards] Implementar alertas e bloqueios críticos

### Dashboard da Fase 0

- [ ] T140 [Dashboards] Criar página de dashboard específica da Fase 0
- [ ] T141 [Dashboards] Implementar métricas de coleta (total, processadas, aprovadas)
- [ ] T142 [Dashboards] Implementar gráficos de coleta ao longo do tempo
- [ ] T143 [Dashboards] Implementar distribuição por site e criticidade
- [ ] T144 [Dashboards] Implementar mapa de calor de dificuldades
- [ ] T145 [Dashboards] Implementar nuvem de palavras (sistemas mais mencionados)

### Kanban Board

- [ ] T146 [Dashboards] Integrar biblioteca de Kanban (react-kanban ou similar)
- [ ] T147 [Dashboards] Criar Kanban de Iniciativas (colunas: Planejada, Em Execução, Concluída, etc.)
- [ ] T148 [Dashboards] Criar Kanban de Revisão de Processos
- [ ] T149 [Dashboards] Implementar drag-and-drop entre colunas
- [ ] T150 [Dashboards] Implementar filtros no Kanban

### Roadmap Gantt

- [ ] T151 [Dashboards] Integrar biblioteca de Gantt (react-gantt-chart ou similar)
- [ ] T152 [Dashboards] Criar componente de roadmap Gantt interativo
- [ ] T153 [Dashboards] Implementar drag-and-drop para ajustar datas
- [ ] T154 [Dashboards] Implementar visualização de dependências
- [ ] T155 [Dashboards] Implementar zoom (anos, trimestres, meses, semanas)
- [ ] T156 [Dashboards] Implementar destaque de caminho crítico

**Checkpoint**: Dashboards e visualizações funcionais.

---

## Phase 8: User Story 4 - Assessment de Maturidade (Priority: P2)

**Goal**: Avaliar maturidade em múltiplos domínios e analisar conformidade com frameworks.

**Independent Test**: Avaliar maturidade, gerar mapa visual, analisar conformidade.

### Models e Database

- [ ] T157 [P] [US4] Implementar modelos Prisma para avaliação de maturidade
- [ ] T158 [P] [US4] Implementar modelos Prisma para checklist de conformidade
- [ ] T159 [US4] Criar migrations para entidades de assessment

### Backend - Assessment

- [ ] T160 [US4] Criar rotas API para avaliação de maturidade
- [ ] T161 [US4] Implementar serviço de cálculo de maturidade por domínio
- [ ] T162 [US4] Criar rotas API para checklist de conformidade
- [ ] T163 [US4] Implementar serviço de análise de conformidade com frameworks
- [ ] T164 [US4] Implementar processamento de documentos com IA para extrair entidades e avaliar conformidade

### Frontend - Assessment

- [ ] T165 [US4] Criar interface de avaliação de maturidade (escala 1-5 por domínio)
- [ ] T166 [US4] Criar mapa visual de maturidade (heatmap)
- [ ] T167 [US4] Criar interface de checklist de conformidade
- [ ] T168 [US4] Implementar vinculação de evidências a requisitos
- [ ] T169 [US4] Criar dashboard de conformidade por framework

**Checkpoint**: User Story 4 funcional e testável.

---

## Phase 9: User Story 5 - Plano Diretor (Priority: P2)

**Goal**: Gerar iniciativas baseadas em gaps, priorizar e criar roadmap interativo.

**Independent Test**: Gerar iniciativas com IA, priorizar, criar roadmap.

### Models e Database

- [ ] T170 [P] [US5] Implementar modelos Prisma: Iniciativa, Risco, Gap, Indicador
- [ ] T171 [US5] Criar migrations para entidades do Plano Diretor

### Backend - Plano Diretor

- [ ] T172 [US5] Criar rotas API para Risco (CRUD)
- [ ] T173 [US5] Criar rotas API para Iniciativa (CRUD)
- [ ] T174 [US5] Implementar serviço de geração de iniciativas com IA (baseado em gaps)
- [ ] T175 [US5] Implementar serviço de priorização de iniciativas com IA (análise multi-critério)
- [ ] T176 [US5] Criar rotas API para Indicador/KPI/KRI (CRUD)
- [ ] T177 [US5] Implementar cálculo de indicadores

### Frontend - Plano Diretor

- [ ] T178 [US5] Criar página de gestão de Riscos (matriz de riscos)
- [ ] T179 [US5] Criar página de geração de Iniciativas (com IA)
- [ ] T180 [US5] Criar página de priorização de Iniciativas
- [ ] T181 [US5] Criar página de gestão de Indicadores
- [ ] T182 [US5] Integrar roadmap Gantt com iniciativas

**Checkpoint**: User Story 5 funcional e testável.

---

## Phase 10: User Story 6 - PMO e Execução (Priority: P3)

**Goal**: Acompanhar execução do Plano Diretor, gerenciar exceções, registrar comitês, gerar relatórios.

**Independent Test**: Acompanhar iniciativas, criar exceção, registrar comitê, gerar relatório.

### Models e Database

- [ ] T183 [P] [US6] Implementar modelos Prisma: ExcecaoRisco, Comite, AtaComite, Relatorio
- [ ] T184 [US6] Criar migrations para entidades de PMO

### Backend - PMO

- [ ] T185 [US6] Criar rotas API para ExcecaoRisco (CRUD, workflow de aprovação)
- [ ] T186 [US6] Implementar serviço de análise de impacto de exceção com IA
- [ ] T187 [US6] Criar rotas API para Comite e AtaComite (CRUD)
- [ ] T188 [US6] Criar rotas API para Relatorio (CRUD, geração)
- [ ] T189 [US6] Implementar serviço de geração de relatórios com IA (markdown → PDF/DOCX/PPTX)
- [ ] T190 [US6] Implementar monitoramento preditivo de iniciativas com IA

### Frontend - PMO

- [ ] T191 [US6] Criar página de acompanhamento de Iniciativas (com saúde e progresso)
- [ ] T192 [US6] Criar interface de workflow de exceções de risco
- [ ] T193 [US6] Criar página de gestão de Comitês
- [ ] T194 [US6] Criar interface de registro de Atas
- [ ] T195 [US6] Criar página de geração de Relatórios
- [ ] T196 [US6] Implementar análise preditiva de iniciativas (com IA)

**Checkpoint**: User Story 6 funcional e testável.

---

## Phase 11: Funcionalidades Adicionais

### File Management

- [ ] T197 [FileMgmt] Criar interface de gerenciamento de arquivos (hierárquica)
- [ ] T198 [FileMgmt] Implementar upload múltiplo de arquivos
- [ ] T199 [FileMgmt] Implementar preview de arquivos (PDF, imagens)
- [ ] T200 [FileMgmt] Implementar vinculação de arquivos a entidades
- [ ] T201 [FileMgmt] Implementar versionamento de arquivos

### Gestão de Usuários

- [ ] T202 [Users] Criar página de gestão de usuários (lista, CRUD)
- [ ] T203 [Users] Criar página de perfil de usuário completo
- [ ] T204 [Users] Criar interface de gestão de permissões granulares
- [ ] T205 [Users] Criar relatório de engajamento de usuários

### Settings e Configurações

- [ ] T206 [Settings] Criar página de configurações de usuário
- [ ] T207 [Settings] Implementar preferências (tema, idioma, notificações)
- [ ] T208 [Settings] Criar página de configurações do projeto

### Notificações

- [ ] T209 [Notifications] Implementar sistema de notificações in-app
- [ ] T210 [Notifications] Implementar notificações por email
- [ ] T211 [Notifications] Criar centro de notificações

### Dashboard de Custos de IA

- [ ] T212 [Costs] Criar página de dashboard de custos de IA
- [ ] T213 [Costs] Implementar gráficos de custos (por período, funcionalidade, fase)
- [ ] T214 [Costs] Implementar alertas de limite de custos
- [ ] T215 [Costs] Implementar configuração de limites

---

## Phase 12: Polish e Otimizações

### Performance

- [ ] T216 [Perf] Implementar paginação em todas as listas
- [ ] T217 [Perf] Implementar lazy loading de componentes
- [ ] T218 [Perf] Implementar cache no frontend (React Query)
- [ ] T219 [Perf] Implementar cache no backend (Redis)
- [ ] T220 [Perf] Otimizar queries do banco de dados (índices, N+1)

### Testes

- [ ] T221 [Tests] Escrever testes unitários para serviços críticos
- [ ] T222 [Tests] Escrever testes de integração para APIs
- [ ] T223 [Tests] Escrever testes E2E para fluxos principais
- [ ] T224 [Tests] Implementar testes de processamento com IA (casos reais)

### Documentação

- [ ] T225 [Docs] Documentar API (OpenAPI/Swagger)
- [ ] T226 [Docs] Criar guia de desenvolvimento
- [ ] T227 [Docs] Criar guia de deployment
- [ ] T228 [Docs] Documentar arquitetura

### Segurança

- [ ] T229 [Sec] Implementar auditoria de ações críticas
- [ ] T230 [Sec] Implementar rate limiting mais granular
- [ ] T231 [Sec] Implementar sanitização de inputs
- [ ] T232 [Sec] Realizar security audit

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Sem dependências - pode começar imediatamente
- **Phase 2 (Fundação)**: Depende de Phase 1 - BLOQUEIA todas as user stories
- **User Stories (Phase 3+)**: Todas dependem de Phase 2
  - User stories podem prosseguir em paralelo (se staffed)
  - Ou sequencialmente em ordem de prioridade (P1 → P2 → P3)
- **Phase 11-12 (Polish)**: Dependem de user stories principais completas

### User Story Dependencies

- **User Story 1 (P1)**: Pode começar após Phase 2 - Sem dependências de outras stories
- **User Story 2 (P1)**: Pode começar após Phase 2 - Sem dependências de outras stories
- **User Story 3 (P2)**: Depende de User Story 2 (precisa de processos normalizados)
- **User Story 4 (P2)**: Pode começar após Phase 2 - Pode integrar com US1/US2 mas é independente
- **User Story 5 (P2)**: Depende de User Story 4 (precisa de gaps identificados)
- **User Story 6 (P3)**: Depende de User Story 5 (precisa de iniciativas do Plano Diretor)

### Within Each User Story

- Models antes de services
- Services antes de controllers/routes
- Backend antes de frontend (quando aplicável)
- Core implementation antes de integração
- Story completa antes de mover para próxima prioridade

### Parallel Opportunities

- Todas as tarefas marcadas [P] podem rodar em paralelo
- Phase 1: Todas as tarefas podem rodar em paralelo
- Phase 2: Todas as tarefas podem rodar em paralelo (dentro da fase)
- Após Phase 2: User Stories podem começar em paralelo (se team capacity permitir)
- Models dentro de uma story marcados [P] podem rodar em paralelo
- Diferentes user stories podem ser trabalhadas em paralelo por diferentes membros do time

---

## Implementation Strategy

### MVP First (User Stories 1 e 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Fundação (CRITICAL - bloqueia todas as stories)
3. Complete User Story 1: Cadastramento e Onboarding
4. Complete User Story 2: Coleta e Processamento de Descrições Raw

**MVP Deliverable**: Sistema funcional para Fase -1 e Fase 0 básica.

### Incremental Expansion

Após MVP:
5. User Story 3: Catálogo de Processos
6. Sistema de Questionários
7. Dashboards básicos
8. User Stories 4, 5, 6 conforme prioridade

---

## Estimated Effort

**Phase 1 (Setup)**: 1 semana  
**Phase 2 (Fundação)**: 1.5 semanas (reduzido com Supabase)  
**User Story 1**: 1.5 semanas (reduzido com Supabase)  
**User Story 2**: 3 semanas  
**User Story 3**: 1 semana  
**Questionários**: 2 semanas  
**Dashboards**: 2 semanas  
**User Stories 4-6**: 4 semanas  
**Funcionalidades Adicionais**: 2 semanas  
**Polish**: 2 semanas  

**Total Estimado**: ~20 semanas (~5 meses) para sistema completo

**MVP (Phase 1 + 2 + US1 + US2)**: ~7 semanas (~1.75 meses) - **reduzido em ~1 semana com Supabase**

---

## Notes

- Todas as tarefas devem incluir testes quando aplicável
- Documentação deve ser atualizada conforme implementação
- Code reviews são obrigatórios antes de merge
- Deploy em staging antes de produção
- Monitoramento de custos de IA deve ser implementado desde o início

---

**Next Steps**: Começar com Phase 1 (Setup) e Phase 2 (Fundação) em paralelo.

