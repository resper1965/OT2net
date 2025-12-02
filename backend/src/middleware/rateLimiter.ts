import { Request, Response, NextFunction } from 'express'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

/**
 * Rate limiter simples em memória
 * Em produção, usar Redis com biblioteca como express-rate-limit
 */
export function rateLimiter(
  windowMs: number = 15 * 60 * 1000, // 15 minutos
  maxRequests: number = 100 // 100 requisições por janela
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown'
    const now = Date.now()

    // Limpar entradas expiradas
    Object.keys(store).forEach((k) => {
      if (store[k].resetTime < now) {
        delete store[k]
      }
    })

    // Verificar ou criar entrada
    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      }
      return next()
    }

    // Incrementar contador
    store[key].count++

    // Verificar limite
    if (store[key].count > maxRequests) {
      const resetTime = new Date(store[key].resetTime).toISOString()
      return res.status(429).json({
        error: 'Muitas requisições',
        message: `Limite de ${maxRequests} requisições excedido. Tente novamente após ${resetTime}`,
        retryAfter: Math.ceil((store[key].resetTime - now) / 1000),
      })
    }

    // Adicionar headers de rate limit
    res.setHeader('X-RateLimit-Limit', maxRequests.toString())
    res.setHeader('X-RateLimit-Remaining', (maxRequests - store[key].count).toString())
    res.setHeader('X-RateLimit-Reset', new Date(store[key].resetTime).toISOString())

    next()
  }
}

