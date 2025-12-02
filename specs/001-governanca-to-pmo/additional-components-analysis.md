# Análise de Componentes Adicionais do Template vs Projeto OT2net

**Data**: 2025-01-27  
**Template Base**: shadcn-ui-kit-dashboard  
**Componentes**: Kanban, File Management, Profile, Authentication, Error Pages, Settings, AI Chat v2, Todo List, Tasks, Calendar

---

## 1. Kanban Board

### 1.1 Uso no Projeto OT2net

**Aplicações:**
- **Gestão de Iniciativas** (Fase 2 e 3): Visualizar iniciativas por status (Planejada, Em Execução, Concluída, Suspensa)
- **Gestão de Tarefas do Projeto**: Tarefas da equipe organizadas por status
- **Workflow de Revisão**: Descrições raw em processamento (Pendente, Processando, Processada, Em Revisão, Aprovada)
- **Gestão de Exceções de Risco**: Workflow de aprovação (Solicitada, Em Análise, Aprovada, Negada, Resolvida)

### 1.2 Estrutura do Kanban

```typescript
interface KanbanBoard {
  id: string;
  nome: string;
  tipo: 'iniciativas' | 'tarefas' | 'revisao' | 'excecoes';
  colunas: KanbanColumn[];
  filtros?: {
    responsavel?: string;
    fase?: string;
    prioridade?: string;
    dominio?: string;
  };
}

interface KanbanColumn {
  id: string;
  nome: string;
  status: string; // 'planejada' | 'em_execucao' | 'concluida' | ...
  ordem: number;
  limite_cards?: number; // Opcional: limite de cards na coluna
  cards: KanbanCard[];
}

interface KanbanCard {
  id: string;
  titulo: string;
  descricao?: string;
  status: string;
  prioridade?: 'critica' | 'alta' | 'media' | 'baixa';
  responsavel?: {
    id: string;
    nome: string;
    avatar?: string;
  };
  labels?: string[]; // Tags: ['Fase 0', 'Alto Impacto', 'Conformidade']
  data_vencimento?: Date;
  progresso?: number; // 0-100
  subtarefas?: Array<{
    id: string;
    titulo: string;
    concluida: boolean;
  }>;
  anexos?: number;
  comentarios?: number;
  cor?: string; // Cor de destaque (por domínio, prioridade, etc)
  metadata?: {
    // Dados específicos do tipo de card
    iniciativa_id?: string;
    processo_id?: string;
    excecao_id?: string;
  };
}
```

### 1.3 Kanban de Iniciativas

**Colunas:**
1. **Planejada** - Iniciativas aprovadas no Plano Diretor, aguardando início
2. **Em Execução** - Iniciativas ativas com progresso
3. **Em Revisão** - Aguardando aprovação de entregáveis
4. **Bloqueada** - Com bloqueios que impedem progresso
5. **Concluída** - Finalizadas e validadas
6. **Suspensa** - Temporariamente pausadas

**Informações no Card:**
- Nome da iniciativa
- Domínio de governança (badge colorido)
- Progresso (barra)
- Responsável (avatar + nome)
- Prazo (dias restantes, destacado se próximo)
- Saúde (indicador verde/amarelo/vermelho)
- Próximo marco
- Bloqueios (badge se houver)

**Ações no Card:**
- Click: Abre modal/página de detalhes
- Drag: Move entre colunas (atualiza status)
- Menu de contexto: Editar, Ver detalhes, Registrar progresso, Reportar bloqueio, Suspender

### 1.4 Kanban de Revisão de Processos

**Colunas:**
1. **Pendente Processamento** - Descrições raw aguardando IA
2. **Processando** - Em processamento pela IA
3. **Aguardando Revisão** - Processadas, aguardando consultor
4. **Em Revisão** - Sendo revisadas por consultor
5. **Aguardando Clarificação** - Precisam de informações do operador
6. **Aprovada** - Normalizações validadas

**Informações no Card:**
- Título da atividade descrita
- Operador (nome + cargo)
- Site
- Score de qualidade (se processada)
- Data de coleta
- Nível de confiança da normalização

### 1.5 Funcionalidades do Kanban

**Drag and Drop:**
- Mover cards entre colunas atualiza status automaticamente
- Validação: algumas transições podem requerer confirmação ou campos adicionais
- Histórico: registrar quem moveu e quando

**Filtros:**
- Por responsável
- Por prioridade
- Por domínio (para iniciativas)
- Por site (para processos)
- Por data de vencimento
- Busca por texto

**Visualizações:**
- Compacta: apenas título e responsável
- Detalhada: todas as informações
- Por cor: agrupar por domínio/prioridade

**Ações em Lote:**
- Selecionar múltiplos cards
- Mover todos para outra coluna
- Atribuir responsável
- Adicionar label
- Exportar

---

## 2. File Management (Gerenciamento de Arquivos)

### 2.1 Necessidade no Projeto OT2net

**Documentos Coletados:**
- Políticas, normas, procedimentos fornecidos pelo cliente (Fase -1 e Fase 1)
- PDFs de diagramas unifilares, arquiteturas
- Planilhas Excel, documentos Word
- Fotos tiradas em campo (observações, equipamentos, documentos físicos)
- Áudios de entrevistas (para transcrição posterior)
- Relatórios gerados pela plataforma
- Evidências de conformidade

### 2.2 Estrutura de Armazenamento

