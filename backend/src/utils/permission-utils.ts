import { UserRole } from '@prisma/client';

/**
 * Definição de permissão
 */
export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

/**
 * Mapeamento completo de permissões por role
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.PLATFORM_ADMIN]: [
    { resource: '*', action: 'create' },
    { resource: '*', action: 'read' },
    { resource: '*', action: 'update' },
    { resource: '*', action: 'delete' },
  ],
  [UserRole.ADMIN]: [
    { resource: '*', action: 'create' },
    { resource: '*', action: 'read' },
    { resource: '*', action: 'update' },
    { resource: '*', action: 'delete' }
  ],
  
  [UserRole.GERENTE_PROJETO]: [
    // Clientes
    { resource: 'clientes', action: 'read' },
    
    // Empresas
    { resource: 'empresas', action: 'create' },
    { resource: 'empresas', action: 'read' },
    { resource: 'empresas', action: 'update' },
    { resource: 'empresas', action: 'delete' },
    
    // Localidades (Sites)
    { resource: 'localidades', action: 'create' },
    { resource: 'localidades', action: 'read' },
    { resource: 'localidades', action: 'update' },
    { resource: 'localidades', action: 'delete' },
    
    // Projetos
    { resource: 'projetos', action: 'create' },
    { resource: 'projetos', action: 'read' },
    { resource: 'projetos', action: 'update' },
    { resource: 'projetos', action: 'delete' },
    
    // Coleta de Processos
    { resource: 'coleta-processos', action: 'create' },
    { resource: 'coleta-processos', action: 'read' },
    { resource: 'coleta-processos', action: 'update' },
    { resource: 'coleta-processos', action: 'delete' },
    
    // Catálogo
    { resource: 'catalogo', action: 'create' },
    { resource: 'catalogo', action: 'read' },
    { resource: 'catalogo', action: 'update' },
    { resource: 'catalogo', action: 'delete' },
    
    // Equipe
    { resource: 'equipe', action: 'create' },
    { resource: 'equipe', action: 'read' },
    { resource: 'equipe', action: 'update' },
    { resource: 'equipe', action: 'delete' },
    
    // Partes Interessadas
    { resource: 'partes-interessadas', action: 'create' },
    { resource: 'partes-interessadas', action: 'read' },
    { resource: 'partes-interessadas', action: 'update' },
    { resource: 'partes-interessadas', action: 'delete' },
    
    // Configurações (conta própria)
    { resource: 'configuracoes', action: 'read' },
    { resource: 'configuracoes', action: 'update' }
  ],
  
  [UserRole.CONSULTOR]: [
    // Clientes
    { resource: 'clientes', action: 'read' },
    
    // Empresas
    { resource: 'empresas', action: 'read' },
    { resource: 'empresas', action: 'update' },
    
    // Localidades
    { resource: 'localidades', action: 'read' },
    { resource: 'localidades', action: 'update' },
    
    // Projetos
    { resource: 'projetos', action: 'read' },
    { resource: 'projetos', action: 'update' },
    
    // Coleta de Processos
    { resource: 'coleta-processos', action: 'create' },
    { resource: 'coleta-processos', action: 'read' },
    { resource: 'coleta-processos', action: 'update' },
    { resource: 'coleta-processos', action: 'delete' },
    
    // Catálogo
    { resource: 'catalogo', action: 'read' },
    
    // Equipe
    { resource: 'equipe', action: 'read' },
    
    // Partes Interessadas
    { resource: 'partes-interessadas', action: 'read' },
    { resource: 'partes-interessadas', action: 'update' },
    
    // Configurações (conta própria)
    { resource: 'configuracoes', action: 'read' },
    { resource: 'configuracoes', action: 'update' }
  ],
  
  [UserRole.CLIENTE]: [
    // Localidades
    { resource: 'localidades', action: 'read' },
    
    // Projetos (apenas seu projeto)
    { resource: 'projetos', action: 'read' },
    
    // Catálogo
    { resource: 'catalogo', action: 'read' },
    
    // Partes Interessadas
    { resource: 'partes-interessadas', action: 'read' },
    
    // Configurações (conta própria)
    { resource: 'configuracoes', action: 'read' },
    { resource: 'configuracoes', action: 'update' }
  ],
  
  [UserRole.AUDITOR]: [
    // Acesso apenas leitura a tudo
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
 * Verifica se um usuário com determinado role tem permissão para executar uma ação em um recurso
 * @param userRole - Role do usuário
 * @param resource - Recurso a ser acessado
 * @param action - Ação a ser executada
 * @returns boolean indicando se tem permissão
 */
export function hasPermission(
  userRole: UserRole,
  resource: string,
  action: Permission['action']
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  
  return permissions.some(
    (p) => 
      (p.resource === '*' || p.resource === resource) &&
      p.action === action
  );
}

/**
 * Verifica se um role tem acesso total (ADMIN)
 */
export function isAdmin(userRole: UserRole): boolean {
  return userRole === UserRole.ADMIN;
}

/**
 * Verifica se um role tem permissão apenas de leitura
 */
export function isReadOnly(userRole: UserRole): boolean {
  return userRole === UserRole.AUDITOR;
}

/**
 * Lista todos os recursos que um role pode acessar com determinada ação
 */
export function getAccessibleResources(
  userRole: UserRole,
  action: Permission['action']
): string[] {
  const permissions = ROLE_PERMISSIONS[userRole];
  
  return permissions
    .filter(p => p.action === action)
    .map(p => p.resource);
}

/**
 * Retorna todas as permissões de um role
 */
export function getRolePermissions(userRole: UserRole): Permission[] {
  return ROLE_PERMISSIONS[userRole];
}
