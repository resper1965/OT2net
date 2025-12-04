import { VercelRequest, VercelResponse } from '@vercel/node'
import { authenticate, AuthenticatedRequest } from '../_helpers/auth'
import prisma from '../_helpers/prisma'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Autenticação
    await authenticate(req as AuthenticatedRequest)

    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID da empresa é obrigatório' })
    }

    try {
      switch (req.method) {
        case 'GET':
          const empresa = await prisma.empresa.findUnique({
            where: { id },
            include: {
              cliente: true,
              sites: {
                select: {
                  id: true,
                  identificacao: true,
                  classificacao: true,
                  criticidade_operacional: true,
                },
              },
            },
          })

          if (!empresa) {
            return res.status(404).json({ error: 'Empresa não encontrada' })
          }

          return res.json({ empresa })

        case 'PATCH':
          const { identificacao, cliente_id, tipo, participacao_acionaria, ambito_operacional, contexto_operacional, status } = req.body

          const empresaAtualizada = await prisma.empresa.update({
            where: { id },
            data: {
              ...(identificacao && { identificacao }),
              ...(cliente_id !== undefined && { cliente_id }),
              ...(tipo !== undefined && { tipo }),
              ...(participacao_acionaria !== undefined && { participacao_acionaria }),
              ...(ambito_operacional !== undefined && { ambito_operacional }),
              ...(contexto_operacional !== undefined && { contexto_operacional }),
              ...(status !== undefined && { status }),
              updated_at: new Date(),
            },
          })

          return res.json({ empresa: empresaAtualizada })

        case 'DELETE':
          await prisma.empresa.delete({
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
        return res.status(404).json({ error: 'Empresa não encontrada' })
      }

      console.error('Erro em /api/empresas/[id]:', error)
      return res.status(500).json({
        error: 'Erro interno do servidor',
        message: error.message,
      })
    }
  } catch (error: any) {
    if (error.message === 'Token não fornecido' || error.message === 'Token inválido ou expirado') {
      return res.status(401).json({
        error: error.message,
        message: 'Faça login novamente',
      })
    }

    console.error('Erro em /api/empresas/[id]:', error)
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message,
    })
  }
}

