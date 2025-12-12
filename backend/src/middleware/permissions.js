"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = requirePermission;
exports.requireAdmin = requireAdmin;
exports.requireProjectAccess = requireProjectAccess;
/**
 * Matriz de permissões por role (Role-Based Access Control)
 * Formato: 'resource:action' ou wildcard '*'
 */
var PERMISSIONS = {
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
function requirePermission(resource, action) {
    var _this = this;
    return function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var userRole, userPermissions, requiredPerm, hasWildcard, hasResourceWildcard, hasActionWildcard, hasExactPerm;
        var _a;
        return __generator(this, function (_b) {
            try {
                userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
                if (!userRole) {
                    return [2 /*return*/, res.status(403).json({
                            error: 'Forbidden',
                            message: 'User role not found'
                        })];
                }
                userPermissions = PERMISSIONS[userRole] || [];
                requiredPerm = "".concat(resource, ":").concat(action);
                hasWildcard = userPermissions.includes('*');
                hasResourceWildcard = userPermissions.includes("".concat(resource, ":*"));
                hasActionWildcard = userPermissions.includes("*:".concat(action));
                hasExactPerm = userPermissions.includes(requiredPerm);
                if (hasWildcard || hasResourceWildcard || hasActionWildcard || hasExactPerm) {
                    return [2 /*return*/, next()];
                }
                // Permissão negada
                return [2 /*return*/, res.status(403).json({
                        error: 'Forbidden',
                        message: "Insufficient permissions. Required: ".concat(requiredPerm),
                        userRole: userRole,
                        userPermissions: userPermissions
                    })];
            }
            catch (error) {
                next(error);
            }
            return [2 /*return*/];
        });
    }); };
}
/**
 * Middleware que valida se o usuário é ADMIN ou PLATFORM_ADMIN
 */
function requireAdmin(req, res, next) {
    var _a;
    var userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
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
function requireProjectAccess(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var projectId, userRole, userId, member, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    projectId = req.params.id || req.body.projeto_id || req.query.projeto_id;
                    userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
                    userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                    // Admins sempre têm acesso
                    if (['PLATFORM_ADMIN', 'ADMIN'].includes(userRole)) {
                        return [2 /*return*/, next()];
                    }
                    if (!projectId) {
                        return [2 /*return*/, res.status(400).json({ error: 'Project ID required' })];
                    }
                    return [4 /*yield*/, req.prisma.membroEquipe.findFirst({
                            where: {
                                projeto_id: projectId,
                                usuario_id: userId
                            }
                        })];
                case 1:
                    member = _c.sent();
                    if (member) {
                        return [2 /*return*/, next()];
                    }
                    return [2 /*return*/, res.status(403).json({
                            error: 'Forbidden',
                            message: 'You are not a member of this project'
                        })];
                case 2:
                    error_1 = _c.sent();
                    next(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