```typescript
interface FileStorage {
  // Organização hierárquica
  estrutura: {
    projetos: {
      [projeto_id: string]: {
        fase_menos_um: {
          documentos_cadastrais: File[];
          organogramas: File[];
        };
        fase_zero: {
          descricoes_raw_anexos: File[]; // Fotos, áudios das descrições
          entrevistas_audio: File[];
          fotos_campo: File[];
        };
        fase_um: {
          documentos_fornecidos: File[]; // Políticas, normas, procedimentos
          diagramas: File[];
          inventarios: File[];
          relatorios_auditoria: File[];
        };
        fase_dois: {
          planos_diretor: File[];
          apresentacoes: File[];
        };
        fase_tres: {
          relatorios_mensais: File[];
          relatorios_trimestrais: File[];
          atas_comite: File[];
        };
        evidencias_conformidade: {
          [framework: string]: {
            [requisito_id: string]: File[];
          };
        };
      };
    };
  };
}

interface FileMetadata {
  id: string;
  nome_original: string;
  nome_armazenado: string; // UUID ou hash
  caminho_s3: string; // s3://bucket/projeto/fase/tipo/arquivo.pdf
  url_publica?: string; // URL temporária para acesso
  tipo_mime: string;
  tamanho_bytes: number;
  hash_md5: string; // Para controle de versão e deduplicação
  extensao: string;
  
  // Metadata do projeto
  projeto_id: string;
  fase?: string;
  categoria?: 'documento' | 'foto' | 'audio' | 'video' | 'planilha' | 'diagrama' | 'relatorio';
  
  // Vinculações
  entidade_vinculada?: {
    tipo: 'descricao_raw' | 'processo' | 'ativo' | 'documento' | 'evidencia_conformidade';
    id: string;
  };
  
  // Processamento
  processado_ia?: boolean;
  data_processamento?: Date;
  entidades_extraidas?: string[]; // IDs de entidades extraídas do documento
  
  // Controle de acesso
  visivel_para: string[]; // IDs de usuários ou perfis
  restrito?: boolean;
  
  // Versionamento
  versao: number;
  versao_anterior_id?: string;
  
  // Metadata do sistema
  uploaded_por: string; // User ID
  uploaded_em: Date;
  updated_at: Date;
  tags?: string[];
  descricao?: string;
}
```

### 2.3 Interface de File Management

**Estrutura de Navegação:**
```
File Manager
├── Projeto: [Nome do Projeto]
│   ├── 📁 Fase -1: Onboarding
│   │   ├── 📁 Documentos Cadastrais
│   │   └── 📁 Organogramas
│   ├── 📁 Fase 0: Descoberta
│   │   ├── 📁 Anexos de Descrições
│   │   ├── 📁 Áudios de Entrevistas
│   │   └── 📁 Fotos de Campo
│   ├── 📁 Fase 1: Assessment
│   │   ├── 📁 Documentos Fornecidos
│   │   ├── 📁 Diagramas
│   │   └── 📁 Inventários
│   ├── 📁 Fase 2: Plano Diretor
│   ├── 📁 Fase 3: PMO
│   └── 📁 Evidências de Conformidade
│       ├── 📁 REN 964/21
│       ├── 📁 ONS RO-CB.BR.01
│       └── 📁 CIS Controls v8.1
```

**Visualizações:**
- **Lista**: Tabela com colunas (nome, tipo, tamanho, data upload, uploader, vinculado a)
- **Grid**: Cards com preview (thumbnail para imagens, ícone para documentos)
- **Árvore**: Navegação hierárquica por pastas

**Funcionalidades:**
- **Upload múltiplo**: Drag-and-drop ou seletor de arquivos
- **Upload progressivo**: Barra de progresso por arquivo
- **Preview**: Visualizar PDFs, imagens, vídeos inline
- **Download**: Individual ou em lote (ZIP)
- **Compartilhamento**: Gerar link temporário com expiração
- **Busca**: Full-text search no conteúdo (se processado)
- **Filtros**: Por tipo, fase, data, uploader, tags
- **Tags**: Adicionar tags para organização
- **Versões**: Ver histórico de versões, restaurar versão anterior
- **Vinculação**: Vincular arquivo a entidade (processo, ativo, evidência)

**Upload com Metadata:**
```typescript
interface UploadOptions {
  arquivo: File;
  projeto_id: string;
  fase?: string;
  categoria?: string;
  entidade_vinculada?: {
    tipo: string;
    id: string;
  };
  tags?: string[];
  descricao?: string;
  visivel_para?: string[]; // IDs de usuários
  processar_ia?: boolean; // Se deve processar com IA automaticamente
}
```

**Integração com Processamento IA:**
- Upload de documento → Trigger processamento IA (se habilitado)
- Extração de entidades → Vincular automaticamente
- Análise de conformidade → Criar/atualizar checklist

---

## 3. Profile (Perfil de Usuário)

### 3.1 Página de Perfil Completa

**Seções:**

**1. Informações Pessoais:**
```typescript
interface PerfilPessoal {
  foto?: string; // URL ou base64
  nome_completo: string;
  nome_preferido?: string;
  email: string;
  email_secundario?: string;
  telefone?: string;
  telefone_celular?: string;
  cargo?: string;
  departamento?: string;
  bio?: string; // Descrição pessoal
}
```

**2. Informações Profissionais:**
```typescript
interface PerfilProfissional {
  organizacao: 'cliente' | 'consultoria_ness' | 'terceiro';
  empresa_id?: string; // Se for cliente
  empresa_nome?: string;
  cargo_formal: string;
  area_departamento: string;
  nivel_hierarquico: 'diretoria' | 'gerencia' | 'coordenacao' | 'supervisao' | 'tecnico' | 'operacional';
  data_admissao?: Date;
  especialidades: string[]; // ['SCADA', 'Segurança Cibernética', 'ISA-62443']
  certificacoes: Array<{
    nome: string;
    emissor: string;
    data_emissao: Date;
    data_expiracao?: Date;
    numero_certificado?: string;
  }>;
}
```

**3. No Projeto:**
```typescript
interface PerfilProjeto {
  perfil_sistema: 'administrador' | 'lider_projeto' | 'consultor' | 'stakeholder_cliente' | 'apenas_leitura';
  membro_equipe?: {
    projeto_id: string;
    projeto_nome: string;
    papel: string; // 'Líder', 'Especialista TO', 'Analista de Dados'
    alocacao_percentual: number;
    datas: {
      inicio: Date;
      fim?: Date;
    };
    responsabilidades: string[];
    matriz_rasci: {
      [entregavel: string]: 'R' | 'A' | 'S' | 'C' | 'I';
    };
  };
  sites_responsabilidade?: string[]; // IDs de sites
  turno_trabalho?: string;
  disponibilidade?: {
    dias_semana: number[]; // 0-6 (domingo-sábado)
    horario_inicio: string; // "09:00"
    horario_fim: string; // "18:00"
    fuso_horario: string; // "America/Sao_Paulo"
  };
}
```

