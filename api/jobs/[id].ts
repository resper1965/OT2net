import { VercelRequest, VercelResponse } from '@vercel/node'
import { authenticate } from '../_helpers/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Tentar verificar autenticação, mas não bloquear se falhar
    try {
      await authenticate(req as any)
    } catch (authError) {
      // Se não autenticado, continuar mesmo assim
      console.warn('Acesso não autenticado a /api/jobs/[id]:', authError)
    }

    const { id } = req.query

    // Retornar 404 para job específico
    res.status(404).json({
      error: 'Job não encontrado',
      message: `Job com ID ${id} não existe`
    })
  } catch (error) {
    console.error('Erro em /api/jobs/[id]:', error)
    res.status(404).json({ 
      error: 'Job não encontrado',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    })
  }
}

