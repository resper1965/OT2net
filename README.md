# Secure-OT-Browser

O **Secure-OT-Browser** é uma solução de "caixa única" (hiperconvergida) que fornece navegação isolada e segura para redes de automação (OT), impedindo que ameaças da Internet alcancem a infraestrutura crítica.

## 🎯 O Problema

Estações de trabalho em redes OT (SCADA, IHMs) não podem ter acesso direto à Internet devido ao alto risco de infecção por malware. No entanto, operadores frequentemente precisam de acesso para consultar manuais de fornecedores, baixar drivers ou acessar documentação técnica.

## 💡 A Solução

Esta solução implanta uma "DMZ-em-uma-caixa" em um único servidor. Todo o acesso à Internet é feito através de sessões de navegador "descartáveis" (baseadas em contêineres) que rodam em uma rede isolada (DMZ). O usuário na rede OT recebe apenas um "streaming" de vídeo e áudio dessa sessão.

- Limite operacional padrão: até **5 conexões simultâneas** por instância, garantindo performance consistente sem saturar os recursos reservados.

## 🔑 Benefícios Principais

- **Segurança reforçada:** isolamento completo entre a navegação e a rede OT, com sessões descartáveis e firewall dedicado.
- **Simplicidade operacional:** automações Terraform + Ansible para provisionamento e configuração padronizados.
- **Escalabilidade controlada:** crescimento horizontal adicionando hosts Proxmox, preservando o limite seguro de 5 sessões por nó.
- **Branding rápido:** personalização via portal Kasm e documentação de branding pronta em `docs/OPERATIONS.md`.

## 🧩 Componentes da Solução

- **Hypervisor:** Proxmox VE com bridges `vmbr0`-`vmbr3` mapeadas para WAN, OT, IT e DMZ.
- **Firewall:** pfSense com política OT→DMZ restritiva e rotas específicas para AD/IT.
- **Gateway de Sessões:** Ubuntu Server com Kasm Workspaces (Docker) entregando streaming de navegador.
- **Automação IaC:** Terraform para provisionar VMs + Ansible para configurar Kasm e restaurar pfSense.

### Arquitetura de Alto Nível

> Substitua esta seção por um diagrama ou descrição resumida da topologia quando disponível.

## 📦 Estrutura do Repositório

| Caminho                                   | Descrição                                                                 |
| :---------------------------------------- | :------------------------------------------------------------------------ |
| `docs/ARCHITECTURE.md`                    | Blueprint técnico com stack, rede e matriz de firewall.                  |
| `docs/OPERATIONS.md`                      | Runbook com backup, restore, IaC fallback e branding.                    |
| `docs/ADR/`                               | Decisões arquiteturais versionadas (hypervisor, isolamento, firewall).   |
| `iac/terraform/`                          | Provisionamento das VMs pfSense/Kasm no Proxmox.                         |
| `iac/ansible/`                            | Configuração pós-provisionamento, incluindo role `kasm`.                 |
| `iac/pfsense/config.xml`                  | Backup mestre inicial da política pfSense.                               |
| `.specify/`                               | Artefatos do Spec Kit (scripts, templates, memórias de projeto).         |

## ⚙️ Requisitos de Infraestrutura

- Servidor bare-metal compatível com Proxmox e 4 NICs físicas.
- CPU 8 vCPUs, 32 GB RAM, 1 TB NVMe (mínimo para ~5 usuários simultâneos).
- Repositório de backup (PBS ou NAS) acessível via Proxmox.

## 🚀 Implantação Rápida (Quickstart)

1. Instale o Proxmox VE no hardware.
2. Configure o `iac/terraform/variables.tf` com seus IPs.
3. Execute `terraform apply`.
4. Execute `ansible-playbook -i ... iac/ansible/playbook.yml`.

## 🔄 Fluxo Operacional

- Consulte `docs/OPERATIONS.md` para backup/restore e reconstrução completa.
- Utilize `iac/pfsense/config.xml` como ponto de partida e adapte regras conforme sua matriz de risco.
- Monitore o consumo de CPU/RAM/GPU no host para manter o SLA das 5 sessões simultâneas.

## 🖥️ Portal de Documentação

- Aplicação dedicada em `pinexio-docs/` (Next.js 15 + Tailwind 4), derivada do template [Pinexio](https://github.com/sanjayc208/pinexio).
- Conteúdo oficial: MDX organizado por Getting Started, Architecture, Operations, Security e ADRs.
- Execução local:

  ```bash
  cd pinexio-docs
  pnpm install   # ou npm install / yarn install
  pnpm dev
  ```

- Ao adicionar páginas:
  - Crie arquivos `.mdx` na pasta `docs/`.
  - Atualize a navegação em `config/sidebar.tsx`.
  - Rode `pnpm build:content` para validar a indexação.
- A aplicação antiga em `docs-site/` foi mantida apenas como referência histórica e será descontinuada após o portal Pinexio entrar em produção.

## 📋 Fluxo Spec Kit

O projeto segue o [Spec Kit](https://github.com/github/spec-kit), facilitando o desenvolvimento orientado por especificação:

1. Crie ou atualize as especificações com `specify`.
2. Gere o plano técnico com `plan` e versiona o resultado em `specs/<id>/plan.md`.
3. Converta o plano em tarefas acionáveis com `tasks`, salvando em `specs/<id>/tasks.md` (ou sincronizando com o gerenciador de issues referenciando este arquivo).
4. Acompanhe a implementação com `implement`, atualizando a seção **Log de Implementação** do spec e mantendo `docs/` e ADRs alinhados.

Sempre vincule PRs aos artefatos produzidos (`spec.md`, `plan.md`, `tasks.md`, ADRs) e ao trecho relevante do portal (`docs-site`).

### Como executar rapidamente

```bash
source .venv/bin/activate
specify check               # valida dependências
./.specify/scripts/bash/create-new-feature.sh "Descrever nova feature"
/speckit.plan               # gera plano técnico e salva em specs/<id>/plan.md
/speckit.tasks              # gera tarefas e salva em specs/<id>/tasks.md
```

## 🗺️ Roadmap Inicial

- [ ] Documentar métricas de observabilidade (Prometheus/Grafana) para as VMs.
- [ ] Adicionar testes de fumaça automatizados pós-provisionamento.
- [ ] Avaliar estratégia de balanceamento para mais de 5 conexões simultâneas.

## 🤝 Contribuindo

- Siga o fluxo Spec Kit para propor novas funcionalidades (`specs/`).
- Atualize ADRs quando decisões de arquitetura forem revisadas.
- Respeite o design system e naming definidos nas memórias do projeto.
