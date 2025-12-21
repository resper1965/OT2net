import { PrismaClient } from '@prisma/client';
import { RAGService } from '../src/services/rag-service';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. TENANT
  console.log('1️⃣  Creating tenant...');
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'Demo Company',
      slug: 'demo'
    }
  });
  console.log(`✅ Tenant: ${tenant.name}`);

  // 2. ORGANIZAÇÕES
  console.log('2️⃣  Creating organizações...');
  const org1 = await prisma.organizacao.create({
    data: {
      tenant_id: tenant.id,
      razao_social: 'Eletrobras Holding S.A.',
      cnpj: '00.001.180/0001-26',
      agencias_reguladoras: ['ANEEL', 'ONS'],
      certificacoes: ['ISO 27001', 'IEC 62443-2-1']
    }
  });

  const org2 = await prisma.organizacao.create({
    data: {
      tenant_id: tenant.id,
      razao_social: 'CEMIG Geração e Transmissão S.A.',
      cnpj: '06.981.176/0001-58',
      agencias_reguladoras: ['ANEEL'],
      certificacoes: ['ISO 27001']
    }
  });
  console.log(`✅ Organizações: 2 created`);

  // 3. EMPRESAS (5)
  console.log('3️⃣  Creating empresas...');
  const empresas = await Promise.all([
    prisma.empresa.create({
      data: {
        tenant_id: tenant.id,
        organizacao_id: org1.id,
        identificacao: 'Eletronorte',
        tipo: 'Geradora',
        status: 'ativa'
      }
    }),
    prisma.empresa.create({
      data: {
        tenant_id: tenant.id,
        organizacao_id: org1.id,
        identificacao: 'Furnas',
        tipo: 'Geradora/Transmissora',
        status: 'ativa'
      }
    }),
    prisma.empresa.create({
      data: {
        tenant_id: tenant.id,
        organizacao_id: org1.id,
        identificacao: 'Chesf',
        tipo: 'Geradora/Transmissora',
        status: 'ativa'
      }
    }),
    prisma.empresa.create({
      data: {
        tenant_id: tenant.id,
        organizacao_id: org2.id,
        identificacao: 'CEMIG GT',
        tipo: 'Geradora/Transmissora',
        status: 'ativa'
      }
    }),
    prisma.empresa.create({
      data: {
        tenant_id: tenant.id,
        organizacao_id: org2.id,
        identificacao: 'CEMIG Distribuição',
        tipo: 'Distribuidora',
        status: 'ativa'
      }
    }),
  ]);
  console.log(`✅ Empresas: ${empresas.length} created`);

  // 4. SITES (10)
  console.log('4️⃣  Creating sites...');
  const sites = await Promise.all([
    prisma.site.create({
      data: {
        tenant_id: tenant.id,
        empresa_id: empresas[0].id,
        identificacao: 'UHE-TUCURUI',
        classificacao: 'Usina Hidrelétrica'
      }
    }),
    prisma.site.create({
      data: {
        tenant_id: tenant.id,
        empresa_id: empresas[0].id,
        identificacao: 'SE-TUCURUI-500KV',
        classificacao: 'Subestação'
      }
    }),
    prisma.site.create({
      data: {
        tenant_id: tenant.id,
        empresa_id: empresas[1].id,
        identificacao: 'UHE-FURNAS',
        classificacao: 'Usina Hidrelétrica'
      }
    }),
    prisma.site.create({
      data: {
        tenant_id: tenant.id,
        empresa_id: empresas[1].id,
        identificacao: 'UTE-SANTA-CRUZ',
        classificacao: 'Usina Termelétrica'
      }
    }),
    prisma.site.create({
      data: {
        tenant_id: tenant.id,
        empresa_id: empresas[2].id,
        identificacao: 'UHE-PAULO-AFONSO-IV',
        classificacao: 'Usina Hidrelétrica'
      }
    }),
    prisma.site.create({
      data: {
        tenant_id: tenant.id,
        empresa_id: empresas[2].id,
        identificacao: 'SE-ANGELIM-II',
        classificacao: 'Subestação'
      }
    }),
    prisma.site.create({
      data: {
        tenant_id: tenant.id,
        empresa_id: empresas[3].id,
        identificacao: 'UHE-EMBORCACAO',
        classificacao: 'Usina Hidrelétrica'
      }
    }),
    prisma.site.create({
      data: {
        tenant_id: tenant.id,
        empresa_id: empresas[3].id,
        identificacao: 'UHE-JAGUARA',
        classificacao: 'Usina Hidrelétrica'
      }
    }),
    prisma.site.create({
      data: {
        tenant_id: tenant.id,
        empresa_id: empresas[4].id,
        identificacao: 'SE-BARREIRO',
        classificacao: 'Subestação'
      }
    }),
    prisma.site.create({
      data: {
        tenant_id: tenant.id,
        empresa_id: empresas[4].id,
        identificacao: 'COS-CEMIG',
        classificacao: 'Centro de Controle'
      }
    }),
  ]);
  console.log(`✅ Sites: ${sites.length} created`);

  // 5. PROJETOS (3)
  console.log('5️⃣  Creating projetos...');
  const projetos = [
    await prisma.projeto.create({
      data: {
        tenant_id: tenant.id,
        organizacao_id: org1.id,
        nome: 'Adequação ANEEL 964/21 - Eletrobras',
        descricao: 'Compliance com Resolução ANEEL 964/21',
        fase_atual: 'discovery'
      }
    }),
    await prisma.projeto.create({
      data: {
        tenant_id: tenant.id,
        organizacao_id: org2.id,
        nome: 'Mapeamento AS-IS - CEMIG',
        descricao: 'Levantamento de processos operacionais',
        fase_atual: 'discovery'
      }
    }),
    await prisma.projeto.create({
      data: {
        tenant_id: tenant.id,
        organizacao_id: org1.id,
        nome: 'Assessment IEC 62443 - Furnas',
        descricao: 'Avaliação de conformidade IEC 62443',
        fase_atual: 'planejamento'
      }
    }),
  ];
  console.log(`✅ Projetos: ${projetos.length} created`);

  // 6. DESCRIÇÕES RAW (20)
  console.log('6️⃣  Creating descrições raw...');
  const descricoes = await Promise.all(
    Array.from({ length: 20 }).map((_, i) => {
      const isProcessado = i < 10;
      return prisma.descricaoOperacionalRaw.create({
        data: {
          tenant_id: tenant.id,
          projeto_id: projetos[i < 12 ? 0 : 1].id,
          site_id: sites[i % 10].id,
          titulo: `Processo Operacional ${i + 1}`,
          descricao_completa: `Descrição detalhada do processo ${i + 1}. Envolve verificação SCADA, análise de alarmes e registro.`,
          status_processamento: isProcessado ? 'processado' : 'pendente',
          resultado_processamento: isProcessado ? {
            approval_text: `Processo ${i + 1}: monitoramento de sistemas SCADA com impacto moderado.`,
            mermaid_graph: `flowchart TD\n    A[Início] --> B[Verificar]\n    B --> C[Fim]`,
            bpmn: { id: `proc-${i}` }
          } as any : undefined
        }
      });
    })
  );
  console.log(`✅ Descrições: ${descricoes.length} (${descricoes.filter(d => d.status_processamento === 'processado').length} processadas)`);

  // 7. PROCESSOS NORMALIZADOS (10)
  console.log('7️⃣  Creating processos normalizados...');
  const processosNorm = await Promise.all(
    descricoes.slice(0, 10).map((desc, i) => {
      return prisma.processoNormalizado.create({
        data: {
          tenant_id: tenant.id,
          descricao_raw_id: desc.id,
          nome: `${desc.titulo} (Normalizado)`,
          nivel_confianca_normalizacao: 0.85,
          status: i < 5 ? 'aprovado' : 'revisao'
        }
      });
    })
  );
  console.log(`✅ Processos Normalizados: ${processosNorm.length} created`);

  // Regulatory Requirements (RAG)
  const requirements = [
    {
      framework: 'ANEEL',
      codigo: 'REN 964/2021',
      titulo: 'Segurança Cibernética no Setor Elétrico',
      descricao: 'Estabelece os requisitos mínimos de segurança cibernética para as instalações e sistemas de rede operativos do setor elétrico.',
      categoria: 'Governança'
    },
    {
      framework: 'IEC62443',
      codigo: 'IEC 62443-3-3',
      titulo: 'System security requirements and security levels',
      descricao: 'Define requisitos detalhados para o SR 1.1 (Identificação e Autenticação), segmentação de zonas e condutos (SR 5.1).',
      categoria: 'Técnico'
    },
    {
      framework: 'NIST_CSF',
      codigo: 'PR.AC-3',
      titulo: 'Access Control Management',
      descricao: 'Controle de acesso lógico ao ativos de rede e sistemas baseados em privilégios mínimos.',
      categoria: 'Proteção'
    }
  ]

  for (const req of requirements) {
    try {
      await RAGService.adicionarRegra(
        req.framework as any,
        req.codigo,
        req.titulo,
        req.descricao,
        req.categoria
      )
    } catch (e) {
      console.log(`Regra ${req.codigo} já existe ou erro na vetorização.`)
    }
  }

  console.log('Seed completed successfully')
  console.log('📊 Summary:');
  console.log(`   - Tenants: 1`);
  console.log(`   - Organizações: 2`);
  console.log(`   - Empresas: ${empresas.length}`);
  console.log(`   - Sites: ${sites.length}`);
  console.log(`   - Projetos: ${projetos.length}`);
  console.log(`   - Descrições Raw: ${descricoes.length}`);
  console.log(`   - Processos Normalizados: ${processosNorm.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