**4. Preferências:**
```typescript
interface PreferenciasUsuario {
  idioma: 'pt-BR' | 'en-US';
  tema: 'dark' | 'light' | 'system';
  fuso_horario: string;
  formato_data: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  formato_hora: '24h' | '12h';
  notificacoes: {
    email: boolean;
    in_app: boolean;
    push?: boolean;
    tipos: {
      processamento_ia_concluido: boolean;
      relatorio_gerado: boolean;
      risco_critico: boolean;
      iniciativa_atrasada: boolean;
      excecao_expirando: boolean;
      documento_pendente_aprovacao: boolean;
      nova_decisao_comite: boolean;
    };
  };
  dashboard_padrao?: string; // Qual dashboard abrir ao logar
  itens_por_pagina: number; // Paginação padrão
}
```

**5. Segurança:**
```typescript
interface SegurancaPerfil {
  autenticacao_dois_fatores: boolean;
  metodo_2fa?: 'app' | 'sms' | 'email';
  ultima_alteracao_senha?: Date;
  sessoes_ativas: Array<{
    id: string;
    dispositivo: string;
    ip: string;
    localizacao?: string;
    ultimo_acesso: Date;
    expira_em: Date;
  }>;
  historico_login: Array<{
    data: Date;
    ip: string;
    dispositivo: string;
    localizacao?: string;
    sucesso: boolean;
  }>;
}
```

**6. Estatísticas de Atividade:**
- Total de ações realizadas
- Descrições coletadas (se consultor)
- Processos revisados
- Iniciativas como responsável
- Relatórios gerados
- Gráfico de atividade ao longo do tempo

**7. Histórico de Ações (Auditoria):**
- Tabela paginada de todas as ações
- Filtros por tipo de ação, entidade, período
- Exportar histórico

---

## 4. Authentication (Autenticação)

### 4.1 Fluxo de Autenticação

**Login:**
```typescript
interface LoginRequest {
  email: string;
  senha: string;
  remember_me?: boolean; // Manter logado por 30 dias
  dispositivo?: string; // Para rastreamento
}

interface LoginResponse {
  token: string; // JWT
  refresh_token: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
    perfil: string;
    foto?: string;
  };
  expires_in: number; // Segundos
}
```

**Páginas:**
- `/login` - Formulário de login
- `/register` - Registro (se permitido, geralmente apenas admin cria usuários)
- `/forgot-password` - Recuperação de senha
- `/reset-password/:token` - Redefinir senha
- `/verify-email/:token` - Verificação de email (se aplicável)

**Funcionalidades:**
- **Autenticação JWT**: Tokens stateless
- **Refresh Token**: Renovação automática
- **Remember Me**: Cookie persistente (30 dias)
- **2FA Opcional**: TOTP via app (Google Authenticator, Authy)
- **Rate Limiting**: Proteção contra brute force
- **Captcha**: Após X tentativas falhas
- **Logout**: Invalidar token, limpar sessão

**Segurança:**
- Senhas: Hash bcrypt (salt rounds: 10)
- Tokens: JWT com expiração (15 min access, 7 dias refresh)
- HTTPS obrigatório
- CORS configurado
- Headers de segurança (Helmet.js)

---

## 5. Error Pages (Páginas de Erro)

### 5.1 Páginas de Erro Customizadas

**404 - Not Found:**
```typescript
// Página quando rota não existe
<ErrorPage
  codigo={404}
  titulo="Página não encontrada"
  mensagem="A página que você está procurando não existe ou foi movida."
  acao_principal={{
    label: "Voltar ao Dashboard",
    href: "/dashboard"
  }}
  acao_secundaria={{
    label: "Página Inicial",
    href: "/"
  }}
/>
```

**403 - Forbidden:**
```typescript
// Quando usuário não tem permissão
<ErrorPage
  codigo={403}
  titulo="Acesso negado"
  mensagem="Você não tem permissão para acessar este recurso."
  detalhes="Contate o administrador do sistema se você acredita que deveria ter acesso."
  acao_principal={{
    label: "Voltar",
    onClick: () => router.back()
  }}
/>
```

**401 - Unauthorized:**
```typescript
// Quando token expirou ou inválido
<ErrorPage
  codigo={401}
  titulo="Sessão expirada"
  mensagem="Sua sessão expirou. Por favor, faça login novamente."
  acao_principal={{
    label: "Fazer Login",
    href: "/login"
  }}
/>
```

**500 - Internal Server Error:**
```typescript
// Erro do servidor
<ErrorPage
  codigo={500}
  titulo="Erro interno do servidor"
  mensagem="Algo deu errado. Nossa equipe foi notificada e está trabalhando para resolver."
  detalhes={process.env.NODE_ENV === 'development' ? error.stack : undefined}
  acao_principal={{
    label: "Tentar Novamente",
    onClick: () => window.location.reload()
  }}
  acao_secundaria={{
    label: "Reportar Problema",
    href: "/suporte"
  }}
/>
```

**503 - Service Unavailable:**
```typescript
// Quando serviço está em manutenção
<ErrorPage
  codigo={503}
  titulo="Serviço em manutenção"
  mensagem="O sistema está temporariamente indisponível para manutenção."
  detalhes="Previsão de retorno: [data/hora]"
  acao_principal={{
    label: "Verificar Status",
    href: "/status"
  }}
/>
```

**Componente de Erro Genérico:**
```typescript
interface ErrorPageProps {
  codigo: number;
  titulo: string;
  mensagem: string;
  detalhes?: string;
  acao_principal?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  acao_secundaria?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  ilustracao?: '404' | '403' | '500' | 'generic';
}
```

**Design:**
- Tema escuro (slate-950/900)
- Ilustração SVG customizada ou ícone grande
- Mensagem clara e acionável
- Botões de ação destacados
- Link para suporte/contato

---

## 6. Settings (Configurações de Usuário)

### 6.1 Página de Configurações

