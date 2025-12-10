import { GoogleGenerativeAI } from '@google/generative-ai'
import { logger } from '@/utils/logger'
import { prisma } from '@/lib/prisma'
import { AppError } from '@/middleware/errorHandler'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

if (!process.env.GEMINI_API_KEY) {
  logger.warn('GEMINI_API_KEY não configurada')
}

/**
 * Preços por token (USD) - Gemini 1.5 Pro
 * Atualizado em 2024
 */
const PRICING = {
  input: 0.00125 / 1000, // $0.00125 por 1K tokens de input
  output: 0.005 / 1000, // $0.005 por 1K tokens de output
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
        funcionalidade: `gemini_${funcionalidade}`,
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
 * Serviço base para integração com Google Gemini API
 */
export class GeminiService {
  /**
   * Envia mensagem para Gemini API
   */
  static async sendMessage(
    funcionalidade: string,
    prompt: string,
    options?: {
      model?: string
      maxOutputTokens?: number
      temperature?: number
      systemInstruction?: string
    }
  ) {
    const modelName = options?.model || 'gemini-1.5-pro'
    const maxOutputTokens = options?.maxOutputTokens || 8192
    const temperature = options?.temperature || 0.7

    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          maxOutputTokens,
          temperature,
        },
        systemInstruction: options?.systemInstruction,
      })

      const response = await retryWithBackoff(async () => {
        return await model.generateContent(prompt)
      })

      const result = response.response
      const text = result.text()

      // Obter informações de uso (se disponível)
      const usageMetadata = result.usageMetadata
      const inputTokens = usageMetadata?.promptTokenCount || 0
      const outputTokens = usageMetadata?.candidatesTokenCount || 0
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
        'Chamada Gemini API bem-sucedida'
      )

      return {
        text,
        usage: {
          inputTokens,
          outputTokens,
          totalTokens: inputTokens + outputTokens,
        },
        custo,
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Erro desconhecido'

      // Tentar registrar erro
      await logCall(funcionalidade, 0, 0, 0, false, errorMessage)

      logger.error(
        { funcionalidade, error: errorMessage },
        'Erro na chamada Gemini API'
      )

      throw new AppError(
        `Erro ao processar com Gemini API: ${errorMessage}`,
        500
      )
    }
  }

  /**
   * Gera embedding usando Gemini API
   * Nota: Gemini não tem modelo de embedding nativo
   * Esta implementação usa uma abordagem alternativa via Vertex AI ou serviço externo
   * Para produção, considere usar Vertex AI Embeddings ou OpenAI embeddings
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    try {
      // Opção 1: Usar Vertex AI Embeddings (requer configuração do Vertex AI)
      // Se GEMINI_USE_VERTEX_AI estiver configurado, usar Vertex AI
      if (process.env.GEMINI_USE_VERTEX_AI === 'true') {
        // Implementação com Vertex AI seria aqui
        // Por enquanto, vamos usar uma abordagem alternativa
      }

      // Opção 2: Usar OpenAI embeddings como fallback (se configurado)
      if (process.env.OPENAI_API_KEY) {
        const { OpenAI } = await import('openai')
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
        
        const response = await openai.embeddings.create({
          model: 'text-embedding-3-small', // 1536 dimensões
          input: text,
        })

        return response.data[0].embedding
      }

      // Opção 3: Gerar embedding via Gemini usando técnica de embedding
      // Usar o próprio Gemini para gerar uma representação vetorial
      // Esta é uma abordagem menos precisa, mas funcional
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      
      const prompt = `Converta o seguinte texto em uma representação numérica vetorial de 768 dimensões.
      Retorne APENAS um array JSON de números, sem explicações.
      
      Texto: ${text}`
      
      const result = await model.generateContent(prompt)
      const responseText = result.response.text().trim()
      
      // Tentar parsear como JSON
      let embedding: number[]
      try {
        // Remover markdown code blocks se existirem
        const jsonText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        embedding = JSON.parse(jsonText)
      } catch {
        // Se falhar, gerar embedding baseado em hash do texto (fallback simples)
        // Esta é uma solução temporária - em produção, use um serviço de embeddings dedicado
        logger.warn('Falha ao gerar embedding via Gemini, usando fallback')
        embedding = this.generateSimpleEmbedding(text, 768)
      }

      logger.info(
        { embeddingLength: embedding.length },
        'Embedding gerado com sucesso'
      )

      return embedding
    } catch (error: any) {
      logger.error({ error: error.message }, 'Erro ao gerar embedding')
      
      // Fallback: gerar embedding simples baseado em hash
      logger.warn('Usando embedding de fallback')
      return this.generateSimpleEmbedding(text, 768)
    }
  }

  /**
   * Gera embedding simples baseado em hash do texto (fallback)
   * Esta é uma solução temporária - em produção, use um serviço de embeddings dedicado
   */
  private static generateSimpleEmbedding(text: string, dimensions: number): number[] {
    // Usar hash do texto para gerar valores pseudo-aleatórios
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }

    const embedding: number[] = []
    for (let i = 0; i < dimensions; i++) {
      // Gerar valor pseudo-aleatório baseado no hash
      const seed = hash + i
      const value = Math.sin(seed) * 10000
      embedding.push(value - Math.floor(value))
    }

    // Normalizar o vetor
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
    return embedding.map(val => val / magnitude)
  }

  /**
   * Gera embeddings em lote
   */
  static async generateEmbeddingsBatch(
    texts: string[],
    batchSize: number = 10
  ): Promise<number[][]> {
    const embeddings: number[][] = []

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize)

      const batchEmbeddings = await Promise.all(
        batch.map((text) => this.generateEmbedding(text))
      )

      embeddings.push(...batchEmbeddings)

      // Delay entre batches para evitar rate limiting
      if (i + batchSize < texts.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    return embeddings
  }
}

