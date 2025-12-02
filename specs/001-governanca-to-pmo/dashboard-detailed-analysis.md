# Análise Detalhada: Dashboards do Template vs Necessidades do Projeto OT2net

**Data**: 2025-01-27  
**Foco**: Dashboards de Gestão de Projetos e Controle de Usuários  
**Template Base**: shadcn-ui-kit-dashboard

---

## 1. Dashboard de Gestão de Projetos (Project Management Dashboard)

### 1.1 Componentes do Template

#### 📊 Métricas Principais (Cards de KPI)
**Template oferece:**
- Cards com métricas numéricas (receita, projetos ativos, novos leads, tempo gasto)
- Indicadores de tendência (↑↓) e percentual de variação
- Ícones visuais por métrica
- Layout responsivo em grid

**Adaptação para OT2net:**
```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard Executivo - Projeto de Governança de TO          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Fase     │  │ Iniciat. │  │ Processos│  │ Riscos   │   │
│  │ Atual    │  │ Ativas   │  │ Mapeados │  │ Críticos │   │
│  │          │  │          │  │          │  │          │   │
│  │ Fase 0   │  │    12    │  │    45    │  │    3     │   │
│  │ 65%      │  │  ↑ 2     │  │  ↑ 8     │  │  ⚠️      │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Sites    │  │ Entrev.  │  │ Docs     │  │ Custo IA │   │
│  │ Mapeados │  │ Realiz.  │  │ Process. │  │ (Mês)    │   │
│  │          │  │          │  │          │  │          │   │
│  │   8/10   │  │   32/50  │  │   15     │  │  $245    │   │
│  │ 80%      │  │  64%     │  │  ↑ 3     │  │  ⚠️ 82%  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Mapeamento de Métricas:**

| Métrica Template | Métrica OT2net | Fonte de Dados | Cálculo |
|------------------|----------------|----------------|---------|
| Receita Total | Custo Total do Projeto | Backend (orçamento) | Soma de custos por fase |
| Projetos Ativos | Iniciativas em Execução | Tabela `iniciativas` WHERE status='em_execucao' | COUNT(*) |
| Novos Leads | Novas Descrições Raw (últimos 7 dias) | Tabela `descricoes_operacionais_raw` WHERE created_at >= NOW() - 7 days | COUNT(*) |
| Tempo Gasto | Horas Totais Trabalhadas | Tabela `membros_equipe` (alocação) | SUM(horas_alocadas) |
| - | Fase Atual do Projeto | Configuração do projeto | Fase com maior progresso |
| - | Processos Normalizados | Tabela `processos_normalizados` WHERE status='aprovado' | COUNT(*) |
| - | Riscos Críticos | Tabela `riscos` WHERE classificacao='critico' | COUNT(*) |
| - | Sites Mapeados | Tabela `sites` WHERE fase_0_incluido=true | COUNT(*) |
| - | Entrevistas Realizadas | Tabela `descricoes_operacionais_raw` WHERE status='processada' | COUNT(*) |
| - | Documentos Processados | Tabela `documentos` WHERE processado_ia=true | COUNT(*) |
| - | Custo IA (Mês) | Tabela `chamadas_ia_log` WHERE created_at >= inicio_mes | SUM(custo_calculado) |

**Status Visual (Verde/Amarelo/Vermelho):**
- **Verde**: Dentro do esperado (ex: progresso >= 80%, custo IA < 70% do orçamento)
- **Amarelo**: Atenção necessária (ex: progresso 50-79%, custo IA 70-90%)
- **Vermelho**: Crítico (ex: progresso < 50%, custo IA > 90%, riscos críticos > 5)

---

#### 📈 Gráficos e Visualizações

**Template oferece:**
- Gráfico de linha (evolução temporal)
- Gráfico de barras (comparação)
- Gráfico de pizza (distribuição)
- Gráfico de área (acumulado)

**Adaptação para OT2net:**

**1. Evolução do Progresso por Fase (Gráfico de Linha)**
```typescript
// Dados necessários
interface ProgressoFase {
  data: string; // Data da medição
  fase_menos_um: number; // % completo Fase -1
  fase_zero: number;      // % completo Fase 0
  fase_um: number;        // % completo Fase 1
  fase_dois: number;      // % completo Fase 2
  fase_tres: number;      // % completo Fase 3
}

// Visualização
<LineChart>
  <Line dataKey="fase_menos_um" stroke="#00ade8" name="Fase -1: Onboarding" />
  <Line dataKey="fase_zero" stroke="#7ED321" name="Fase 0: Descoberta" />
  <Line dataKey="fase_um" stroke="#F5A623" name="Fase 1: Assessment" />
  <Line dataKey="fase_dois" stroke="#D0021B" name="Fase 2: Plano Diretor" />
  <Line dataKey="fase_tres" stroke="#9013FE" name="Fase 3: PMO" />
