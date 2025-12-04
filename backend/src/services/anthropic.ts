import Anthropic from '@anthropic-ai/sdk'
import { logger } from '@/utils/logger'
import { prisma } from '@/lib/prisma'
import { AppError } from '@/middleware/errorHandler'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

if (!process.env.ANTHROPIC_API_KEY) {
  logger.warn('ANTHROPIC_API_KEY não configurada')
}

/**
 * Preços por token (USD) - Claude 3.5 Sonnet
 * Atualizado em 2024
 */
const PRICING = {
  input: 0.003 / 1000, // $0.003 por 1K tokens de input
  output: 0.015 / 1000, // $0.015 por 1K tokens de output
}

/**
 * Calcula custo de uma chamada à API
 */
function calculateCost(inputTokens: number, outputTokens: number): number {
  const inputCost = inputTokens * PRICING.input
  const outputCost = outputTokens * PRICING.output
  return inputCost + outputCost
}

/**
 * Registra chamada à API no banco de dados
 */
async function logCall(
  funcionalidade: string,
  inputTokens: number,
  outputTokens: number,
  custo: number,
  sucesso: boolean,
  erro?: string
) {
  try {
    await prisma.chamadaIA.create({
      data: {
        funcionalidade,
        tokens_input: inputTokens,
        tokens_output: outputTokens,
        custo,
        sucesso,
        erro: erro || null,
      },
    })
  } catch (error) {
    logger.error({ error }, 'Erro ao registrar chamada IA')
  }
}

/**
 * Retry logic com exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error

      // Não fazer retry em erros 4xx (client errors)
      if (error.status >= 400 && error.status < 500) {
        throw error
      }

      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt)
        logger.warn(
          { attempt: attempt + 1, delay, error: error.message },
          'Retry após erro'
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error('Erro desconhecido após retries')
}

/**
 * Serviço base para integração com Claude API
 */
export class AnthropicService {
  /**
   * Envia mensagem para Claude API
   */
  static async sendMessage(
    funcionalidade: string,
    messages: Anthropic.MessageParam[],
    options?: {
      model?: string
      maxTokens?: number
      temperature?: number
      system?: string
    }
  ) {
    const model = options?.model || 'claude-3-5-sonnet-20241022'
    const maxTokens = options?.maxTokens || 4096
    const temperature = options?.temperature || 0.7

    try {
      const response = await retryWithBackoff(async () => {
        return await anthropic.messages.create({
          model,
          max_tokens: maxTokens,
          temperature,
          system: options?.system,
          messages,
        })
      })

      const inputTokens = response.usage.input_tokens
      const outputTokens = response.usage.output_tokens
      const custo = calculateCost(inputTokens, outputTokens)

      // Registrar chamada
      await logCall(funcionalidade, inputTokens, outputTokens, custo, true)

      logger.info(
        {
          funcionalidade,
          inputTokens,
          outputTokens,
          custo,
        },
        'Chamada Claude API bem-sucedida'
      )

      return {
        content: response.content,
        usage: response.usage,
        custo,
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Erro desconhecido'
      
      // Tentar registrar erro (com tokens estimados)
      await logCall(
        funcionalidade,
        0,
        0,
        0,
        false,
        errorMessage
      )

      logger.error(
        { funcionalidade, error: errorMessage },
        'Erro na chamada Claude API'
      )

      throw new AppError(
        `Erro ao processar com Claude API: ${errorMessage}`,
        500
      )
    }
  }

  /**
   * Gera embedding usando Claude API
   * Nota: Claude não tem endpoint de embeddings nativo
   * Esta função pode ser usada para gerar embeddings via texto
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    // Claude não tem endpoint de embeddings direto
    // Em produção, usar serviço de embeddings dedicado ou
    // processar texto para gerar representação vetorial
    throw new AppError(
      'Embeddings devem ser gerados via serviço dedicado (ex: OpenAI, Cohere)',
      501
    )
  }
}

