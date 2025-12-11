import { GeminiService } from './gemini'
import { prisma } from '../lib/prisma'
import { logger } from '../utils/logger'
import { AppError } from '../middleware/errorHandler'

/**
 * Serviço de RAG (Retrieval-Augmented Generation) para regras regulatórias
 * Especializado em regras da ANEEL, ONS sobre redes operativas e normas BPMN 2.0
 */
export type FrameworkType = 'ANEEL' | 'ONS' | 'BPMN'

export class RAGService {
  /**
   * Busca regras similares usando busca semântica
   */
  static async buscarRegrasSimilares(
    query: string,
    options?: {
      framework?: FrameworkType
      limit?: number
      threshold?: number
    }
  ) {
    try {
      // Gerar embedding da query
      const queryEmbedding = await GeminiService.generateEmbedding(query)

      const limit = options?.limit || 10
      const threshold = options?.threshold || 0.7
      const framework = options?.framework

      // Buscar requisitos similares usando pgvector
      const resultados = await prisma.$queryRaw<Array<{
        id: string
        framework: string
        codigo: string
        titulo: string
        descricao: string
        categoria: string | null
        similaridade: number
      }>>`
        SELECT 
          id,
          framework,
          codigo,
          titulo,
          descricao,
          categoria,
          1 - (embedding <=> ${queryEmbedding}::vector) as similaridade
        FROM requisitos_framework
        WHERE 
          embedding IS NOT NULL
          AND (1 - (embedding <=> ${queryEmbedding}::vector)) >= ${threshold}
          ${framework ? prisma.$queryRaw`AND framework = ${framework}` : prisma.$queryRaw``}
        ORDER BY embedding <=> ${queryEmbedding}::vector
        LIMIT ${limit}
      `

      logger.info(
        { count: resultados.length, threshold, framework },
        'Busca semântica de regras realizada'
      )

      return resultados
    } catch (error: any) {
      logger.error({ error: error.message }, 'Erro na busca semântica de regras')
      throw new AppError(`Erro na busca semântica: ${error.message}`, 500)
    }
  }

  /**
   * Consulta regras regulatórias usando RAG com Gemini
   * Retorna resposta contextualizada baseada nas regras encontradas
   */
  static async consultarRegras(
    pergunta: string,
    options?: {
      framework?: FrameworkType
      maxRegras?: number
      includeContext?: boolean
    }
  ) {
    try {
      // Buscar regras similares
      const regrasSimilares = await this.buscarRegrasSimilares(pergunta, {
        framework: options?.framework,
        limit: options?.maxRegras || 5,
        threshold: 0.6, // Threshold mais baixo para capturar mais contexto
      })

      if (regrasSimilares.length === 0) {
        return {
          resposta: 'Não foram encontradas regras regulatórias relevantes para sua consulta.',
          regrasEncontradas: [],
          contexto: null,
        }
      }

      // Construir contexto com as regras encontradas
      const contexto = regrasSimilares
        .map(
          (regra) => `
**${regra.framework} - ${regra.codigo}: ${regra.titulo}**
${regra.descricao}
${regra.categoria ? `Categoria: ${regra.categoria}` : ''}
Similaridade: ${(regra.similaridade * 100).toFixed(1)}%
`
        )
        .join('\n\n---\n\n')

      // Construir prompt para Gemini baseado no framework
      const frameworkContext = regrasSimilares[0]?.framework || options?.framework || 'GERAL'
      
      let systemInstruction = ''
      if (frameworkContext === 'BPMN') {
        systemInstruction = `Você é um especialista em BPMN 2.0 (Business Process Model and Notation 2.0), o padrão internacional para modelagem de processos de negócio.

Sua função é responder perguntas sobre normas e especificações BPMN 2.0 relacionadas a:
- Elementos de modelagem (atividades, eventos, gateways, fluxos)
- Notação e símbolos BPMN
- Padrões de modelagem e boas práticas
- Semântica e execução de processos
- Conformidade com a especificação BPMN 2.0

Use APENAS as normas fornecidas no contexto para responder. Se a pergunta não estiver relacionada às normas fornecidas, informe isso claramente.

Seja preciso, cite os códigos/seções das normas quando relevante, e forneça respostas práticas e acionáveis com exemplos quando apropriado.`
      } else {
        systemInstruction = `Você é um especialista em regulações da ANEEL (Agência Nacional de Energia Elétrica) e ONS (Operador Nacional do Sistema Elétrico) sobre redes operativas.

Sua função é responder perguntas sobre regras regulatórias relacionadas a:
- Redes operativas de energia elétrica
- Requisitos de segurança e operação
- Normas técnicas e procedimentos
- Conformidade regulatória

Use APENAS as regras fornecidas no contexto para responder. Se a pergunta não estiver relacionada às regras fornecidas, informe isso claramente.

Seja preciso, cite os códigos das regras quando relevante, e forneça respostas práticas e acionáveis.`
      }

      const prompt = `Com base nas seguintes regras regulatórias, responda à pergunta do usuário:

${contexto}

---

Pergunta do usuário: ${pergunta}

Forneça uma resposta clara e precisa, citando as regras relevantes quando apropriado.`

      // Chamar Gemini para gerar resposta contextualizada
      // Chamar Gemini para gerar resposta contextualizada
      const resposta = await GeminiService.sendMessage(
        prompt,
        {
          systemInstruction,
          temperature: 0.3, // Menor temperatura para respostas mais precisas
        }
      )

      return {
        resposta: resposta.content,
        regrasEncontradas: regrasSimilares.map((r) => ({
          id: r.id,
          framework: r.framework,
          codigo: r.codigo,
          titulo: r.titulo,
          similaridade: r.similaridade,
        })),
        contexto: options?.includeContext ? contexto : null,
      }
    } catch (error: any) {
      logger.error({ error: error.message }, 'Erro ao consultar regras via RAG')
      throw new AppError(`Erro ao consultar regras: ${error.message}`, 500)
    }
  }