</LineChart>
```

**2. Distribuição de Iniciativas por Status (Gráfico de Pizza)**
```typescript
// Dados: COUNT por status
const dados = [
  { name: 'Planejada', value: 8, color: '#94a3b8' },
  { name: 'Em Execução', value: 12, color: '#00ade8' },
  { name: 'Concluída', value: 15, color: '#7ED321' },
  { name: 'Suspensa', value: 2, color: '#F5A623' },
  { name: 'Cancelada', value: 1, color: '#D0021B' }
];
```

**3. Iniciativas por Domínio de Governança (Gráfico de Barras)**
```typescript
// Agrupar iniciativas por domínio
const dados = [
  { dominio: 'Governança de TO', count: 8 },
  { dominio: 'Segmentação de Redes', count: 5 },
  { dominio: 'Gestão de Acessos', count: 6 },
  { dominio: 'Gestão de Ativos', count: 7 },
  { dominio: 'Resposta a Incidentes', count: 4 },
  { dominio: 'Gestão de Vulnerabilidades', count: 3 },
  { dominio: 'Backup e Recuperação', count: 2 }
];
```

**4. Matriz de Riscos (Heatmap)**
```typescript
// Eixo X: Probabilidade (Baixa, Média, Alta)
// Eixo Y: Impacto (Baixo, Médio, Alto, Crítico)
// Cor: Quantidade de riscos naquela célula
const matrizRiscos = [
  { probabilidade: 'Baixa', impacto: 'Baixo', count: 5, color: '#7ED321' },
  { probabilidade: 'Baixa', impacto: 'Médio', count: 3, color: '#F5A623' },
  { probabilidade: 'Média', impacto: 'Alto', count: 2, color: '#F5A623' },
  { probabilidade: 'Alta', impacto: 'Crítico', count: 3, color: '#D0021B' },
  // ...
];
```

**5. Evolução de KPIs/KRIs (Gráfico de Área com Thresholds)**
```typescript
// Mostrar evolução temporal de indicadores com zonas de alerta
<AreaChart>
  <Area dataKey="valor" stroke="#00ade8" fill="#00ade8" opacity={0.3} />
  <ReferenceLine y={meta} stroke="#7ED321" strokeDasharray="3 3" label="Meta" />
  <ReferenceLine y={threshold_amarelo} stroke="#F5A623" strokeDasharray="2 2" />
  <ReferenceLine y={threshold_vermelho} stroke="#D0021B" strokeDasharray="2 2" />
</AreaChart>
```

---

#### 📋 Lista de Projetos/Iniciativas

**Template oferece:**
- Tabela com projetos
- Colunas: Nome, Status, Progresso, Responsável, Prazo
- Filtros por status
- Ordenação por colunas
- Ações rápidas (editar, visualizar, deletar)

**Adaptação para OT2net - Lista de Iniciativas:**

```typescript
// Estrutura da tabela
interface IniciativaTableRow {
  id: string;
  nome: string;
  dominio: string; // Domínio de governança
  status: 'planejada' | 'em_execucao' | 'concluida' | 'suspensa' | 'cancelada';
  progresso: number; // 0-100%
  responsavel: string; // Nome do responsável
  prazo_fim: Date;
  prioridade: 'critica' | 'alta' | 'media' | 'baixa';
  saude: 'verde' | 'amarelo' | 'vermelho'; // Calculado pela IA
  proximo_marco: string;
  dias_ate_marco: number;
}

// Colunas da tabela
const colunas = [
  { key: 'nome', label: 'Iniciativa', sortable: true },
  { key: 'dominio', label: 'Domínio', filterable: true },
  { key: 'status', label: 'Status', filterable: true, badge: true },
  { 
    key: 'progresso', 
    label: 'Progresso', 
    render: (value) => <ProgressBar value={value} /> 
  },
  { key: 'saude', label: 'Saúde', render: (value) => <StatusBadge status={value} /> },
  { key: 'responsavel', label: 'Responsável', sortable: true },
  { key: 'prazo_fim', label: 'Prazo', sortable: true, render: (date) => formatDate(date) },
  { key: 'prioridade', label: 'Prioridade', filterable: true, badge: true },
  { key: 'acoes', label: 'Ações', render: (row) => <ActionButtons row={row} /> }
];

// Filtros disponíveis
const filtros = [
  { key: 'status', type: 'select', options: ['planejada', 'em_execucao', 'concluida', 'suspensa'] },
  { key: 'dominio', type: 'select', options: ['Governança', 'Segmentação', 'Acessos', ...] },
  { key: 'prioridade', type: 'select', options: ['critica', 'alta', 'media', 'baixa'] },
  { key: 'saude', type: 'select', options: ['verde', 'amarelo', 'vermelho'] },
  { key: 'responsavel', type: 'autocomplete', source: 'usuarios' },
  { key: 'atrasadas', type: 'checkbox', label: 'Apenas atrasadas' }
];
```

**Ações Rápidas:**
- 👁️ Visualizar detalhes (abre modal ou página)
- ✏️ Editar iniciativa
- 📊 Ver análise preditiva (IA)
- 📝 Registrar progresso
- 🚨 Reportar bloqueio
- 📤 Exportar para Excel/PDF
- 🔗 Vincular a risco/dor/processo

---

#### 🎯 Eficiência e Atividades Recentes

**Template oferece:**
- Seção de eficiência (métricas de produtividade)
- Timeline de atividades recentes
- Feed de notificações

**Adaptação para OT2net:**

**Eficiência:**
```typescript
interface MetricasEficiencia {
  taxa_conclusao_marco: number; // % de marcos concluídos no prazo
  velocidade_execucao: number; // Iniciativas concluídas / semana
  taxa_revisao_ia: number; // % de normalizações aprovadas sem ajustes
  tempo_medio_processamento: number; // Minutos médios para processar descrição raw
  taxa_adoção_plataforma: number; // % de atividades registradas na plataforma
}
```

**Atividades Recentes (Timeline):**
```typescript
interface AtividadeRecente {
  id: string;
  tipo: 'descricao_processada' | 'iniciativa_atualizada' | 'risco_identificado' | 
        'relatorio_gerado' | 'comite_realizado' | 'excecao_aprovada';
  descricao: string; // "João processou descrição de Monitoramento de Alarmes"
  usuario: string;
  timestamp: Date;
  entidade_relacionada?: {
    tipo: 'processo' | 'iniciativa' | 'risco' | 'relatorio';
    id: string;
    nome: string;
  };
  acao_rapida?: {
    label: string;
    onClick: () => void;
  };
}

