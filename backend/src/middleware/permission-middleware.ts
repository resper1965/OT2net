import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { hasPermission, Permission } from '../utils/permission-utils';

/**
 * Estende o tipo Request para incluir informações do usuário autenticado
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
        cliente_id?: string | null;
      };
    }
  }
}

/**
 * Middleware para verificar se o usuário tem permissão para acessar um recurso
 * @param resource - Nome do recurso (ex: 'projetos', 'clientes')
 * @param action - Ação a ser executada ('create', 'read', 'update', 'delete')
 * @returns Middleware function
 */
export function requirePermission(
  resource: string,
  action: Permission['action']
) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Verifica se o usuário está autenticado
    if (!req.user) {
      return res.status(401).json({
        error: 'Não autenticado',
        message: 'É necessário estar autenticado para acessar este recurso'
      });
    }

    const userRole = req.user.role;
    
    // Verifica se tem permissão
    if (!hasPermission(userRole, resource, action)) {
      return res.status(403).json({
        error: 'Permissão negada',
        message: `Você não tem permissão para ${getActionLabel(action)} ${getResourceLabel(resource)}`
      });
    }
    
    next();
  };
}

/**
 * Middleware para verificar se o usuário é Admin
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Não autenticado',
      message: 'É necessário estar autenticado para acessar este recurso'
    });
  }

  if (req.user.role !== UserRole.ADMIN) {
    return res.status(403).json({
      error: 'Acesso negado',
      message: 'Apenas administradores podem acessar este recurso'
    });
  }

  next();
}

/**
 * Middleware para verificar se o usuário pode acessar dados de um projeto específico
 * Admins têm acesso a tudo
 * Gerentes e Consultores devem estar na equipe do projeto
 * Clientes devem ter o projeto associado ao seu cliente
 */
export function requireProjectAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Não autenticado',
      message: 'É necessário estar autenticado para acessar este recurso'
    });
  }

  // Admin tem acesso total
  if (req.user.role === UserRole.ADMIN) {
    return next();
  }

  // Aqui você implementaria a lógica de verificar se o usuário
  // está associado ao projeto (verificando membros_equipe, etc)
  // Por enquanto, vamos deixar passar para Gerentes e Consultores
  if (req.user.role === UserRole.GERENTE_PROJETO || req.user.role === UserRole.CONSULTOR) {
    return next();
  }

  // Cliente deve ter acesso apenas aos projetos do seu cliente
  if (req.user.role === UserRole.CLIENTE) {
    // Implementar verificação se o projeto pertence ao cliente do usuário
    return next();
  }

  // Auditor tem acesso apenas leitura
  if (req.user.role === UserRole.AUDITOR && req.method === 'GET') {
    return next();
  }

  return res.status(403).json({
    error: 'Acesso negado',
    message: 'Você não tem acesso a este projeto'
  });
}

/**
 * Retorna label traduzida para ação
 */
function getActionLabel(action: Permission['action']): string {
  const labels: Record<Permission['action'], string> = {
    create: 'criar',
    read: 'visualizar',
    update: 'editar',
    delete: 'excluir'
  };
  return labels[action];
}

/**
 * Retorna label traduzida para recurso
 */
function getResourceLabel(resource: string): string {
  const labels: Record<string, string> = {
    'clientes': 'clientes',
    'empresas': 'empresas',
    'localidades': 'localidades',
    'projetos': 'projetos',
    'coleta-processos': 'coletas de processos',
    'catalogo': 'catálogo de processos',
    'equipe': 'membros da equipe',
    'partes-interessadas': 'partes interessadas',
    'usuarios': 'usuários',
    'configuracoes': 'configurações'
  };
  return labels[resource] || resource;
}
