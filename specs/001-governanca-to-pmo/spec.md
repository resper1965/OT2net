# Feature Specification: Sistema de Gestão de Governança e Segurança de TO - Plataforma PMO Inteligente

**Feature Branch**: `001-governanca-to-pmo`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "Sistema de Gestão de Governança e Segurança de TO - Plataforma PMO Inteligente"

**Nota**: Esta especificação incorpora a especificação detalhada revisada da Fase 0 (Descoberta Operacional AS-IS), que estabelece o princípio fundamental de capturar a realidade operacional pura sem julgamento, antes de qualquer análise crítica ou proposta de mudança. A Fase 0 foca em COMO a operação realmente funciona hoje, sob a perspectiva de quem executa o trabalho diariamente.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cadastramento e Onboarding do Cliente (Priority: P1)

O consultor precisa cadastrar completamente o cliente e sua estrutura organizacional antes de iniciar a descoberta, criando a fundação de dados que alimentará todo o projeto de consultoria.

**Why this priority**: Esta é a fase preparatória (Fase -1) que estabelece toda a base de dados do projeto. Sem o cadastramento completo, nenhuma das fases subsequentes pode ser executada adequadamente. É o MVP mínimo funcional.

**Independent Test**: Pode ser totalmente testado cadastrando um cliente completo (razão social, CNPJ, empresas do grupo, stakeholders-chave, sites operacionais, escopo do projeto, equipe do projeto) e gerando o Relatório de Onboarding em PDF. O teste é válido se o relatório contém todas as informações cadastradas de forma estruturada e o sistema permite navegar pelas entidades relacionadas.

**Acceptance Scenarios**:

1. **Given** um consultor acessa a plataforma pela primeira vez, **When** cadastra um novo cliente com dados cadastrais completos (razão social, CNPJ, endereço, contatos), **Then** o sistema cria o registro do cliente e permite adicionar empresas do grupo vinculadas.
2. **Given** um cliente cadastrado, **When** o consultor adiciona empresas do grupo (SPEs, subsidiárias) com suas informações, **Then** o sistema vincula as empresas ao cliente e permite cadastrar sites operacionais para cada empresa.
3. **Given** empresas e sites cadastrados, **When** o consultor mapeia stakeholders-chave com seus papéis, poder de decisão e influência, **Then** o sistema organiza os stakeholders e permite definir a equipe do projeto com matriz RASCI.
4. **Given** todas as informações de cadastramento preenchidas, **When** o consultor solicita geração do Relatório de Onboarding, **Then** o sistema gera um PDF consolidado contendo visão completa do cliente, estrutura, stakeholders mapeados e baseline documental.

---

### User Story 2 - Coleta de Descrições Operacionais Raw e Processamento Inteligente (Priority: P1)

O operador, técnico ou engenheiro de TO precisa descrever livremente como realiza suas atividades operacionais em texto corrido, usando sua própria linguagem, e o sistema deve processar automaticamente essas descrições raw transformando-as em processos normalizados estruturados, identificando ativos de informação, localizações, contextos de rede, dificuldades e workarounds.

**Why this priority**: Esta é a atividade central da Fase 0 (Descoberta Operacional AS-IS). O princípio fundamental é capturar a realidade operacional pura sem julgamento, antes de qualquer análise crítica. A capacidade de processar descrições livres com IA é o diferencial competitivo da plataforma, automatizando trabalho manual intensivo e garantindo que nenhum insight seja perdido, incluindo práticas informais e workarounds.

**Independent Test**: Pode ser totalmente testado coletando uma descrição operacional raw de um operador (texto livre descrevendo atividade diária), processando com IA, e validando que o sistema extraiu corretamente: processo normalizado com etapas sequenciais, ativos de informação (formais e informais), localizações físicas, contextos de rede, dificuldades, workarounds e riscos mencionados espontaneamente. O teste é válido se a taxa de acerto na extração for acima de 80% e o processo normalizado mantém fidelidade absoluta ao original.

**Acceptance Scenarios**:

