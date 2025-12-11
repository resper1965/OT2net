# Implementation Plan: Sistema de Gestão de Governança e Segurança de TO - Plataforma PMO Inteligente

**Branch**: `001-governanca-to-pmo` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-governanca-to-pmo/spec.md`

## Summary

Plataforma web administrativa inteligente para suportar projetos de consultoria em Governança e Segurança de Tecnologia Operacional (TO). A plataforma automatiza coleta e processamento de informações operacionais usando IA (Gemini Pro API), estrutura dados de governança, facilita execução de projetos em múltiplas fases, gera documentação automaticamente e monitora progresso e conformidade com frameworks regulatórios (ANEEL 964/21, ONS RO-CB.BR.01, CIS Controls v8.1, ISA IEC 62443, NIST SP 800-82).

**Abordagem Técnica**: Aplicação web full-stack usando Next.js (React 18) no frontend, arquitetura híbrida com Supabase (Auth, Storage, Realtime, PostgreSQL gerenciado) e Node.js/Express para lógica de negócio complexa e processamento IA. Prisma como ORM, pgvector para busca semântica, e integração com Gemini Pro API para processamento inteligente. Template base shadcn-ui-kit-dashboard será adaptado para acelerar desenvolvimento de componentes UI.

## Technical Context

**Language/Version**: 
- TypeScript 5.x
- Node.js LTS (20.x ou superior)
- React 18
- Next.js 14+ (App Router)

**Primary Dependencies**: 
- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS, shadcn/ui, React Hook Form, Zod, Recharts, Mermaid.js, Supabase Client, React Context API
- **Backend (Express)**: Express.js, TypeScript, Prisma, Google Vertex AI SDK (Gemini Pro API), Bull/BullMQ (Redis), Winston/Pino
- **Supabase**: Auth, Storage, Realtime, PostgreSQL gerenciado, Auto REST APIs, Edge Functions (opcional)
- **Database**: PostgreSQL 14+ (via Supabase), extensões: uuid-ossp, pg_trgm, pgvector (para embeddings e busca semântica)
- **Vector Search**: pgvector (PostgreSQL via Supabase) para busca semântica de frameworks regulatórios

**Storage**: 
- PostgreSQL (dados relacionais + vetores com pgvector) - via Supabase
- Supabase Storage (arquivos e documentos) - substitui S3/MinIO
- Redis (cache e filas de jobs) - mantido para Bull

**Testing**: 
- Jest, React Testing Library, Supertest
- Testes unitários, integração e E2E

**Target Platform**: 
- Web (desktop, tablet, mobile responsivo)
- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Deploy em cloud (AWS/Azure/GCP/Digital Ocean)

**Project Type**: Web application (full-stack)

**Performance Goals**: 
- Tempo de carregamento inicial < 2s
- Processamento de descrição raw com IA < 30s
- Interface responsiva < 100ms para interações
- Suportar 100+ usuários simultâneos

**Constraints**: 
- Deve funcionar com conexão ativa (offline será versão futura)
- Custos de IA devem ser monitorados e limitados
- Dados sensíveis de TO requerem segurança adequada
- Conformidade com frameworks regulatórios

**Scale/Scope**: 
- Múltiplos projetos simultâneos
- 10-50 usuários por projeto
- 100-1000 processos mapeados por projeto
- 50-500 iniciativas por projeto
- Milhares de documentos processados

## Constitution Check

✅ **Spec-Driven Decisions**: Spec completa com user stories, critérios de aceitação e métricas definidas.

✅ **Iterative Refinement**: Especificação será refinada durante implementação conforme feedback.

✅ **AI Integration**: Gemini Pro API integrada para processamento inteligente, análise e geração de conteúdo.

✅ **Documentation**: ADRs e documentação técnica serão mantidos atualizados.

## Project Structure

### Documentation (this feature)

```text
specs/001-governanca-to-pmo/
├── spec.md              # Feature specification (✅ Complete)
├── plan.md              # This file
├── tasks.md             # Task breakdown (to be generated)
├── research.md          # Technical research (if needed)
├── data-model.md        # Database schema design
├── quickstart.md        # Quick start guide
└── contracts/           # API contracts (OpenAPI/Swagger)
```

### Source Code Structure

```text
ot2net/
├── frontend/                    # Next.js application
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   │   ├── (auth)/         # Auth routes (login, register)
│   │   │   ├── (dashboard)/    # Dashboard routes (protected)
│   │   │   │   ├── dashboard/  # Dashboard executivo
│   │   │   │   ├── fases/      # Fases do projeto
│   │   │   │   │   ├── fase-1/ # Onboarding
│   │   │   │   │   ├── fase-0/ # Descoberta
│   │   │   │   │   ├── fase-1/ # Assessment
│   │   │   │   │   ├── fase-2/ # Plano Diretor
│   │   │   │   │   └── fase-3/ # PMO
│   │   │   │   ├── entidades/  # CRUD de entidades
│   │   │   │   ├── questionarios/ # Sistema de questionários
│   │   │   │   ├── conformidade/  # Checklists de conformidade
│   │   │   │   ├── relatorios/    # Relatórios
│   │   │   │   └── chat-ia/       # Chat com IA (futuro)
│   │   │   ├── api/            # API Routes (Next.js)
│   │   │   └── layout.tsx      # Root layout
│   │   ├── components/         # React components
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── dashboard/      # Dashboard components
│   │   │   ├── forms/          # Form components
│   │   │   ├── tables/         # Table components
│   │   │   ├── diagrams/       # Mermaid diagram renderer
│   │   │   ├── gantt/          # Gantt chart component
│   │   │   ├── kanban/         # Kanban board
│   │   │   ├── questionarios/  # Questionário components
│   │   │   └── chat/           # Chat IA component
│   │   ├── lib/                # Utilities
│   │   │   ├── api/            # API client
│   │   │   ├── utils/          # Helper functions
│   │   │   ├── validations/    # Zod schemas
│   │   │   └── mermaid/        # Mermaid utilities
│   │   ├── hooks/              # Custom React hooks
│   │   ├── types/              # TypeScript types
│   │   ├── context/            # React Context providers
│   │   └── store/              # State management (React Context)
│   ├── public/                 # Static assets
│   ├── package.json
│   └── next.config.js
│
├── backend/                     # Express.js API
│   ├── src/
│   │   ├── routes/             # API routes
│   │   ├── controllers/        # Route handlers
│   │   ├── services/           # Business logic
│   │   │   ├── ai/             # Gemini Pro API integration
│   │   │   ├── auth/           # Authentication service
│   │   │   ├── questionarios/  # Questionário processing
│   │   │   └── relatorios/     # Report generation
│   │   ├── models/             # Prisma models (generated)
│   │   ├── middleware/         # Express middleware
│   │   ├── utils/              # Utilities
│   │   ├── jobs/               # Background jobs (Bull)
│   │   └── server.ts           # Express app entry
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma schema
│   │   └── migrations/         # Database migrations
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                      # Shared types and utilities
│   ├── types/                  # Shared TypeScript types
│   └── constants/              # Shared constants
│
├── docker/                      # Docker configurations
│   ├── docker-compose.yml      # Local development
│   └── Dockerfile.*            # Production images
│
├── docs/                        # Documentation
│   ├── api/                    # API documentation
│   ├── architecture/           # Architecture docs
│   └── deployment/             # Deployment guides
│
└── .github/                     # CI/CD
    └── workflows/              # GitHub Actions
