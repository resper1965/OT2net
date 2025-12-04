import { Request, Response, NextFunction } from 'express'
import { verifySupabaseToken } from '@/lib/supabase'

/**
 * Middleware de autenticação para rotas do Express
 * Verifica token JWT do Supabase e adiciona dados do usuário ao request
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Extrair token do header Authorization
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token não fornecido',
        message: 'Authorization header deve conter: Bearer <token>',
      })
    }

    const token = authHeader.replace('Bearer ', '')

    // Verificar token com Supabase
    const user = await verifySupabaseToken(token)

    if (!user) {
      return res.status(401).json({
        error: 'Token inválido ou expirado',
        message: 'Faça login novamente',
      })
    }

    // Adicionar dados do usuário ao request
    ;(req as any).user = user
    ;(req as any).userId = user.id

    next()
  } catch (error) {
    console.error('Erro na autenticação:', error)
    return res.status(500).json({
      error: 'Erro interno na autenticação',
      message: 'Tente novamente mais tarde',
    })
  }
}

/**
 * Middleware opcional de autenticação
 * Não retorna erro se não houver token, apenas adiciona user se existir
 */
export async function optionalAuthenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')
      const user = await verifySupabaseToken(token)

      if (user) {
        ;(req as any).user = user
        ;(req as any).userId = user.id
      }
    }

    next()
  } catch (error) {
    // Em caso de erro, continua sem autenticação
    next()
  }
}

/**
 * Alias para compatibilidade com rotas existentes
 */
export const authenticateToken = authenticate

