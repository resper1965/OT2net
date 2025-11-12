# Secure-OT-Browser

O **Secure-OT-Browser** é uma solução de "caixa única" (hiperconvergida) que fornece navegação isolada e segura para redes de automação (OT), impedindo que ameaças da Internet alcancem a infraestrutura crítica.

## 🎯 O Problema

Estações de trabalho em redes OT (SCADA, IHMs) não podem ter acesso direto à Internet devido ao alto risco de infecção por malware. No entanto, operadores frequentemente precisam de acesso para consultar manuais de fornecedores, baixar drivers ou acessar documentação técnica.

## 💡 A Solução

Esta solução implanta uma "DMZ-em-uma-caixa" em um único servidor. Todo o acesso à Internet é feito através de sessões de navegador "descartáveis" (baseadas em contêineres) que rodam em uma rede isolada (DMZ). O usuário na rede OT recebe apenas um "streaming" de vídeo e áudio dessa sessão.

### Arquitetura de Alto Nível

> Substitua esta seção por um diagrama ou descrição resumida da topologia quando disponível.

## 🚀 Implantação Rápida (Quickstart)

1. Instale o Proxmox VE no hardware.
2. Configure o `iac/terraform/variables.tf` com seus IPs.
3. Execute `terraform apply`.
4. Execute `ansible-playbook -i ... iac/ansible/playbook.yml`.

## 📋 Fluxo Spec Kit

O projeto segue o [Spec Kit](https://github.com/github/spec-kit), facilitando o desenvolvimento orientado por especificação:

1. Crie ou atualize as especificações com `specify`.
2. Gere o plano técnico com `plan`.
3. Converta o plano em tarefas acionáveis com `tasks`.
4. Acompanhe a implementação com `implement`.

Documente saídas relevantes em `docs/` para manter a trilha de arquitetura e decisões alinhada.
