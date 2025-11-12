# Terraform - Secure-OT-Browser

## 🧭 Visão Geral

Este módulo provisiona as VMs `pfSense` e `Kasm` no Proxmox VE, mantendo o padrão de isolamento definido na arquitetura.

## 📂 Estrutura

- `main.tf`: cria VMs e redes virtuais.
- `variables.tf`: catálogo de variáveis configuráveis.
- `proxmox.tf`: definição de provider e autenticação.

## 🔑 Pré-requisitos

- Terraform >= 1.6.0.
- Provider `Telmate/proxmox` >= 3.0.1 (instalado automaticamente).
- Template `pfSense` e `Ubuntu Kasm` previamente preparados no Proxmox.
- Token ou usuário com permissões `VM.Allocate`, `VM.Clone`, `VM.Config.*`.

## ⚙️ Configuração

Crie um arquivo `terraform.tfvars` (não versionado) contendo, por exemplo:

```hcl
proxmox_api_url             = "https://pve.lab.local:8006/api2/json"
proxmox_api_user            = "terraform@pve"
proxmox_api_password        = "<token-secret>"
proxmox_target_node         = "pve-node-01"
pfsense_template            = "tpl-pfsense-23.09"
kasm_template               = "tpl-ubuntu-kasm"
pfsense_disk_size_gb        = 20
kasm_disk_size_gb           = 200
bridge_wan                  = "vmbr0"
bridge_ot                   = "vmbr1"
bridge_it                   = "vmbr2"
bridge_dmz                  = "vmbr3"
```

> **Importante:** utilize cofre de segredos + backend remoto (`terraform cloud` ou `s3`) para armazenar estado e senhas.

## ▶️ Execução

```bash
terraform init
terraform plan
terraform apply
```

Para destruir os recursos (apenas em ambientes de teste):

```bash
terraform destroy
```

## ♻️ Fluxo de Atualização

1. Atualize variáveis e imagens base.
2. Rode `terraform plan` para validar drift.
3. Aplique `terraform apply` com aprovação manual.
4. Execute `ansible-playbook` após mudanças relevantes (nova VM Kasm).

## 🛡️ Boas Práticas

- Habilite `pm_tls_insecure=false` em produção (exigir certificados válidos).
- Use tags nos objetos Proxmox para organizar ambientes (`prod`, `lab`).
- Automatize backups do estado Terraform e revise adições via PR (Spec Kit).