// Renderização
<Timeline>
  {atividades.map(ativ => (
    <TimelineItem key={ativ.id}>
      <TimelineIcon tipo={ativ.tipo} />
      <TimelineContent>
        <p>{ativ.descricao}</p>
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(ativ.timestamp)} atrás
        </span>
        {ativ.entidade_relacionada && (
          <Link to={`/${ativ.entidade_relacionada.tipo}/${ativ.entidade_relacionada.id}`}>
            Ver {ativ.entidade_relacionada.nome}
          </Link>
        )}
      </TimelineContent>
    </TimelineItem>
  ))}
</Timeline>
```

---

### 1.2 Adaptações Específicas Necessárias

#### 🗓️ Roadmap Gantt (Não existe no template padrão)

**Necessidade do Projeto:**
- Visualização Gantt interativa com drag-and-drop
- Iniciativas como barras horizontais
- Dependências como setas
- Marcos como diamantes
- Zoom (anos, trimestres, meses, semanas)
- Caminho crítico destacado

**Solução:**
```typescript
// Biblioteca: react-gantt-chart ou @dhtmlx/gantt
import { Gantt } from 'react-gantt-chart';

interface GanttTask {
  id: string;
  name: string; // Nome da iniciativa
  start: Date;
  end: Date;
  progress: number; // 0-100
  dependencies?: string[]; // IDs de iniciativas predecessoras
  milestone?: boolean;
  critical?: boolean; // Caminho crítico
  color?: string; // Por domínio ou prioridade
}

<Gantt
  tasks={iniciativas}
  onTaskChange={(task) => updateIniciativa(task)} // Drag-and-drop
  onDependencyChange={(dep) => updateDependencia(dep)}
  viewMode="month" // ou 'year', 'quarter', 'week'
  showCriticalPath={true}
/>
```

---

#### 📊 Dashboard da Fase 0 (Específico do Projeto)

**Componentes necessários:**

**1. Métricas de Coleta:**
```typescript
interface MetricasFase0 {
  total_descricoes_coletadas: number;
  descricoes_processadas: number;
  descricoes_pendentes: number;
  processos_normalizados: number;
  processos_aprovados: number;
  processos_em_revisao: number;
  ativos_identificados: number;
  dificuldades_catalogadas: number;
  workarounds_identificados: number;
  taxa_aprovacao_normalizacao: number; // % aprovadas sem ajustes
  score_medio_qualidade: number; // 0-100
}
```

**2. Gráfico de Coleta ao Longo do Tempo:**
```typescript
// Linha mostrando quantas descrições foram coletadas por dia/semana
<LineChart data={coletaPorPeriodo}>
  <Line dataKey="coletadas" name="Coletadas" />
  <Line dataKey="processadas" name="Processadas" />
  <Line dataKey="aprovadas" name="Aprovadas" />
</LineChart>
```

**3. Distribuição por Site:**
```typescript
// Barras mostrando quantos processos foram mapeados por site
<BarChart data={processosPorSite}>
  <Bar dataKey="count" fill="#00ade8" />
  <XAxis dataKey="site_nome" />
</BarChart>
```

**4. Distribuição por Criticidade:**
```typescript
// Pizza mostrando processos por nível de criticidade
<PieChart>
  <Pie data={processosPorCriticidade} dataKey="count" />
</PieChart>
```

**5. Mapa de Calor de Dificuldades:**
```typescript
// Heatmap: Categoria de Dificuldade x Site
// Intensidade da cor = quantidade de dificuldades
<Heatmap
  xAxis={categoriasDificuldade} // ['Sistema Lento', 'Falta Integração', ...]
  yAxis={sites}
  data={dificuldadesPorCategoriaESite}
/>
```

**6. Nuvem de Palavras - Sistemas Mais Mencionados:**
```typescript
// Biblioteca: react-wordcloud
import WordCloud from 'react-wordcloud';

const palavras = [
  { text: 'SCADA Elipse E3', value: 45 },
  { text: 'Excel', value: 32 },
  { text: 'CMMS', value: 28 },
  { text: 'Outlook', value: 25 },
  // ...
];

<WordCloud words={palavras} />
```

---

## 2. Dashboard de Controle de Usuários (User Management Dashboard)

### 2.1 Componentes do Template

#### 👥 Lista de Usuários

**Template oferece:**
- Tabela de usuários
- Colunas: Nome, Email, Cargo, Status, Último Acesso
- Filtros por status, cargo, permissões
- Ações: Editar, Desativar, Resetar Senha, Ver Perfil

**Adaptação para OT2net:**

```typescript
interface UsuarioTableRow {
  id: string;
  nome: string;
  email: string;
  perfil: 'administrador' | 'lider_projeto' | 'consultor' | 'stakeholder_cliente' | 'apenas_leitura';
  organizacao: 'cliente' | 'consultoria_ness' | 'terceiro';
  status: 'ativo' | 'inativo' | 'suspenso';
  ultimo_acesso: Date;
  data_criacao: Date;
  permissoes: {
    entidades: {
      [key: string]: 'view' | 'create' | 'edit' | 'delete' | 'none';
    };
  };
  acoes_restritas: string[]; // ['aprovar_escopo', 'fechar_fase', ...]
  membro_equipe?: {
    projeto_id: string;
    papel: string;
    alocacao_percentual: number;
  };
}

