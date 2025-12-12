"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_PERMISSIONS = void 0;
exports.hasPermission = hasPermission;
exports.isAdmin = isAdmin;
exports.isReadOnly = isReadOnly;
exports.getAccessibleResources = getAccessibleResources;
exports.getRolePermissions = getRolePermissions;
var client_1 = require("@prisma/client");
/**
 * Mapeamento completo de permissões por role
 */
exports.ROLE_PERMISSIONS = (_a = {},
    _a[client_1.UserRole.PLATFORM_ADMIN] = [
        { resource: '*', action: 'create' },
        { resource: '*', action: 'read' },
        { resource: '*', action: 'update' },
        { resource: '*', action: 'delete' },
    ],
    _a[client_1.UserRole.ADMIN] = [
        { resource: '*', action: 'create' },
        { resource: '*', action: 'read' },
        { resource: '*', action: 'update' },
        { resource: '*', action: 'delete' }
    ],
    _a[client_1.UserRole.GERENTE_PROJETO] = [
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
    _a[client_1.UserRole.CONSULTOR] = [
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
    _a[client_1.UserRole.CLIENTE] = [
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
    _a[client_1.UserRole.AUDITOR] = [
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
    ],
    _a);
/**
 * Verifica se um usuário com determinado role tem permissão para executar uma ação em um recurso
 * @param userRole - Role do usuário
 * @param resource - Recurso a ser acessado
 * @param action - Ação a ser executada
 * @returns boolean indicando se tem permissão
 */
function hasPermission(userRole, resource, action) {
    var permissions = exports.ROLE_PERMISSIONS[userRole];
    return permissions.some(function (p) {
        return (p.resource === '*' || p.resource === resource) &&
            p.action === action;
    });
}
/**
 * Verifica se um role tem acesso total (ADMIN)
 */
function isAdmin(userRole) {
    return userRole === client_1.UserRole.ADMIN;
}
/**
 * Verifica se um role tem permissão apenas de leitura
 */
function isReadOnly(userRole) {
    return userRole === client_1.UserRole.AUDITOR;
}
/**
 * Lista todos os recursos que um role pode acessar com determinada ação
 */
function getAccessibleResources(userRole, action) {
    var permissions = exports.ROLE_PERMISSIONS[userRole];
    return permissions
        .filter(function (p) { return p.action === action; })
        .map(function (p) { return p.resource; });
}
/**
 * Retorna todas as permissões de um role
 */
function getRolePermissions(userRole) {
    return exports.ROLE_PERMISSIONS[userRole];
}
