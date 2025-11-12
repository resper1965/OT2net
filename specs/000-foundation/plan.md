# Implementation Plan — 000-foundation

## Contexto
- Spec origem: `specs/000-foundation/spec.md`
- Objetivo: entregar stack mínima do Secure-OT-Browser com documentação operacional completa.
- Principais artefatos de suporte: `docs/ARCHITECTURE.md`, `docs/OPERATIONS.md`, `docs/SECURITY.md`, ADRs `001-003`.

## Trilhas de Trabalho

### 1. Provisionamento Infraestrutura (FR-002, FR-003)
- Validar variáveis de rede para Terraform (`iac/terraform/variables.tf`).
- Criar pipeline local de validação (`terraform fmt`, `terraform validate`, `ansible-lint`).
- Scriptar restauração do `config.xml` do pfSense pós-provisionamento.
- Saída: infraestrutura pronta para testes de sessão e backup.

### 2. Sessões Kasm e Limitações Operacionais (FR-001, FR-005)
- Configurar conjunto mínimo de imagens Kasm.
- Garantir aplicação de limite de 5 sessões simultâneas (policy + monitoramento).
- Documentar processo de autenticação e encerramento em `docs/OPERATIONS.md`.
- Validar destruição automática das sessões (SC-002).

### 3. Recuperação e Backup (User Story 2, SC-004)
- Automatizar backup PBS/NAS com checklist diário.
- Testar restore completo em ambiente de laboratório e registrar evidências.
- Documentar fallback IaC (Plano B) passo a passo.

### 4. Segurança e Observabilidade (FR-006, Edge Cases)
- Configurar exportação de logs pfSense/Kasm para SIEM genérico.
- Definir métricas monitoradas (CPU/RAM, sessões, WAN latency) e thresholds.
- Registrar controles em `docs/SECURITY.md` e roadmap de segurança.

### 5. Governança e Documentação
- Manter ADRs alinhados às decisões de hypervisor, isolamento e firewall.
- Atualizar portal `docs-site` com seções de arquitetura, operações, segurança e Spec Kit.
- Preparar SBOM inicial das dependências IaC e docs (requer integração futura).

## Testes Planejados
- `terraform apply` em ambiente de laboratório com rollback documentado.
- Execução de `ansible-playbook` com verificação de idempotência (`--check`).
- Teste manual de sessão Kasm (criação, uso, destruição).
- Restore completo a partir de backup PBS e via IaC (simulação de perda total).
- Verificação de logs exportados para SIEM e alarmes quando recursos > 70%.

## Entregáveis
- Infraestrutura funcional validada com sessão Kasm operante.
- Documentação atualizada (arquitetura, operações, segurança) com evidências de testes.
- ADRs alinhados ao estado atual.
- Plano e tarefas versionados neste diretório.


