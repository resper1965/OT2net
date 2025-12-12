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
var processamento_ia_1 = require("../services/processamento-ia");
var router = (0, express_1.Router)();
var createDescricaoRawSchema = zod_1.z.object({
    projeto_id: zod_1.z.string().uuid().optional(),
    site_id: zod_1.z.string().uuid().optional(),
    titulo: zod_1.z.string().min(1),
    descricao_completa: zod_1.z.string().min(1),
    frequencia: zod_1.z.string().optional(),
    impacto: zod_1.z.string().optional(),
    dificuldades: zod_1.z.string().optional(),
    pessoa_id: zod_1.z.string().uuid().optional(),
    cargo: zod_1.z.string().optional(),
    turno: zod_1.z.string().optional(),
    metodo_coleta: zod_1.z.string().optional(),
});
var updateDescricaoRawSchema = createDescricaoRawSchema.partial();
// GET /api/descricoes-raw - Listar descrições raw
router.get('/', auth_1.authenticateToken, (0, permissions_1.requirePermission)('descricoes_raw', 'read'), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, projeto_id, site_id, status_1, where, descricoes, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, projeto_id = _a.projeto_id, site_id = _a.site_id, status_1 = _a.status;
                where = {};
                if (projeto_id)
                    where.projeto_id = projeto_id;
                if (site_id)
                    where.site_id = site_id;
                if (status_1)
                    where.status_processamento = status_1;
                return [4 /*yield*/, req.prisma.descricaoOperacionalRaw.findMany({
                        where: where,
                        orderBy: { created_at: 'desc' },
                        include: {
                            projeto: true,
                            site: true,
                        },
                    })];
            case 1:
                descricoes = _b.sent();
                res.json(descricoes);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/descricoes-raw/:id - Obter descrição raw por ID
router.get('/:id', auth_1.authenticateToken, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, descricao, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, req.prisma.descricaoOperacionalRaw.findUnique({
                        where: { id: id },
                        include: {
                            projeto: true,
                            site: true,
                        },
                    })];
            case 1:
                descricao = _a.sent();
                if (!descricao) {
                    return [2 /*return*/, res.status(404).json({ error: 'Descrição raw não encontrada' })];
                }
                res.json(descricao);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/descricoes-raw - Criar nova descrição raw
router.post('/', auth_1.authenticateToken, (0, validation_1.validate)({ body: createDescricaoRawSchema }), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var descricao, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, req.prisma.descricaoOperacionalRaw.create({
                        data: req.body,
                    })];
            case 1:
                descricao = _a.sent();
                res.status(201).json(descricao);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT /api/descricoes-raw/:id - Atualizar descrição raw
router.put('/:id', auth_1.authenticateToken, (0, validation_1.validate)({ body: updateDescricaoRawSchema }), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, descricao, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, req.prisma.descricaoOperacionalRaw.update({
                        where: { id: id },
                        data: req.body,
                    })];
            case 1:
                descricao = _a.sent();
                res.json(descricao);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                if (error_4.code === 'P2025') {
                    return [2 /*return*/, res.status(404).json({ error: 'Descrição raw não encontrada' })];
                }
                next(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// DELETE /api/descricoes-raw/:id - Deletar descrição raw
router.delete('/:id', auth_1.authenticateToken, (0, permissions_1.requirePermission)('descricoes_raw', 'delete'), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, req.prisma.descricaoOperacionalRaw.delete({
                        where: { id: id },
                    })];
            case 1:
                _a.sent();
                res.status(204).send();
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                if (error_5.code === 'P2025') {
                    return [2 /*return*/, res.status(404).json({ error: 'Descrição raw não encontrada' })];
                }
                next(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/descricoes-raw/:id/processar - Processar descrição raw com IA
router.post('/:id/processar', auth_1.authenticateToken, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, criar_processo, tenantId, processo, tenantId, resultado, error_6;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                id = req.params.id;
                criar_processo = req.query.criar_processo;
                if (!(criar_processo === 'true')) return [3 /*break*/, 2];
                tenantId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.tenant_id;
                if (!tenantId)
                    throw new Error('Tenant ID não encontrado no usuário');
                return [4 /*yield*/, processamento_ia_1.ProcessamentoIAService.processarECriar(id, tenantId)];
            case 1:
                processo = _c.sent();
                res.json({
                    success: true,
                    processo: processo,
                    message: 'Descrição processada e processo normalizado criado',
                });
                return [3 /*break*/, 4];
            case 2:
                tenantId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.tenant_id;
                if (!tenantId)
                    throw new Error('Tenant ID não encontrado no usuário');
                return [4 /*yield*/, processamento_ia_1.ProcessamentoIAService.processarDescricaoRaw(id, tenantId)];
            case 3:
                resultado = _c.sent();
                res.json({
                    success: true,
                    resultado: resultado,
                    message: 'Descrição processada com sucesso',
                });
                _c.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_6 = _c.sent();
                next(error_6);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