  /**
   * Vetoriza e salva uma regra regulatória ou norma no banco
   */
  static async adicionarRegra(
    framework: FrameworkType,
    codigo: string,
    titulo: string,
    descricao: string,
    categoria?: string,
    versao?: string
  ) {
    try {
      // Verificar se já existe
      const existente = await prisma.requisitoFramework.findFirst({
        where: {
          framework,
          codigo,
        },
      })

      if (existente) {
        throw new AppError(
          `Regra ${framework} ${codigo} já existe`,
          409
        )
      }

      // Gerar embedding
      const textoCompleto = `${titulo}\n\n${descricao}`
      const embedding = await GeminiService.generateEmbedding(textoCompleto)

      // Criar requisito usando Prisma
      // @ts-ignore
      const requisito = await prisma.requisitoFramework.create({
        data: {
          framework,
          codigo,
          titulo,
          descricao,
          categoria: categoria || null,
          versao: versao || null,
          data_vetorizacao: new Date(),
        },
      })

      // Atualizar embedding usando SQL raw (pgvector requer SQL direto)
      await prisma.$executeRaw`
        UPDATE requisitos_framework
        SET embedding = ${embedding}::vector
        WHERE id = ${requisito.id}::uuid
      `

      logger.info(
        { framework, codigo, requisitoId: requisito.id },
        'Regra adicionada e vetorizada com sucesso'
      )

      return requisito
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }
      logger.error(
        { framework, codigo, error: error.message },
        'Erro ao adicionar regra'
      )
      throw new AppError(`Erro ao adicionar regra: ${error.message}`, 500)
    }
  }

  /**
   * Atualiza embedding de uma regra existente
   */
  static async reVetorizarRegra(requisitoId: string) {
    try {
      const requisito = await prisma.requisitoFramework.findUnique({
        where: { id: requisitoId },
      })

      if (!requisito) {
        throw new AppError('Requisito não encontrado', 404)
      }

      // Gerar novo embedding
      const textoCompleto = `${requisito.titulo}\n\n${requisito.descricao}`
      const embedding = await GeminiService.generateEmbedding(textoCompleto)

      // Atualizar embedding
      await prisma.$executeRaw`
        UPDATE requisitos_framework
        SET embedding = ${embedding}::vector,
            data_vetorizacao = NOW()
        WHERE id = ${requisitoId}::uuid
      `

      logger.info({ requisitoId }, 'Regra re-vetorizada com sucesso')
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }
      logger.error(
        { requisitoId, error: error.message },
        'Erro ao re-vetorizar regra'
      )
      throw new AppError(`Erro ao re-vetorizar regra: ${error.message}`, 500)
    }
  }

  /**
   * Processa e vetoriza regras em lote
   */
  static async processarRegrasEmLote(
    regras: Array<{
      framework: FrameworkType
      codigo: string
      titulo: string
      descricao: string
      categoria?: string
      versao?: string
    }>,
    batchSize: number = 5
  ) {
    const resultados = {
      sucesso: 0,
      erro: 0,
      erros: [] as Array<{ codigo: string; erro: string }>,
    }

    for (let i = 0; i < regras.length; i += batchSize) {
      const batch = regras.slice(i, i + batchSize)

      await Promise.allSettled(
        batch.map(async (regra) => {
          try {
            await this.adicionarRegra(
              regra.framework,
              regra.codigo,
              regra.titulo,
              regra.descricao,
              regra.categoria,
              regra.versao
            )
            resultados.sucesso++
          } catch (error: any) {
            resultados.erro++
            resultados.erros.push({
              codigo: regra.codigo,
              erro: error.message,
            })
          }
        })
      )

      // Delay entre batches para evitar rate limiting
      if (i + batchSize < regras.length) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    logger.info(
      { sucesso: resultados.sucesso, erro: resultados.erro },
      'Processamento em lote de regras concluído'
    )

    return resultados
  }

  /**
   * Lista regras por framework
   */
  static async listarRegras(
    framework?: FrameworkType,
    limit: number = 50,
    offset: number = 0
  ) {
    try {
      const regras = await prisma.requisitoFramework.findMany({
        where: framework ? { framework } : undefined,
        take: limit,
        skip: offset,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          framework: true,
          codigo: true,
          titulo: true,
          descricao: true,
          categoria: true,
          versao: true,
          data_vetorizacao: true,
          created_at: true,
        },
      })

      const total = await prisma.requisitoFramework.count({
        where: framework ? { framework } : undefined,
      })

      return {
        regras,
        total,
        limit,
        offset,
      }
    } catch (error: any) {
      logger.error({ error: error.message }, 'Erro ao listar regras')
      throw new AppError(`Erro ao listar regras: ${error.message}`, 500)
    }
  }
}