1. **Given** um operador acessa a plataforma na Fase 0, **When** preenche formulário simples descrevendo uma atividade em texto livre (sem estrutura rígida), incluindo o que faz passo a passo, sistemas utilizados, onde realiza, dificuldades enfrentadas, **Then** o sistema salva a descrição raw e captura automaticamente metadata (pessoa, site, cargo, data, frequência, impacto).
2. **Given** uma descrição operacional raw coletada, **When** o sistema processa com Claude API usando prompt especializado de normalização, **Then** o sistema extrai processo normalizado com etapas sequenciais, identifica todos os ativos de informação (hardware, software, arquivos, mídias físicas, comunicações), mapeia localizações físicas e contextos de rede, identifica dificuldades e workarounds, e retorna JSON estruturado com nível de confiança.
3. **Given** resultado do processamento por IA, **When** o consultor revisa em interface lado-a-lado (descrição original vs resultado normalizado), **Then** o sistema permite editar, aprovar, solicitar clarificação ao operador ou reprocessar, e ao aprovar cria automaticamente entidades (Processo Normalizado, Etapas, Ativos, Dificuldades, Workarounds) vinculadas à descrição original.
4. **Given** processo normalizado aprovado, **When** o sistema gera automaticamente múltiplos diagramas Mermaid (flowchart, swimlane, BPMN, data flow, user journey), **Then** o sistema valida sintaxe, renderiza visualmente na interface, e disponibiliza para exportação (PNG, SVG), permitindo regeneração se processo for editado.

---

### User Story 3 - Catálogo de Processos AS-IS e Consolidação (Priority: P2)

O consultor precisa navegar todos os processos operacionais normalizados, visualizar diagramas, consolidar processos similares de múltiplas fontes, e gerar inventário consolidado de ativos de informação identificados.

**Why this priority**: Processos são fundamentais para entender a operação real. O catálogo permite navegação e análise consolidada. A consolidação de processos similares garante consistência dos dados e evita duplicação. Esta funcionalidade adiciona valor significativo mas depende de processos já coletados e normalizados (User Story 2).

**Independent Test**: Pode ser totalmente testado acessando catálogo de processos, filtrando por site/criticidade/tipo, visualizando diagramas Mermaid renderizados, identificando dois processos similares usando busca semântica, solicitando consolidação, e validando que o processo consolidado mantém referências às fontes originais e todas as variações.

**Acceptance Scenarios**:

1. **Given** múltiplos processos normalizados e aprovados, **When** o consultor acessa catálogo de processos AS-IS, **Then** o sistema mostra lista/cards/mapa com filtros (site, criticidade, tipo, sistemas utilizados), busca full-text, e permite visualizar detalhes completos incluindo etapas, ativos, localizações, dificuldades e workarounds.
2. **Given** um processo no catálogo, **When** o consultor acessa página de detalhes, **Then** o sistema mostra todas as visualizações Mermaid (flowchart, swimlane, BPMN, data flow, user journey) renderizadas inline, permite exportar diagramas (PNG, SVG), e mostra histórico de modificações.
3. **Given** múltiplos processos similares de diferentes fontes, **When** o sistema identifica similaridade usando embeddings e análise semântica, **Then** o sistema oferece opção de consolidação e, ao confirmar, cria processo padronizado único mantendo links para todas as descrições raw originais, permitindo drill-down do consolidado para detalhes.
4. **Given** processos normalizados com ativos identificados, **When** o consultor acessa mapa de ativos de informação, **Then** o sistema mostra visão consolidada em árvore (tipo > categoria > ativo específico) com quantidade de processos que utilizam cada ativo, sites onde está presente, contexto de rede predominante, e permite filtrar por ativos informais (cadernos, post-its, arquivos locais).

---

### User Story 4 - Assessment de Governança e Maturidade (Priority: P2)

O consultor precisa avaliar o nível atual de governança e maturidade em TO do cliente, considerando documentos formais, práticas reais e contexto regulatório, gerando relatórios de assessment.

**Why this priority**: Esta é a Fase 1 do projeto de consultoria. O assessment é crítico para identificar gaps e definir o Plano Diretor. Porém depende de dados coletados na Fase 0, então é P2.

**Independent Test**: Pode ser totalmente testado cadastrando documentos fornecidos pelo cliente, processando-os com IA para extração de entidades e análise de conformidade, preenchendo matriz de maturidade para múltiplos domínios, e gerando Relatório de Assessment. O teste é válido se o relatório contém diagnóstico técnico completo, mapa visual de maturidade e resumo executivo.