```

## Architecture Overview

### High-Level Architecture (Híbrida com Supabase)

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                         │
│  Next.js App (React 18) + shadcn/ui + TailwindCSS          │
│  + Supabase Client                                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS API ROUTES (Frontend)                  │
│  - Server-side rendering                                    │
│  - API proxy                                                │
└─────────────────────────────────────────────────────────────┘
         │                              │
         │                              │
         ▼                              ▼
┌──────────────────────┐    ┌──────────────────────────────┐
│   SUPABASE           │    │   BACKEND EXPRESS (Custom)   │
│  - Auth (JWT + RLS)  │    │  - Processamento IA          │
│  - PostgreSQL +      │    │  - Workflows complexos       │
│    pgvector          │    │  - Jobs assíncronos (Bull)   │
│  - Storage (Files)   │    │  - Integração Gemini Pro API     │
│  - Realtime          │    │  - Lógica de negócio         │
│  - Auto REST APIs    │    │  - Validações complexas      │
│  - Edge Functions    │    │                              │
└──────────────────────┘    └──────────────────────────────┘
         │                              │
         │                              │
         ▼                              ▼
┌──────────────────────┐    ┌──────────────────────────────┐
│   SUPABASE SERVICES  │    │   EXTERNAL SERVICES          │
│  - PostgreSQL DB     │    │  - Gemini Pro API (Google Vertex AI)    │
│  - Storage Buckets   │    │  - Redis (Bull jobs)         │
│  - Realtime Engine   │    │  - Email Service (SMTP/SES)  │
└──────────────────────┘    └──────────────────────────────┘
```

### Technology Stack Decisions

**Frontend Framework: Next.js 14**
- **Rationale**: Template base usa Next.js, SSR nativo, API Routes integradas, otimizações automáticas
- **Alternatives Considered**: Vite (rejeitado - template não compatível)

**Backend-as-a-Service: Supabase**
- **Rationale**: Reduz desenvolvimento inicial (~80 horas), oferece Auth integrado (OAuth, Magic Links, 2FA), Storage gerenciado, Realtime nativo, APIs automáticas para CRUD simples, PostgreSQL gerenciado com backups automáticos
- **Alternatives Considered**: Firebase (rejeitado - não usa PostgreSQL), AWS Amplify (rejeitado - mais complexo), self-hosted completo (rejeitado - mais operação)
- **Uso**: Auth, Storage, Realtime, CRUD simples, PostgreSQL gerenciado
- **Não usado para**: Processamento IA pesado, workflows complexos, jobs longos (mantidos no Express)

