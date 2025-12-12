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
var zod_1 = require("zod");
var auth_1 = require("../middleware/auth");
var permissions_1 = require("../middleware/permissions");
var cpf_cnpj_validator_1 = require("cpf-cnpj-validator");
var router = (0, express_1.Router)();
// Schema de validação
var createOrganizacaoSchema = zod_1.z.object({
    razao_social: zod_1.z.string().min(1),
    cnpj: zod_1.z.string().min(14).max(18).refine(function (val) { return cpf_cnpj_validator_1.cnpj.isValid(val); }, { message: 'CNPJ inválido' }),
    endereco: zod_1.z.object({
        logradouro: zod_1.z.string().optional(),
        numero: zod_1.z.string().optional(),
        complemento: zod_1.z.string().optional(),
        bairro: zod_1.z.string().optional(),
        cidade: zod_1.z.string().optional(),
        estado: zod_1.z.string().optional(),
        cep: zod_1.z.string().optional(),
    }).optional(),
    contatos: zod_1.z.object({
        telefone: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        responsavel: zod_1.z.string().optional(),
    }).optional(),
    classificacao: zod_1.z.string().optional(),
    estrutura: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    agencias_reguladoras: zod_1.z.array(zod_1.z.string()).optional(),
    certificacoes: zod_1.z.array(zod_1.z.string()).optional(),
});
var updateOrganizacaoSchema = createOrganizacaoSchema.partial();
// GET /api/organizacoes - Listar todas as organizações
router.get('/', auth_1.authenticateToken, (0, permissions_1.requirePermission)('organizacoes', 'read'), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var organizacoes, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, req.prisma.organizacao.findMany({
                        orderBy: { created_at: 'desc' },
                    })];
            case 1:
                organizacoes = _a.sent();
                res.json({ organizacoes: organizacoes });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/organizacoes/:id - Obter organização por ID
router.get('/:id', auth_1.authenticateToken, (0, permissions_1.requirePermission)('organizacoes', 'read'), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, organizacao, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, req.prisma.organizacao.findUnique({
                        where: { id: id },
                        include: {
                            empresas: {
                                include: {
                                    sites: true,
                                },
                            },
                            projetos: true,
                        },
                    })];
            case 1:
                organizacao = _a.sent();
                if (!organizacao) {
                    return [2 /*return*/, res.status(404).json({ error: 'Organização não encontrada' })];
                }
                res.json(organizacao);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/organizacoes - Criar nova organização
router.post('/', auth_1.authenticateToken, (0, permissions_1.requirePermission)('organizacoes', 'create'), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var organizacao, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, req.prisma.organizacao.create({
                        data: req.body,
                    })];
            case 1:
                organizacao = _a.sent();
                res.status(201).json(organizacao);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                if (error_3.code === 'P2002') {
                    return [2 /*return*/, res.status(409).json({ error: 'CNPJ já cadastrado' })];
                }
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT /api/organizacoes/:id - Atualizar organização
router.put('/:id', auth_1.authenticateToken, (0, permissions_1.requirePermission)('organizacoes', 'update'), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, organizacao, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, req.prisma.organizacao.update({
                        where: { id: id },
                        data: req.body,
                    })];
            case 1:
                organizacao = _a.sent();
                res.json(organizacao);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                if (error_4.code === 'P2025') {
                    return [2 /*return*/, res.status(404).json({ error: 'Organização não encontrada' })];
                }
                next(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// DELETE /api/organizacoes/:id - Deletar organização
router.delete('/:id', auth_1.authenticateToken, (0, permissions_1.requirePermission)('organizacoes', 'delete'), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, req.prisma.organizacao.delete({
                        where: { id: id },
                    })];
            case 1:
                _a.sent();
                res.status(204).send();
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                if (error_5.code === 'P2025') {
                    return [2 /*return*/, res.status(404).json({ error: 'Organização não encontrada' })];
                }
                next(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