**Acceptance Scenarios**:

1. **Given** documentos fornecidos pelo cliente (políticas, normas, procedimentos), **When** o consultor faz upload dos documentos, **Then** o sistema processa com IA extraindo entidades (ativos, sistemas, processos) e avalia conformidade com REN 964/21, ISA-62443 e CIS Controls v8.1.
2. **Given** documentos processados e dados coletados na Fase 0, **When** o consultor preenche matriz de maturidade avaliando múltiplos domínios (governança, segmentação, acessos, gestão de ativos, resposta a incidentes) em escala de 1 a 5, **Then** o sistema armazena as avaliações e gera mapa visual de maturidade.
3. **Given** avaliação de maturidade completa, **When** o consultor identifica riscos críticos e quick wins, **Then** o sistema permite cadastrar riscos vinculando a ativos e processos, e quick wins com análise de custo-benefício.
4. **Given** assessment completo, **When** o consultor solicita geração do Relatório de Assessment, **Then** o sistema gera PDF com diagnóstico técnico, mapa de maturidade e resumo executivo para alta gestão.

---

### User Story 5 - Plano Diretor e Roadmap Interativo (Priority: P2)

O consultor precisa estruturar o Plano Diretor com iniciativas concretas, priorizá-las multi-critério, organizá-las em roadmap temporal e definir indicadores de acompanhamento (KPIs/KRIs).

**Why this priority**: Esta é a Fase 2 do projeto, transformando diagnósticos em ação. A geração inteligente de iniciativas por IA e o roadmap interativo são diferenciais importantes. Depende do assessment (Fase 1) estar completo.

**Independent Test**: Pode ser totalmente testado gerando iniciativas baseadas em gaps identificados (manualmente ou por IA), priorizando-as considerando múltiplos critérios (conformidade, redução de risco, resolução de dores, custo-benefício), organizando em roadmap com dependências, e definindo KPIs/KRIs. O teste é válido se o roadmap visual (Gantt) mostra iniciativas corretamente sequenciadas e os indicadores têm fórmulas e thresholds definidos.

**Acceptance Scenarios**:

1. **Given** gaps identificados no assessment (dores não resolvidas, lacunas de maturidade, riscos críticos), **When** o consultor solicita geração de iniciativas por IA ou cria manualmente, **Then** o sistema gera propostas de iniciativas com nome, descrição, escopo, entregáveis, estimativas e benefícios, apresentando para revisão e aprovação.
2. **Given** múltiplas iniciativas propostas, **When** o consultor solicita priorização multi-critério por IA, **Then** o sistema analisa considerando impacto em conformidade, redução de risco, resolução de dores, custo-benefício e urgência regulatória, retornando lista priorizada com scores e justificativas.
3. **Given** iniciativas priorizadas, **When** o consultor solicita otimização de roadmap, **Then** o sistema organiza iniciativas em ondas temporais (curto, médio, longo prazo) respeitando dependências e restrições de recursos, gerando visualização Gantt interativa com drag-and-drop.
4. **Given** iniciativas definidas, **When** o consultor define KPIs e KRIs para cada domínio de governança, **Then** o sistema permite cadastrar indicadores com fórmulas, fontes de dados, baselines, metas, thresholds e responsáveis, gerando sugestões por IA quando solicitado.

---

### User Story 6 - PMO e Acompanhamento de Execução (Priority: P3)

O consultor precisa acompanhar a execução do Plano Diretor na Fase 3, monitorando progresso de iniciativas, gerenciando exceções de risco, registrando comitês e gerando relatórios periódicos automaticamente.

**Why this priority**: Esta é a Fase 3 do projeto, garantindo execução efetiva. Funcionalidades importantes mas que só fazem sentido após o Plano Diretor estar definido. O monitoramento preditivo por IA adiciona valor mas não é crítico para MVP.

**Independent Test**: Pode ser totalmente testado cadastrando iniciativas em execução, atualizando progresso percentual e marcos, solicitando análise preditiva de saúde das iniciativas, criando exceção de risco com análise por IA, registrando reunião de comitê com ata, e gerando relatório mensal automático. O teste é válido se o dashboard mostra status correto das iniciativas, exceções têm workflow de aprovação funcional, e relatórios são gerados em formato solicitado.

