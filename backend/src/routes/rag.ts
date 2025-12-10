import { Router } from 'express'
import { authenticate } from '@/middleware/auth'
import { requirePermission } from '@/middleware/permissions'
import { RAGService, FrameworkType } from '@/services/rag-service'
import { AppError } from '@/middleware/errorHandler'
import { z } from 'zod'

const router = Router()

/**
 * Schema de validação para consulta de regras
 */
const consultaRegrasSchema = z.object({
  pergunta: z.string().min(10, 'A pergunta deve ter pelo menos 10 caracteres'),
  framework: z.enum(['ANEEL', 'ONS', 'BPMN']).optional(),
  maxRegras: z.number().int().min(1).max(20).optional(),
  includeContext: z.boolean().optional(),
})

/**
 * Schema de validação para adicionar regra
 */
const adicionarRegraSchema = z.object({
  framework: z.enum(['ANEEL', 'ONS', 'BPMN']),
  codigo: z.string().min(1, 'Código é obrigatório'),
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  categoria: z.string().optional(),
  versao: z.string().optional(),
})

/**
 * POST /api/rag/consultar
 * Consulta regras regulatórias usando RAG
 */
router.post(
  '/consultar',
  authenticate,
  requirePermission('requisito_framework', 'view'),
  async (req, res, next) => {
    try {
      const dados = consultaRegrasSchema.parse(req.body)

      const resultado = await RAGService.consultarRegras(dados.pergunta, {
        framework: dados.framework,
        maxRegras: dados.maxRegras,
        includeContext: dados.includeContext,
      })

      res.json({
        sucesso: true,
        dados: resultado,
      })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Dados inválidos',
          detalhes: error.errors,
        })
      }
      next(error)
    }
  }
)

/**
 * POST /api/rag/regras
 * Adiciona uma nova regra regulatória
 */
router.post(
  '/regras',
  authenticate,
  requirePermission('requisito_framework', 'create'),
  async (req, res, next) => {
    try {
      const dados = adicionarRegraSchema.parse(req.body)

      const requisito = await RAGService.adicionarRegra(
        dados.framework,
        dados.codigo,
        dados.titulo,
        dados.descricao,
        dados.categoria,
        dados.versao
      )

      res.status(201).json({
        sucesso: true,
        dados: requisito,
      })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Dados inválidos',
          detalhes: error.errors,
        })
      }
      if (error instanceof AppError && error.statusCode === 409) {
        return res.status(409).json({
          sucesso: false,
          erro: error.message,
        })
      }
      next(error)
    }
  }
)

/**
 * GET /api/rag/regras
 * Lista regras regulatórias
 */
router.get(
  '/regras',
  authenticate,
  requirePermission('requisito_framework', 'view'),
  async (req, res, next) => {
    try {
      const framework = req.query.framework as FrameworkType | undefined
      const limit = parseInt(req.query.limit as string) || 50
      const offset = parseInt(req.query.offset as string) || 0

      if (framework && !['ANEEL', 'ONS', 'BPMN'].includes(framework)) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Framework deve ser ANEEL, ONS ou BPMN',
        })
      }

      const resultado = await RAGService.listarRegras(framework, limit, offset)

      res.json({
        sucesso: true,
        dados: resultado,
      })
    } catch (error) {
      next(error)
    }
  }
)

/**
 * POST /api/rag/regras/:id/re-vetorizar
 * Re-vetoriza uma regra existente
 */
router.post(
  '/regras/:id/re-vetorizar',
  authenticate,
  requirePermission('requisito_framework', 'update'),
  async (req, res, next) => {
    try {
      const { id } = req.params

      await RAGService.reVetorizarRegra(id)

      res.json({
        sucesso: true,
        mensagem: 'Regra re-vetorizada com sucesso',
      })
    } catch (error) {
      next(error)
    }
  }
)

/**
 * POST /api/rag/regras/batch
 * Processa múltiplas regras em lote
 */
router.post(
  '/regras/batch',
  authenticate,
  requirePermission('requisito_framework', 'create'),
  async (req, res, next) => {
    try {
      const regras = z.array(adicionarRegraSchema).parse(req.body.regras)
      const batchSize = parseInt(req.body.batchSize as string) || 5

      const resultado = await RAGService.processarRegrasEmLote(regras, batchSize)

      res.json({
        sucesso: true,
        dados: resultado,
      })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Dados inválidos',
          detalhes: error.errors,
        })
      }
      next(error)
    }
  }
)

/**
 * GET /api/rag/buscar
 * Busca regras similares (sem RAG, apenas busca semântica)
 */
router.get(
  '/buscar',
  authenticate,
  requirePermission('requisito_framework', 'view'),
  async (req, res, next) => {
    try {
      const query = req.query.q as string
      const framework = req.query.framework as FrameworkType | undefined
      const limit = parseInt(req.query.limit as string) || 10
      const threshold = parseFloat(req.query.threshold as string) || 0.7

      if (!query || query.length < 3) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Query deve ter pelo menos 3 caracteres',
        })
      }

      if (framework && !['ANEEL', 'ONS', 'BPMN'].includes(framework)) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Framework deve ser ANEEL, ONS ou BPMN',
        })
      }

      const resultados = await RAGService.buscarRegrasSimilares(query, {
        framework,
        limit,
        threshold,
      })

      res.json({
        sucesso: true,
        dados: resultados,
      })
    } catch (error) {
      next(error)
    }
  }
)

export default router

