type TocPage = {
  title: string;
  href: string;
};

type TocSection = {
  title: string;
  href: string;
  pages?: TocPage[];
};

type TocData = {
  [key: string]: TocSection[];
};

// Your TocData object with the correct types
export const TocData: TocData = {
  'getting-started/overview': [
    {
      title: 'Secure-OT-Browser',
      href: '/docs/getting-started/overview#secure-ot-browser',
      pages: [
        {
          title: 'Problema',
          href: '/docs/getting-started/overview#problema',
        },
        {
          title: 'Solução',
          href: '/docs/getting-started/overview#solucao',
        },
        {
          title: 'Benefícios',
          href: '/docs/getting-started/overview#beneficios',
        },
      ],
    },
  ],
  'getting-started/spec-kit': [
    {
      title: 'Spec-Driven Delivery',
      href: '/docs/getting-started/spec-kit#spec-driven-delivery',
      pages: [
        {
          title: 'Comandos Centrais',
          href: '/docs/getting-started/spec-kit#comandos-centrais',
        },
        {
          title: 'Como iniciar uma feature',
          href: '/docs/getting-started/spec-kit#como-iniciar-uma-feature',
        },
        {
          title: 'Expectativas de documentação',
          href: '/docs/getting-started/spec-kit#expectativas-de-documentacao',
        },
      ],
    },
  ],
  'architecture/stack': [
    {
      title: 'Pilha de Tecnologia',
      href: '/docs/architecture/stack#1-pilha-de-tecnologia-stack',
    },
    {
      title: 'Design da Rede',
      href: '/docs/architecture/stack#3-design-da-rede',
      pages: [
        {
          title: 'Interfaces físicas',
          href: '/docs/architecture/stack#interfaces-fisicas-proxmox',
        },
        {
          title: 'Redes virtuais',
          href: '/docs/architecture/stack#redes-virtuais-proxmox-bridges',
        },
      ],
    },
    {
      title: 'Fluxo de Sessão',
      href: '/docs/architecture/stack#6-fluxo-de-sessao',
    },
    {
      title: 'Escalabilidade',
      href: '/docs/architecture/stack#8-escalabilidade-e-alta-disponibilidade',
    },
  ],
  'operations/runbook': [
    {
      title: 'Backup (Plano A)',
      href: '/docs/operations/runbook#1-backup-plano-a',
    },
    {
      title: 'Recuperação de Desastre',
      href: '/docs/operations/runbook#2-recuperacao-de-desastre-plano-a---restore',
    },
    {
      title: 'Reconstrução (Plano B - IaC)',
      href: '/docs/operations/runbook#3-reconstrucao-plano-b---iac',
      pages: [
        {
          title: 'Pré-requisitos',
          href: '/docs/operations/runbook#31-pre-requisitos-de-laboratorio',
        },
        {
          title: 'Provisionamento Terraform',
          href: '/docs/operations/runbook#32-provisionamento-com-terraform',
        },
        {
          title: 'Configuração Ansible',
          href: '/docs/operations/runbook#33-configuracao-com-ansible',
        },
      ],
    },
    {
      title: 'SBOM',
      href: '/docs/operations/runbook#4-geracao-e-manutencao-de-sbom',
    },
    {
      title: 'Troubleshooting',
      href: '/docs/operations/runbook#9-troubleshooting-rapido',
    },
  ],
  'security/security-controls': [
    {
      title: 'Princípios de Segurança',
      href: '/docs/security/security-controls#1-principios-de-seguranca',
    },
    {
      title: 'Controles recomendados',
      href: '/docs/security/security-controls#2-controles-recomendados',
    },
    {
      title: 'Hardening',
      href: '/docs/security/security-controls#3-hardening-de-componentes',
    },
    {
      title: 'Compliance CIS v8.1',
      href: '/docs/security/security-controls#8-alinhamento-ao-cis-controls-v81-ig2',
    },
  ],
  'customization/font': [
    {
      title: 'Fonte global',
      href: '/docs/customization/font#font-customization',
      pages: [
        {
          title: 'Fonte global',
          href: '/docs/customization/font#fonte-global',
        },
        {
          title: 'Tailwind config',
          href: '/docs/customization/font#tailwind-config',
        },
        {
          title: 'Pesos recomendados',
          href: '/docs/customization/font#pesos-recomendados',
        },
      ],
    },
  ],
  'customization/toc': [
    {
      title: 'Estrutura',
      href: '/docs/customization/toc#table-of-contents-toc-customization',
    },
    {
      title: 'Sidebar',
      href: '/docs/customization/toc#sidebar',
    },
    {
      title: 'TOC por página',
      href: '/docs/customization/toc#toc-por-pagina',
    },
    {
      title: 'Regras',
      href: '/docs/customization/toc#regras',
    },
    {
      title: 'Teste',
      href: '/docs/customization/toc#teste',
    },
  ],
};
