import { GeminiService } from './gemini'
import { VertexSearchService } from './vertex-search'
import { prisma } from '../lib/prisma'
import { logger } from '../utils/logger'
import { AppError } from '../middleware/errorHandler'

/**
 * Serviço de vetorização e busca semântica
 * Usa pgvector para armazenar embeddings e busca por similaridade
 */
export class VectorService {
  /**
  /**
   * Gera embedding usando Vertex AI (Gecko)
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    return await GeminiService.generateEmbedding(text)
  }

  /**
   * Vetoriza um requisito de framework e salva no banco
   */
  static async vectorizeRequisito(
    requisitoId: string,
    texto: string,
    tenantId: string | null = null // Default null para compatibilidade, ideal ser obrigatório
  ): Promise<void> {
    try {
      // Gerar embedding usando Gemini
      const embedding = await GeminiService.generateEmbedding(texto)

      // 1. Atualizar Postgres (Persistence + Fallback)
      // Mesmo usando Vertex, guardamos o vetor no banco se coluna existir, ou apenas metadados
      await prisma.$executeRaw`
        UPDATE requisitos_framework
        SET embedding = ${embedding}::vector,
            data_vetorizacao = NOW()
        WHERE id = ${requisitoId}::uuid
      `

      // 2. Indexar no Vertex AI (Busca Performática Multitenant)
      await VertexSearchService.upsertVector(
          requisitoId, 
          embedding,
          tenantId
      )

      logger.info({ requisitoId, tenantId }, 'Requisito vetorizado e indexado com sucesso')
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
    tenantId?: string | null // null para global
  ) {
    try {
      // Busca Vetorial no Vertex AI (Opção B)
      const vertexResults = await VertexSearchService.search(
        queryEmbedding,
        tenantId || null,
        limit
      )

      if (vertexResults.length === 0) {
        return []
      }

      // Hidratar resultados com dados do banco (Postgres)
      // Vertex retorna IDs, buscamos o conteúdo completo no DB
      const ids = vertexResults.map(r => r.id)
      
      const requisitos = await prisma.requisitoFramework.findMany({
        where: {
          id: { in: ids }
        },
        select: {
          id: true,
          framework: true,
          codigo: true,
          titulo: true,
          descricao: true,
          // embedding: false // carrega muito peso desnecessario
        }
      })

      // Mapear scores de similaridade do Vertex (se disponivel) ou reordenar
      const resultados = ids.map(id => {
          const req = requisitos.find(r => r.id === id)
          const vertexRes = vertexResults.find(r => r.id === id)
          if (!req) return null
          
          return {
              ...req,
              similaridade: vertexRes ? (1 - vertexRes.distancia) : 0 // Vertex geralmente retorna distância
          }
      }).filter(Boolean)

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
    texto: string,
    tenantId: string
  ) {
    try {
      // Gerar embedding do texto da entidade
      const embedding = await GeminiService.generateEmbedding(texto)

      // Buscar requisitos similares (Global ou do Tenant)
      const requisitosSimilares = await this.buscarRequisitosSimilares(
        embedding,
        20,
        0.6, // Threshold
        undefined,
        tenantId // Passando o tenantId
      )

      // Criar análises de conformidade
      const analises = await Promise.all(
        requisitosSimilares.map(async (requisito: any) => {
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
              tenant_id: tenantId,
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

