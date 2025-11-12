# Secure-OT-Browser Constitution

## Core Principles

### I. Spec-Driven Decisions
Toda iniciativa parte de um `spec.md` com user stories, critérios de aceitação e métricas. Nenhuma implementação é iniciada sem spec aprovado e versionado.

### II. Infraestrutura Reprodutível
Terraform, Ansible e artefatos pfSense são fonte de verdade. Alterações manuais devem ser capturadas como código e documentadas antes de serem consideradas válidas.

### III. Segurança em Primeiro Lugar
Cada mudança deve evidenciar impacto em isolamento OT, hardening e cadeia de restauração. Nenhum ajuste é aceito se reduzir controles de segurança sem mitigação referenciada.

### IV. Observabilidade e Recuperação
Metas de monitoramento e recuperação (backup, restauração, alertas) são parte do Definition of Done. Specs precisam apontar métricas e testes operacionais.

### V. Documentação Viva
Docs (`docs/`, ADRs e portal) são atualizados no mesmo PR da implementação. Divergências entre spec e documentação são bugs críticos.

## Requisitos Complementares

- Aderência ao padrão BMAD da empresa, preservando linguagem especificada e design system oficial.
- Utilização obrigatória do fluxo Context7 para consulta de bibliotecas, APIs e diagnósticos de erro.
- Manutenção do SBOM atualizado a cada dependência nova ou atualizada.

## Workflow de Desenvolvimento

1. Criar spec via `/speckit.specify` usando os scripts em `.specify/scripts`.
2. Gerar plano (`/speckit.plan`) e tarefas (`/speckit.tasks`), versionando artefatos em `specs/<id>/`.
3. Abrir PR vinculando spec, plano, tarefas e ADRs afetados.
4. Executar `/speckit.implement`, atualizar docs e marcar tarefas concluídas antes do merge.
5. Registrar evidências de testes (IaC, operação, segurança) no spec ou anexos.

## Governance

- Esta constituição tem prioridade sobre outras práticas do projeto.
- Emendas exigem ADR dedicada, atualização deste documento e consenso das áreas Arquitetura, Operações e Segurança.
- Code reviews devem verificar conformidade com princípios, fluxos Spec Kit e atualização da documentação.

**Version**: 1.0.0 | **Ratified**: 2025-11-12 | **Last Amended**: 2025-11-12
