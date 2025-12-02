import { AnthropicService } from './anthropic'
import prisma from '@/lib/prisma'
import { logger } from '@/utils/logger'
import { AppError } from '@/middleware/errorHandler'

/**
 * Serviço de vetorização e busca semântica
 * Usa pgvector para armazenar embeddings e busca por similaridade
 */
export class VectorService {
  /**
   * Gera embedding usando Claude API
   * Nota: Claude não tem endpoint de embeddings nativo
   * Esta função usa uma abordagem alternativa ou delega para serviço de embeddings
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    // TODO: Implementar geração de embeddings
    // Opções:
    // 1. Usar OpenAI embeddings (text-embedding-3-large)
    // 2. Usar Cohere embeddings
    // 3. Usar serviço dedicado de embeddings
    
    throw new AppError(
      'Geração de embeddings ainda não implementada. Use serviço dedicado (OpenAI, Cohere, etc.)',
      501
    )
  }

  /**
   * Vetoriza um requisito de framework e salva no banco
   */
  static async vectorizeRequisito(
    requisitoId: string,
    texto: string
  ): Promise<void> {
    try {
      // Gerar embedding (quando implementado)
      const embedding = await this.generateEmbedding(texto)

      // Atualizar requisito com embedding
      await prisma.$executeRaw`
        UPDATE requisitos_framework
        SET embedding = ${embedding}::vector,
            data_vetorizacao = NOW()
        WHERE id = ${requisitoId}::uuid
      `

      logger.info({ requisitoId }, 'Requisito vetorizado com sucesso')
    } catch (error: any) {
      logger.error({ requisitoId, error: error.message }, 'Erro ao vetorizar requisito')
      throw new AppError(`Erro ao vetorizar requisito: ${error.message}`, 500)
    }
  }

  /**
   * Busca requisitos similares usando busca semântica
   * @param queryEmbedding Embedding da query de busca
   * @param limit Número máximo de resultados
   * @param threshold Threshold mínimo de similaridade (0-1)
   */
  static async buscarRequisitosSimilares(
    queryEmbedding: number[],
    limit: number = 10,
    threshold: number = 0.7,
    framework?: string,
    tenantId?: string
  ) {
    try {
      // Usar função SQL do Supabase para busca semântica
      const resultados = await prisma.$queryRaw<Array<{
        id: string
        framework: string
        codigo: string
        titulo: string
        descricao: string
        similaridade: number
      }>>`
        SELECT 
          id,
          framework,
          codigo,
          titulo,
          descricao,
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
        { count: resultados.length, threshold },
        'Busca semântica de requisitos realizada'
      )

      return resultados
    } catch (error: any) {
      logger.error({ error: error.message }, 'Erro na busca semântica')
      throw new AppError(`Erro na busca semântica: ${error.message}`, 500)
    }
  }

  /**
   * Analisa conformidade de uma entidade com requisitos regulatórios
   * @param entidadeTipo Tipo da entidade (processo, controle, documento)
   * @param entidadeId ID da entidade
   * @param texto Texto da entidade para análise
   */
  static async analisarConformidade(
    entidadeTipo: string,
    entidadeId: string,
    texto: string
  ) {
    try {
      // Gerar embedding do texto da entidade
      const embedding = await this.generateEmbedding(texto)

      // Buscar requisitos similares
      const requisitosSimilares = await this.buscarRequisitosSimilares(
        embedding,
        20,
        0.6 // Threshold mais baixo para capturar mais requisitos
      )

      // Criar análises de conformidade
      const analises = await Promise.all(
        requisitosSimilares.map(async (requisito) => {
          // Determinar status baseado na similaridade
          let status = 'nao_atendido'
          if (requisito.similaridade >= 0.9) {
            status = 'atendido'
          } else if (requisito.similaridade >= 0.7) {
            status = 'parcialmente_atendido'
          }

          // Criar análise
          return await prisma.analiseConformidade.create({
            data: {
              requisito_id: requisito.id,
              entidade_tipo: entidadeTipo,
              entidade_id: entidadeId,
              similaridade: requisito.similaridade,
              status,
              analisado_por_ia: true,
            },
          })
        })
      )

      logger.info(
        { entidadeTipo, entidadeId, count: analises.length },
        'Análise de conformidade realizada'
      )

      return analises
    } catch (error: any) {
      logger.error(
        { entidadeTipo, entidadeId, error: error.message },
        'Erro na análise de conformidade'
      )
      throw new AppError(
        `Erro na análise de conformidade: ${error.message}`,
        500
      )
    }
  }

  /**
   * Processa vetorização em lote de requisitos
   */
  static async processarVetorizacaoEmLote(
    requisitos: Array<{ id: string; texto: string }>,
    batchSize: number = 10
  ) {
    const resultados = {
      sucesso: 0,
      erro: 0,
      erros: [] as Array<{ id: string; erro: string }>,
    }

    for (let i = 0; i < requisitos.length; i += batchSize) {
      const batch = requisitos.slice(i, i + batchSize)

      await Promise.allSettled(
        batch.map(async (requisito) => {
          try {
            await this.vectorizeRequisito(requisito.id, requisito.texto)
            resultados.sucesso++
          } catch (error: any) {
            resultados.erro++
            resultados.erros.push({
              id: requisito.id,
              erro: error.message,
            })
          }
        })
      )

      // Delay entre batches para evitar rate limiting
      if (i + batchSize < requisitos.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    logger.info(
      { sucesso: resultados.sucesso, erro: resultados.erro },
      'Vetorização em lote concluída'
    )

    return resultados
  }
}

