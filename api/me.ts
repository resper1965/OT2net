import { VercelRequest, VercelResponse } from '@vercel/node'
import { authenticate, AuthenticatedRequest } from './_helpers/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const user = await authenticate(req as AuthenticatedRequest)

    res.json({
      user: {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata,
      },
    })
  } catch (error: any) {
    if (error.message === 'Token não fornecido' || error.message === 'Token inválido ou expirado') {
      return res.status(401).json({
        error: error.message,
        message: 'Faça login novamente',
      })
    }

    console.error('Erro em /api/me:', error)
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message,
    })
  }
}

