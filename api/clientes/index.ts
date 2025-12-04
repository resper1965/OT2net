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
        // Listar clientes
        const clientes = await prisma.cliente.findMany({
          include: {
            empresas: {
              select: {
                id: true,
                identificacao: true,
                tipo: true,
                status: true,
              },
            },
            _count: {
              select: {
                projetos: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        })

        return res.json({ clientes })

      case 'POST':
        // Criar cliente
        const { razao_social, cnpj, endereco, contatos, classificacao, estrutura, agencias_reguladoras, certificacoes } = req.body

        if (!razao_social || !cnpj) {
          return res.status(400).json({
            error: 'Campos obrigatórios: razao_social, cnpj',
          })
        }

        const novoCliente = await prisma.cliente.create({
          data: {
            razao_social,
            cnpj,
            endereco: endereco || null,
            contatos: contatos || null,
            classificacao: classificacao || null,
            estrutura: estrutura || null,
            agencias_reguladoras: agencias_reguladoras || [],
            certificacoes: certificacoes || [],
          },
        })

        return res.status(201).json({ cliente: novoCliente })

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

    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Cliente já existe',
        message: 'Já existe um cliente com este CNPJ',
      })
    }

    console.error('Erro em /api/clientes:', error)
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message,
    })
  }
}

