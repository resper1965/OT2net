import { Request, Response, NextFunction } from 'express'
import { firebaseAuth } from '@/lib/firebase'

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

    // Verificar token com Firebase Auth
    const decodedToken = await firebaseAuth.verifyIdToken(token)

    if (!decodedToken) {
      return res.status(401).json({
        error: 'Token inválido ou expirado',
        message: 'Faça login novamente',
      })
    }

    // Adicionar dados do usuário ao request
    // Estrutura customizada com tenant_id e role
    ;(req as any).user = {
        id: decodedToken.uid,
        email: decodedToken.email,
        tenant_id: decodedToken.tenant_id, // Custom claim
        role: decodedToken.role // Custom claim
    }
    ;(req as any).userId = decodedToken.uid

    next()
  } catch (error) {
    console.error('Erro na autenticação:', error)
    return res.status(401).json({
      error: 'Falha na autenticação',
      message: 'Token inválido',
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
      try {
        const decodedToken = await firebaseAuth.verifyIdToken(token)

        if (decodedToken) {
          ;(req as any).user = {
            id: decodedToken.uid,
            email: decodedToken.email,
            tenant_id: decodedToken.tenant_id,
            role: decodedToken.role
          }
          ;(req as any).userId = decodedToken.uid
        }
      } catch (e) {
        // Ignora erro se token inválido no opcional
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

