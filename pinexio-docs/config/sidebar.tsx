import { BookCopy, Layers, Shield, Wrench, Rocket, SlidersHorizontal } from 'lucide-react';

export const sidebarNav = [
  {
    title: 'Getting Started',
    icon: <Rocket className="h-5 w-5" />,
    defaultOpen: true,
    pages: [
      {
        title: 'Overview',
        href: '/docs/getting-started/overview',
      },
      {
        title: 'Spec Kit Workflow',
        href: '/docs/getting-started/spec-kit',
      },
    ],
  },
  {
    title: 'Architecture',
    icon: <Layers className="h-5 w-5" />,
    defaultOpen: true,
    pages: [
      {
        title: 'Architecture Blueprint',
        href: '/docs/architecture/stack',
      },
    ],
  },
  {
    title: 'Operations',
    icon: <Wrench className="h-5 w-5" />,
    defaultOpen: true,
    pages: [
      {
        title: 'Operational Runbook',
        href: '/docs/operations/runbook',
      },
    ],
  },
  {
    title: 'Customization',
    icon: <SlidersHorizontal className="h-5 w-5" />,
    defaultOpen: false,
    pages: [
      {
        title: 'Font Customization',
        href: '/docs/customization/font',
      },
      {
        title: 'TOC Customization',
        href: '/docs/customization/toc',
      },
    ],
  },
  {
    title: 'Security',
    icon: <Shield className="h-5 w-5" />,
    defaultOpen: true,
    pages: [
      {
        title: 'Security Controls',
        href: '/docs/security/security-controls',
      },
    ],
  },
  {
    title: 'ADRs',
    icon: <BookCopy className="h-5 w-5" />,
    defaultOpen: true,
    pages: [
      {
        title: 'ADR 001 — Hypervisor',
        href: '/docs/adr/001-hypervisor',
      },
      {
        title: 'ADR 002 — Isolation Technology',
        href: '/docs/adr/002-isolation-tech',
      },
      {
        title: 'ADR 003 — Firewall Strategy',
        href: '/docs/adr/003-firewall',
      },
    ],
  },
];
