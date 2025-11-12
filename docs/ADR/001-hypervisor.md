# ADR 001: Seleção de Hypervisor

## Decisão

Adotar **Proxmox VE** como hypervisor bare-metal para hospedar o Secure-OT-Browser.

## Justificativa

* **Stack única:** Proxmox unifica virtualização KVM e containers LXC com gerenciamento de storage, simplificando a operação por equipes reduzidas.
* **Recursos nativos:** Inclui clustering, HA e integração com Proxmox Backup Server, alinhado ao plano de backup descrito no runbook.
* **Compatibilidade:** Suporte comprovado a pfSense e Ubuntu Server, componentes principais da solução.
* **Custo:** Licenciamento opcional. Pode operar totalmente com software livre, reduzindo custo total de propriedade.

## Alternativas Consideradas

* **VMware ESXi:** Oferece recursos avançados, porém implica custo recorrente de licenciamento e dependência de hardware certificado.
* **Microsoft Hyper-V:** Requer Windows Server como host, fugindo do objetivo de uma caixa única baseada em Linux.

## Consequências

* Time precisa dominar a CLI e a interface web do Proxmox.
* Necessidade de manter o repositório `pve-no-subscription` configurado para receber atualizações estáveis sem assinatura.
