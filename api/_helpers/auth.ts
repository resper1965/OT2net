import { VercelRequest } from '@vercel/node'
import { verifySupabaseToken } from './supabase'

export interface AuthenticatedRequest extends VercelRequest {
  user?: any
  userId?: string
}

/**
 * Middleware de autenticação para Vercel Serverless Functions
 */
export async function authenticate(req: AuthenticatedRequest) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Token não fornecido')
  }

  const token = authHeader.replace('Bearer ', '')
  const user = await verifySupabaseToken(token)

  if (!user) {
    throw new Error('Token inválido ou expirado')
  }

  req.user = user
  req.userId = user.id

  return user
}

