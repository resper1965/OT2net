# Padrão de Estrutura para Páginas do Dashboard

## Análise da Estrutura Atual

### Layout Base
- **Sidebar fixo** (256px) com navegação
- **Main content** com padding responsivo (`p-4 lg:p-8`)
- **Background**: `bg-zinc-50 dark:bg-black`
- **Max width**: `max-w-7xl mx-auto`

### Estrutura Padrão de Páginas

Todas as páginas do dashboard devem seguir esta estrutura:

```
┌─────────────────────────────────────────────────┐
│ HEADER SECTION                                  │
│ ├─ Título (h1, text-3xl, font-bold)            │
│ ├─ Descrição (text-zinc-600)                   │
│ └─ Botões de Ação (direita, flex gap-2)        │
│    ├─ Botão Secundário (Exportar, Filtros)     │
│    └─ Botão Primário (Novo Item)               │
├─────────────────────────────────────────────────┤
│ KPI CARDS SECTION (3-4 cards)                  │
│ ├─ Card 1: Métrica Principal                   │
│ ├─ Card 2: Métrica Secundária                  │
│ ├─ Card 3: Métrica Terciária                   │
│ └─ Card 4: Métrica Adicional (opcional)        │
├─────────────────────────────────────────────────┤
│ FILTERS & SEARCH SECTION (opcional)            │
│ ├─ Campo de Busca (Input com ícone Search)     │
│ ├─ Filtros (Select, Checkboxes, etc)           │
│ └─ Botões de Ação de Filtro                    │
├─────────────────────────────────────────────────┤
│ CONTENT CARD                                    │
│ ├─ Header do Card (título + contador)          │
│ ├─ Tabela ou Grid de Dados                     │
│ └─ Paginação (se necessário)                   │
└─────────────────────────────────────────────────┘
```

## Componentes Padrão

### 1. Header Section
```tsx
<div className="mb-8">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <div>
      <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-2">
        {Título da Página}
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        {Descrição da funcionalidade}
      </p>
    </div>
    <div className="flex gap-2">
      {/* Botões de ação */}
    </div>
  </div>
</div>
```

### 2. KPI Cards
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  {kpiCards.map((kpi) => (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
          <Icon className={`h-6 w-6 ${kpi.color}`} />
        </div>
        <span className="text-2xl font-bold">{kpi.value}</span>
      </div>
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        {kpi.title}
      </p>
    </div>
  ))}
</div>
```

### 3. Filters & Search
```tsx
<div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 mb-6">
  <div className="flex flex-col sm:flex-row gap-4">
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
      <Input
        type="text"
        placeholder="Buscar..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10"
      />
    </div>
    {/* Filtros adicionais */}
  </div>
</div>
```

### 4. Content Card
```tsx
<div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
  <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
    <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
      {Título} ({count})
    </h2>
  </div>
  {/* Conteúdo: Tabela ou Grid */}
</div>
```

### 5. Empty State
```tsx
<div className="text-center py-12 p-6">
  <Icon className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
  <p className="text-zinc-600 dark:text-zinc-400 mb-4">
    {Mensagem de estado vazio}
  </p>
  <Link href="/dashboard/{secao}/novo">
    <Button variant="primary">Criar primeiro item</Button>
  </Link>
</div>
```

### 6. Loading State
```tsx
<div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-12 text-center">
  <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
</div>
```

## Regras de Design

### Cores e Espaçamentos
- **Cards**: `bg-white dark:bg-zinc-900`, `border-zinc-200 dark:border-zinc-800`
- **Padding padrão**: `p-6` para cards, `p-4` para filtros
- **Gap entre seções**: `mb-8` para header, `mb-6` para KPIs/filtros
- **Border radius**: `rounded-lg` para todos os cards

### Tipografia
- **Título principal**: `text-3xl font-bold`
- **Subtítulo**: `text-lg font-semibold`
- **Descrição**: `text-sm text-zinc-600 dark:text-zinc-400`
- **Labels**: `text-xs font-medium uppercase tracking-wider`

### Ícones
- **Tamanho padrão**: `h-6 w-6` para cards, `h-4 w-4` para botões
- **Cores**: Seguir paleta de cores do KPI

### Responsividade
- **Grid KPIs**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- **Header**: `flex-col sm:flex-row` para mobile
- **Tabelas**: `overflow-x-auto` para mobile

## Páginas que Devem Seguir Este Padrão

1. ✅ Dashboard (page.tsx) - Já implementado
2. ⚠️ Clientes - Parcialmente implementado (falta busca/filtros)
3. ⚠️ Empresas - Parcialmente implementado (falta busca/filtros)
4. ✅ Projetos - Implementado (modelo completo)
5. ⚠️ Processos - Precisa implementar
6. ⚠️ Sites - Precisa implementar
7. ⚠️ Stakeholders - Precisa implementar
8. ⚠️ Equipe - Precisa implementar
9. ⚠️ Catálogo - Precisa implementar

## Checklist de Implementação

Para cada página, garantir:
- [ ] Header com título, descrição e botões de ação
- [ ] 3-4 cards de KPIs relevantes
- [ ] Barra de busca e filtros (quando aplicável)
- [ ] Card de conteúdo principal com header
- [ ] Tabela ou grid de dados formatado
- [ ] Estados vazios com ícone e CTA
- [ ] Loading states consistentes
- [ ] Responsividade mobile
- [ ] Dark mode funcionando
- [ ] Ações (editar, excluir, ver detalhes) padronizadas