**Acceptance Scenarios**:

1. **Given** Plano Diretor aprovado com iniciativas, **When** o consultor inicia execução de uma iniciativa atualizando status para "Em Execução", **Then** o sistema permite atualizar progresso percentual, marcos atingidos, bloqueios e recursos alocados, mostrando saúde da iniciativa (verde, amarelo, vermelho).
2. **Given** iniciativa em execução, **When** o consultor solicita análise preditiva por IA, **Then** o sistema analisa histórico de progresso, tendências e riscos, retornando previsão de data de conclusão com intervalo de confiança e recomendações de ações corretivas.
3. **Given** necessidade operacional urgente, **When** um gestor solicita exceção de risco descrevendo controle sendo desviado e justificativa, **Then** o sistema analisa impacto por IA (segurança, conformidade, operação) e encaminha para workflow de aprovação do comitê, registrando decisão e condições.
4. **Given** reunião de comitê realizada, **When** o consultor registra ata com pauta, decisões tomadas e pendências, **Then** o sistema armazena a ata vinculada ao comitê e permite busca de decisões históricas.
5. **Given** final do mês/trimestre, **When** o consultor solicita geração de relatório periódico, **Then** o sistema coleta dados do período, gera relatório narrativo profissional por IA em markdown, converte para PDF/DOCX/PPTX, e disponibiliza para download.

---

### Edge Cases

