"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = requirePermission;
exports.requireAdmin = requireAdmin;
exports.requireProjectAccess = requireProjectAccess;
var client_1 = require("@prisma/client");
var permission_utils_1 = require("../utils/permission-utils");
/**
 * Middleware para verificar se o usuário tem permissão para acessar um recurso
 * @param resource - Nome do recurso (ex: 'projetos', 'clientes')
 * @param action - Ação a ser executada ('create', 'read', 'update', 'delete')
 * @returns Middleware function
 */
function requirePermission(resource, action) {
    return function (req, res, next) {
        // Verifica se o usuário está autenticado
        if (!req.user) {
            return res.status(401).json({
                error: 'Não autenticado',
                message: 'É necessário estar autenticado para acessar este recurso'
            });
        }
        var userRole = req.user.role;
        // Verifica se tem permissão
        if (!(0, permission_utils_1.hasPermission)(userRole, resource, action)) {
            return res.status(403).json({
                error: 'Permissão negada',
                message: "Voc\u00EA n\u00E3o tem permiss\u00E3o para ".concat(getActionLabel(action), " ").concat(getResourceLabel(resource))
            });
        }
        next();
    };
}
/**
 * Middleware para verificar se o usuário é Admin
 */
function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            error: 'Não autenticado',
            message: 'É necessário estar autenticado para acessar este recurso'
        });
    }
    if (req.user.role !== client_1.UserRole.ADMIN) {
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
function requireProjectAccess(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            error: 'Não autenticado',
            message: 'É necessário estar autenticado para acessar este recurso'
        });
    }
    // Admin tem acesso total
    if (req.user.role === client_1.UserRole.ADMIN) {
        return next();
    }
    // Aqui você implementaria a lógica de verificar se o usuário
    // está associado ao projeto (verificando membros_equipe, etc)
    // Por enquanto, vamos deixar passar para Gerentes e Consultores
    if (req.user.role === client_1.UserRole.GERENTE_PROJETO || req.user.role === client_1.UserRole.CONSULTOR) {
        return next();
    }
    // Cliente deve ter acesso apenas aos projetos do seu cliente
    if (req.user.role === client_1.UserRole.CLIENTE) {
        // Implementar verificação se o projeto pertence ao cliente do usuário
        return next();
    }
    // Auditor tem acesso apenas leitura
    if (req.user.role === client_1.UserRole.AUDITOR && req.method === 'GET') {
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
function getActionLabel(action) {
    var labels = {
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
function getResourceLabel(resource) {
    var labels = {
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
