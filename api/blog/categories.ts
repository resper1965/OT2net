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
      console.warn('Acesso não autenticado a /api/blog/categories:', authError)
    }

    const includeCounts = req.query.include_counts === 'true'

    // Retornar lista vazia de categorias
    // Esta rota pode ser implementada no futuro se necessário
    const categories: any[] = []

    if (includeCounts) {
      // Se include_counts for true, adicionar contagem de posts por categoria
      res.status(200).json({
        categories: categories.map(cat => ({
          ...cat,
          post_count: 0
        }))
      })
    } else {
      res.status(200).json({
        categories,
        message: 'Blog categories endpoint - não implementado ainda'
      })
    }
  } catch (error) {
    console.error('Erro em /api/blog/categories:', error)
    res.status(200).json({ 
      categories: [],
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    })
  }
}