// Colunas da tabela
const colunas = [
  { key: 'nome', label: 'Nome', sortable: true },
  { key: 'email', label: 'Email', sortable: true, filterable: true },
  { 
    key: 'perfil', 
    label: 'Perfil', 
    filterable: true,
    render: (value) => <Badge variant={getPerfilVariant(value)}>{value}</Badge>
  },
  { 
    key: 'organizacao', 
    label: 'Organização',
    filterable: true,
    render: (value) => value === 'consultoria_ness' ? 'ness.' : 'Cliente'
  },
  { 
    key: 'status', 
    label: 'Status',
    filterable: true,
    render: (value) => <StatusBadge status={value} />
  },
  { 
    key: 'ultimo_acesso', 
    label: 'Último Acesso',
    sortable: true,
    render: (date) => date ? formatDistanceToNow(date) : 'Nunca'
  },
  { 
    key: 'membro_equipe', 
    label: 'No Projeto',
    render: (membro) => membro ? `${membro.papel} (${membro.alocacao_percentual}%)` : '-'
  },
  { key: 'acoes', label: 'Ações', render: (row) => <UserActionButtons user={row} /> }
];
```

**Ações Disponíveis:**
- 👁️ Ver Perfil Completo
- ✏️ Editar Usuário
- 🔐 Gerenciar Permissões
- 🔄 Resetar Senha
- 📧 Enviar Convite (se inativo)
- 🚫 Desativar/Ativar
- 📊 Ver Atividades (auditoria)
- 🗑️ Deletar (apenas admin)

---

#### 📊 Estatísticas de Usuários

**Template oferece:**
- Cards com métricas: Total de Usuários, Usuários Ativos, Novos Usuários (mês), Usuários por Perfil

**Adaptação para OT2net:**

```typescript
interface EstatisticasUsuarios {
  total_usuarios: number;
  usuarios_ativos: number; // Status = 'ativo' e último acesso < 30 dias
  usuarios_inativos: number; // Status = 'ativo' mas último acesso > 30 dias
  novos_usuarios_mes: number; // Criados no último mês
  usuarios_por_perfil: {
    administrador: number;
    lider_projeto: number;
    consultor: number;
    stakeholder_cliente: number;
    apenas_leitura: number;
  };
  usuarios_por_organizacao: {
    consultoria_ness: number;
    cliente: number;
    terceiro: number;
  };
  taxa_engajamento: number; // % de usuários que acessaram nos últimos 7 dias
}
```

**Visualização:**
```typescript
// Cards de métricas
<MetricCard
  title="Total de Usuários"
  value={estatisticas.total_usuarios}
  trend={{ value: estatisticas.novos_usuarios_mes, label: "novos este mês" }}
/>

<MetricCard
  title="Usuários Ativos"
  value={estatisticas.usuarios_ativos}
  subtitle={`${estatisticas.usuarios_inativos} inativos`}
  status={estatisticas.taxa_engajamento > 80 ? 'success' : 'warning'}
/>

// Gráfico de distribuição por perfil
<PieChart data={estatisticas.usuarios_por_perfil}>
  <Pie dataKey="value" nameKey="name" />
</PieChart>

// Gráfico de distribuição por organização
<BarChart data={estatisticas.usuarios_por_organizacao}>
  <Bar dataKey="value" fill="#00ade8" />
</BarChart>
```

---

#### 👤 Página de Perfil de Usuário

**Template oferece:**
- Informações pessoais
- Estatísticas de atividade
- Histórico de ações
- Configurações

**Adaptação para OT2net:**

**Seções da Página de Perfil:**

**1. Informações Básicas:**
```typescript
interface PerfilUsuario {
  // Dados pessoais
  nome: string;
  email: string;
  telefone?: string;
  foto?: string;
  
  // Vínculo profissional
  organizacao: 'cliente' | 'consultoria_ness' | 'terceiro';
  empresa_id?: string; // Se for cliente
  cargo?: string;
  departamento?: string;
  
  // No projeto
  perfil_sistema: string;
  membro_equipe?: {
    projeto_id: string;
    papel: string;
    alocacao_percentual: number;
    datas: { inicio: Date; fim?: Date };
    responsabilidades: string[];
  };
  
  // Permissões
  permissoes: PermissoesGranulares;
  acoes_restritas: string[];
}
```

**2. Estatísticas de Atividade:**
```typescript
interface EstatisticasAtividadeUsuario {
  total_acoes: number; // Total de ações realizadas
  descricoes_coletadas: number; // Se for consultor
  processos_revisados: number; // Se for consultor
  iniciativas_responsavel: number; // Iniciativas onde é responsável
  relatorios_gerados: number;
  ultima_atividade: Date;
  atividades_por_tipo: {
    criacao: number;
    edicao: number;
    visualizacao: number;
    aprovacao: number;
    delecao: number;
  };
  atividades_por_entidade: {
    [entidade: string]: number; // Ex: { 'processo': 45, 'iniciativa': 12 }
  };
}
```

**3. Histórico de Ações (Auditoria):**
```typescript
interface AcaoAuditoria {
  id: string;
  timestamp: Date;
  acao: 'create' | 'update' | 'delete' | 'view' | 'approve' | 'reject';
  entidade_tipo: string; // 'processo', 'iniciativa', 'risco', ...
  entidade_id: string;
  entidade_nome: string;
  detalhes?: string; // JSON com mudanças (para update)
  ip_address?: string;
  user_agent?: string;
}