**Aba: Perfil**
- Editar informações pessoais
- Upload de foto
- Alterar email (com verificação)
- Alterar telefone

**Aba: Segurança**
- Alterar senha
- Configurar 2FA
- Gerenciar dispositivos/sessões ativas
- Revogar sessões
- Histórico de logins

**Aba: Notificações**
- Preferências de notificação (email, in-app, push)
- Tipos de notificação (checkboxes)
- Frequência de emails (imediato, diário, semanal)

**Aba: Preferências**
- Idioma
- Tema (dark/light/system)
- Fuso horário
- Formato de data/hora
- Dashboard padrão
- Itens por página

**Aba: Integrações** (Futuro)
- Conectar calendário (Google, Outlook)
- Integração com ferramentas externas

**Aba: Privacidade**
- Visibilidade do perfil
- Compartilhamento de dados
- Exportar meus dados (GDPR)
- Deletar conta

**Aba: Billing** (Se aplicável)
- Plano atual
- Histórico de pagamentos
- Métodos de pagamento

---

## 7. AI Chat v2 (Para o Futuro)

### 7.1 Visão Futura do Chat IA

**Funcionalidades Avançadas:**
- **Contexto Persistente**: Chat mantém contexto de conversas anteriores
- **Memória de Longo Prazo**: IA lembra preferências e padrões do usuário
- **Análises Sob Demanda**: "Analise os riscos do site SE Bom Despacho"
- **Geração de Conteúdo**: "Gere um resumo executivo do status atual"
- **Sugestões Proativas**: IA sugere ações baseadas em dados do projeto
- **Multi-modal**: Upload de imagens/documentos para análise
- **Streaming de Respostas**: Respostas aparecem em tempo real (typing effect)

**Interface:**
- Widget flutuante ou página dedicada
- Histórico de conversas
- Busca em conversas anteriores
- Exportar conversa
- Compartilhar insights gerados

**Integração:**
- Acesso a todo contexto do projeto
- Pode executar ações (criar iniciativa, atualizar status)
- Pode gerar relatórios
- Pode fazer análises complexas

---

## 8. Todo List App

### 8.1 Uso no Projeto OT2net

**Aplicações:**
- **Tarefas Pessoais**: Checklist do consultor
- **Tarefas do Projeto**: Tarefas da equipe
- **Follow-ups**: Ações de follow-up de reuniões
- **Lembretes**: Tarefas agendadas

### 8.2 Estrutura

```typescript
interface TodoItem {
  id: string;
  titulo: string;
  descricao?: string;
  concluida: boolean;
  prioridade?: 'alta' | 'media' | 'baixa';
  data_vencimento?: Date;
  data_conclusao?: Date;
  criado_por: string;
  atribuido_para?: string; // Se for tarefa compartilhada
  tags?: string[];
  vinculado_a?: {
    tipo: 'iniciativa' | 'processo' | 'risco' | 'reuniao';
    id: string;
  };
  subtarefas?: TodoItem[];
  lembretes?: Array<{
    data: Date;
    enviado: boolean;
  }>;
  criado_em: Date;
  atualizado_em: Date;
}

interface TodoList {
  id: string;
  nome: string;
  tipo: 'pessoal' | 'projeto' | 'equipe';
  projeto_id?: string;
  compartilhada_com?: string[]; // IDs de usuários
  itens: TodoItem[];
  filtros_ativos?: {
    status?: 'todas' | 'pendentes' | 'concluidas';
    prioridade?: string;
    atribuido?: string;
    tags?: string[];
  };
}
```

**Funcionalidades:**
- Criar, editar, deletar tarefas
- Marcar como concluída
- Reordenar (drag-and-drop)
- Filtrar por status, prioridade, tags
- Buscar
- Agrupar por data, prioridade, responsável
- Compartilhar listas
- Atribuir tarefas a outros usuários
- Lembretes (notificações)

---

## 9. Tasks (Sistema de Tarefas)

### 9.1 Diferença entre Todo List e Tasks

**Todo List**: Tarefas simples, pessoais ou compartilhadas, sem workflow complexo

**Tasks**: Tarefas do projeto com workflow, dependências, estimativas, rastreamento

### 9.2 Estrutura de Tasks

```typescript
interface Task {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'tarefa' | 'bug' | 'melhoria' | 'documentacao' | 'pesquisa';
  status: 'backlog' | 'planejada' | 'em_andamento' | 'em_revisao' | 'concluida' | 'cancelada';
  prioridade: 'critica' | 'alta' | 'media' | 'baixa';
  
  // Atribuição
  criado_por: string;
  atribuido_para?: string;
  revisores?: string[]; // Para tarefas que precisam revisão
  
  // Estimativas
  estimativa_horas?: number;
  tempo_gasto_horas?: number;
  data_inicio?: Date;
  data_vencimento?: Date;
  data_conclusao?: Date;
  
  // Relacionamentos
  projeto_id: string;
  fase?: string;
  iniciativa_vinculada?: string;
  dependencias?: string[]; // IDs de outras tasks
  bloqueada_por?: string[]; // Tasks que bloqueiam esta
  
  // Detalhes
  labels?: string[];
  checklist?: Array<{
    id: string;
    item: string;
    concluido: boolean;
  }>;
  anexos?: string[]; // IDs de arquivos
  comentarios?: TaskComment[];
  
  // Rastreamento
  tempo_logado?: Array<{
    usuario: string;
    horas: number;
    data: Date;
    descricao?: string;
  }>;
  historico_mudancas?: Array<{
    campo: string;
    valor_anterior: any;
    valor_novo: any;
    alterado_por: string;
    data: Date;
  }>;
  
  criado_em: Date;
  atualizado_em: Date;
}

interface TaskComment {
  id: string;
  usuario: string;
  comentario: string;
  data: Date;
  editado?: boolean;
  anexos?: string[];
}
```

**Visualizações:**
- **Lista**: Tabela com todas as tasks
- **Kanban**: Por status
- **Timeline**: Linha do tempo com dependências
- **Board**: Por responsável ou por iniciativa