- O que acontece quando a API Claude está indisponível ou retorna erro? → Sistema deve mostrar mensagem clara, permitir retry, e opcionalmente permitir processamento manual posterior. Descrições raw ficam em status "pendente" até processamento bem-sucedido.
- Como o sistema lida com descrições raw muito longas ou muito curtas? → Sistema deve validar tamanho mínimo (sugerir pelo menos 100 caracteres), aceitar descrições longas (até 10000 palavras), e processar em chunks se necessário, mantendo contexto completo.
- O que acontece quando descrição raw é ambígua ou incompleta? → IA deve retornar nível de confiança baixo (<70%), sistema sinaliza para revisão humana, e consultor pode solicitar clarificação ao operador ou fazer perguntas de follow-up.
- Como o sistema lida com ativos informais mencionados (cadernos, post-its, senhas anotadas)? → Sistema deve identificar e catalogar todos os ativos informais sem julgamento, documentando observações sobre práticas informais, permitindo análise posterior de riscos sem expor operador a crítica imediata.
- O que acontece quando operador menciona workaround que viola segurança mas é necessário para operação? → Sistema deve documentar workaround completamente incluindo razão e risco percebido, sem julgamento na Fase 0. Análise de risco e remediação acontecem nas fases posteriores.
- Como o sistema lida com múltiplas descrições do mesmo processo por diferentes operadores com variações? → Sistema deve processar cada descrição independentemente, depois identificar similaridade usando embeddings, oferecer consolidação mantendo todas as variações como referências, permitindo análise de diferenças entre turnos/sites/operadores.
- O que acontece quando processo normalizado perde fidelidade ao original após processamento? → Sistema deve manter descrição raw original sempre acessível, interface de revisão permite comparar lado-a-lado, consultor pode editar normalização ou reprocessar com prompt ajustado, histórico de versões mantém rastreabilidade.
- Como o sistema lida com documentos muito grandes (PDFs de centenas de páginas)? → Sistema deve processar em chunks, mostrar progresso, e permitir cancelamento. Limite de tamanho configurável.
- O que acontece quando múltiplos usuários editam a mesma entidade simultaneamente? → Sistema deve implementar controle de concorrência (optimistic locking ou last-write-wins com notificação de conflito).
- O que acontece quando roadmap tem dependências circulares? → Sistema deve detectar e alertar, impedindo criação de dependência circular, sugerindo resolução.
- Como o sistema lida com custos de IA excedendo orçamento? → Sistema deve ter limites configuráveis, alertar quando próximo do limite, e permitir pausar processamentos automáticos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow cadastramento completo de cliente incluindo dados cadastrais (razão social, CNPJ, endereço, contatos), empresas do grupo, stakeholders-chave, sites operacionais, escopo do projeto e equipe do projeto.
- **FR-002**: System MUST generate Relatório de Onboarding em PDF consolidando todas as informações cadastradas na Fase -1.
- **FR-003**: System MUST provide simple, non-intimidating interface for operators to describe their operational activities in free text format, capturing title, complete description, frequency, impact, and optional difficulties, with automatic capture of metadata (person, site, role, date, shift).
- **FR-004**: System MUST process raw operational descriptions using Claude API with specialized normalization prompt to extract structured process with sequential steps, identify all information assets (hardware, software, files, physical media, communications), map physical locations and network contexts, identify difficulties and workarounds, and return structured JSON with confidence level, maintaining absolute fidelity to original description.
- **FR-005**: System MUST create automatically entities (Processo Normalizado, Processo Etapas, Ativos, Dificuldades Operacionais, Workarounds, Riscos Mencionados) from processed descriptions, linking them to original raw description for full traceability.
- **FR-005A**: System MUST provide side-by-side review interface showing original raw description with highlights vs normalized result, allowing edit, approve, request clarification from operator, or reprocess with prompt adjustments.
- **FR-006**: System MUST automatically generate multiple Mermaid diagrams (flowchart simple, swimlane, BPMN complete, data flow, user journey) for each normalized process, validating syntax, rendering visually in interface with zoom and export controls (PNG, SVG), allowing regeneration if process is edited.
- **FR-007**: System MUST normalize similar processes mentioned in multiple sources using embeddings and semantic analysis, consolidating into single standardized process maintaining references to all original raw descriptions, allowing drill-down from consolidated to details.
- **FR-007A**: System MUST identify and catalog all information assets mentioned in descriptions including formal (systems, servers, workstations) and informal (notebooks, post-its, local files, shared spreadsheets), with network context (TO network, IT network, DMZ, offline, VPN) and usage observations.
- **FR-008**: System MUST process documents (PDF, DOCX) fornecidos pelo cliente usando IA para extrair entidades (ativos, sistemas, processos) e avaliar conformidade com REN 964/21, ISA-62443 e CIS Controls v8.1.
- **FR-009**: System MUST provide interface para avaliação de maturidade em múltiplos domínios (governança, segmentação, acessos, gestão de ativos, resposta a incidentes, etc.) em escala de 1 a 5, gerando mapa visual de maturidade.
- **FR-010**: System MUST allow cadastramento de riscos de segurança cibernética vinculando a ativos, processos e sites, com classificação (crítico, alto, médio, baixo) baseada em impacto e probabilidade.
- **FR-011**: System MUST generate initiatives for Plano Diretor based on gaps identified (dores, lacunas de maturidade, riscos) using IA, presenting proposals for human review and approval.
- **FR-012**: System MUST prioritize initiatives using multi-criteria analysis (impact on compliance, risk reduction, pain resolution, cost-benefit, regulatory urgency) with IA support, returning prioritized list with scores and justifications.
- **FR-013**: System MUST provide interactive Gantt roadmap visualization allowing drag-and-drop to adjust dates, showing dependencies as arrows, milestones as diamonds, with zoom controls for different granularity levels.
- **FR-014**: System MUST allow definition of KPIs and KRIs for governance domains with formulas, data sources, baselines, targets, thresholds (green, yellow, red) and responsible parties, with IA suggestions available.
- **FR-015**: System MUST monitor progress of initiatives in execution, tracking percentage complete, milestones, blockers, and resources, showing health status (green, yellow, red) with predictive analysis by IA.
- **FR-016**: System MUST provide workflow for risk exceptions including request, IA impact analysis (security, compliance, operational), committee approval workflow, and tracking of approved exceptions with expiration dates.
- **FR-017**: System MUST allow registration of committee meetings with agenda, decisions taken, pending items, and generate meeting minutes (atas) searchable by decisions.
- **FR-018**: System MUST generate periodic reports (monthly, quarterly, annual) automatically using IA, creating narrative professional reports in markdown, converting to PDF/DOCX/PPTX formats.
- **FR-019**: System MUST provide chat interface with IA assistant allowing natural language questions about project status, requesting analyses, and getting suggestions for next actions, with access to full project context.
- **FR-020**: System MUST maintain checklists of compliance for multiple frameworks (REN 964/21, ONS RO-CB.BR.01, CIS Controls v8.1, ISA/IEC-62443, NIST SP 800-82) allowing evaluation of each requirement with evidence linking and gap identification.
- **FR-021**: System MUST provide CRUD interfaces for all entity types (Cliente, Empresa, Stakeholder, Site, Ativo, Processo, Dor, Risco, Iniciativa, Indicador, etc.) with validation, relationships, and file uploads when applicable.
- **FR-022**: System MUST implement authentication and authorization with user profiles (Administrador, Líder de Projeto, Consultor, Stakeholder Cliente, Apenas Leitura) and granular permissions (view, create, edit, delete) per entity type.
- **FR-023**: System MUST provide dashboard executivo showing current project phase with progress percentage, key indicators (KPIs/KRIs) with status visualization (green, yellow, red), alerts and critical blockers, and quick access to frequent actions.
- **FR-024**: System MUST implement notification system (in-app and email) for scheduled interviews, completed IA processing, generated reports, critical risk alerts, delayed initiatives, expiring exceptions, and documents pending approval.
- **FR-025**: System MUST track costs of Claude API calls, calculating cost per call based on input/output tokens, presenting dashboard of IA costs (daily, weekly, monthly, by functionality, by phase) with configurable limits and alerts.