// Tabela de auditoria
<Table data={historicoAcoes}>
  <Column key="timestamp" label="Data/Hora" />
  <Column key="acao" label="Ação" render={(v) => <Badge>{v}</Badge>} />
  <Column key="entidade_tipo" label="Entidade" />
  <Column key="entidade_nome" label="Item" render={(v, row) => <Link to={`/${row.entidade_tipo}/${row.entidade_id}`}>{v}</Link>} />
  <Column key="detalhes" label="Detalhes" render={(v) => v ? <Button onClick={() => showDetails(v)}>Ver</Button> : '-'} />
</Table>
```

**4. Permissões Detalhadas:**
```typescript
// Matriz de permissões por entidade
interface MatrizPermissoes {
  entidades: {
    cliente: PermissoesEntidade;
    empresa: PermissoesEntidade;
    stakeholder: PermissoesEntidade;
    site: PermissoesEntidade;
    ativo: PermissoesEntidade;
    processo: PermissoesEntidade;
    dor: PermissoesEntidade;
    risco: PermissoesEntidade;
    iniciativa: PermissoesEntidade;
    indicador: PermissoesEntidade;
    // ...
  };
  acoes_restritas: string[];
}

interface PermissoesEntidade {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

// Visualização em tabela
<Table>
  <thead>
    <tr>
      <th>Entidade</th>
      <th>Ver</th>
      <th>Criar</th>
      <th>Editar</th>
      <th>Deletar</th>
    </tr>
  </thead>
  <tbody>
    {Object.entries(permissoes.entidades).map(([entidade, perms]) => (
      <tr key={entidade}>
        <td>{entidade}</td>
        <td><Checkbox checked={perms.view} disabled /></td>
        <td><Checkbox checked={perms.create} disabled /></td>
        <td><Checkbox checked={perms.edit} disabled /></td>
        <td><Checkbox checked={perms.delete} disabled /></td>
      </tr>
    ))}
  </tbody>
</Table>
```

---

### 2.2 Gestão de Permissões Granulares

**Template oferece:**
- Base de controle de acesso
- Perfis pré-definidos

**Adaptação para OT2net - Interface de Gestão:**

```typescript
// Componente de gestão de permissões
interface PermissoesManagerProps {
  usuarioId: string;
  perfilAtual: string;
  permissoesAtuais: MatrizPermissoes;
  onSave: (permissoes: MatrizPermissoes) => void;
}

const PermissoesManager: React.FC<PermissoesManagerProps> = ({ ... }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissões Granulares</CardTitle>
        <CardDescription>
          Gerencie permissões específicas por tipo de entidade
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Seletor de perfil base */}
        <Select
          value={perfilBase}
          onValueChange={aplicarPerfilBase}
        >
          <SelectItem value="administrador">Administrador (Todas as permissões)</SelectItem>
          <SelectItem value="lider_projeto">Líder de Projeto</SelectItem>
          <SelectItem value="consultor">Consultor</SelectItem>
          <SelectItem value="stakeholder_cliente">Stakeholder Cliente</SelectItem>
          <SelectItem value="apenas_leitura">Apenas Leitura</SelectItem>
          <SelectItem value="customizado">Customizado</SelectItem>
        </Select>

        {/* Matriz de permissões editável */}
        <Table>
          <thead>
            <tr>
              <th>Entidade</th>
              <th>Ver</th>
              <th>Criar</th>
              <th>Editar</th>
              <th>Deletar</th>
            </tr>
          </thead>
          <tbody>
            {ENTIDADES.map(entidade => (
              <tr key={entidade}>
                <td>{entidade}</td>
                <td>
                  <Checkbox
                    checked={permissoes.entidades[entidade].view}
                    onCheckedChange={(checked) => updatePermissao(entidade, 'view', checked)}
                  />
                </td>
                {/* ... outros checkboxes */}
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Ações restritas */}
        <div>
          <h4>Ações Restritas</h4>
          <p className="text-sm text-muted-foreground">
            Estas ações requerem permissão explícita além do perfil base
          </p>
          <div className="space-y-2">
            {ACOES_RESTRITAS.map(acao => (
              <Checkbox
                key={acao.id}
                checked={permissoes.acoes_restritas.includes(acao.id)}
                onCheckedChange={(checked) => toggleAcaoRestrita(acao.id, checked)}
              >
                {acao.label}
                <Tooltip>
                  <TooltipTrigger>ℹ️</TooltipTrigger>
                  <TooltipContent>{acao.descricao}</TooltipContent>
                </Tooltip>
              </Checkbox>
            ))}
          </div>
        </div>

        <Button onClick={handleSave}>Salvar Permissões</Button>
      </CardContent>
    </Card>
  );
};
```

**Ações Restritas do Projeto:**
```typescript
const ACOES_RESTRITAS = [
  {
    id: 'aprovar_escopo',
    label: 'Aprovar Escopo do Projeto',
    descricao: 'Permite aprovar ou rejeitar definição de escopo do projeto'
  },
  {
    id: 'fechar_fase',
    label: 'Fechar Fase do Projeto',
    descricao: 'Permite marcar uma fase como concluída e avançar para próxima'
  },
  {
    id: 'aprovar_excecao_risco',
    label: 'Aprovar Exceções de Risco',
    descricao: 'Permite aprovar solicitações de exceção de controles de segurança'
  },
  {
    id: 'gerar_relatorio_executivo',
    label: 'Gerar Relatórios Executivos',
    descricao: 'Permite gerar relatórios para alta gestão'
  },
  {
    id: 'configurar_projeto',
    label: 'Configurar Projeto',
    descricao: 'Permite alterar configurações gerais do projeto'
  },
  {
    id: 'gerenciar_usuarios',
    label: 'Gerenciar Usuários',
    descricao: 'Permite criar, editar e deletar usuários do sistema'
  },
  {
    id: 'ver_custos_ia',
    label: 'Ver Custos de IA',
    descricao: 'Permite visualizar dashboard de custos de chamadas à Claude API'
  }
];
```

---

### 2.3 Relatório de Engajamento

**Template oferece:**
- Estatísticas básicas de uso

**Adaptação para OT2net:**

```typescript
interface RelatorioEngajamento {
  periodo: { inicio: Date; fim: Date };
  usuarios_analisados: number;
  
