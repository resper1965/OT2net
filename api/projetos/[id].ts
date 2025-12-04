import { VercelRequest, VercelResponse } from '@vercel/node'
import { authenticate, AuthenticatedRequest } from '../_helpers/auth'
import prisma from '../_helpers/prisma'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Autenticação
    await authenticate(req as AuthenticatedRequest)

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
    if (error.message === 'Token não fornecido' || error.message === 'Token inválido ou expirado') {
      return res.status(401).json({
        error: error.message,
        message: 'Faça login novamente',
      })
    }

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

