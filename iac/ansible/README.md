# Ansible - Secure-OT-Browser

## 🎯 Objetivo

Configurar automaticamente a VM Kasm (Ubuntu) com Docker, baixar a release e habilitar serviços necessários para streaming seguro.

## 📁 Conteúdo

- `playbook.yml`: playbook principal dirigido ao grupo `kasm`.
- `roles/kasm`: role de configuração do Kasm Workspaces.
- `requirements.yml`: dependências Galaxy (ex.: `geerlingguy.docker`).

## 🔑 Pré-requisitos

- Ansible >= 2.15.
- Inventário com host(s) Kasm acessível via SSH.
- Usuário com sudo sem senha ou chave SSH configurada.
- Python 3 no alvo (default Ubuntu já atende).

## ⚙️ Preparação

Instale as dependências:

```bash
ansible-galaxy install -r requirements.yml
```

Crie um inventário (ex.: `inventory.ini`):

```ini
[kasm]
192.168.100.20 ansible_user=ansible ansible_ssh_private_key_file=~/.ssh/kasm
```

Defina variáveis opcionais (`group_vars/kasm.yml`):

```yaml
kasm_version: "1.15.0"
ansible_become_password: "<vault>"
```

Proteja secrets com `ansible-vault encrypt group_vars/kasm.yml`.

## ▶️ Execução

```bash
ansible-playbook -i inventory.ini playbook.yml
```

Use tags para etapas específicas, por exemplo instalar apenas Docker:

```bash
ansible-playbook -i inventory.ini playbook.yml --tags docker
```

## 🔄 Atualizações do Kasm

1. Ajuste `kasm_version` conforme release desejada.
2. Reaplique o playbook (vai executar instalador novamente, preservando dados).
3. Monitorar `/opt/kasm/current/log/install.log` para validar sucesso.

## 🧪 Validação Pós-Configuração

- `systemctl status kasmapi` deve retornar `active (running)`.
- `docker ps` deve listar contêineres `kasm` básicos (`kasm_db`, `kasm_api`, etc.).
- Acesse `https://<kasm_ip>` e verifique login administrativo.

## 🛡️ Boas Práticas

- Usar `serial: 1` ao aplicar em múltiplos nós para evitar indisponibilidade.
- Registrar alterações significativas em ADRs ou `specs/` via Spec Kit.
- Integrar com pipeline CI para lint (`ansible-lint`) e testes (`molecule`).