### Key Entities *(include if feature involves data)*

- **Cliente**: Grupo empresarial ou holding contratante. Atributos: identificação (razão social, CNPJ, endereço), classificação (tipo, setor, porte), estrutura (subsidiárias, holding controladora), agências reguladoras, certificações.
- **Empresa**: Cada empresa do grupo (SPEs, subsidiárias, joint ventures). Atributos: identificação, tipo, participação acionária, âmbito operacional, sites vinculados, tipo de contrato, contexto operacional, status.
- **Stakeholder**: Pessoas-chave que impactam o projeto. Atributos: identificação pessoal, vínculo profissional, contatos, localização, papel no projeto, poder e influência, expertise, relacionamentos organizacionais.
- **Site**: Instalação física operacional. Atributos: identificação (código, nome), vínculo organizacional, classificação (tipo, subtipo, função), criticidade operacional, localização geográfica, infraestrutura de comunicação, sistemas principais, operação, responsáveis, segurança física.
- **Ativo**: Equipamentos e sistemas de TO. Atributos: identificação (tag, nome), classificação (categoria, tipo, subtipo), localização (site, área, zona), criticidade, características técnicas, rede e conectividade, protocolos, segurança, lifecycle, documentação, conformidade.
- **DescricaoOperacionalRaw**: Descrição original coletada do operador antes de processamento. Atributos: título da atividade, descrição completa raw (texto livre), frequência, impacto, dificuldades relatadas, pessoa que descreveu, site, cargo, turno, data coleta, método coleta, anexos, status processamento, resultado processamento, score qualidade, revisado por.
- **ProcessoNormalizado**: Processo operacional após normalização pela IA. Atributos: descrição raw origem, nome processo normalizado, objetivo, gatilho, frequência, duração estimada, criticidade, dependências, observações gerais, nível confiança normalização, tipo processo, sites envolvidos, status, versão.
- **ProcessoEtapa**: Cada etapa sequencial do processo normalizado. Atributos: processo normalizado, ordem, nome etapa, descrição detalhada, tipo etapa (tarefa humana, automática, decisão, comunicação, deslocamento), ator cargo, localização física, duração estimada, inputs, outputs, sistemas tecnológicos, decisões, observações.
- **Processo**: Processos operacionais descobertos ou documentados. Atributos: identificação (nome, categoria, versão), origem (como foi descoberto), descrição (objetivo, escopo), passos estruturados, fluxos em formato Mermaid, atores e papéis, aprovações, relacionamentos.
- **Workaround**: Soluções informais e atalhos identificados. Atributos: processo normalizado, etapa, descrição, razão, risco percebido, categoria (uso mídia removível, anotação senha, conta compartilhada, cópia manual, acesso não autorizado), evidência, status.
- **DificuldadeOperacional**: Dificuldades identificadas em processos AS-IS. Atributos: processo normalizado, etapa, descrição, impacto percebido, frequência ocorrência, origem identificação, categoria (sistema lento, indisponível, falta integração, retrabalho manual, falta treinamento), contexto adicional, votação importância, status.
- **Dor**: Dores operacionais identificadas. Atributos: descrição, origem (tipo, ID de referência, perfil da pessoa), classificação (frequência, impacto, relação com segurança), exemplos, evidências, status, iniciativas vinculadas.
- **Risco**: Riscos de segurança cibernética. Atributos: descrição, causa raiz, impacto, probabilidade, classificação resultante, controles atuais, recomendações de mitigação, status do tratamento, ativos relacionados, iniciativas vinculadas.
- **Iniciativa**: Cada iniciativa do Plano Diretor. Atributos: identificação (nome, domínio), problema endereçado, escopo, abordagem, entregáveis, dependências, riscos, benefícios, KPIs específicos, estimativa (duração, esforço, custo), responsável, prioridade, horizonte temporal, status de execução, progresso.
- **Indicador**: KPIs e KRIs definidos. Atributos: identificação (nome, tipo), cálculo (fórmula, fonte de dados, unidade), governança (frequência, responsáveis), baseline, meta, thresholds, medições históricas, tendência, relacionamento estratégico.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Consultor pode cadastrar cliente completo (dados cadastrais, 5 empresas, 10 stakeholders, 3 sites, escopo e equipe) e gerar Relatório de Onboarding em menos de 2 horas.
- **SC-002**: Sistema processa descrição operacional raw (até 5000 palavras) com IA normalizando em processo estruturado, extraindo etapas sequenciais, ativos de informação (formais e informais), localizações físicas, contextos de rede, dificuldades e workarounds em menos de 30 segundos, com taxa de acerto acima de 80% e fidelidade absoluta ao original.
- **SC-003**: Sistema gera diagrama Mermaid (flowchart, swimlane ou BPMN) a partir de processo com até 20 etapas em menos de 10 segundos, renderizando corretamente na interface.
- **SC-004**: Sistema processa documento PDF de até 100 páginas extraindo entidades e avaliando conformidade em menos de 2 minutos, identificando corretamente requisitos de frameworks aplicáveis.
- **SC-005**: Consultor pode completar avaliação de maturidade para 10 domínios e gerar Relatório de Assessment em menos de 4 horas.
- **SC-006**: Sistema gera proposta de iniciativa baseada em gap identificado usando IA em menos de 1 minuto, apresentando descrição completa, escopo, entregáveis e estimativas.
- **SC-007**: Sistema prioriza 20 iniciativas usando análise multi-critério por IA em menos de 2 minutos, retornando lista priorizada com scores e justificativas.
- **SC-008**: Sistema gera roadmap Gantt interativo com até 30 iniciativas, dependências e marcos, carregando e permitindo drag-and-drop em menos de 3 segundos.
- **SC-009**: Sistema monitora progresso de iniciativas em execução, realizando análise preditiva por IA identificando iniciativas em risco antes que se tornem críticas, com precisão acima de 70%.
- **SC-010**: Sistema gera relatório mensal de PMO (até 50 páginas) automaticamente por IA em menos de 1 minuto, em formato PDF/DOCX/PPTX com conteúdo narrativo profissional.
- **SC-011**: Interface permite que operador complete descrição operacional raw em formulário simples em menos de 10 minutos, e consultor revise normalização em interface lado-a-lado aprovando ou ajustando em menos de 5 minutos por descrição.
- **SC-012**: Dashboard executivo carrega mostrando fase atual, indicadores-chave, progresso e alertas em menos de 3 segundos.
- **SC-013**: Sistema suporta 20 usuários simultâneos sem degradação perceptível de performance (tempo de resposta mantido abaixo de 2 segundos para operações CRUD).
- **SC-014**: Custo de chamadas à Claude API permanece abaixo de 300 dólares por mês para processamento típico de um projeto (entrevistas, análises, geração de relatórios).
- **SC-015**: Pelo menos 80% dos processos operacionais críticos são descritos na plataforma, cobrindo todos os sites críticos e perfis operacionais (operador, técnico, engenheiro), com processos normalizados tendo score de confiança médio acima de 80% (adoção pela equipe e qualidade da coleta).
- **SC-016**: Relatórios gerados pela plataforma são apresentados em comitês e aprovados sem necessidade de retrabalho manual significativo (menos de 20% do conteúdo requer edição manual).
