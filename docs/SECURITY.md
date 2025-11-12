# 🔒 Guia de Segurança

Este documento descreve os controles e práticas recomendadas para manter o Secure-OT-Browser em conformidade com os requisitos de redes industriais.

## 1. Princípios de Segurança

- **Isolamento total da OT:** toda navegação ocorre em contêineres descartáveis na DMZ.
- **Menor privilégio:** acessos de administração restritos a jump hosts autenticados com MFA.
- **Visibilidade contínua:** logs de pfSense e Kasm encaminhados para SIEM genérico.
- **Imutabilidade:** reconstrução por IaC minimiza drift e garante baseline conhecida.

## 2. Controles Recomendados

| Área | Controle | Implementação | Frequência |
| :--- | :--- | :--- | :--- |
| Acesso remoto | VPN/IPsec + MFA | pfSense + RADIUS/LDAP | Sempre ativo |
| Navegação | Filtragem de URL | pfSense + DNS filtrado | Contínua |
| Contêineres | Reset por sessão | Padrão Kasm | Contínua |
| Logs | Syslog + Retenção 180 dias | pfSense + Kasm -> SIEM | Diária |
| Atualizações | Patch, firmware, containers | Terraform/Ansible | Quinzenal |
| Segredos | Vault centralizado | Exportar variáveis via Ansible Vault | Contínua |

## 3. Hardening de Componentes

### Hypervisor Proxmox
- Aplicar recomendações do CIS Benchmark (desabilitar root login via SSH, usar chave).
- Limitar interface web (`pveproxy`) à rede de gerência (`eno1`).
- Habilitar backup criptografado no PBS.

### pfSense
- Desabilitar acesso administrativo pela WAN.
- Criar usuários administrativos individuais com MFA.
- Configurar IDS/IPS opcional (Suricata) monitorando tráfego WAN/DMZ.

### Kasm Workspaces
- Restringir imagens disponíveis às necessárias (remover browsers legacy).
- Habilitar session timeout (< 60 minutos inativo).
- Forçar TLS 1.2+ e renovar certificados via ACME/AC corporativa.

## 4. Gestão de Segredos

- Armazene credenciais Proxmox/pfSense em cofre (HashiCorp Vault, AWS Secrets Manager).
- Utilize Ansible Vault para criptografar variáveis sensíveis (`group_vars/`).
- Nunca faça commit de `.env` ou segredos; mantenha `.gitignore` atualizado.

## 5. Detecção e Resposta

- Configure alertas para tentativas de login falho no pfSense e Kasm.
- Integre com SOC para playbooks de resposta (bloqueio IP, reset de sessão).
- Mantenha runbooks de incidente em `docs/OPERATIONS.md` (seção troubleshooting).

## 6. Compliance e Auditoria

- Registrar mudanças de firewall via ADR (documentar motivo + data).
- Rastrear alterações IaC com PRs revisados (Spec Kit -> `specs/` + tarefas).
- Auditorias trimestrais: validar checksums do `config.xml` e do playbook Ansible.

## 7. Roadmap de Segurança

- [ ] Implantar varredura de vulnerabilidades nos contêineres Kasm.
- [ ] Adicionar assinatura digital aos backups do `config.xml`.
- [ ] Automatizar verificação de drift de firewall via API pfSense.
- [ ] Integrar com Zero Trust Access para autenticação granular dos operadores.

## 8. Alinhamento ao CIS Controls v8.1 (IG2)

