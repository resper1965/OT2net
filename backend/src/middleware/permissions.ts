import { Request, Response, NextFunction } from 'express'
import prisma from '@/lib/prisma'

/**
 * Middleware de autorização baseado em permissões
 * Verifica se o usuário tem permissão para realizar ação em entidade
 */
export function requirePermission(entidadeTipo: string, acao: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId

      if (!userId) {
        return res.status(401).json({
          error: 'Não autenticado',
          message: 'Faça login para acessar este recurso',
        })
      }

      // Buscar permissão do usuário
      const permissao = await prisma.permissao.findFirst({
        where: {
          usuario_id: userId,
          entidade_tipo: entidadeTipo,
          acao: acao,
        },
      })

      if (!permissao) {
        return res.status(403).json({
          error: 'Acesso negado',
          message: `Você não tem permissão para ${acao} ${entidadeTipo}`,
        })
      }

      next()
    } catch (error) {
      console.error('Erro na verificação de permissão:', error)
      return res.status(500).json({
        error: 'Erro interno na verificação de permissão',
        message: 'Tente novamente mais tarde',
      })
    }
  }
}

/**
 * Helper para verificar múltiplas permissões (OR)
 * Usuário precisa ter pelo menos uma das permissões
 */
export function requireAnyPermission(
  permissoes: Array<{ entidadeTipo: string; acao: string }>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId

      if (!userId) {
        return res.status(401).json({
          error: 'Não autenticado',
          message: 'Faça login para acessar este recurso',
        })
      }

      // Verificar se usuário tem pelo menos uma permissão
      const permissoesEncontradas = await prisma.permissao.findMany({
        where: {
          usuario_id: userId,
          OR: permissoes.map((p) => ({
            entidade_tipo: p.entidadeTipo,
            acao: p.acao,
          })),
        },
      })

      if (permissoesEncontradas.length === 0) {
        return res.status(403).json({
          error: 'Acesso negado',
          message: 'Você não tem permissão para acessar este recurso',
        })
      }

      next()
    } catch (error) {
      console.error('Erro na verificação de permissão:', error)
      return res.status(500).json({
        error: 'Erro interno na verificação de permissão',
        message: 'Tente novamente mais tarde',
      })
    }
  }
}

/**
 * Helper para verificar se usuário é admin
 * Verifica se usuário tem permissão de delete em qualquer entidade (indicador de admin)
 */
export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).userId

    if (!userId) {
      return res.status(401).json({
        error: 'Não autenticado',
        message: 'Faça login para acessar este recurso',
      })
    }

    // Verificar se usuário tem permissão de delete em usuários (indicador de admin)
    const isAdmin = await prisma.permissao.findFirst({
      where: {
        usuario_id: userId,
        entidade_tipo: 'usuario',
        acao: 'delete',
      },
    })

    if (!isAdmin) {
      return res.status(403).json({
        error: 'Acesso negado',
        message: 'Apenas administradores podem acessar este recurso',
      })
    }

    next()
  } catch (error) {
    console.error('Erro na verificação de admin:', error)
    return res.status(500).json({
      error: 'Erro interno na verificação de permissão',
      message: 'Tente novamente mais tarde',
    })
  }
}

