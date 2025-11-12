# Task Breakdown — 000-foundation

| ID | Título | Descrição | Responsável | Saída | Estado |
| :-- | :-- | :-- | :-- | :-- | :-- |
| T-001 | Provisionar infraestrutura | Executar Terraform + Ansible com variáveis validadas e registrar estado | Infra | `terraform.tfstate`, relatórios ansible *(terraform fmt/init/validate executados; aguardando ambiente Proxmox para apply)* | In Progress |
| T-002 | Validar sessões Kasm | Configurar imagens, limite de sessões e testar encerramento limpo | Operações | Evidência de streaming e logs de destruição | Pending |
| T-003 | Formalizar backup & restore | Implementar backup PBS e simular restauração completa | Operações | Relatório de teste de restauração | Pending |
| T-004 | Integrar logging e monitoramento | Encaminhar logs pfSense/Kasm para SIEM genérico e definir thresholds | Segurança | Playbook/logs exportados, alertas configurados | Pending |
| T-005 | Atualizar documentação oficial | Sincronizar `docs/`, ADRs e portal `docs-site` com resultados dos testes | Arquitetura | PR com documentação revisada | Pending |
| T-006 | SBOM inicial | Registrar dependências IaC e docs no SBOM corporativo | Arquitetura | `sbom/secure-ot-browser.cdx.json` | Completed |


