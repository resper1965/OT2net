# ADR 003: Plataforma de Firewall

## Decisão

Padronizar o firewall virtual da solução no **pfSense CE** executando em máquina virtual dedicada.

## Justificativa

* **Recursos avançados:** pfSense entrega inspeção de pacotes, VPNs, proxy e autenticação integrada, cobrindo as necessidades da DMZ sem custo adicional.
* **Automação:** Exporta/Importa configuração em XML, permitindo versionamento do `config.xml` no repositório e reprovisionamento automatizado.
* **Comunidade e suporte:** Forte ecossistema, extensa documentação e fóruns ativos.

## Alternativas Consideradas

* **OPNsense:** Similar ao pfSense, porém a equipe já possui experiência prévia com pfSense e materiais de treinamento existentes.
* **Firewall proprietário (FortiGate, Palo Alto VM-Series):** Elevado custo de licença, contra o objetivo de solução economicamente viável.

## Consequências

* Devemos acompanhar atualizações de packages (por exemplo, Squid, Suricata) para evitar vulnerabilidades.
* O time precisa manter políticas de segurança rígidas para acesso administrativo à interface web do pfSense.
