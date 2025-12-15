import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const FASES_DATA = [
  {
    codigo: 'fase-1',
    nome: 'Onboarding & Setup',
    descricao: 'Captura de estrutura organizacional (Organizações, Empresas, Sites, Stakeholders)',
    ordem: 1,
    cor: '#0ea5e9',
    icone: 'Building2',
    etapas: [
      {
        nome: 'Cadastrar Organizações',
        descricao: 'Cadastrar a organização principal (CNPJ raiz) e empresas subsidiárias',
        ordem: 1,
        obrigatoria: true,
      },
      {
        nome: 'Mapear Sites',
        descricao: 'Identificar e cadastrar todos os sites/instalações físicas e lógicas',
        ordem: 2,
        obrigatoria: true,
      },
      {
        nome: 'Definir Equipe e Stakeholders',
        descricao: 'Cadastrar membros da equipe interna e stakeholders externos (RACI)',
        ordem: 3,
        obrigatoria: true,
      },
    ],
  },
  {
    codigo: 'fase0',
    nome: 'Discovery & AS-IS',
    descricao: 'Coleta de descrições operacionais + Normalização com IA (BPMN, Mermaid)',
    ordem: 2,
    cor: '#f59e0b',
    icone: 'Search',
    etapas: [
      {
        nome: 'Coletar Descrições Operacionais',
        descricao: 'Realizar entrevistas e coletar descrições brutas de processos operacionais',
        ordem: 1,
        obrigatoria: true,
      },
      {
        nome: 'Normalizar Processos com IA',
        descricao: 'Processar descrições brutas com IA para gerar processos normalizados (BPMN)',
        ordem: 2,
        obrigatoria: true,
      },
      {
        nome: 'Validar Processos com Cliente',
        descricao: 'Revisar e aprovar processos normalizados junto ao cliente',
        ordem: 3,
        obrigatoria: true,
      },
    ],
  },
  {
    codigo: 'fase1',
    nome: 'Assessment',
    descricao: 'Análise de conformidade (ONS, ANEEL) + Matriz de riscos + Gap analysis',
    ordem: 3,
    cor: '#8b5cf6',
    icone: 'Shield',
    etapas: [
      {
        nome: 'Análise de Conformidade',
        descricao: 'Avaliar conformidade com normas ONS, ANEEL e outras regulamentações',
        ordem: 1,
        obrigatoria: true,
      },
      {
        nome: 'Construir Matriz de Riscos',
        descricao: 'Identificar e classificar riscos operacionais e de segurança',
        ordem: 2,
        obrigatoria: true,
      },
      {
        nome: 'Gap Analysis',
        descricao: 'Identificar lacunas entre estado atual (AS-IS) e desejado (TO-BE)',
        ordem: 3,
        obrigatoria: true,
      },
    ],
  },
  {
    codigo: 'fase2',
    nome: 'Plano Diretor',
    descricao: 'Roadmap de iniciativas + Priorização (MoSCoW) + Estimativas de investimento',
    ordem: 4,
    cor: '#ec4899',
    icone: 'Map',
    etapas: [
      {
        nome: 'Criar Roadmap de Iniciativas',
        descricao: 'Definir iniciativas estratégicas para fechar gaps identificados',
        ordem: 1,
        obrigatoria: true,
      },
      {
        nome: 'Priorizar Iniciativas (MoSCoW)',
        descricao: 'Classificar iniciativas em Must-have, Should-have, Could-have, Won\'t-have',
        ordem: 2,
        obrigatoria: true,
      },
      {
        nome: 'Estimar Investimentos e Benefícios',
        descricao: 'Calcular custos estimados e benefícios esperados de cada iniciativa',
        ordem: 3,
        obrigatoria: true,
      },
    ],
  },
  {
    codigo: 'fase3',
    nome: 'PMO & Execução',
    descricao: 'Dashboard PMO + Gestão de tarefas + Relatórios de status',
    ordem: 5,
    cor: '#10b981',
    icone: 'Rocket',
    etapas: [
      {
        nome: 'Configurar Dashboard PMO',
        descricao: 'Implementar dashboard de acompanhamento de iniciativas',
        ordem: 1,
        obrigatoria: true,
      },
      {
        nome: 'Gestão de Tarefas e Entregas',
        descricao: 'Gerenciar tarefas, prazos e responsáveis de cada iniciativa',
        ordem: 2,
        obrigatoria: true,
      },
      {
        nome: 'Gerar Relatórios de Status',
        descricao: 'Produzir relatórios executivos de progresso e saúde do projeto',
        ordem: 3,
        obrigatoria: true,
      },
    ],
  },
];

async function seedFases() {
  console.log('🌱 Seeding Fases e Etapas...');

  for (const faseData of FASES_DATA) {
    const { etapas, ...faseInfo } = faseData;

    // Criar ou atualizar fase
    const fase = await prisma.fase.upsert({
      where: { codigo: faseInfo.codigo },
      update: faseInfo,
      create: faseInfo,
    });

    console.log(`✅ Fase criada: ${fase.nome} (${fase.codigo})`);

    // Criar etapas
    for (const etapaData of etapas) {
      // Buscar etapa existente
      const existingEtapa = await prisma.faseEtapa.findFirst({
        where: {
          fase_id: fase.id,
          ordem: etapaData.ordem,
        },
      });

      if (existingEtapa) {
        await prisma.faseEtapa.update({
          where: { id: existingEtapa.id },
          data: etapaData,
        });
      } else {
        await prisma.faseEtapa.create({
          data: {
            ...etapaData,
            fase_id: fase.id,
          },
        });
      }
    }

    console.log(`   📋 ${etapas.length} etapas criadas`);
  }

  console.log('✨ Seed concluído!');
}

seedFases()
  .catch((e) => {
    console.error('❌ Erro ao fazer seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
