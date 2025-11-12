# ⚙️ Operações e Manutenção

## 1. Backup (Plano A)

1. Use um **Proxmox Backup Server (PBS)** ou um **NAS (NFS/CIFS)**.
2. No Proxmox, vá em `Datacenter -> Storage` e adicione seu storage de backup.
3. Vá em `Datacenter -> Backup` e crie um job agendado.
4. **IMPORTANTE:** Faça backup de **AMBAS** as VMs (`pfSense` e `Kasm`) diariamente.

## 2. Recuperação de Desastre (Plano A - Restore)

1. Instale o Proxmox VE no novo hardware.
2. Adicione o storage de backup (conforme passo 1.2).
3. No seu storage de backup, localize os backups das VMs.
4. Clique no backup da `pfSense` -> **Restore**.
5. Clique no backup da `Kasm` -> **Restore**.
6. Inicie as VMs. O sistema estará 100% operacional.

## 3. Reconstrução (Plano B - IaC)

Se os backups falharem, use o IaC para reconstruir do zero:

1. Instale o Proxmox e configure as redes em `/etc/network/interfaces`.
2. Clone este repositório.
3. Restaure o `config.xml` do pfSense (pode ser via Ansible).
4. Provisione as VMs com Terraform (veja abaixo).
5. Configure o Kasm com Ansible (veja abaixo).

### 3.1 Pré-requisitos de laboratório

- Proxmox VE funcional com templates clonáveis:
  - Template `pfSense` contendo as NICs ot/it/dmz/wan.
  - Template `Ubuntu Server` endurecido para servir o Kasm.
- Usuário/tokens do Proxmox com permissão para clonar VMs e gerenciar storage.
- Bridges de rede configuradas: `vmbr0` (WAN), `vmbr1` (OT), `vmbr2` (IT), `vmbr3` (DMZ) ou valores equivalentes a informar no Terraform.
- Host de automação com Python 3.12+, Terraform (>= 1.7) e acesso SSH ao Proxmox/Kasm.

### 3.2 Provisionamento com Terraform

1. Crie um arquivo `iac/terraform/terraform.tfvars` (não versionado) com credenciais e parâmetros da infraestrutura:

   ```hcl
   proxmox_api_url            = "https://proxmox.local:8006/api2/json"
   proxmox_api_user           = "iac@pam"
   proxmox_api_password       = "TOKEN_SEGURO"
   proxmox_api_skip_tls_verify = true
   proxmox_target_node        = "pve01"
   proxmox_storage_pool       = "local-lvm"
   pfsense_template           = "tpl-pfsense"
   kasm_template              = "tpl-ubuntu-kasm"
   bridge_wan                 = "vmbr0"
   bridge_ot                  = "vmbr1"
   bridge_it                  = "vmbr2"
   bridge_dmz                 = "vmbr3"
   ```

2. Execute os comandos na pasta `iac/terraform`:

   ```bash
   terraform fmt
   terraform init
   terraform plan
   terraform apply
   ```

   > **Nota:** o `plan/apply` só terá sucesso com acesso ao Proxmox. Mantenha o `terraform.tfstate` seguro e exporte outputs relevantes (IPs das VMs) para consumo posterior.

### 3.3 Configuração com Ansible

1. Ajuste o inventário (`inventory.ini` ou arquivo equivalente) apontando para a VM Kasm criada:

   ```ini
   [kasm]
   kasm01 ansible_host=10.0.100.10 ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/kasm.pem
   ```

2. Na pasta `iac/ansible`, garanta que o ambiente virtual está ativo e dependências instaladas:

   ```bash
   source ../.venv/bin/activate
   ansible-galaxy install -r requirements.yml -p collections
   ansible-lint
   ```

3. Execute o playbook (recomenda-se um `--check` inicial):

   ```bash
   ansible-playbook -i inventory.ini playbook.yml --check
   ansible-playbook -i inventory.ini playbook.yml
   ```

4. Ao final, valide:
   - Serviço `kasmapi` ativo (`systemctl status kasmapi`).
   - Destruição de contêineres após logout (`kasmcli sessions list`).
   - Logs exportáveis em `/opt/kasm/current/log`.

Documente quaisquer ajustes locais de variáveis (ex.: `kasm_version`) no spec correspondente.

## 4. Geração e Manutenção de SBOM