**ORM: Prisma**
- **Rationale**: Type-safe, migrations automáticas, excelente DX, geração de tipos TypeScript, compatível com Supabase PostgreSQL
- **Alternatives Considered**: Supabase Client (usado para queries simples), Knex.js (rejeitado - menos type-safety)

**State Management: React Context**
- **Rationale**: Nativo, simples, suficiente para escopo inicial
- **Alternatives Considered**: Zustand (deferido - pode migrar se necessário)

**Authentication: Supabase Auth**
- **Rationale**: Substitui JWT custom, oferece OAuth (Google, GitHub), Magic Links, SMS, 2FA, Row Level Security (RLS) nativo, dashboard de gestão de usuários
- **Alternatives Considered**: JWT custom (rejeitado - muito trabalho, menos features), Auth0 (rejeitado - mais caro, menos integrado)

**Storage: Supabase Storage**
- **Rationale**: Substitui S3/MinIO, integração simples, controle de acesso via RLS, CDN incluído, S3-compatible
- **Alternatives Considered**: AWS S3 (rejeitado - mais complexo, custo variável), MinIO (rejeitado - mais operação)

**Realtime: Supabase Realtime**
- **Rationale**: Notificações em tempo real, updates automáticos, colaboração, baseado em PostgreSQL changes (simples)
- **Alternatives Considered**: Socket.io (rejeitado - mais complexo, precisa gerenciar), WebSockets custom (rejeitado - muito trabalho)

## Database Schema (Prisma)

### Core Entities

