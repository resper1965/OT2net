import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

/**
 * Middleware de tratamento de erros
 * Captura erros e retorna resposta JSON padronizada
 */
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Erro interno do servidor'

  // Log do erro
  logger.error(
    {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      path: req.path,
      method: req.method,
      statusCode,
    },
    'Request error'
  )

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
      }),
    },
  })
}

/**
 * Wrapper para rotas assíncronas
 * Captura erros de promises rejeitadas automaticamente
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * Classe de erro customizada
 */
export class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

