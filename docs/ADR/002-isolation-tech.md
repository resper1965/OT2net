# ADR 002: Escolha da Tecnologia de Isolamento

## Decisão

Usaremos **Kasm Workspaces (Contêineres)** em vez de uma VDI tradicional (Máquinas Virtuais) com Apache Guacamole e Ravada.

## Justificativa

* **Velocidade:** Contêineres iniciam em < 2 segundos. VMs completas levam 10-30 segundos, prejudicando a experiência do usuário.
* **Eficiência:** Podemos rodar 10 sessões de contêiner com a mesma RAM que rodaria 2-3 VMs. O consumo de recursos é muito menor.
* **Segurança:** Contêineres são 100% "descartáveis" por padrão. No final da sessão, ele é destruído, garantindo que nenhum malware persista.
* **Branding:** O Kasm foi construído para ser "white-label", facilitando a customização da marca.

## Alternativas Consideradas

* **Guacamole + Ravada (VDI):** Muito pesado para "apenas navegar". O gerenciamento do pool de VMs adiciona complexidade operacional.
* **Browser local endurecido:** Exige hardening contínuo das estações OT, o que aumenta o risco operacional e a superfície de ataque.

## Consequências

* Precisamos operar e manter o cluster Docker do Kasm.
* Exige monitoramento de recursos para evitar sobrecarga quando mais de 10 usuários simultâneos acessarem.
* O time de operações deve conhecer o ciclo de vida dos contêineres descartáveis para troubleshooting.