```prisma
// Cliente e Organização
model Cliente {
  id            String   @id @default(uuid())
  razao_social  String
  cnpj          String   @unique
  // ... outros campos
  empresas      Empresa[]
  projetos      Projeto[]
}

model Empresa {
  id          String   @id @default(uuid())
  cliente_id  String
  cliente     Cliente  @relation(fields: [cliente_id], references: [id])
  // ... outros campos
  sites       Site[]
}

model Site {
  id         String   @id @default(uuid())
  empresa_id String
  empresa    Empresa  @relation(fields: [empresa_id], references: [id])
  // ... outros campos
  ativos     Ativo[]
  processos  ProcessoNormalizado[]
}

// Projeto e Fases
model Projeto {
  id              String   @id @default(uuid())
  cliente_id      String
  cliente         Cliente  @relation(fields: [cliente_id], references: [id])
  fase_atual      String
  progresso_geral Float    @default(0)
  // ... outros campos
  membros_equipe  MembroEquipe[]
  iniciativas     Iniciativa[]
}

// Fase 0 - Descoberta
model DescricaoOperacionalRaw {
  id                    String   @id @default(uuid())
  projeto_id            String
  titulo                String
  descricao_completa    String   @db.Text
  frequencia            String?
  impacto               String?
  dificuldades          String?  @db.Text
  pessoa_id             String?
  site_id               String?
  cargo                 String?
  turno                 String?
  data_coleta           DateTime @default(now())
  status_processamento  String   @default("pendente")
  score_qualidade       Float?
  processado_por_ia     Boolean  @default(false)
  // ... outros campos
  processo_normalizado  ProcessoNormalizado?
}

model ProcessoNormalizado {
  id                      String   @id @default(uuid())
  descricao_raw_id        String   @unique
  descricao_raw           DescricaoOperacionalRaw @relation(fields: [descricao_raw_id], references: [id])
  nome                    String
  objetivo                String?  @db.Text
  nivel_confianca         Float
  // ... outros campos
  etapas                  ProcessoEtapa[]
  ativos_identificados    Ativo[]
  dificuldades            DificuldadeOperacional[]
  workarounds             Workaround[]
}

model ProcessoEtapa {
  id                    String   @id @default(uuid())
  processo_id           String
  processo              ProcessoNormalizado @relation(fields: [processo_id], references: [id])
  ordem                 Int
  nome                  String
  descricao             String   @db.Text
  tipo_etapa            String
  // ... outros campos
}

model Ativo {
  id              String   @id @default(uuid())
  tipo            String   // 'hardware', 'software', 'arquivo', 'fisico', 'comunicacao'
  nome            String
  categoria       String?  // 'formal', 'informal'
  site_id         String?
  site            Site?    @relation(fields: [site_id], references: [id])
  contexto_rede   String?
  // ... outros campos
}

model DificuldadeOperacional {
  id            String   @id @default(uuid())
  processo_id   String
  processo      ProcessoNormalizado @relation(fields: [processo_id], references: [id])
  descricao     String   @db.Text
  categoria     String?
  // ... outros campos
}

model Workaround {
  id            String   @id @default(uuid())
  processo_id   String
  processo      ProcessoNormalizado @relation(fields: [processo_id], references: [id])
  descricao     String   @db.Text
  categoria     String?
  risco_percebido String?
  // ... outros campos
}

// Fase 2 - Plano Diretor
model Iniciativa {
  id              String   @id @default(uuid())
  projeto_id      String
  projeto         Projeto  @relation(fields: [projeto_id], references: [id])
  nome            String
  dominio         String
  status          String   @default("planejada")
  prioridade      String
  progresso       Float    @default(0)
  data_inicio     DateTime?
  data_fim        DateTime?
  // ... outros campos
  tarefas         Tarefa[]
  marcos          Marco[]
}

// Questionários
model Questionario {
  id                    String   @id @default(uuid())
  projeto_id            String
  nome                  String
  status                String   @default("rascunho")
  link_publico          String?  @unique
  // ... outros campos
  questoes              Questao[]
  respostas             RespostaQuestionario[]
}

model Questao {
  id              String   @id @default(uuid())
  questionario_id String
  questionario    Questionario @relation(fields: [questionario_id], references: [id])
  ordem           Int
  tipo            String
  pergunta        String
  obrigatoria     Boolean  @default(false)
  // ... outros campos
}

model RespostaQuestionario {
  id              String   @id @default(uuid())
  questionario_id String
  questionario    Questionario @relation(fields: [questionario_id], references: [id])
  status          String   @default("em_progresso")
  progresso       Float    @default(0)
  // ... outros campos
  respostas       RespostaQuestao[]
}

// Usuários e Autenticação
model Usuario {
  id              String   @id @default(uuid())
  email           String   @unique
  senha_hash      String
  nome            String
  perfil          String
  organizacao     String
  // ... outros campos
  permissoes      Permissao[]
  membros_equipe  MembroEquipe[]
}

model Permissao {
  id              String   @id @default(uuid())
  usuario_id      String
  usuario         Usuario  @relation(fields: [usuario_id], references: [id])
  entidade_tipo   String
  acao            String   // 'view', 'create', 'edit', 'delete'
  // ... outros campos
}

// IA e Processamento
model ChamadaIA {
  id              String   @id @default(uuid())
  funcionalidade  String
  tokens_input    Int
  tokens_output   Int
  custo           Float
  sucesso         Boolean
  erro            String?  @db.Text
  created_at      DateTime @default(now())
  // ... outros campos
}

// Frameworks Regulatórios Vetorizados
model RequisitoFramework {
  id              String   @id @default(uuid())
  framework       String   // 'REN_964_21', 'ONS_RO_CB_BR_01', 'CIS_CONTROLS_V8_1', etc.
  codigo          String   // Ex: "REN-964-21-4.2.1"
  titulo          String
  descricao       String   @db.Text
  categoria       String
  versao          String
  embedding       Unsupported("vector(1536)") // pgvector - 1536 dimensões para Claude embeddings
  data_vetorizacao DateTime?
  created_at      DateTime @default(now())
  
  // Relacionamentos
  analises_conformidade AnaliseConformidade[]
  controles_sugeridos   ControleSugerido[]
}

model AnaliseConformidade {
  id                String   @id @default(uuid())
  requisito_id      String
  requisito         RequisitoFramework @relation(fields: [requisito_id], references: [id])
  entidade_tipo     String   // 'processo', 'controle', 'documento'
  entidade_id       String
  similaridade      Float    // 0-1 (cosine similarity)
  status            String   // 'atendido', 'parcialmente_atendido', 'nao_atendido', 'nao_aplicavel'
  evidencias        String[] // IDs de processos, controles, documentos
  gaps              String[] @db.Text
  recomendacoes     String[] @db.Text
  analisado_por_ia  Boolean  @default(false)
  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt
}
```

## API Design

### Authentication Endpoints

```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/refresh
POST   /api/auth/logout
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### Project Management Endpoints

**Nota**: CRUD simples pode usar Supabase Auto REST APIs. Endpoints complexos mantidos no Express.

```
# Supabase Auto REST (CRUD simples)
GET    /rest/v1/projetos
POST   /rest/v1/projetos
GET    /rest/v1/projetos/:id
PATCH  /rest/v1/projetos/:id
DELETE /rest/v1/projetos/:id