**Funcionalidades:**
- Criar, editar, deletar
- Atribuir, reatribuir
- Log de tempo
- Adicionar comentários
- Upload de anexos
- Checklist
- Dependências visuais
- Filtros avançados
- Busca
- Exportar

---

## 10. Calendar (Calendário)

### 10.1 Uso no Projeto OT2net

**Eventos:**
- **Entrevistas agendadas** (Fase 0)
- **Workshops** (Fase 0)
- **Reuniões de comitê** (Fase 2 e 3)
- **Marcos do projeto** (deadlines importantes)
- **Reuniões da equipe**
- **Apresentações para stakeholders**
- **Auditorias** (se agendadas)
- **Treinamentos**

### 10.2 Estrutura

```typescript
interface CalendarEvent {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: 'entrevista' | 'workshop' | 'reuniao_comite' | 'marco' | 'reuniao_equipe' | 
        'apresentacao' | 'auditoria' | 'treinamento' | 'outro';
  
  // Datas
  data_inicio: Date;
  data_fim: Date;
  dia_inteiro?: boolean; // Se for evento de dia inteiro
  recorrente?: {
    frequencia: 'diaria' | 'semanal' | 'mensal' | 'anual';
    intervalo: number; // A cada X dias/semanas/meses
    termina_em?: Date;
    termina_apos?: number; // Após X ocorrências
    dias_semana?: number[]; // Para semanal: [1,3,5] = segunda, quarta, sexta
  };
  
  // Localização
  local?: string; // "Sala de Reuniões A", "Site SE Bom Despacho"
  online?: boolean;
  link_videoconferencia?: string;
  
  // Participantes
  organizador: string; // User ID
  participantes: Array<{
    usuario_id: string;
    nome: string;
    email: string;
    status: 'confirmado' | 'pendente' | 'recusado' | 'talvez';
    notificado: boolean;
  }>;
  
  // Vinculações
  projeto_id: string;
  fase?: string;
  entidade_vinculada?: {
    tipo: 'entrevista' | 'workshop' | 'comite' | 'iniciativa';
    id: string;
  };
  
  // Detalhes específicos por tipo
  metadata?: {
    // Para entrevista
    tipo_entrevista?: string;
    pessoa_entrevistada?: string;
    
    // Para workshop
    tema_workshop?: string;
    facilitador?: string;
    
    // Para reunião de comitê
    comite_id?: string;
    pauta?: string[];
    
    // Para marco
    iniciativa_id?: string;
    critico?: boolean; // Se é marco crítico
  };
  
  // Lembretes
  lembretes?: Array<{
    tempo_antes: number; // Minutos antes do evento
    metodo: 'email' | 'in_app' | 'push';
    enviado: boolean;
  }>;
  
  // Status
  status: 'agendado' | 'em_andamento' | 'concluido' | 'cancelado';
  cancelado_por?: string;
  motivo_cancelamento?: string;
  
  // Anexos
  anexos?: string[]; // IDs de arquivos (agenda, apresentação, etc)
  
  criado_em: Date;
  atualizado_em: Date;
}
```

### 10.3 Visualizações do Calendário

**1. Vista Mensal:**
- Grid de dias do mês
- Eventos mostrados como badges nos dias
- Click no dia: ver eventos do dia
- Click no evento: abrir detalhes

**2. Vista Semanal:**
- Grid de 7 dias
- Colunas por dia, linhas por hora
- Eventos como blocos de tempo
- Drag-and-drop para mover eventos

**3. Vista Diária:**
- Timeline de 24 horas
- Eventos como blocos de tempo
- Mais detalhes visíveis

**4. Vista de Agenda:**
- Lista de eventos próximos
- Agrupados por data
- Filtros por tipo, participante

**Funcionalidades:**
- Criar evento
- Editar evento (drag-and-drop para mudar data/hora)
- Deletar evento
- Duplicar evento
- Criar evento recorrente
- Convites (enviar email para participantes)
- Sincronização (Google Calendar, Outlook) - futuro
- Exportar (iCal, Google Calendar)
- Filtros (por tipo, participante, fase)
- Busca
- Cores por tipo de evento

**Integração:**
- Notificações antes do evento
- Link para videoconferência (se online)
- Criar evento a partir de entrevista agendada
- Criar evento a partir de reunião de comitê

---

## 11. Sistema de Questionários/Pesquisas

### 11.1 Visão Geral

O sistema de questionários permite coletar respostas estruturadas de operadores, técnicos e engenheiros de TO de forma escalável, complementando entrevistas individuais e observações de campo.

### 11.2 Estrutura de Questionário

