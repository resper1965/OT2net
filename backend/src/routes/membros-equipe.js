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
var express_1 = require("express");
var permissions_1 = require("../middleware/permissions");
var zod_1 = require("zod");
var validation_1 = require("../middleware/validation");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
var createMembroEquipeSchema = zod_1.z.object({
    projeto_id: zod_1.z.string().uuid().optional(),
    organizacao_id: zod_1.z.string().uuid().optional(),
    usuario_id: zod_1.z.string().uuid().optional(),
    // Identificação
    nome: zod_1.z.string().min(1),
    email: zod_1.z.string().email().optional(),
    cargo: zod_1.z.string().optional(),
    departamento: zod_1.z.string().optional(),
    telefone: zod_1.z.string().optional(),
    // Classificação
    tipo: zod_1.z.enum(['EQUIPE_INTERNA', 'STAKEHOLDER_EXTERNO', 'PATROCINADOR', 'CLIENTE', 'ENTREVISTADO']).default('EQUIPE_INTERNA'),
    papel: zod_1.z.string().optional(),
    // RACI
    responsabilidade: zod_1.z.string().optional(),
    autoridade: zod_1.z.string().optional(),
    consultado: zod_1.z.boolean().optional(),
    informado: zod_1.z.boolean().optional(),
    // Stakeholder Management
    poder_influencia: zod_1.z.enum(['ALTO', 'MEDIO', 'BAIXO']).optional(),
    nivel_interesse: zod_1.z.enum(['ALTO', 'MEDIO', 'BAIXO']).optional(),
    estrategia_engajamento: zod_1.z.string().optional(),
    expertise: zod_1.z.string().optional(),
    localizacao: zod_1.z.string().optional(),
    // Metadata
    ativo: zod_1.z.boolean().optional(),
    observacoes: zod_1.z.string().optional(),
});
var updateMembroEquipeSchema = createMembroEquipeSchema.partial();
// GET /api/membros-equipe - Listar todos os membros
router.get('/', auth_1.authenticateToken, (0, permissions_1.requirePermission)('membros_equipe', 'read'), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, projeto_id, organizacao_id, tipo, where, membros, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, projeto_id = _a.projeto_id, organizacao_id = _a.organizacao_id, tipo = _a.tipo;
                where = {};
                if (projeto_id)
                    where.projeto_id = projeto_id;
                if (organizacao_id)
                    where.organizacao_id = organizacao_id;
                if (tipo)
                    where.tipo = tipo;
                return [4 /*yield*/, req.prisma.membroEquipe.findMany({
                        where: where,
                        orderBy: { created_at: 'desc' },
                        include: {
                            projeto: true,
                            organizacao: true,
                        },
                    })];
            case 1:
                membros = _b.sent();
                res.json(membros);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/membros-equipe/:id - Obter membro por ID
router.get('/:id', auth_1.authenticateToken, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, membro, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, req.prisma.membroEquipe.findUnique({
                        where: { id: id },
                        include: {
                            projeto: true,
                        },
                    })];
            case 1:
                membro = _a.sent();
                if (!membro) {
                    return [2 /*return*/, res.status(404).json({ error: 'Membro não encontrado' })];
                }
                res.json(membro);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/membros-equipe - Criar novo membro
router.post('/', auth_1.authenticateToken, (0, validation_1.validate)({ body: createMembroEquipeSchema }), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var membro, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, req.prisma.membroEquipe.create({
                        data: req.body,
                    })];
            case 1:
                membro = _a.sent();
                res.status(201).json(membro);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT /api/membros-equipe/:id - Atualizar membro
router.put('/:id', auth_1.authenticateToken, (0, validation_1.validate)({ body: updateMembroEquipeSchema }), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, membro, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, req.prisma.membroEquipe.update({
                        where: { id: id },
                        data: req.body,
                    })];
            case 1:
                membro = _a.sent();
                res.json(membro);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                if (error_4.code === 'P2025') {
                    return [2 /*return*/, res.status(404).json({ error: 'Membro não encontrado' })];
                }
                next(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// DELETE /api/membros-equipe/:id - Deletar membro
router.delete('/:id', auth_1.authenticateToken, (0, permissions_1.requirePermission)('membros_equipe', 'delete'), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, req.prisma.membroEquipe.delete({
                        where: { id: id },
                    })];
            case 1:
                _a.sent();
                res.status(204).send();
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                if (error_5.code === 'P2025') {
                    return [2 /*return*/, res.status(404).json({ error: 'Membro não encontrado' })];
                }
                next(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
