import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { logger } from '../utils/logger'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/errorHandler'

/**
 * Serviço de integração com Google Gemini AI
 */
export class GeminiService {
  private static genAI: GoogleGenerativeAI
  private static modelPro: GenerativeModel
  private static modelFlash: GenerativeModel
  private static embeddingModel: GenerativeModel

  private static initialize() {
    if (!this.genAI) {
      if (!process.env.GEMINI_API_KEY) {
        logger.warn('GEMINI_API_KEY não configurada')
        throw new AppError('GEMINI_API_KEY não configurada', 500)
      }
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
      this.modelPro = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })
      this.modelFlash = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      this.embeddingModel = this.genAI.getGenerativeModel({ model: 'text-embedding-004' })
    }
  }

  /**
   * Envia mensagem para Gemini API
   * @param prompt Prompt do usuário
   * @param systemInstruction Instrução de sistema (opcional)
   * @param useFlash Se true, usa modelo Flash (mais rápido/barato). Se false, usa Pro. Default: false
   * @param jsonMode Se true, força resposta em JSON. Default: false
   */
  static async sendMessage(
    prompt: string,
    options?: {
      systemInstruction?: string
      useFlash?: boolean
      jsonMode?: boolean
      temperature?: number
    }
  ) {
    this.initialize()

    const modelParams: any = {}
    if (options?.systemInstruction) {
        modelParams.systemInstruction = options.systemInstruction
    }

    // Configurar generation config
    const generationConfig: any = {
      temperature: options?.temperature ?? 0.7,
    }

    if (options?.jsonMode) {
      generationConfig.responseMimeType = "application/json"
    }

    const model = options?.useFlash ? this.modelFlash : this.modelPro

    try {
      // Nota: o SDK pode não suportar systemInstruction na inicialização dependendo da versão, 
      // mas a API suporta. Se der erro, mover para o prompt.
      // Assumindo suporte na ^0.24.1
      
      // Temporário: Instanciar modelo com params para garantir systemInstruction
      const specificModel = this.genAI.getGenerativeModel({
        model: options?.useFlash ? 'gemini-1.5-flash' : 'gemini-1.5-pro',
        systemInstruction: options?.systemInstruction,
        generationConfig
      })

      const result = await specificModel.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Log usage if available (Gemini response meta might have it)
      const usage = response.usageMetadata
      if (usage) {
        logger.info(
            { 
              inputTokens: usage.promptTokenCount, 
              outputTokens: usage.candidatesTokenCount,
              model: options?.useFlash ? 'flash' : 'pro'
            }, 
            'Chamada Gemini realizada'
        )
        
        // Registrar no banco (Assíncrono)
        this.logCall(
            'gemini_generation', 
            usage.promptTokenCount, 
            usage.candidatesTokenCount, 
            true
        )
      }

      return {
        content: text,
        usage
      }

    } catch (error: any) {
      const errorMessage = error.message || 'Erro desconhecido na chamada Gemini'
      logger.error({ error: errorMessage }, 'Erro Gemini API')
      
      this.logCall('gemini_generation', 0, 0, false, errorMessage)

      throw new AppError(`Erro Gemini: ${errorMessage}`, 500)
    }
  }

  /**
   * Gera embedding para texto
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    this.initialize()
    
    try {
        const result = await this.embeddingModel.embedContent(text)
        const embedding = result.embedding.values
        return embedding
    } catch (error: any) {
        const errorMessage = error.message
        logger.error({ error: errorMessage }, 'Erro ao gerar embedding Gemini')
        throw new AppError(`Erro Embedding: ${errorMessage}`, 500)
    }
  }

  /**
   * Registra chamada no banco (placeholder para manter compatibilidade com logica anterior)
   */
  private static async logCall(
    funcionalidade: string,
    inputTokens: number,
    outputTokens: number,
    sucesso: boolean,
    erro?: string
  ) {
    try {
        // Custo estimado (muito baixo no Gemini, mas mantendo a estrutura)
        // Flash: $0.075/1M input, $0.30/1M output
        // Pro: $3.50/1M input, $10.50/1M output
        // Simplificação: usando custo zero ou implementação futura
        const custo = 0 

        await prisma.chamadaIA.create({
            data: {
                funcionalidade,
                tokens_input: inputTokens,
                tokens_output: outputTokens,
                custo,
                sucesso,
                erro: erro || null
            }
        })
    } catch (e) {
        logger.warn('Falha ao registrar log de IA')
    }
  }
}