# Express (lógica complexa)
GET    /api/projetos/:id/dashboard
POST   /api/projetos/:id/analise
GET    /api/projetos/:id/metricas
```

### Fase 0 - Descoberta Endpoints

```
POST   /api/descricoes-raw
GET    /api/descricoes-raw
GET    /api/descricoes-raw/:id
POST   /api/descricoes-raw/:id/processar
GET    /api/processos-normalizados
GET    /api/processos-normalizados/:id
PUT    /api/processos-normalizados/:id
POST   /api/processos-normalizados/:id/aprovar
POST   /api/processos-normalizados/:id/reprocessar
GET    /api/processos-normalizados/:id/diagramas
```

### Questionários Endpoints

```
GET    /api/questionarios
POST   /api/questionarios
GET    /api/questionarios/:id
PUT    /api/questionarios/:id
DELETE /api/questionarios/:id
POST   /api/questionarios/:id/publicar
GET    /api/questionarios/:link/responder
POST   /api/questionarios/respostas
GET    /api/questionarios/:id/resultados
GET    /api/questionarios/:id/analise
```

### Iniciativas Endpoints

```
GET    /api/iniciativas
POST   /api/iniciativas
GET    /api/iniciativas/:id
PUT    /api/iniciativas/:id
DELETE /api/iniciativas/:id
GET    /api/iniciativas/:id/roadmap
POST   /api/iniciativas/:id/analise-preditiva
```

## Vector Database Strategy

### Vetorização de Frameworks Regulatórios

**Objetivo**: Permitir busca semântica e análise automática de conformidade usando embeddings dos requisitos regulatórios.

**Frameworks a Vetorizar**:
1. **REN 964/21** (ANEEL) - Resolução Normativa sobre segurança cibernética
2. **ONS RO-CB.BR.01** - Requisitos operacionais
3. **CIS Controls v8.1** - Controles de segurança
4. **ISA/IEC-62443** - Segurança de sistemas de automação industrial
5. **NIST SP 800-82** - Guia de segurança para sistemas de controle industrial

**Estrutura de Requisitos**:
```typescript
interface RequisitoFramework {
  framework: string;
  codigo: string;        // Ex: "REN-964-21-4.2.1"
  titulo: string;
  descricao: string;     // Texto completo do requisito
  categoria: string;     // Ex: "Governança", "Segmentação", "Acessos"
  subcategoria?: string;
  nivel?: string;        // Ex: "Nível 1", "Nível 2" (para ISA-62443)
  embedding: number[];   // Vetor de 1536 dimensões (Claude embeddings)
}
```

**Processo de Vetorização**:
1. **Importação**: Carregar todos os requisitos dos frameworks em formato estruturado
2. **Geração de Embeddings**: Para cada requisito, gerar embedding usando Gemini Pro API Embeddings
3. **Armazenamento**: Salvar no PostgreSQL com extensão `pgvector`
4. **Indexação**: Criar índice HNSW para busca rápida de similaridade (cosine similarity)

**Casos de Uso**:

**1. Análise de Conformidade Automática**:
```typescript
// Quando um processo é normalizado, analisar conformidade automaticamente
async function analisarConformidadeProcesso(processo: ProcessoNormalizado) {
  // Gerar embedding do processo
  const embeddingProcesso = await claudeAPI.embeddings.create({
    input: `${processo.nome} ${processo.objetivo} ${processo.etapas.map(e => e.descricao).join(' ')}`
  });
  
  // Buscar requisitos similares (top 10)
  const requisitosSimilares = await vectorDB.search({
    embedding: embeddingProcesso.embedding,
    framework: 'REN_964_21',
    topK: 10,
    threshold: 0.7 // Similaridade mínima
  });
  
  // Para cada requisito similar, analisar se processo atende
  const analises = requisitosSimilares.map(req => ({
    requisito: req,
    similaridade: req.similarity,
    status: determinarStatusConformidade(processo, req),
    evidencias: extrairEvidencias(processo, req),
    gaps: identificarGaps(processo, req)
  }));
  
  return analises;
}
```

**2. Sugestão de Controles para Riscos**:
```typescript
// Quando um risco é identificado, sugerir controles do framework
async function sugerirControles(risco: Risco, framework: string) {
  const embeddingRisco = await claudeAPI.embeddings.create({
    input: `${risco.descricao} ${risco.causa_raiz} ${risco.impacto}`
  });
  
  // Buscar controles recomendados
  const controles = await vectorDB.search({
    embedding: embeddingRisco.embedding,
    framework: framework,
    categoria: 'Controles',
    topK: 5
  });
  
  return controles.map(controle => ({
    requisito: controle,
    relevancia: controle.similarity,
    justificativa: gerarJustificativa(risco, controle)
  }));
}
```

**3. Análise de Documentos**:
```typescript
// Processar documento e comparar com requisitos
async function analisarDocumentoConformidade(documento: Documento, framework: string) {
  // Extrair texto do documento
  const texto = await extrairTexto(documento);
  
  // Gerar embedding do documento
  const embeddingDoc = await claudeAPI.embeddings.create({
    input: texto
  });
  
  // Buscar requisitos relevantes
  const requisitosRelevantes = await vectorDB.search({
    embedding: embeddingDoc.embedding,
    framework: framework,
    topK: 20
  });
  
  // Analisar quais requisitos são mencionados/atendidos no documento
  return requisitosRelevantes.map(req => ({
    requisito: req,
    mencionado: texto.includes(req.codigo) || similaridadeTexto(texto, req.descricao) > 0.8,
    evidencias: extrairEvidenciasDoTexto(texto, req)
  }));
}
```

**4. Busca Semântica de Requisitos**:
```typescript
// Buscar requisitos por descrição natural
async function buscarRequisitos(consulta: string, framework?: string) {
  const embeddingConsulta = await claudeAPI.embeddings.create({
    input: consulta
  });
  
  return await vectorDB.search({
    embedding: embeddingConsulta.embedding,
    framework: framework,
    topK: 10
  });
}