  // Métricas de engajamento
  taxa_acesso_diario: number; // % de usuários que acessaram pelo menos 1x por dia
  taxa_acesso_semanal: number; // % de usuários que acessaram pelo menos 1x por semana
  media_sessoes_por_usuario: number;
  tempo_medio_sessao: number; // Minutos
  
  // Atividades
  usuarios_mais_ativos: Array<{
    usuario_id: string;
    nome: string;
    total_acoes: number;
    acoes_por_tipo: { [tipo: string]: number };
  }>;
  
  usuarios_inativos: Array<{
    usuario_id: string;
    nome: string;
    ultimo_acesso: Date;
    dias_sem_acesso: number;
  }>;
  
  // Por perfil
  engajamento_por_perfil: {
    [perfil: string]: {
      total: number;
      ativos: number;
      taxa_engajamento: number;
    };
  };
  
  // Funcionalidades mais usadas
  funcionalidades_mais_usadas: Array<{
    funcionalidade: string;
    acessos: number;
    usuarios_unicos: number;
  }>;
}

// Visualização
<Card>
  <CardHeader>
    <CardTitle>Relatório de Engajamento - {format(periodo.inicio, 'dd/MM/yyyy')} a {format(periodo.fim, 'dd/MM/yyyy')}</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Métricas principais */}
    <div className="grid grid-cols-4 gap-4">
      <MetricCard title="Taxa Acesso Diário" value={`${relatorio.taxa_acesso_diario}%`} />
      <MetricCard title="Taxa Acesso Semanal" value={`${relatorio.taxa_acesso_semanal}%`} />
      <MetricCard title="Média Sessões/Usuário" value={relatorio.media_sessoes_por_usuario} />
      <MetricCard title="Tempo Médio Sessão" value={`${relatorio.tempo_medio_sessao}min`} />
    </div>

    {/* Gráfico de engajamento ao longo do tempo */}
    <LineChart data={engajamentoPorDia}>
      <Line dataKey="usuarios_ativos" name="Usuários Ativos" />
    </LineChart>

    {/* Top 10 usuários mais ativos */}
    <Table data={relatorio.usuarios_mais_ativos.slice(0, 10)}>
      <Column key="nome" label="Usuário" />
      <Column key="total_acoes" label="Total de Ações" />
      {/* ... */}
    </Table>

    {/* Usuários inativos */}
    <Alert variant="warning">
      <AlertTitle>Usuários Inativos ({relatorio.usuarios_inativos.length})</AlertTitle>
      <AlertDescription>
        {relatorio.usuarios_inativos.length} usuários não acessaram a plataforma há mais de 30 dias
      </AlertDescription>
    </Alert>
    <Table data={relatorio.usuarios_inativos}>
      <Column key="nome" label="Usuário" />
      <Column key="ultimo_acesso" label="Último Acesso" />
      <Column key="dias_sem_acesso" label="Dias Sem Acesso" />
      <Column key="acoes" label="Ações" render={(row) => (
        <Button onClick={() => enviarLembrete(row.usuario_id)}>Enviar Lembrete</Button>
      )} />
    </Table>
  </CardContent>
</Card>
```

---

## 3. Outros Dashboards Relevantes do Template

### 3.1 Dashboard de Analytics (Adaptável para Conformidade)

**Template oferece:**
- Gráficos de tendências
- Análise de dados
- Filtros temporais

**Adaptação para OT2net - Dashboard de Conformidade:**

```typescript
interface DashboardConformidade {
  // Por framework
  conformidade_por_framework: {
    ren_964_21: {
      total_requisitos: number;
      atendidos: number;
      em_progresso: number;
      nao_atendidos: number;
      percentual_conformidade: number;
    };
    ons_ro_cb_br_01: { /* ... */ };
    cis_controls_v8_1: { /* ... */ };
    isa_iec_62443: { /* ... */ };
    nist_sp_800_82: { /* ... */ };
  };
  
  // Evolução temporal
  evolucao_conformidade: Array<{
    data: Date;
    ren_964_21: number;
    ons: number;
    cis: number;
    isa: number;
    nist: number;
  }>;
  
  // Gaps críticos
  gaps_criticos: Array<{
    framework: string;
    requisito: string;
    status: 'nao_atendido' | 'em_progresso';
    iniciativa_vinculada?: string;
    prazo_estimado?: Date;
  }>;
}

