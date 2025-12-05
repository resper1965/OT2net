# Planejamento: Template Dashboard de Gerenciamento de Projetos

## 📋 Visão Geral

Este documento descreve o planejamento para implementação de um template de dashboard de gerenciamento de projetos no OT2net, integrando funcionalidades avançadas de visualização, métricas e controle de projetos.

## 🎯 Objetivos

1. **Visualização Centralizada**: Dashboard unificado com visão geral de todos os projetos
2. **Métricas e KPIs**: Indicadores de desempenho em tempo real
3. **Gestão de Tarefas**: Visualização de tarefas, prazos e responsáveis
4. **Análise de Progresso**: Gráficos e relatórios de andamento
5. **Gestão de Recursos**: Alocação de equipe e carga de trabalho
6. **Gestão de Riscos**: Identificação e monitoramento de riscos

## 📊 Estrutura Atual do Projeto

### Funcionalidades Existentes
- ✅ Autenticação (Supabase)
- ✅ CRUD de Clientes, Empresas, Projetos
- ✅ Sidebar de navegação
- ✅ API REST completa
- ✅ Prisma ORM com schema definido

### Dados Disponíveis (Schema Prisma)
- **Projetos**: nome, descrição, fase_atual, progresso_geral, cliente_id
- **Iniciativas**: nome, status, progresso_percentual, saude, prioridade, datas
- **Membros de Equipe**: papel, responsabilidade, autoridade
- **Stakeholders**: papel_no_projeto, poder_influencia, expertise
- **Riscos**: classificacao, impacto, probabilidade
- **Processos**: status, criticidade, dependencias

## 🏗️ Arquitetura Proposta

### Componentes do Dashboard

#### 1. **Header/Overview Cards**
```
┌─────────────────────────────────────────────────┐
│  [Total Projetos] [Em Andamento] [Concluídos]  │
│  [Atrasados] [Riscos Críticos] [Equipe Ativa]  │
└─────────────────────────────────────────────────┘
```

#### 2. **Gráficos e Visualizações**
- Gráfico de pizza: Distribuição por fase
- Gráfico de barras: Progresso por projeto
- Timeline/Gantt: Cronograma de projetos
- Gráfico de linha: Tendência de progresso
- Heatmap: Carga de trabalho da equipe

#### 3. **Tabelas Interativas**
- Lista de projetos com filtros e ordenação
- Tarefas recentes e pendentes
- Riscos identificados
- Atividades recentes (timeline)

#### 4. **Widgets Específicos**
- Próximos prazos
- Projetos que precisam de atenção
- Status da equipe
- Indicadores de saúde do projeto

## 🛠️ Stack Tecnológica

### Bibliotecas de Visualização
```json
{
  "recharts": "^2.10.0",        // Gráficos React
  "date-fns": "^3.0.0",         // Manipulação de datas
  "@tanstack/react-table": "^8.0.0", // Tabelas avançadas
  "react-big-calendar": "^1.8.0" // Calendário/Gantt
}
```

### Componentes UI (shadcn/ui compatível)
- Card, Badge, Progress, Avatar
- Table, Dialog, Select, DatePicker
- Tabs, Accordion, Tooltip
- Skeleton (loading states)

## 📐 Estrutura de Componentes

```
src/
├── components/
│   ├── dashboard/
│   │   ├── OverviewCards.tsx          # Cards de métricas gerais
│   │   ├── ProjectChart.tsx           # Gráficos de projetos
│   │   ├── ProjectTable.tsx           # Tabela de projetos
│   │   ├── TaskList.tsx               # Lista de tarefas
│   │   ├── RiskPanel.tsx              # Painel de riscos
│   │   ├── TeamWorkload.tsx           # Carga de trabalho
│   │   ├── TimelineView.tsx           # Visualização timeline
│   │   ├── KPIWidget.tsx              # Widgets de KPI
│   │   └── ActivityFeed.tsx           # Feed de atividades
│   ├── ui/                            # Componentes base (shadcn)
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── chart.tsx
│   │   └── ...
│   └── Sidebar.tsx                    # ✅ Já existe
├── lib/
│   ├── hooks/
│   │   ├── useProjects.ts             # Hook para projetos
│   │   ├── useStats.ts                # Hook para estatísticas
│   │   └── useTimeline.ts             # Hook para timeline
│   └── utils/
│       ├── chart-utils.ts             # Utilitários de gráficos
│       └── date-utils.ts              # Utilitários de data
└── app/
    └── dashboard/
        ├── page.tsx                   # Dashboard principal
        └── projetos/
            └── [id]/
                └── overview.tsx       # Dashboard do projeto
```

## 📊 Métricas e KPIs Propostos

### Métricas Gerais
1. **Total de Projetos**: Contagem total
2. **Projetos Ativos**: Em andamento
3. **Projetos Concluídos**: Finalizados
4. **Projetos Atrasados**: Com prazo vencido
5. **Riscos Críticos**: Riscos de alto impacto
6. **Equipe Ativa**: Membros com atividades

### KPIs por Projeto
1. **Progresso Geral**: progresso_geral (0-100%)
2. **Saúde do Projeto**: saude (verde/amarelo/vermelho)
3. **Aderência ao Prazo**: % de tarefas no prazo
4. **Utilização de Recursos**: % de capacidade utilizada
5. **Qualidade**: Score baseado em revisões