// Exemplo: "Como devo gerenciar acessos de terceiros?"
// Retorna requisitos relevantes sobre gestão de acessos, terceiros, etc.
```

**5. Consolidação de Requisitos Similares entre Frameworks**:
```typescript
// Identificar requisitos similares entre diferentes frameworks
async function encontrarRequisitosSimilaresEntreFrameworks() {
  // Para cada requisito de um framework, buscar similares em outros
  const mapeamento: Map<string, RequisitoFramework[]> = new Map();
  
  for (const framework of ['REN_964_21', 'CIS_CONTROLS_V8_1', 'ISA_IEC_62443']) {
    const requisitos = await db.requisitosFramework.findMany({
      where: { framework }
    });
    
    for (const req of requisitos) {
      const similares = await vectorDB.search({
        embedding: req.embedding,
        excludeFramework: framework, // Buscar em outros frameworks
        topK: 3,
        threshold: 0.85
      });
      
      mapeamento.set(req.id, similares);
    }
  }
  
  return mapeamento;
}
```

**Implementação Técnica**:

**1. Setup do pgvector**:
```sql
-- Instalar extensão pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabela de requisitos com embedding
CREATE TABLE requisitos_framework (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  framework VARCHAR(50) NOT NULL,
  codigo VARCHAR(100) NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  categoria VARCHAR(100),
  embedding vector(1536), -- 1536 dimensões para Claude embeddings
  data_vetorizacao TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(framework, codigo)
);

-- Índice HNSW para busca rápida
CREATE INDEX ON requisitos_framework 
USING hnsw (embedding vector_cosine_ops);

-- Índice para busca por framework
CREATE INDEX ON requisitos_framework (framework);
```

**2. Serviço de Vetorização**:
```typescript
// backend/src/services/ai/vector.service.ts
import { PrismaClient } from '@prisma/client';
import Google Vertex AI from '@anthropic-ai/sdk';

class VectorService {
  private prisma: PrismaClient;
  private anthropic: Google Vertex AI;
  
  async vetorizarRequisito(requisito: RequisitoFramework): Promise<void> {
    // Gerar embedding usando Gemini Pro API
    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      messages: [{
        role: 'user',
        content: `Gere embedding para este requisito regulatório: ${requisito.descricao}`
      }]
    });
    
    // Usar Claude Embeddings API (quando disponível) ou alternativa
    const embedding = await this.gerarEmbedding(requisito.descricao);
    
    // Salvar no banco
    await this.prisma.requisitoFramework.update({
      where: { id: requisito.id },
      data: {
        embedding: embedding,
        data_vetorizacao: new Date()
      }
    });
  }
  
  async buscarSimilares(
    texto: string, 
    framework?: string, 
    topK: number = 10
  ): Promise<RequisitoFramework[]> {
    // Gerar embedding do texto de busca
    const embedding = await this.gerarEmbedding(texto);
    
    // Buscar usando pgvector (cosine similarity)
    const resultados = await this.prisma.$queryRaw`
      SELECT 
        id, framework, codigo, titulo, descricao, categoria,
        1 - (embedding <=> ${embedding}::vector) as similaridade
      FROM requisitos_framework
      WHERE ${framework ? Prisma.sql`framework = ${framework}` : Prisma.sql`TRUE`}
        AND embedding IS NOT NULL
      ORDER BY embedding <=> ${embedding}::vector
      LIMIT ${topK}
    `;
    
    return resultados;
  }
  
  private async gerarEmbedding(texto: string): Promise<number[]> {
    // Usar Claude Embeddings API ou alternativa (OpenAI, etc.)
    // Por enquanto, usar Gemini Pro API para embeddings
    const response = await this.anthropic.messages.create({
      // Usar endpoint de embeddings quando disponível
    });
    
    return response.embedding;
  }
}
```

**3. Integração com Análise de Conformidade**:
```typescript
// backend/src/services/conformidade/conformidade.service.ts
class ConformidadeService {
  private vectorService: VectorService;
  
