/**
 * Script de importação de frameworks regulatórios
 * 
 * Este script importa requisitos dos frameworks:
 * - REN 964/21
 * - ONS RO-CB.BR.01
 * - CIS Controls v8.1
 * - ISA/IEC-62443
 * - NIST SP 800-82
 * 
 * Executar com: npx tsx backend/scripts/import-frameworks.ts
 */

import prisma from '../src/lib/prisma'
import { logger } from '../src/utils/logger'

interface RequisitoFramework {
  codigo: string
  titulo: string
  descricao: string
  categoria?: string
  versao?: string
}

/**
 * Framework: REN 964/21
 * Resolução Normativa ANEEL sobre Segurança Cibernética
 */
const REN_964_21: RequisitoFramework[] = [
  {
    codigo: 'REN-964-21-4.1',
    titulo: 'Governança de Segurança Cibernética',
    descricao: 'Estabelecer estrutura de governança para segurança cibernética, incluindo políticas, procedimentos e responsabilidades.',
    categoria: 'Governança',
    versao: '2021',
  },
  {
    codigo: 'REN-964-21-4.2',
    titulo: 'Gestão de Riscos Cibernéticos',
    descricao: 'Implementar processo de gestão de riscos cibernéticos, incluindo identificação, análise, tratamento e monitoramento.',
    categoria: 'Gestão de Riscos',
    versao: '2021',
  },
  // Adicionar mais requisitos conforme necessário
]

/**
 * Framework: ONS RO-CB.BR.01
 * Requisitos Operacionais do ONS para Segurança Cibernética
 */
const ONS_RO_CB_BR_01: RequisitoFramework[] = [
  {
    codigo: 'ONS-RO-CB.BR.01-1',
    titulo: 'Segmentação de Rede',
    descricao: 'Implementar segmentação de rede para isolar sistemas críticos e reduzir superfície de ataque.',
    categoria: 'Segurança de Rede',
    versao: '2023',
  },
  // Adicionar mais requisitos conforme necessário
]

/**
 * Framework: CIS Controls v8.1
 * Critical Security Controls
 */
const CIS_CONTROLS_V8_1: RequisitoFramework[] = [
  {
    codigo: 'CIS-1',
    titulo: 'Inventory and Control of Enterprise Assets',
    descricao: 'Actively manage (inventory, track, and correct) all enterprise assets (end-user devices, including portable and mobile, network devices, non-computing/IoT devices, and servers) connected to the infrastructure physically, virtually, remotely, and those within cloud environments, to accurately know the totality of assets that need to be monitored and protected within the enterprise.',
    categoria: 'Asset Management',
    versao: '8.1',
  },
  // Adicionar mais controles conforme necessário
]

/**
 * Framework: ISA/IEC-62443
 * Security for Industrial Automation and Control Systems
 */
const ISA_IEC_62443: RequisitoFramework[] = [
  {
    codigo: 'ISA-62443-3-3-SR1.1',
    titulo: 'Identification and Authentication Control',
    descricao: 'The control system shall enforce identification and authentication of all users, processes, and devices.',
    categoria: 'Access Control',
    versao: '3.3',
  },
  // Adicionar mais requisitos conforme necessário
]

/**
 * Framework: NIST SP 800-82
 * Guide to Industrial Control Systems (ICS) Security
 */
const NIST_SP_800_82: RequisitoFramework[] = [
  {
    codigo: 'NIST-800-82-5.1',
    titulo: 'ICS Security Program Development',
    descricao: 'Develop and maintain a comprehensive ICS security program that addresses security throughout the system lifecycle.',
    categoria: 'Security Program',
    versao: 'Rev. 2',
  },
  // Adicionar mais requisitos conforme necessário
]

async function importFramework(
  frameworkName: string,
  requisitos: RequisitoFramework[]
) {
  logger.info({ framework: frameworkName, count: requisitos.length }, 'Importando framework')

  let imported = 0
  let skipped = 0

  for (const req of requisitos) {
    try {
      // Verificar se já existe
      const existing = await prisma.requisitoFramework.findFirst({
        where: {
          framework: frameworkName,
          codigo: req.codigo,
        },
      })

      if (existing) {
        skipped++
        continue
      }

      // Criar requisito
      await prisma.requisitoFramework.create({
        data: {
          framework: frameworkName,
          codigo: req.codigo,
          titulo: req.titulo,
          descricao: req.descricao,
          categoria: req.categoria || null,
          versao: req.versao || null,
        },
      })

      imported++
    } catch (error: any) {
      logger.error(
        { framework: frameworkName, codigo: req.codigo, error: error.message },
        'Erro ao importar requisito'
      )
    }
  }

  logger.info(
    { framework: frameworkName, imported, skipped },
    'Framework importado'
  )

  return { imported, skipped }
}

async function main() {
  logger.info('Iniciando importação de frameworks regulatórios...')

  const resultados = {
    'REN_964_21': await importFramework('REN_964_21', REN_964_21),
    'ONS_RO_CB_BR_01': await importFramework('ONS_RO_CB_BR_01', ONS_RO_CB_BR_01),
    'CIS_CONTROLS_V8_1': await importFramework('CIS_CONTROLS_V8_1', CIS_CONTROLS_V8_1),
    'ISA_IEC_62443': await importFramework('ISA_IEC_62443', ISA_IEC_62443),
    'NIST_SP_800_82': await importFramework('NIST_SP_800_82', NIST_SP_800_82),
  }

  const totalImported = Object.values(resultados).reduce((sum, r) => sum + r.imported, 0)
  const totalSkipped = Object.values(resultados).reduce((sum, r) => sum + r.skipped, 0)

  logger.info(
    { totalImported, totalSkipped },
    'Importação de frameworks concluída'
  )

  console.log('\n✅ Importação concluída!')
  console.log(`   - ${totalImported} requisitos importados`)
  console.log(`   - ${totalSkipped} requisitos já existentes (ignorados)`)
}

main()
  .catch((e) => {
    logger.error({ error: e }, 'Erro na importação')
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



