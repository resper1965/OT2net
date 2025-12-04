import { VercelRequest, VercelResponse } from '@vercel/node'
import { authenticate } from '../_helpers/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Tentar verificar autenticação, mas não bloquear se falhar
    try {
      await authenticate(req as any)
    } catch (authError) {
      // Se não autenticado, retornar lista vazia mesmo assim
      // (pode ser chamado por código externo)
      console.warn('Acesso não autenticado a /api/blog:', authError)
    }

    // Retornar lista vazia por enquanto
    // Esta rota pode ser implementada no futuro se necessário
    res.status(200).json({
      posts: [],
      message: 'Blog endpoint - não implementado ainda'
    })
  } catch (error) {
    console.error('Erro em /api/blog:', error)
    res.status(200).json({ 
      posts: [],
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    })
  }
}

