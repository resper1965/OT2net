import { prisma } from '../lib/prisma';
import { RAGService } from '../services/rag-service';
import { logger } from '../utils/logger';

async function seed() {
  logger.info('Starting Regulations Seed...');

  const regulations = [
    // === ONS ===
    {
      framework: 'ONS',
      codigo: 'RO-CB.BR.01',
      titulo: 'Procedimentos de Rede - Submódulo 10.12',
      descricao: 'Estabelece os requisitos mínimos para os sistemas de supervisão e controle das instalações da Rede de Operação. Define que toda instalação da Rede Básica deve possuir meios para a supervisão e o controle telecomandado a partir de um Centro de Operação.',
      categoria: 'Operação',
      versao: '2023.1'
    },
    {
      framework: 'ONS',
      codigo: 'RO-CB.BR.02',
      titulo: 'Requisitos de Telemetria',
      descricao: 'As medições de tensão, corrente, potência ativa e reativa devem ser enviadas ao ONS com periodicidade não superior a 4 segundos e erro máximo de 2%. Falhas na telemetria por mais de 30 minutos devem ser justificadas em relatório técnico.',
      categoria: 'Telemetria',
      versao: '2023.1'
    },
    // === ANEEL ===
    {
      framework: 'ANEEL',
      codigo: 'REN 964/2021',
      titulo: 'Resolução Normativa 964',
      descricao: 'Dispõe sobre a segurança cibernética no setor elétrico brasileiro. Exige a implementação de controles de segurança para infraestruturas críticas, incluindo segmentação de redes, gestão de patches e monitoramento contínuo de ameaças.',
      categoria: 'Cibersegurança',
      versao: '2021'
    },
    {
      framework: 'ANEEL',
      codigo: 'PRODIST-M8',
      titulo: 'Qualidade da Energia Elétrica',
      descricao: 'O Módulo 8 do PRODIST define os padrões de qualidade da energia elétrica, incluindo limites para flutuação de tensão, harmônicos e desequilíbrio de tensão. As distribuidoras devem monitorar esses indicadores permanentemente.',
      categoria: 'Qualidade',
      versao: '2022'
    }
  ];

  logger.info(`Found ${regulations.length} regulations to seed.`);

  // Process using RAGService to vectorize
  // We use "as any" because 'FrameworkType' might have specific string literals defined in the service type
  await RAGService.processarRegrasEmLote(regulations as any);

  logger.info('Regulations Seed Completed successfully.');
}

seed()
  .catch((e) => {
    logger.error({ error: e }, 'Error planting seeds');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
