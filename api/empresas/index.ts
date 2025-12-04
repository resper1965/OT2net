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
        // Listar empresas (com filtro opcional por cliente_id)
        const clienteId = req.query.cliente_id as string | undefined

        const empresas = await prisma.empresa.findMany({
          where: clienteId ? { cliente_id: clienteId } : undefined,
          include: {
            cliente: {
              select: {
                id: true,
                razao_social: true,
                cnpj: true,
              },
            },
            _count: {
              select: {
                sites: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        })

        return res.json({ empresas })

      case 'POST':
        // Criar empresa
        const { identificacao, cliente_id, tipo, participacao_acionaria, ambito_operacional, contexto_operacional, status } = req.body

        if (!identificacao) {
          return res.status(400).json({
            error: 'Campo obrigatório: identificacao',
          })
        }

        const novaEmpresa = await prisma.empresa.create({
          data: {
            identificacao,
            cliente_id: cliente_id || null,
            tipo: tipo || null,
            participacao_acionaria: participacao_acionaria || null,
            ambito_operacional: ambito_operacional || null,
            contexto_operacional: contexto_operacional || null,
            status: status || null,
          },
        })

        return res.status(201).json({ empresa: novaEmpresa })

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

    console.error('Erro em /api/empresas:', error)
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message,
    })
  }
}