### Gráficos Propostos
1. **Distribuição por Fase**: Pizza (fase_atual)
2. **Progresso por Projeto**: Barras horizontais
3. **Tendência de Progresso**: Linha temporal
4. **Carga de Trabalho**: Heatmap por membro
5. **Riscos por Categoria**: Barras empilhadas

## 🔄 Integração com Backend

### Endpoints Necessários

#### Estatísticas Gerais
```typescript
GET /api/dashboard/stats
Response: {
  totalProjetos: number
  projetosAtivos: number
  projetosConcluidos: number
  projetosAtrasados: number
  riscosCriticos: number
  equipeAtiva: number
}
```

#### Dados para Gráficos
```typescript
GET /api/dashboard/charts
  ?type=distribution|progress|timeline|workload
Response: {
  labels: string[]
  data: number[]
  // ... dados específicos do gráfico
}
```

#### Projetos com Filtros
```typescript
GET /api/projetos
  ?status=ativo|concluido|atrasado
  ?cliente_id=uuid
  ?fase=fase-1|fase-2|...
Response: {
  projetos: Projeto[]
  total: number
}
```

#### Timeline de Atividades
```typescript
GET /api/dashboard/activities
  ?limit=50
  ?project_id=uuid
Response: {
  activities: Activity[]
}
```

## 📅 Fases de Implementação

### Fase 1: Fundação (Semana 1-2)
- [ ] Instalar dependências (recharts, date-fns, react-table)
- [ ] Criar estrutura de componentes base
- [ ] Implementar OverviewCards com dados reais
- [ ] Criar hook useStats para buscar estatísticas
- [ ] Implementar loading states (Skeleton)

**Entregáveis:**
- Cards de métricas funcionais
- Integração com API existente
- Layout responsivo

### Fase 2: Visualizações Básicas (Semana 3-4)
- [ ] Implementar gráfico de distribuição por fase
- [ ] Criar gráfico de progresso por projeto
- [ ] Implementar tabela de projetos com filtros
- [ ] Adicionar ordenação e paginação

**Entregáveis:**
- Gráficos funcionais com dados reais
- Tabela interativa de projetos
- Filtros básicos

### Fase 3: Funcionalidades Avançadas (Semana 5-6)
- [ ] Implementar timeline/Gantt view
- [ ] Criar painel de riscos
- [ ] Implementar widget de carga de trabalho
- [ ] Adicionar feed de atividades

**Entregáveis:**
- Timeline visual de projetos
- Painel de gestão de riscos
- Visualização de equipe

### Fase 4: Refinamento e Otimização (Semana 7-8)
- [ ] Adicionar filtros avançados
- [ ] Implementar exportação de relatórios
- [ ] Otimizar performance (lazy loading, memoization)
- [ ] Adicionar testes
- [ ] Documentação

**Entregáveis:**
- Dashboard completo e otimizado
- Relatórios exportáveis
- Testes automatizados

## 🎨 Design System

### Cores (Ness Branding)
- **Primária**: #00ade8 (azul Ness)
- **Sucesso**: Verde (projetos saudáveis)
- **Atenção**: Amarelo (projetos em risco)
- **Erro**: Vermelho (projetos críticos)
- **Neutro**: Zinc (fundo e bordas)

### Tipografia
- **Títulos**: Montserrat Medium/Bold
- **Corpo**: Inter Regular
- **Métricas**: Montserrat Bold (números grandes)

### Componentes Visuais
- Cards com sombra sutil
- Bordas arredondadas (rounded-lg)
- Transições suaves (transition-colors)
- Dark mode completo

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 768px (1 coluna, sidebar oculto)
- **Tablet**: 768px - 1024px (2 colunas)
- **Desktop**: > 1024px (3-4 colunas, sidebar fixo)

### Adaptações Mobile
- Gráficos em scroll horizontal
- Tabelas com scroll horizontal
- Cards empilhados verticalmente
- Menu hambúrguer (já implementado)

## 🔐 Segurança e Performance

### Segurança
- ✅ Autenticação obrigatória (já implementado)
- ✅ Validação de dados no backend
- ✅ Sanitização de inputs
- ✅ Rate limiting nas APIs

### Performance
- Lazy loading de componentes pesados
- Memoization de cálculos complexos
- Paginação de listas grandes
- Cache de dados estáticos
- Debounce em filtros

## 📈 Métricas de Sucesso

### KPIs de Implementação
1. **Tempo de Carregamento**: < 2s
2. **Taxa de Erro**: < 1%
3. **Cobertura de Testes**: > 80%
4. **Acessibilidade**: WCAG 2.1 AA

### KPIs de Uso
1. **Adoção**: % de usuários que usam o dashboard
2. **Engajamento**: Tempo médio no dashboard
3. **Eficiência**: Redução de tempo para encontrar informações

## 🚀 Próximos Passos Imediatos

1. **Aprovação do Planejamento**: Revisar e aprovar este documento
2. **Setup Inicial**: Instalar dependências básicas
3. **Protótipo**: Criar versão inicial com dados mockados
4. **Integração**: Conectar com APIs existentes
5. **Iteração**: Refinar baseado em feedback

## 📚 Referências

- [Recharts Documentation](https://recharts.org/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

## 📝 Notas

- Este planejamento é flexível e pode ser ajustado conforme necessário
- Priorizar funcionalidades baseadas em feedback dos usuários
- Manter consistência com o design system existente
- Garantir acessibilidade desde o início

---

**Versão**: 1.0  
**Data**: 2025-01-27  
**Autor**: Equipe OT2net

