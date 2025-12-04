import { VercelRequest, VercelResponse } from '@vercel/node'
import { verifySupabaseToken } from '../_helpers/supabase'
import prisma from '../_helpers/prisma'

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

  try {
    switch (req.method) {
      case 'GET':
        // Listar projetos (com permissão)
        const projetos = await prisma.projeto.findMany({
          include: {
            cliente: {
              select: {
                id: true,
                razao_social: true,
                cnpj: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        })

        return res.json({ projetos })

      case 'POST':
        // Criar projeto (requer permissão)
        const { nome, descricao, cliente_id, fase_atual } = req.body

        if (!nome || !cliente_id) {
          return res.status(400).json({
            error: 'Campos obrigatórios: nome, cliente_id',
          })
        }

        const novoProjeto = await prisma.projeto.create({
          data: {
            nome,
            descricao,
            cliente_id,
            fase_atual: fase_atual || 'fase-0',
            progresso_geral: 0,
          },
        })

        return res.status(201).json({ projeto: novoProjeto })

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

    console.error('Erro em /api/projetos:', error)
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message,
    })
  }
}