| CIS Control | Descrição (IG2) | Implementação atual | Lacunas / Próximos passos |
| :--- | :--- | :--- | :--- |
| 01 - Inventory and Control of Enterprise Assets | Inventariar e controlar ativos conectados | Terraform/Ansible mantêm inventário declarativo de VMs; `specs/` registra mudanças | Automatizar descoberta de thin clients OT e integrá-los ao CMDB corporativo |
| 02 - Inventory and Control of Software Assets | Inventariar e gerir software autorizado | Playbooks definem versões Kasm/Docker; pfSense `config.xml` versionado | Implementar varredura periódica de pacotes nas VMs e alertar quando houver drift |
| 03 - Data Protection | Proteger dados sensíveis | Isolamento DMZ/OT, TLS obrigatório, backups cifrados no PBS | Classificar dados gerados pelas sessões e considerar DLP na DMZ |
| 04 - Secure Configuration of Enterprise Assets and Software | Configurações seguras | Hardening Proxmox/pfSense documentado, Ansible aplica baseline | Automatizar checagem com CIS-CAT ou OpenSCAP em base recorrente |
| 05 - Account Management | Gestão de contas e acessos | Uso recomendado de MFA, contas individuais no pfSense/Kasm | Integrar com IAM corporativo e revisar contas sem uso trimestralmente |
| 06 - Access Control Management | Controles de acesso | Segregação de redes, ACLs pfSense, role-based access no Kasm | Implementar Just-In-Time access para administração Proxmox/pfSense |
| 07 - Continuous Vulnerability Management | Gestão de vulnerabilidades | Atualizações quinzenais e roadmap de varredura Kasm | Adicionar scanner autenticado (ex.: OpenVAS) e rastrear findings via Spec Kit |
| 08 - Audit Log Management | Gestão de logs | Exportação para SIEM genérico e retenção de 180 dias | Formalizar correlação de eventos críticos e alertas automáticos |
| 09 - Email and Web Browser Protections | Proteções de email/navegador | Sessões Kasm isolam navegadores, limitam plugins e persistência | Adicionar listas de bloqueio de extensões e política de downloads na DMZ |
| 10 - Malware Defenses | Defesas anti-malware | Containers descartáveis mitigam persistência; pfSense pode integrar IDS/IPS | Avaliar antivírus em imagens Kasm e inspeção de payloads no proxy |
| 11 - Data Recovery | Recuperação de dados | Backups diários em PBS, plano IaC para reconstrução | Testes de restauração documentados no Spec Kit a cada trimestre |
| 12 - Network Infrastructure Management | Gestão da infraestrutura de rede | Bridges definidas, regras pfSense versionadas, DMZ isolada | Automatizar verificação de conformidade das regras vs. matriz definida |
| 13 - Network Monitoring and Defense | Monitoramento de rede | IDS/IPS (Suricata) opcional, logging pfSense -> SIEM | Implantar Suricata no roadmap e definir playbooks SOC específicos |
| 14 - Security Awareness and Skills Training | Treinamento | Reforço via documentação e RACI (Operações/SOC) | Criar módulo específico sobre uso seguro do Kasm para operadores |
| 15 - Service Provider Management | Gestão de terceiros | Dependências mapeadas (Kasm, PBS); suporte formal listado | Avaliar contratos SLA e requisitos de segurança dos provedores |
| 16 - Application Software Security | Segurança de software | Kasm e pfSense tratados como appliances com configuração controlada | Para customizações futuras, seguir pipeline DevSecOps com testes SAST/DAST |
| 17 - Incident Response Management | Gestão de incidentes | Runbook inclui troubleshooting e contatos SOC | Desenvolver playbooks do SOC baseados nos principais cenários (comprometimento DMZ, falha pfSense) |
| 18 - Penetration Testing | Testes de intrusão | Não implementado; previsto em roadmap | Agendar pentest anual focado em DMZ, pfSense e fluxo streaming |

### Prioridades IG2

1. **Vulnerabilidade e monitoramento (Controles 07, 08, 13):** operacionalizar scanners, alertas SIEM e Suricata.
2. **Gestão de identidades (Controles 05, 06):** integrar com IAM e aplicar acessos temporários.
3. **Resposta e testes (Controles 11, 17, 18):** institucionalizar testes de restauração e exercícios de incidente.
4. **Treinamento e provedores (Controles 14, 15):** criar material de conscientização e revisar SLAs.