```typescript
interface Questionario {
  id: string;
  nome: string;
  descricao: string;
  objetivo: string; // "Coletar feedback sobre dificuldades operacionais"
  
  // Configuração
  projeto_id: string;
  fase: 'fase_zero' | 'fase_um' | 'todas';
  publico_alvo: 'operadores' | 'tecnicos' | 'engenheiros' | 'todos';
  sites_alvo?: string[]; // IDs de sites específicos, ou null para todos
  
  // Status
  status: 'rascunho' | 'publicado' | 'pausado' | 'encerrado';
  data_criacao: Date;
  data_publicacao?: Date;
  data_encerramento?: Date;
  
  // Acesso
  acesso: 'publico' | 'link_privado' | 'apenas_convidados';
  link_publico?: string; // UUID único para acesso público
  senha_acesso?: string; // Opcional: proteger com senha
  permite_respostas_anonimas: boolean;
  
  // Coleta
  permite_multiplas_respostas: boolean; // Se mesmo usuário pode responder várias vezes
  limite_respostas?: number; // Limite total de respostas aceitas
  coleta_metadata_automatica: boolean; // Site, cargo, turno automaticamente
  
  // Questões
  questoes: Questao[];
  ordem_questoes: 'fixa' | 'aleatoria'; // Se ordem das questões é fixa ou aleatória
  
  // Mensagens
  mensagem_introducao?: string; // Mostrada antes de começar
  mensagem_agradecimento?: string; // Mostrada após enviar
  
  // Configurações avançadas
  progress_bar: boolean; // Mostrar barra de progresso
  salvar_progresso: boolean; // Permitir salvar e continuar depois
  modo_offline: boolean; // Permitir preencher offline
  
  // Rastreamento
  criado_por: string;
  total_respostas: number;
  respostas_completas: number;
  respostas_parciais: number;
  taxa_conclusao: number; // %
}

interface Questao {
  id: string;
  ordem: number;
  tipo: 'texto_livre' | 'texto_curto' | 'multipla_escolha' | 'multipla_escolha_multipla' | 
        'escala' | 'data' | 'numero' | 'upload' | 'matriz' | 'ranking';
  pergunta: string;
  descricao_ajuda?: string; // Texto de ajuda abaixo da pergunta
  obrigatoria: boolean;
  
  // Opções (para múltipla escolha, escala, etc)
  opcoes?: Array<{
    id: string;
    label: string;
    valor: string | number;
    ordem: number;
  }>;
  
  // Validação
  validacao?: {
    min_caracteres?: number;
    max_caracteres?: number;
    min_valor?: number;
    max_valor?: number;
    padrao_regex?: string;
    mensagem_erro?: string;
  };
  
  // Lógica condicional
  mostrar_se?: {
    questao_id: string;
    condicao: 'igual' | 'diferente' | 'contem' | 'maior' | 'menor';
    valor: any;
  };
  
  // Metadata
  tags?: string[]; // Para análise posterior
  categoria?: string; // Agrupar questões relacionadas
}

interface RespostaQuestionario {
  id: string;
  questionario_id: string;
  
  // Identificação (se não anônimo)
  usuario_id?: string;
  nome_respondente?: string;
  email_respondente?: string;
  
  // Metadata automática
  site_id?: string;
  site_nome?: string;
  cargo?: string;
  turno?: string;
  data_resposta: Date;
  ip_address?: string;
  user_agent?: string;
  dispositivo?: 'desktop' | 'tablet' | 'mobile';
  
  // Respostas
  respostas: Array<{
    questao_id: string;
    valor: any; // String, number, array, objeto dependendo do tipo
    texto_livre?: string; // Para questões de texto
  }>;
  
  // Status
  status: 'em_progresso' | 'completa' | 'abandonada';
  progresso: number; // 0-100%
  tempo_preenchimento_segundos?: number;
  
  // Offline
  preenchida_offline: boolean;
  sincronizada: boolean;
  data_sincronizacao?: Date;
  
  // Processamento
  processada_ia: boolean; // Se respostas foram analisadas por IA
  insights_extraidos?: string[]; // IDs de dores, processos, etc extraídos
}
```

### 11.3 Interface de Criação de Questionário

**Página: `/questionarios/novo` ou `/questionarios/:id/editar`**

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Criar Questionário                                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Aba: Configuração] [Aba: Questões] [Aba: Preview]    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Nome do Questionário *                           │   │
│  │ [________________________________]               │   │
│  │                                                  │   │
│  │ Descrição                                        │   │
│  │ [________________________________]               │   │
│  │ [Multiline text area]                           │   │
│  │                                                  │   │
│  │ Público-alvo *                                   │   │
│  │ ○ Operadores  ○ Técnicos  ○ Engenheiros  ○ Todos│   │
│  │                                                  │   │
│  │ Sites (deixe vazio para todos)                  │   │
│  │ [Select múltiplo com busca]                     │   │
│  │                                                  │   │
│  │ ☑ Permitir respostas anônimas                   │   │
│  │ ☑ Permitir múltiplas respostas                  │   │
│  │ ☑ Salvar progresso (continuar depois)           │   │
│  │ ☑ Modo offline habilitado                       │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  [Salvar Rascunho]  [Publicar]                          │
└─────────────────────────────────────────────────────────┘
```

**Aba Questões:**
- Lista de questões (drag-and-drop para reordenar)
- Botão "Adicionar Questão"
- Para cada questão:
  - Tipo de questão (dropdown)
  - Campo de pergunta
  - Checkbox "Obrigatória"
  - Configurações específicas do tipo
  - Botões: Editar, Duplicar, Deletar

**Tipos de Questão Disponíveis:**

**1. Texto Livre (Longo):**
```typescript
{
  tipo: 'texto_livre',
  validacao: {
    min_caracteres: 50,
    max_caracteres: 5000
  }
}
```

**2. Texto Curto:**
```typescript
{
  tipo: 'texto_curto',
  validacao: {
    max_caracteres: 200
  }
}
```

**3. Múltipla Escolha (Uma opção):**
```typescript
{
  tipo: 'multipla_escolha',
  opcoes: [
    { label: 'Diariamente', valor: 'diaria' },
    { label: 'Semanalmente', valor: 'semanal' },
    { label: 'Mensalmente', valor: 'mensal' }
  ]
}
```

**4. Múltipla Escolha (Múltiplas opções):**
```typescript
{
  tipo: 'multipla_escolha_multipla',
  opcoes: [
    { label: 'SCADA', valor: 'scada' },
    { label: 'CMMS', valor: 'cmms' },
    { label: 'Excel', valor: 'excel' },
    { label: 'Outlook', valor: 'outlook' }
  ]
}
```

**5. Escala (Likert):**
```typescript
{
  tipo: 'escala',
  opcoes: [
    { label: 'Muito Insatisfeito', valor: 1 },
    { label: 'Insatisfeito', valor: 2 },
    { label: 'Neutro', valor: 3 },
    { label: 'Satisfeito', valor: 4 },
    { label: 'Muito Satisfeito', valor: 5 }
  ]
}
// Ou escala numérica de 1 a 10
```

**6. Data:**
```typescript
{
  tipo: 'data',
  validacao: {
    min_data: '2020-01-01',
    max_data: 'hoje'
  }
}
```

**7. Número:**
```typescript
{
  tipo: 'numero',
  validacao: {
    min_valor: 0,
    max_valor: 100
  }
}
```

**8. Upload de Arquivo:**
```typescript
{
  tipo: 'upload',
  validacao: {
    tipos_permitidos: ['image/*', 'application/pdf'],
    tamanho_max_mb: 10
  }
}
```

**9. Matriz (Múltiplas perguntas com mesma escala):**
```typescript
{
  tipo: 'matriz',
  linhas: [
    'Sistema SCADA',
    'Sistema CMMS',
    'Planilhas Excel'
  ],
  colunas: [
    'Muito Fácil',
    'Fácil',
    'Neutro',
    'Difícil',
    'Muito Difícil'
  ]
}
```

**10. Ranking (Ordenar opções):**
```typescript
{
  tipo: 'ranking',
  opcoes: [
    'Acesso a sistemas',
    'Documentação',
    'Treinamento',
    'Ferramentas',
    'Processos'
  ],
  instrucao: 'Ordene do mais problemático (1) ao menos problemático (5)'
}
```

### 11.4 Interface de Preenchimento do Questionário

**Página: `/questionarios/:link/responder`**

**Design:**
- Interface minimalista e não intimidante
- Linguagem simples
- Progresso visível (barra no topo)
- Navegação: Anterior, Próxima, Salvar e Continuar Depois
- Validação em tempo real
- Mensagens de erro claras

**Layout Mobile-First:**
```typescript
// Componente de questão
<QuestionCard>
  <ProgressBar value={progresso} />
  
  <QuestionHeader>
    <QuestionNumber>Questão {ordem} de {total}</QuestionNumber>
    {obrigatoria && <RequiredBadge>* Obrigatória</RequiredBadge>}
  </QuestionHeader>
  
  <QuestionText>{questao.pergunta}</QuestionText>
  {questao.descricao_ajuda && (
    <HelpText>{questao.descricao_ajuda}</HelpText>
  )}
  
  <QuestionInput
    tipo={questao.tipo}
    opcoes={questao.opcoes}
    valor={resposta}
    onChange={handleChange}
    validacao={questao.validacao}
    erro={erro}
  />
  
  <NavigationButtons>
    <Button onClick={anterior} disabled={ordem === 1}>
      Anterior
    </Button>
    <Button onClick={proxima} disabled={!valida}>
      Próxima
    </Button>
    {!ultimaQuestao && (
      <Button variant="outline" onClick={salvarProgresso}>
        Salvar e Continuar Depois
      </Button>
    )}
  </NavigationButtons>