- O SBOM CycloneDX atual está em `sbom/secure-ot-browser.cdx.json`.
- Para atualizar após mudanças de dependência:

  ```bash
  cd /home/resper/OT2net/secure-ot-browser
  /home/resper/.local/bin/syft dir:./ --exclude './.venv' --exclude './docs-site/node_modules' -o cyclonedx-json > sbom/secure-ot-browser.cdx.json
  ```

- Inclua o SBOM no pipeline corporativo da ness e registre a atualização no log da feature correspondente (`specs/<id>/spec.md`).

## 5. Branding (Customização do Produto)

Para adicionar a marca da sua empresa:

1. Acesse o portal do Kasm como administrador.
2. Navegue até `Admin -> Branding`.
3. Faça o upload do seu **Logo**, **Favicon** e **Imagem de Fundo**.
4. (Opcional) Use a seção **Custom CSS** para alterar cores.

## 6. Monitoramento e Observabilidade

- **Proxmox:** habilite `pveproxy` metrics ou exporte via Prometheus (`/api2/json/nodes/<node>/rrddata`).
- **pfSense:** configure `Status -> System Logs -> Settings` para enviar syslog a um SIEM genérico.
- **Kasm:** monitore `/opt/kasm/current/log` e exponha métricas com `docker stats` ou agente Node Exporter.
- **Indicadores-chave:**
  - CPU, RAM e disco das VMs.
  - Quantidade de sessões Kasm ativas (limite alvo: 5 simultâneas).
  - Latência média WAN -> DMZ (alerta > 150 ms).

## 7. Gestão de Patches

- **Proxmox:** aplicar atualizações quinzenais (`apt update && apt dist-upgrade`) mantendo snapshots.
- **pfSense:** acompanhar `System -> Update`; sempre exportar `config.xml` antes de upgrades.
- **Kasm/Ubuntu:** usar Ansible para aplicar patches (`unattended-upgrades` + role personalizada).
- **Docker Images:** reexecutar instalador Kasm ou usar `kasmcli` para download das novas imagens base.

## 8. Tabela de Capacidade

| Recurso | Alvo | Ação preventiva |
| :--- | :--- | :--- |
| CPU host Proxmox | < 70% média | Adicionar segundo nó ou reduzir sessões. |
| RAM host Proxmox | > 6 GB livres | Ajustar limites de sessão ou ampliar RAM. |
| Disco NVMe | > 20% livre | Rotacionar snapshots, mover logs para NAS. |
| Sessões simultâneas | ≤ 5 | Avaliar clusterização Kasm e balanceador. |

## 9. Troubleshooting Rápido

- **Usuário não acessa portal Kasm:** validar DNS/HTTPS, regra pfSense OT→DMZ e certificado TLS.
- **Sessão abriu sem áudio/vídeo:** verificar codec habilitado nas políticas Kasm e largura de banda OT.
- **WAN bloqueada:** conferir se pfSense está resolvendo DNS upstream; usar `Diagnostics -> Ping`.
- **Provisionamento falhou:** rodar `terraform plan` para drift e reexecutar role Ansible com `-vv`.
- **Limpeza de sessões órfãs:** `kasmcli sessions list` + `kasmcli sessions terminate <id>`.

## 10. Operações com Spec Kit

- Inicializar feature: `./.specify/scripts/bash/create-new-feature.sh "Melhoria X"`.
- Documentar especificação em `specs/<id>-melhoria/spec.md`.
- Usar comandos `/speckit.plan`, `/speckit.tasks` no agente Cursor para gerar plano e tarefas.
- Atualizar docs após implementação e fechar a feature com PR associado.

## 11. Matriz RACI (Resumo)

| Atividade | Responsável (R) | Suporte (S) | Informado (I) |
| :--- | :--- | :--- | :--- |
| Backup diário | Operações OT | Segurança | Gerência OT |
| Patches mensais | Segurança | Operações OT | Gerência |
| Monitoramento 24x7 | SOC | Operações OT | Segurança |
| Branding | Marketing | Operações OT | Segurança |
| Gestão de especificações | Arquitetura | Operações OT | Stakeholders |

## 12. Contatos e Escalonamento

- **NOC / Operações:** noc@example.com (24x7)
- **Segurança (SOC):** soc@example.com (24x7)
- **Change Advisory Board:** cab@example.com (horário comercial)
- **Suporte Kasm:** https://kasmweb.com/support (SLA conforme contrato)