// Visualização
<div className="grid grid-cols-2 gap-4">
  {/* Cards de conformidade por framework */}
  {Object.entries(conformidade_por_framework).map(([framework, dados]) => (
    <Card key={framework}>
      <CardHeader>
        <CardTitle>{framework}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{dados.percentual_conformidade}%</div>
        <Progress value={dados.percentual_conformidade} />
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span>Atendidos</span>
            <span className="text-green-600">{dados.atendidos}</span>
          </div>
          <div className="flex justify-between">
            <span>Em Progresso</span>
            <span className="text-yellow-600">{dados.em_progresso}</span>
          </div>
          <div className="flex justify-between">
            <span>Não Atendidos</span>
            <span className="text-red-600">{dados.nao_atendidos}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>

{/* Gráfico de evolução */}
<LineChart data={evolucao_conformidade}>
  <Line dataKey="ren_964_21" stroke="#00ade8" name="REN 964/21" />
  <Line dataKey="ons" stroke="#7ED321" name="ONS" />
  <Line dataKey="cis" stroke="#F5A623" name="CIS Controls" />
  <Line dataKey="isa" stroke="#9013FE" name="ISA/IEC-62443" />
  <Line dataKey="nist" stroke="#D0021B" name="NIST SP 800-82" />
</LineChart>
```

---

### 3.2 Dashboard Financeiro (Adaptável para Custos de IA)

**Template oferece:**
- Receitas, despesas, lucro
- Gráficos de evolução
- Projeções

**Adaptação para OT2net - Dashboard de Custos de IA (FR-025):**

```typescript
interface DashboardCustosIA {
  periodo: { inicio: Date; fim: Date };
  
  // Métricas principais
  custo_total_periodo: number; // USD
  custo_medio_dia: number;
  projecao_mes: number; // Baseado em média diária
  limite_configurado: number;
  percentual_limite_usado: number; // 0-100
  
  // Por funcionalidade
  custo_por_funcionalidade: {
    processamento_descricoes: number;
    normalizacao_processos: number;
    geracao_diagramas: number;
    analise_riscos: number;
    geracao_iniciativas: number;
    priorizacao_iniciativas: number;
    monitoramento_preditivo: number;
    analise_excecoes: number;
    geracao_relatorios: number;
    chat_assistente: number;
  };
  
  // Por fase
  custo_por_fase: {
    fase_menos_um: number;
    fase_zero: number;
    fase_um: number;
    fase_dois: number;
    fase_tres: number;
  };
  
  // Evolução diária
  evolucao_diaria: Array<{
    data: Date;
    custo: number;
    tokens_input: number;
    tokens_output: number;
    chamadas: number;
  }>;
  
  // Top 10 chamadas mais caras
  chamadas_mais_caras: Array<{
    id: string;
    funcionalidade: string;
    timestamp: Date;
    tokens_input: number;
    tokens_output: number;
    custo: number;
  }>;
}

// Visualização
<Card>
  <CardHeader>
    <CardTitle>Dashboard de Custos de IA</CardTitle>
    <CardDescription>
      Acompanhamento de custos de chamadas à Claude API
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Alertas de limite */}
    {percentual_limite_usado > 90 && (
      <Alert variant="destructive">
        <AlertTitle>Atenção: Limite Próximo</AlertTitle>
        <AlertDescription>
          {percentual_limite_usado}% do limite mensal já foi utilizado.
          Projeção para o mês: ${projecao_mes.toFixed(2)}
        </AlertDescription>
      </Alert>
    )}

    {/* Métricas principais */}
    <div className="grid grid-cols-4 gap-4">
      <MetricCard
        title="Custo Total (Período)"
        value={`$${custo_total_periodo.toFixed(2)}`}
        status={percentual_limite_usado > 90 ? 'error' : percentual_limite_usado > 70 ? 'warning' : 'success'}
      />
      <MetricCard title="Custo Médio/Dia" value={`$${custo_medio_dia.toFixed(2)}`} />
      <MetricCard title="Projeção Mês" value={`$${projecao_mes.toFixed(2)}`} />
      <MetricCard
        title="Limite Usado"
        value={`${percentual_limite_usado}%`}
        subtitle={`$${limite_configurado.toFixed(2)} configurado`}
      />
    </div>

    {/* Gráfico de evolução diária */}
    <AreaChart data={evolucao_diaria}>
      <Area dataKey="custo" stroke="#00ade8" fill="#00ade8" opacity={0.3} />
      <ReferenceLine y={limite_configurado / 30} stroke="#D0021B" strokeDasharray="3 3" label="Média Diária Limite" />
    </AreaChart>

    {/* Distribuição por funcionalidade */}
    <PieChart data={Object.entries(custo_por_funcionalidade).map(([name, value]) => ({ name, value }))}>
      <Pie dataKey="value" nameKey="name" />
      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
    </PieChart>

    {/* Distribuição por fase */}
    <BarChart data={Object.entries(custo_por_fase).map(([name, value]) => ({ name, value }))}>
      <Bar dataKey="value" fill="#00ade8" />
      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
    </BarChart>
  </CardContent>
</Card>
```

---

## 4. Estrutura de Dados Necessária no Backend

### 4.1 Endpoints de API para Dashboard Executivo

```typescript
// GET /api/dashboard/executivo
interface DashboardExecutivoResponse {
  fase_atual: {
    nome: string;
    progresso: number;
    data_inicio: Date;
    data_fim_estimada: Date;
  };
  metricas: {
    iniciativas_ativas: number;
    processos_mapeados: number;
    riscos_criticos: number;
    sites_mapeados: number;
    entrevistas_realizadas: number;
    documentos_processados: number;
    custo_ia_mes: number;
  };
  progresso_fases: {
    fase_menos_um: number;
    fase_zero: number;
    fase_um: number;
    fase_dois: number;
    fase_tres: number;
  };
  alertas: Array<{
    tipo: 'risco' | 'atraso' | 'custo' | 'bloqueio';
    severidade: 'alta' | 'media' | 'baixa';
    titulo: string;
    descricao: string;
    acao_rapida?: string;
  }>;
  proximos_marcos: Array<{
    nome: string;
    data: Date;
    fase: string;
    dias_restantes: number;
  }>;
}

// GET /api/dashboard/fase-0
interface DashboardFase0Response {
  metricas: MetricasFase0;
  coleta_por_periodo: Array<{ data: Date; coletadas: number; processadas: number; aprovadas: number }>;
  processos_por_site: Array<{ site_nome: string; count: number }>;
  processos_por_criticidade: Array<{ criticidade: string; count: number }>;
  dificuldades_por_categoria: Array<{ categoria: string; count: number }>;
  sistemas_mais_mencionados: Array<{ nome: string; count: number }>;
}
```

### 4.2 Endpoints de API para Gestão de Usuários

```typescript
// GET /api/usuarios
interface ListaUsuariosResponse {
  usuarios: UsuarioTableRow[];
  total: number;
  pagina: number;
  por_pagina: number;
}

// GET /api/usuarios/:id/perfil
interface PerfilUsuarioResponse {
  perfil: PerfilUsuario;
  estatisticas: EstatisticasAtividadeUsuario;
  historico_acoes: AcaoAuditoria[];
  permissoes: MatrizPermissoes;
}

// GET /api/usuarios/estatisticas
interface EstatisticasUsuariosResponse {
  estatisticas: EstatisticasUsuarios;
  engajamento_por_perfil: { [perfil: string]: number };
  funcionalidades_mais_usadas: Array<{ funcionalidade: string; acessos: number }>;
}

// GET /api/usuarios/engajamento
interface RelatorioEngajamentoResponse {
  relatorio: RelatorioEngajamento;
}

// PUT /api/usuarios/:id/permissoes
interface UpdatePermissoesRequest {
  permissoes: MatrizPermissoes;
}
```

---

## 5. Componentes Customizados Necessários

### 5.1 Componentes Específicos do Projeto

```typescript
// components/dashboard/StatusBadge.tsx
// Badge com cores específicas (verde/amarelo/vermelho)

// components/dashboard/ProgressBar.tsx
// Barra de progresso com cores por status

// components/dashboard/MetricCard.tsx
// Card de métrica com trend, status, subtitle

// components/dashboard/Timeline.tsx
// Timeline de atividades recentes

// components/dashboard/Heatmap.tsx
// Mapa de calor para matrizes

// components/dashboard/GanttChart.tsx
// Roadmap Gantt interativo

// components/dashboard/WordCloud.tsx
// Nuvem de palavras

// components/usuarios/PermissoesManager.tsx
// Gestor de permissões granulares

// components/usuarios/MatrizPermissoes.tsx
// Tabela de permissões editável

// components/usuarios/RelatorioEngajamento.tsx
// Relatório de engajamento de usuários
```

---

## 6. Resumo de Adaptações Necessárias

### ✅ Componentes que Podem Ser Usados Diretamente (Pouca ou Nenhuma Modificação)

1. **Cards de Métricas** - Apenas ajustar dados e labels
2. **Tabelas Avançadas** - Estrutura pronta, só adaptar colunas
3. **Formulários** - Base pronta, adicionar campos específicos
4. **Gráficos Básicos** - Recharts, usar diretamente
5. **Layout e Navegação** - Sidebar, breadcrumbs prontos
6. **Sistema de Notificações** - Base pronta

### ⚠️ Componentes que Precisam Adaptação Média

1. **Dashboard Executivo** - Adaptar métricas e visualizações específicas
2. **Lista de Iniciativas** - Adaptar colunas e filtros
3. **Página de Perfil** - Adicionar seções específicas do projeto
4. **Gestão de Permissões** - Criar interface de matriz granular

### 🔧 Componentes que Precisam Desenvolvimento Customizado

1. **Roadmap Gantt** - Integrar biblioteca externa
2. **Matriz de Riscos (Heatmap)** - Componente customizado
3. **Interface de Revisão Lado-a-Lado** - Layout customizado
4. **Dashboard de Custos de IA** - Adaptar dashboard financeiro
5. **Nuvem de Palavras** - Integrar biblioteca
6. **Renderização Mermaid** - Integrar Mermaid.js

---

## 7. Priorização de Implementação

### Fase 1: Dashboards Base (2 semanas)
1. ✅ Dashboard Executivo básico (métricas principais)
2. ✅ Lista de Iniciativas (tabela adaptada)
3. ✅ Lista de Usuários (tabela adaptada)
4. ✅ Página de Perfil básica

### Fase 2: Dashboards Específicos (2 semanas)
1. ✅ Dashboard da Fase 0
2. ✅ Dashboard de Conformidade
3. ✅ Dashboard de Custos de IA
4. ✅ Relatório de Engajamento

### Fase 3: Funcionalidades Avançadas (2 semanas)
1. ✅ Roadmap Gantt
2. ✅ Matriz de Riscos
3. ✅ Gestão de Permissões Granulares
4. ✅ Visualizações customizadas (Mermaid, WordCloud)

---

**Conclusão**: O template oferece excelente base para dashboards de gestão de projetos e controle de usuários, requerendo principalmente adaptação de dados e algumas funcionalidades customizadas específicas do projeto OT2net.