</QuestionCard>
```

**Modo Offline:**
```typescript
// Service Worker ou IndexedDB para armazenamento local
interface OfflineStorage {
  // Armazenar respostas localmente
  salvarRespostaLocal(resposta: Partial<RespostaQuestionario>): Promise<void>;
  
  // Sincronizar quando online
  sincronizarRespostas(): Promise<void>;
  
  // Verificar status de conexão
  estaOnline(): boolean;
  
  // Lista de respostas pendentes de sincronização
  respostasPendentes(): Promise<RespostaQuestionario[]>;
}

// Indicador visual de status
{!estaOnline && (
  <Alert variant="warning">
    <AlertTitle>Modo Offline</AlertTitle>
    <AlertDescription>
      Suas respostas estão sendo salvas localmente e serão sincronizadas quando a conexão for restaurada.
    </AlertDescription>
  </Alert>
)}
```

### 11.5 Processamento de Respostas

**1. Coleta e Armazenamento:**
```typescript
// Quando resposta é submetida
async function submeterResposta(resposta: RespostaQuestionario) {
  // Validar respostas obrigatórias
  const validacao = validarRespostas(resposta);
  if (!validacao.valida) {
    return { erro: validacao.erros };
  }
  
  // Se offline, salvar localmente
  if (!navigator.onLine) {
    await salvarLocalmente(resposta);
    return { sucesso: true, offline: true };
  }
  
  // Enviar para backend
  const resultado = await api.post('/questionarios/respostas', resposta);
  
  // Se sucesso, remover do storage local se existia
  if (resposta.id_local) {
    await removerLocal(resposta.id_local);
  }
  
  return { sucesso: true, id: resultado.data.id };
}
```

**2. Análise Estatística:**
```typescript
interface AnaliseEstatistica {
  questionario_id: string;
  total_respostas: number;
  taxa_resposta: number; // % do público-alvo que respondeu
  tempo_medio_preenchimento: number; // Minutos
  
  // Por questão
  analise_por_questao: Array<{
    questao_id: string;
    tipo: string;
    total_respostas: number;
    
    // Para múltipla escolha
    distribuicao_opcoes?: Array<{
      opcao: string;
      count: number;
      percentual: number;
    }>;
    
    // Para escala
    media?: number;
    mediana?: number;
    moda?: number;
    desvio_padrao?: number;
    
    // Para texto livre
    total_palavras?: number;
    temas_mais_mencionados?: Array<{
      tema: string;
      frequencia: number;
    }>;
  }>;
  
  // Cross-tabulação
  cross_tabs?: Array<{
    questao_x: string;
    questao_y: string;
    tabela: number[][]; // Matriz de correlação
  }>;
}
```

**3. Processamento com IA (Opcional):**
```typescript
// Analisar respostas de texto livre para extrair dores, processos, sistemas
async function processarRespostasComIA(questionario_id: string) {
  const respostas = await buscarRespostasTexto(questionario_id);
  
  // Agrupar respostas similares
  const grupos = agruparPorSimilaridade(respostas);
  
  // Para cada grupo, processar com IA
  for (const grupo of grupos) {
    const contexto = montarContextoGrupo(grupo);
    const resultado = await claudeAPI.processar({
      prompt: `Analise as seguintes respostas de questionário sobre operação de TO:
      
      ${contexto}
      
      Extraia:
      - Dores operacionais mencionadas
      - Processos descritos
      - Sistemas utilizados
      - Dificuldades recorrentes
      `,
      formato: 'json'
    });
    
    // Criar entidades automaticamente
    await criarEntidadesDoProcessamento(resultado, grupo);
  }
}
```

### 11.6 Dashboard de Resultados

**Página: `/questionarios/:id/resultados`**

**Visualizações:**
- **Resumo Executivo**: Total de respostas, taxa de resposta, tempo médio
- **Gráficos por Questão**: 
  - Pizza para múltipla escolha
  - Barras para escala
  - Nuvem de palavras para texto livre
- **Tabela de Respostas**: Todas as respostas individuais (se não anônimo)
- **Exportação**: Excel, CSV, PDF

**Filtros:**
- Por site
- Por cargo
- Por turno
- Por data de resposta

**Comparações:**
- Comparar respostas entre sites
- Comparar respostas entre turnos
- Evolução temporal (se questionário foi aplicado múltiplas vezes)

### 11.7 Fluxo Completo de Questionário

**1. Criação (Consultor):**
```
Consultor acessa → Criar Questionário
  → Define configurações (nome, público, sites)
  → Adiciona questões (drag-and-drop)
  → Preview do questionário
  → Publica (gera link público)
