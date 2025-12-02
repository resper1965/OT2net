/**
 * Prisma Seed Script
 * 
 * Popula o banco de dados com dados iniciais para desenvolvimento e testes.
 * 
 * Executar com: npx tsx prisma/seed.ts
 * ou: npm run prisma:seed
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // ============================================
  // 1. Criar usuário administrador
  // ============================================
  console.log('📝 Criando usuário administrador...')
  
  const adminUser = await prisma.usuario.upsert({
    where: { email: 'admin@ot2net.com' },
    update: {},
    create: {
      email: 'admin@ot2net.com',
      nome: 'Administrador',
      perfil: 'Administrador',
      organizacao: 'OT2net',
      status: 'ativo',
    },
  })

  console.log('✅ Usuário admin criado:', adminUser.email)

  // ============================================
  // 2. Criar permissões básicas para admin
  // ============================================
  console.log('🔐 Criando permissões básicas...')

  const permissoes = [
    { entidade_tipo: 'cliente', acao: 'view' },
    { entidade_tipo: 'cliente', acao: 'create' },
    { entidade_tipo: 'cliente', acao: 'edit' },
    { entidade_tipo: 'cliente', acao: 'delete' },
    { entidade_tipo: 'projeto', acao: 'view' },
    { entidade_tipo: 'projeto', acao: 'create' },
    { entidade_tipo: 'projeto', acao: 'edit' },
    { entidade_tipo: 'projeto', acao: 'delete' },
    { entidade_tipo: 'processo', acao: 'view' },
    { entidade_tipo: 'processo', acao: 'create' },
    { entidade_tipo: 'processo', acao: 'edit' },
    { entidade_tipo: 'processo', acao: 'delete' },
    { entidade_tipo: 'questionario', acao: 'view' },
    { entidade_tipo: 'questionario', acao: 'create' },
    { entidade_tipo: 'questionario', acao: 'edit' },
    { entidade_tipo: 'questionario', acao: 'delete' },
    { entidade_tipo: 'usuario', acao: 'view' },
    { entidade_tipo: 'usuario', acao: 'create' },
    { entidade_tipo: 'usuario', acao: 'edit' },
    { entidade_tipo: 'usuario', acao: 'delete' },
  ]

  // Verificar se já existem permissões para evitar duplicatas
  const permissoesExistentes = await prisma.permissao.findMany({
    where: { usuario_id: adminUser.id },
  })

  const permissoesParaCriar = permissoes.filter(
    (p) =>
      !permissoesExistentes.some(
        (ep) => ep.entidade_tipo === p.entidade_tipo && ep.acao === p.acao
      )
  )

  if (permissoesParaCriar.length > 0) {
    await prisma.permissao.createMany({
      data: permissoesParaCriar.map((p) => ({
        usuario_id: adminUser.id,
        entidade_tipo: p.entidade_tipo,
        acao: p.acao,
      })),
    })
  }

  console.log(`✅ ${permissoes.length} permissões criadas para admin`)

  // ============================================
  // 3. Criar cliente de exemplo
  // ============================================
  console.log('🏢 Criando cliente de exemplo...')

  const clienteExemplo = await prisma.cliente.upsert({
    where: { cnpj: '12345678000190' },
    update: {},
    create: {
      razao_social: 'Empresa Exemplo Ltda',
      cnpj: '12345678000190',
      endereco: {
        logradouro: 'Rua Exemplo, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
      },
      contatos: {
        telefone: '(11) 1234-5678',
        email: 'contato@exemplo.com',
      },
      classificacao: 'Distribuidora de Energia',
      agencias_reguladoras: ['ANEEL'],
      certificacoes: [],
    },
  })

  console.log('✅ Cliente de exemplo criado:', clienteExemplo.razao_social)

  // ============================================
  // 4. Criar empresa de exemplo
  // ============================================
  console.log('🏭 Criando empresa de exemplo...')

  // Verificar se já existe
  let empresaExemplo = await prisma.empresa.findFirst({
    where: { cliente_id: clienteExemplo.id, identificacao: 'Empresa Exemplo - Matriz' },
  })

  if (!empresaExemplo) {
    empresaExemplo = await prisma.empresa.create({
      data: {
        cliente_id: clienteExemplo.id,
        identificacao: 'Empresa Exemplo - Matriz',
        tipo: 'Matriz',
        status: 'ativo',
        ambito_operacional: 'Geração e Distribuição',
      },
    })
  }

  console.log('✅ Empresa de exemplo criada:', empresaExemplo.identificacao)

  // ============================================
  // 5. Criar site de exemplo
  // ============================================
  console.log('📍 Criando site de exemplo...')

  let siteExemplo = await prisma.site.findFirst({
    where: { empresa_id: empresaExemplo.id, identificacao: 'Subestação Exemplo' },
  })

  if (!siteExemplo) {
    siteExemplo = await prisma.site.create({
      data: {
        empresa_id: empresaExemplo.id,
        identificacao: 'Subestação Exemplo',
        classificacao: 'Subestação de Transmissão',
        criticidade_operacional: 'Alta',
        localizacao_geografica: {
          latitude: -23.5505,
          longitude: -46.6333,
          endereco: 'Rua Exemplo, 456',
          cidade: 'São Paulo',
          estado: 'SP',
        },
        sistemas_principais: ['SCADA', 'Sistema de Proteção'],
      },
    })
  }

  console.log('✅ Site de exemplo criado:', siteExemplo.identificacao)

  // ============================================
  // 6. Criar projeto de exemplo
  // ============================================
  console.log('📊 Criando projeto de exemplo...')

  let projetoExemplo = await prisma.projeto.findFirst({
    where: {
      cliente_id: clienteExemplo.id,
      nome: 'Projeto de Governança e Segurança TO - Exemplo',
    },
  })

  if (!projetoExemplo) {
    projetoExemplo = await prisma.projeto.create({
      data: {
        cliente_id: clienteExemplo.id,
        nome: 'Projeto de Governança e Segurança TO - Exemplo',
        descricao: 'Projeto piloto para demonstração da plataforma',
        fase_atual: 'fase-0',
        progresso_geral: 0,
      },
    })
  }

  console.log('✅ Projeto de exemplo criado:', projetoExemplo.nome)

  // ============================================
  // 7. Criar membro da equipe (admin no projeto)
  // ============================================
  console.log('👥 Criando membro da equipe...')

  let membroEquipe = await prisma.membroEquipe.findFirst({
    where: {
      projeto_id: projetoExemplo.id,
      usuario_id: adminUser.id,
    },
  })

  if (!membroEquipe) {
    membroEquipe = await prisma.membroEquipe.create({
      data: {
        projeto_id: projetoExemplo.id,
        usuario_id: adminUser.id,
        papel: 'Consultor Líder',
        responsabilidade: 'Responsável',
        autoridade: 'Responsável',
        consultado: 'Responsável',
        informado: 'Responsável',
      },
    })
  }

  console.log('✅ Membro da equipe criado')

  // ============================================
  // 8. Criar indicadores de exemplo
  // ============================================
  console.log('📈 Criando indicadores de exemplo...')

  const indicadores = [
    {
      dominio_governanca: 'Governança',
      tipo: 'KPI',
      nome: 'Taxa de Conformidade com REN 964/21',
      formula: '(Requisitos Atendidos / Total de Requisitos) * 100',
      fonte_dados: 'Análise de Conformidade',
      baseline: 0,
      target: 100,
      threshold_verde: 90,
      threshold_amarelo: 70,
      threshold_vermelho: 50,
    },
    {
      dominio_governanca: 'Segurança',
      tipo: 'KRI',
      nome: 'Número de Incidentes de Segurança',
      formula: 'COUNT(Incidentes)',
      fonte_dados: 'Sistema de Gestão de Incidentes',
      baseline: 0,
      target: 0,
      threshold_verde: 0,
      threshold_amarelo: 1,
      threshold_vermelho: 3,
    },
  ]

  for (const indicador of indicadores) {
    const existe = await prisma.indicador.findFirst({
      where: {
        dominio_governanca: indicador.dominio_governanca,
        nome: indicador.nome,
      },
    })

    if (!existe) {
      await prisma.indicador.create({
        data: indicador,
      })
    }
  }

  console.log(`✅ ${indicadores.length} indicadores criados`)

  console.log('\n🎉 Seed concluído com sucesso!')
  console.log('\n📋 Resumo:')
  console.log(`   - 1 usuário admin (${adminUser.email})`)
  console.log(`   - ${permissoes.length} permissões`)
  console.log(`   - 1 cliente de exemplo`)
  console.log(`   - 1 empresa de exemplo`)
  console.log(`   - 1 site de exemplo`)
  console.log(`   - 1 projeto de exemplo`)
  console.log(`   - 1 membro da equipe`)
  console.log(`   - ${indicadores.length} indicadores`)
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

