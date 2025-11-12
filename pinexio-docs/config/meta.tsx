export const meta = {
  metadataBase: new URL('https://secure-ot-browser-docs.ness.local'),
  title: 'Secure-OT-Browser Docs — ness',
  description:
    'Portal oficial de documentação do Secure-OT-Browser, com especificações, arquitetura, operações e segurança.',
  authors: [{ name: 'ness — Secure-OT-Browser Team' }],
  keywords: [
    'Secure-OT-Browser',
    'ness',
    'OT security',
    'isolation browser',
    'Kasm',
    'Terraform',
    'Ansible',
    'Spec Kit',
    'MDX',
  ],
  publisher: 'ness',
  creator: 'ness',
  openGraph: {
    type: 'website',
    title: 'Secure-OT-Browser Docs',
    description:
      'Documentação do Secure-OT-Browser com guias de arquitetura, runbooks e controles de segurança.',
    images: [
      {
        url: '/brand/ness-wordmark.svg',
        width: 512,
        height: 256,
        alt: 'ness · Secure-OT-Browser',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image', // Type of Twitter card
    title: 'Secure-OT-Browser Docs', // Twitter card title
    description:
      'Conheça o Secure-OT-Browser, navegação isolada para redes OT com governança Spec Kit.', // Twitter card description
    images: ['/brand/ness-wordmark.svg'], // Image used in the Twitter card
    creator: '@ness_tech', // Twitter handle of the content creator (optional)
  },
  // SEO Enhancements
  alternates: {
    canonical: 'https://secure-ot-browser-docs.ness.local', // Set the canonical URL
  },
  robots: 'index, follow', // Allows search engines to index and follow links
  // Optional: Hreflang for multilingual content (if applicable)
  hreflang: {
    en: 'https://secure-ot-browser-docs.ness.local',
    pt: 'https://secure-ot-browser-docs.ness.local/pt',
  },
};
