import { Request, Response, NextFunction } from 'express';

/**
 * Matriz de permissões por role (Role-Based Access Control)
 * Formato: 'resource:action' ou wildcard '*'
 */
const PERMISSIONS: Record<string, string[]> = {
  PLATFORM_ADMIN: ['*'], // Acesso total a tudo
  ADMIN: [
    'organizacoes:*',
    'empresas:*',
    'projetos:*',
    'sites:*',
    'stakeholders:*',
    'equipe:*',
    'descricoes:*',
    'processos:*',
    'relatorios:*',
    'usuarios:read' // Admin pode ver usuários mas não modificar roles
  ],
  CONSULTOR: [
    'projetos:read',
    'projetos:update', // Pode editar projetos que está alocado
    'descricoes:*', // Full CRUD em descrições operacionais
    'processos:*', // Full CRUD em processos normalizados
    'relatorios:read',
    'stakeholders:read',
    'equipe:read',
    'sites:read'
  ],
  GESTOR: [
    'projetos:read',
    'processos:read',
    'descrições:read',
    'relatorios:read',
    'stakeholders:read',
    'equipe:read'
  ],
  VISUALIZADOR: [
    'relatorios:read'
  ],
  AUDITOR: [
    '*:read' // Read-only universal
  ]
};

/**
 * Middleware que valida se o usuário tem permissão para acessar o recurso
 * @param resource - Nome do recurso (ex: 'organizacoes', 'projetos')
 * @param action - Ação desejada (ex: 'read', 'create', 'update', 'delete')
 */
export function requirePermission(resource: string, action: string) {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role;
      
      if (!userRole) {
        return res.status(403).json({ 
          error: 'Forbidden', 
          message: 'User role not found'
        });
      }

      const userPermissions = PERMISSIONS[userRole] || [];
      
      // Verificar permissões
      const requiredPerm = `${resource}:${action}`;
      const hasWildcard = userPermissions.includes('*');
      const hasResourceWildcard = userPermissions.includes(`${resource}:*`);
      const hasActionWildcard = userPermissions.includes(`*:${action}`);
      const hasExactPerm = userPermissions.includes(requiredPerm);
      
      if (hasWildcard || hasResourceWildcard || hasActionWildcard || hasExactPerm) {
        return next();
      }
      
      // Permissão negada
      return res.status(403).json({ 
        error: 'Forbidden',
        message: `Insufficient permissions. Required: ${requiredPerm}`,
        userRole,
        userPermissions
      });
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware que valida se o usuário é ADMIN ou PLATFORM_ADMIN
 */
export function requireAdmin(req: any, res: Response, next: NextFunction) {
  const userRole = req.user?.role;
  
  if (userRole === 'ADMIN' || userRole === 'PLATFORM_ADMIN') {
    return next();
  }
  
  return res.status(403).json({ 
    error: 'Forbidden',
    message: 'Admin access required'
  });
}

/**
 * Middleware que valida se o usuário pode acessar um projeto específico
 * Verifica se o usuário está alocado no projeto ou tem role ADMIN+
 */
export async function requireProjectAccess(req: any, res: Response, next: NextFunction) {
  try {
    const projectId = req.params.id || req.body.projeto_id || req.query.projeto_id;
    const userRole = req.user?.role;
    const userId = req.user?.id;
    
    // Admins sempre têm acesso
    if (['PLATFORM_ADMIN', 'ADMIN'].includes(userRole)) {
      return next();
    }
    
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID required' });
    }
    
    // Verificar se usuário está alocado no projeto
    const member = await req.prisma.membroEquipe.findFirst({
      where: {
        projeto_id: projectId,
        usuario_id: userId
      }
    });
    
    if (member) {
      return next();
    }
    
    return res.status(403).json({ 
      error: 'Forbidden',
      message: 'You are not a member of this project'
    });
  } catch (error) {
    next(error);
  }
}
