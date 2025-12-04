import { VercelRequest, VercelResponse } from '@vercel/node'
import { authenticate, AuthenticatedRequest } from '../_helpers/auth'
import prisma from '../_helpers/prisma'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Autenticação
    await authenticate(req as AuthenticatedRequest)

    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID do cliente é obrigatório' })
    }

    try {
      switch (req.method) {
        case 'GET':
          const cliente = await prisma.cliente.findUnique({
            where: { id },
            include: {
              empresas: true,
              projetos: {
                select: {
                  id: true,
                  nome: true,
                  fase_atual: true,
                  progresso_geral: true,
                },
              },
            },
          })

          if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' })
          }

          return res.json({ cliente })

        case 'PATCH':
          const { razao_social, cnpj, endereco, contatos, classificacao, estrutura, agencias_reguladoras, certificacoes } = req.body

          const clienteAtualizado = await prisma.cliente.update({
            where: { id },
            data: {
              ...(razao_social && { razao_social }),
              ...(cnpj && { cnpj }),
              ...(endereco !== undefined && { endereco }),
              ...(contatos !== undefined && { contatos }),
              ...(classificacao !== undefined && { classificacao }),
              ...(estrutura !== undefined && { estrutura }),
              ...(agencias_reguladoras !== undefined && { agencias_reguladoras }),
              ...(certificacoes !== undefined && { certificacoes }),
              updated_at: new Date(),
            },
          })

          return res.json({ cliente: clienteAtualizado })

        case 'DELETE':
          await prisma.cliente.delete({
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
        return res.status(404).json({ error: 'Cliente não encontrado' })
      }

      if (error.code === 'P2002') {
        return res.status(409).json({
          error: 'CNPJ já existe',
          message: 'Já existe outro cliente com este CNPJ',
        })
      }

      console.error('Erro em /api/clientes/[id]:', error)
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

    console.error('Erro em /api/clientes/[id]:', error)
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message,
    })
  }
}

