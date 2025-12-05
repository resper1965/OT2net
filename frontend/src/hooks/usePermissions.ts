import { useAuth } from '@/contexts/AuthContext';

/**
 * User roles disponíveis no sistema
 */
export type UserRole = 
  | 'ADMIN'
  | 'GERENTE_PROJETO' 
  | 'CONSULTOR' 
  | 'CLIENTE' 
  | 'AUDITOR';

/**
 * Ações permitidas sobre recursos
 */
export type PermissionAction = 'create' | 'read' | 'update' | 'delete';

/**
 * Recursos do sistema
 */
export type Resource = 
  | 'clientes'
  | 'empresas'
  | 'localidades'
  | 'projetos'
  | 'coleta-processos'
  | 'catalogo'
  | 'equipe'
  | 'partes-interessadas'
  | 'usuarios'
  | 'configuracoes';

/**
 * Mapeamento de permissões por role
 */
const ROLE_PERMISSIONS: Record<UserRole, { resource: string; action: PermissionAction }[]> = {
  ADMIN: [
    { resource: '*', action: 'create' },
    { resource: '*', action: 'read' },
    { resource: '*', action: 'update' },
    { resource: '*', action: 'delete' }
  ],
  
  GERENTE_PROJETO: [
    { resource: 'clientes', action: 'read' },
    { resource: 'empresas', action: 'create' },
    { resource: 'empresas', action: 'read' },
    { resource: 'empresas', action: 'update' },
    { resource: 'empresas', action: 'delete' },
    { resource: 'localidades', action: 'create' },
    { resource: 'localidades', action: 'read' },
    { resource: 'localidades', action: 'update' },
    { resource: 'localidades', action: 'delete' },
    { resource: 'projetos', action: 'create' },
    { resource: 'projetos', action: 'read' },
    { resource: 'projetos', action: 'update' },
    { resource: 'projetos', action: 'delete' },
    { resource: 'coleta-processos', action: 'create' },
    { resource: 'coleta-processos', action: 'read' },
    { resource: 'coleta-processos', action: 'update' },
    { resource: 'coleta-processos', action: 'delete' },
    { resource: 'catalogo', action: 'create' },
    { resource: 'catalogo', action: 'read' },
    { resource: 'catalogo', action: 'update' },
    { resource: 'catalogo', action: 'delete' },
    { resource: 'equipe', action: 'create' },
    { resource: 'equipe', action: 'read' },
    { resource: 'equipe', action: 'update' },
    { resource: 'equipe', action: 'delete' },
    { resource: 'partes-interessadas', action: 'create' },
    { resource: 'partes-interessadas', action: 'read' },
    { resource: 'partes-interessadas', action: 'update' },
    { resource: 'partes-interessadas', action: 'delete' },
    { resource: 'configuracoes', action: 'read' },
    { resource: 'configuracoes', action: 'update' }
  ],
  
  CONSULTOR: [
    { resource: 'clientes', action: 'read' },
    { resource: 'empresas', action: 'read' },
    { resource: 'empresas', action: 'update' },
    { resource: 'localidades', action: 'read' },
    { resource: 'localidades', action: 'update' },
    { resource: 'projetos', action: 'read' },
    { resource: 'projetos', action: 'update' },
    { resource: 'coleta-processos', action: 'create' },
    { resource: 'coleta-processos', action: 'read' },
    { resource: 'coleta-processos', action: 'update' },
    { resource: 'coleta-processos', action: 'delete' },
    { resource: 'catalogo', action: 'read' },
    { resource: 'equipe', action: 'read' },
    { resource: 'partes-interessadas', action: 'read' },
    { resource: 'partes-interessadas', action: 'update' },
    { resource: 'configuracoes', action: 'read' },
    { resource: 'configuracoes', action: 'update' }
  ],
  
  CLIENTE: [
    { resource: 'localidades', action: 'read' },
    { resource: 'projetos', action: 'read' },
    { resource: 'catalogo', action: 'read' },
    { resource: 'partes-interessadas', action: 'read' },
    { resource: 'configuracoes', action: 'read' },
    { resource: 'configuracoes', action: 'update' }
  ],
  
  AUDITOR: [
    { resource: 'clientes', action: 'read' },
    { resource: 'empresas', action: 'read' },
    { resource: 'localidades', action: 'read' },
    { resource: 'projetos', action: 'read' },
    { resource: 'coleta-processos', action: 'read' },
    { resource: 'catalogo', action: 'read' },
    { resource: 'equipe', action: 'read' },
    { resource: 'partes-interessadas', action: 'read' },
    { resource: 'usuarios', action: 'read' },
    { resource: 'configuracoes', action: 'read' },
    { resource: 'configuracoes', action: 'update' }
  ]
};

/**
 * Hook para gerenciamento de permissões de usuário
 * @returns Funções e flags para verificação de permissões
 */
export function usePermissions() {
  const { user } = useAuth();
  
  /**
   * Verifica se o usuário pode executar determinada ação em um recurso
   * @param resource - Nome do recurso
   * @param action - Ação a ser executada
   * @returns true se tem permissão, false caso contrário
   */
  const can = (resource: Resource | string, action: PermissionAction): boolean => {
    if (!user?.role) return false;
    
    const userRole = user.role as UserRole;
    const permissions = ROLE_PERMISSIONS[userRole];
    
    if (!permissions) return false;
    
    return permissions.some(
      (p) => 
        (p.resource === '*' || p.resource === resource) &&
        p.action === action
    );
  };
  
  /**
   * Verifica se o usuário pode criar um recurso
   */
  const canCreate = (resource: Resource | string): boolean => {
    return can(resource, 'create');
  };
  
  /**
   * Verifica se o usuário pode visualizar um recurso
   */
  const canRead = (resource: Resource | string): boolean => {
    return can(resource, 'read');
  };
  
  /**
   * Verifica se o usuário pode editar um recurso
   */
  const canUpdate = (resource: Resource | string): boolean => {
    return can(resource, 'update');
  };
  
  /**
   * Verifica se o usuário pode deletar um recurso
   */
  const canDelete = (resource: Resource | string): boolean => {
    return can(resource, 'delete');
  };
  
  // Flags de role
  const role = user?.role as UserRole | undefined;
  const isAdmin = role === 'ADMIN';
  const isGerente = role === 'GERENTE_PROJETO';
  const isConsultor = role === 'CONSULTOR';
  const isCliente = role === 'CLIENTE';
  const isAuditor = role === 'AUDITOR';
  const isReadOnly = isAuditor;
  
  return {
    can,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    role,
    isAdmin,
    isGerente,
    isConsultor,
    isCliente,
    isAuditor,
    isReadOnly
  };
}