  async analisarConformidadeAutomatica(
    entidade: ProcessoNormalizado | Documento | Controle,
    framework: string
  ): Promise<AnaliseConformidade[]> {
    // Gerar embedding da entidade
    const textoEntidade = this.extrairTexto(entidade);
    const embedding = await this.vectorService.gerarEmbedding(textoEntidade);
    
    // Buscar requisitos similares
    const requisitosSimilares = await this.vectorService.buscarSimilares(
      textoEntidade,
      framework,
      20
    );
    
    // Analisar cada requisito
    const analises = await Promise.all(
      requisitosSimilares.map(async (requisito) => {
        // Usar Gemini Pro API para análise detalhada
        const analise = await this.claudeService.analisarConformidadeDetalhada(
          entidade,
          requisito
        );
        
        return {
          requisito_id: requisito.id,
          similaridade: requisito.similaridade,
          status: analise.status,
          evidencias: analise.evidencias,
          gaps: analise.gaps,
          recomendacoes: analise.recomendacoes
        };
      })
    );
    
    // Salvar análises
    await this.salvarAnalises(entidade, analises);
    
    return analises;
  }
}
```

**Benefícios da Vetorização**:
1. **Precisão**: Busca semântica mais precisa que busca textual
2. **Automação**: Análise de conformidade automática sem necessidade de mapeamento manual
3. **Eficiência**: Reduz custos de IA (menos chamadas, mais contexto)
4. **Descoberta**: Identifica requisitos relevantes que não seriam encontrados por busca textual
5. **Consistência**: Análise padronizada baseada em similaridade semântica
6. **Escalabilidade**: Fácil adicionar novos frameworks

**Custos**:
- Geração inicial de embeddings: ~1000-5000 requisitos × custo por embedding
- Busca: Muito barata (apenas query no PostgreSQL)
- Análise detalhada: Apenas para requisitos similares (reduz custos significativamente)

## Integration Points

### Gemini Pro API Integration

**Service**: `backend/src/services/ai/claude.service.ts`

**Key Functions**:
- `processarDescricaoRaw(descricao: string): Promise<ProcessoNormalizado>`
- `gerarDiagramaMermaid(processo: ProcessoNormalizado): Promise<string>`
- `analisarRiscos(processo: ProcessoNormalizado): Promise<Risco[]>`
- `gerarIniciativas(gaps: Gap[]): Promise<Iniciativa[]>`
- `priorizarIniciativas(iniciativas: Iniciativa[]): Promise<IniciativaPriorizada[]>`
- `gerarRelatorio(dados: RelatorioData): Promise<string>`

**Error Handling**: Retry logic, rate limiting, cost tracking

### Vector Database e Embeddings para Frameworks Regulatórios

**Rationale**: Vetorizar requisitos dos frameworks regulatórios permite busca semântica, análise de conformidade automática, e sugestões inteligentes de controles baseadas em similaridade semântica.

**Technology**: 
- **Vector Database**: PostgreSQL com extensão `pgvector` (ou Pinecone/Weaviate como alternativa)
- **Embeddings**: Gemini Pro API Embeddings (ou OpenAI embeddings) para gerar vetores dos requisitos

**Service**: `backend/src/services/ai/vector.service.ts`

**Key Functions**:
- `vetorizarRequisitoFramework(requisito: RequisitoFramework): Promise<Embedding>`
- `buscarRequisitosSimilares(texto: string, framework?: string, topK?: number): Promise<RequisitoFramework[]>`
- `analisarConformidadeSemantica(processo: ProcessoNormalizado, framework: string): Promise<AnaliseConformidade>`
- `sugerirControles(risco: Risco, framework: string): Promise<ControleSugerido[]>`
- `compararComFramework(descricao: string, framework: string): Promise<Gap[]>`

**Estrutura de Dados**:
```typescript
interface RequisitoFramework {
  id: string;
  framework: 'REN_964_21' | 'ONS_RO_CB_BR_01' | 'CIS_CONTROLS_V8_1' | 'ISA_IEC_62443' | 'NIST_SP_800_82';
  codigo: string; // Ex: "REN-964-21-4.2.1"
  titulo: string;
  descricao: string; // Texto completo do requisito
  categoria: string; // Ex: "Governança", "Segmentação", "Acessos"
  embedding?: number[]; // Vetor de embeddings (1536 dimensões para Claude)
  versao: string;
  data_vetorizacao?: Date;
}

