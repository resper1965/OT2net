import { VercelRequest, VercelResponse } from '@vercel/node'
import { verifySupabaseToken } from '../../backend/src/lib/supabase'
import prisma from '../../backend/src/lib/prisma'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Autenticação
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Não autenticado' })
  }

  const token = authHeader.replace('Bearer ', '')
  const user = await verifySupabaseToken(token)

  if (!user) {
    return res.status(401).json({ error: 'Token inválido' })
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID do projeto é obrigatório' })
  }

  try {
    switch (req.method) {
      case 'GET':
        const projeto = await prisma.projeto.findUnique({
          where: { id },
          include: {
            cliente: true,
            membros_equipe: true,
            iniciativas: true,
          },
        })

        if (!projeto) {
          return res.status(404).json({ error: 'Projeto não encontrado' })
        }

        return res.json({ projeto })

      case 'PATCH':
        const { nome, descricao, fase_atual, progresso_geral } = req.body

        const projetoAtualizado = await prisma.projeto.update({
          where: { id },
          data: {
            ...(nome && { nome }),
            ...(descricao !== undefined && { descricao }),
            ...(fase_atual && { fase_atual }),
            ...(progresso_geral !== undefined && { progresso_geral }),
          },
        })

        return res.json({ projeto: projetoAtualizado })

      case 'DELETE':
        await prisma.projeto.delete({
          where: { id },
        })

        return res.status(204).send()

      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Projeto não encontrado' })
    }

    console.error('Erro em /api/projetos/[id]:', error)
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message,
    })
  }
}