```

**2. Distribuição:**
```
Opção A: Link público compartilhado
  → Consultor copia link
  → Compartilha via email, WhatsApp, QR Code
  → Operadores acessam link

Opção B: Convites diretos
  → Consultor seleciona usuários
  → Sistema envia email com link personalizado
  → Usuário acessa (já autenticado ou com token)

Opção C: QR Code em campo
  → Gerar QR Code do link
  → Imprimir ou exibir em tablet
  → Operador escaneia e acessa
```

**3. Preenchimento (Operador):**
```
Operador acessa link
  → Vê introdução e instruções
  → Começa a responder
  → Pode salvar progresso (se habilitado)
  → Pode preencher offline (se habilitado)
  → Submete respostas
  → Vê mensagem de agradecimento
```

**4. Sincronização (Se Offline):**
```
Resposta preenchida offline
  → Salva em IndexedDB/localStorage
  → Service Worker detecta quando online
  → Sincroniza automaticamente
  → Confirma sucesso
```

**5. Análise (Consultor):**
```
Consultor acessa resultados
  → Vê dashboard com estatísticas
  → Analisa respostas individuais
  → Processa com IA (opcional)
  → Exporta dados
  → Gera relatório
```

### 11.8 Suporte Offline Completo

**Tecnologias:**
- **Service Worker**: Interceptar requisições, cache de assets
- **IndexedDB**: Armazenar respostas localmente
- **Background Sync API**: Sincronizar quando online
- **Cache API**: Cache de questionários para acesso offline

**Implementação:**
```typescript
// service-worker.ts
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('questionarios-v1').then((cache) => {
      return cache.addAll([
        '/questionarios/offline.html',
        '/assets/questionario-app.js',
        '/assets/questionario-styles.css'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Interceptar requisições de questionários
  if (event.request.url.includes('/questionarios/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Se offline, retornar do cache
        return caches.match(event.request);
      })
    );
  }
});

// Sincronização de respostas
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-respostas') {
    event.waitUntil(sincronizarRespostasPendentes());
  }
});

// Sincronizar respostas pendentes
async function sincronizarRespostasPendentes() {
  const respostasPendentes = await obterRespostasPendentes();
  
  for (const resposta of respostasPendentes) {
    try {
      await fetch('/api/questionarios/respostas', {
        method: 'POST',
        body: JSON.stringify(resposta),
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Marcar como sincronizada
      await marcarSincronizada(resposta.id_local);
    } catch (error) {
      console.error('Erro ao sincronizar resposta:', error);
    }
  }
}
```

**Armazenamento Local:**
```typescript
// indexed-db.ts
interface RespostaLocal {
  id_local: string; // UUID gerado localmente
  questionario_id: string;
  respostas: any[];
  progresso: number;
  data_criacao: Date;
  sincronizada: boolean;
}

// Salvar resposta localmente
async function salvarRespostaLocal(resposta: RespostaLocal) {
  const db = await abrirDB();
  const tx = db.transaction('respostas', 'readwrite');
  await tx.store.put(resposta);
  await tx.done;
}

// Obter respostas pendentes
async function obterRespostasPendentes(): Promise<RespostaLocal[]> {
  const db = await abrirDB();
  return await db.getAllFromIndex('respostas', 'sincronizada', false);
}
```

**Interface Offline:**
```typescript
// Componente que detecta status online/offline
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
}

// No componente de questionário
const isOnline = useOnlineStatus();
const respostasPendentes = useRespostasPendentes();

{!isOnline && (
  <Banner variant="warning">
    <WifiOff className="w-4 h-4" />
    <span>Modo Offline - {respostasPendentes.length} resposta(s) aguardando sincronização</span>
  </Banner>
)}

{!isOnline && respostasPendentes.length > 0 && (
  <Button onClick={tentarSincronizar}>
    Tentar Sincronizar Agora
  </Button>
)}
```

### 11.9 Otimização para Tablet e Mobile

**Design Responsivo:**
- Layout adapta-se ao tamanho da tela
- Questões uma por vez em mobile (swipe)
- Múltiplas questões visíveis em tablet/desktop
- Botões grandes e fáceis de tocar
- Inputs otimizados para touch

**Performance:**
- Lazy loading de questões
- Virtualização de listas longas
- Compressão de imagens no upload
- Cache agressivo de assets

**Acessibilidade:**
- Navegação por teclado
- Screen reader friendly
- Alto contraste
- Tamanho de fonte ajustável

---

## 12. Resumo de Componentes e Priorização

### ✅ Componentes Prontos para Uso (Pouca Adaptação)

1. **Profile** - Base pronta, adicionar seções específicas
2. **Authentication** - Base pronta, customizar perfis
3. **Error Pages** - Prontas, customizar mensagens
4. **Settings** - Base pronta, adicionar preferências específicas
5. **Calendar** - Base pronta, adaptar tipos de eventos
6. **Todo List** - Pronto para uso

### ⚠️ Componentes que Precisam Adaptação Média

1. **Kanban** - Adaptar colunas e cards para iniciativas/processos
2. **File Management** - Estrutura de pastas específica do projeto
3. **Tasks** - Workflow e campos específicos

### 🔧 Componentes que Precisam Desenvolvimento Customizado

1. **Questionários** - Sistema completo customizado
2. **AI Chat v2** - Funcionalidades avançadas futuras

---

**Próximos Passos**: Documentar especificamente o sistema de questionários na especificação principal e criar wireframes das interfaces.