interface AnaliseConformidade {
  requisito_id: string;
  requisito_codigo: string;
  requisito_titulo: string;
  similaridade: number; // 0-1 (cosine similarity)
  status: 'atendido' | 'parcialmente_atendido' | 'nao_atendido' | 'nao_aplicavel';
  evidencias: string[]; // IDs de processos, controles, documentos que atendem
  gaps: string[]; // Descrição dos gaps identificados
  recomendacoes: string[];
}
```

**Workflow de Vetorização**:
1. **Carregamento Inicial**: Importar todos os requisitos dos frameworks (REN 964/21, ONS, CIS Controls, ISA-62443, NIST)
2. **Geração de Embeddings**: Para cada requisito, gerar embedding usando Gemini Pro API
3. **Armazenamento**: Salvar embeddings no PostgreSQL com pgvector
4. **Indexação**: Criar índice HNSW para busca rápida de similaridade

**Uso em Análise de Conformidade**:
- Processo normalizado → Gerar embedding → Buscar requisitos similares → Analisar conformidade
- Risco identificado → Buscar controles recomendados do framework → Sugerir implementação
- Documento processado → Comparar com requisitos → Identificar gaps automaticamente

**Benefícios**:
- Busca semântica mais precisa que busca textual
- Identificação automática de requisitos relevantes
- Análise de conformidade mais abrangente
- Sugestões de controles baseadas em similaridade
- Redução de custos de IA (menos chamadas, mais precisão)

### File Storage (S3/MinIO)

**Service**: `backend/src/services/storage/storage.service.ts`

**Operations**:
- Upload de documentos
- Upload de anexos de questionários
- Upload de evidências de conformidade
- Geração de URLs temporárias para download

## Security Considerations

1. **Authentication**: Supabase Auth com JWT, refresh tokens automáticos, OAuth, Magic Links, 2FA
2. **Authorization**: Row Level Security (RLS) no PostgreSQL + permissões granulares por entidade e ação no backend
3. **Input Validation**: Zod schemas em todas as rotas (Express) + validação no Supabase (RLS policies)
4. **SQL Injection**: Prisma previne automaticamente + Supabase usa prepared statements
5. **XSS**: Sanitização de inputs, React escapa automaticamente
6. **CSRF**: Tokens CSRF em formulários críticos + Supabase Auth protege contra CSRF
7. **Rate Limiting**: Express rate limit middleware + Supabase rate limiting nativo
8. **HTTPS**: Obrigatório em produção (Supabase força HTTPS)
9. **Secrets**: Variáveis de ambiente, nunca commitadas + Supabase secrets management
10. **Audit Logging**: Todas as ações críticas registradas + Supabase audit logs
11. **RLS (Row Level Security)**: Políticas no PostgreSQL para controle de acesso granular a nível de linha

## Performance Considerations

1. **Database**: Índices em campos frequentemente consultados
2. **Caching**: Redis para dados frequentemente acessados
3. **Pagination**: Todas as listas paginadas
4. **Lazy Loading**: Componentes e rotas carregados sob demanda
5. **Image Optimization**: Next.js Image component
6. **API Response Compression**: Gzip/Brotli
7. **Background Jobs**: Processamento pesado em filas (Bull)

## Deployment Strategy

### Development
- Docker Compose para ambiente local
- Hot reload no frontend e backend
- Database migrations automáticas

### Staging
- Deploy em ambiente de staging
- Testes automatizados antes de produção
- Preview deployments para PRs

### Production
- Deploy em cloud (AWS/Azure/GCP)
- CI/CD com GitHub Actions
- Blue-green deployment
- Monitoring e alertas (Sentry, DataDog, etc.)

## Testing Strategy

1. **Unit Tests**: Funções e componentes isolados
2. **Integration Tests**: APIs e serviços
3. **E2E Tests**: Fluxos completos de usuário (Playwright/Cypress)
4. **IA Tests**: Validação de processamento com casos reais
5. **Performance Tests**: Load testing com múltiplos usuários

## Monitoring and Observability

1. **Logging**: Winston/Pino com níveis apropriados
2. **Error Tracking**: Sentry ou similar
3. **Metrics**: Prometheus + Grafana
4. **APM**: Application Performance Monitoring
5. **Cost Tracking**: Monitoramento de custos de IA

## Migration Path

1. **Phase 1**: Setup e infraestrutura base
2. **Phase 2**: Autenticação e autorização
3. **Phase 3**: CRUD básico de entidades
4. **Phase 4**: Fase -1 (Onboarding)
5. **Phase 5**: Fase 0 (Descoberta) - MVP
6. **Phase 6**: Questionários
7. **Phase 7**: Fases 1, 2, 3

## Risks and Mitigations

1. **Risk**: Custos de IA excederem orçamento
   - **Mitigation**: Limites configuráveis, alertas, monitoramento

2. **Risk**: Performance com grandes volumes de dados
   - **Mitigation**: Paginação, índices, cache, otimizações de queries

3. **Risk**: Complexidade de relacionamentos entre entidades
   - **Mitigation**: Schema bem definido, validações, testes

4. **Risk**: Processamento de IA pode falhar ou demorar
   - **Mitigation**: Retry logic, jobs assíncronos, feedback visual

## Success Metrics

- Tempo de processamento de descrição raw < 30s
- Taxa de acerto na extração de entidades > 80%
- Tempo de carregamento de página < 2s
- Uptime > 99.5%
- Taxa de conclusão de questionários > 70%
- Satisfação do usuário > 4/5

---

**Next Steps**: Generate task breakdown with `/speckit.tasks`

