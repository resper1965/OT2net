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
var auth_1 = require("../middleware/auth");
var permissions_1 = require("../middleware/permissions");
var rag_service_1 = require("../services/rag-service");
var errorHandler_1 = require("../middleware/errorHandler");
var zod_1 = require("zod");
var router = (0, express_1.Router)();
/**
 * Schema de validação para consulta de regras
 */
var consultaRegrasSchema = zod_1.z.object({
    pergunta: zod_1.z.string().min(10, 'A pergunta deve ter pelo menos 10 caracteres'),
    framework: zod_1.z.enum(['ANEEL', 'ONS', 'BPMN']).optional(),
    maxRegras: zod_1.z.number().int().min(1).max(20).optional(),
    includeContext: zod_1.z.boolean().optional(),
});
/**
 * Schema de validação para adicionar regra
 */
var adicionarRegraSchema = zod_1.z.object({
    framework: zod_1.z.enum(['ANEEL', 'ONS', 'BPMN']),
    codigo: zod_1.z.string().min(1, 'Código é obrigatório'),
    titulo: zod_1.z.string().min(1, 'Título é obrigatório'),
    descricao: zod_1.z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
    categoria: zod_1.z.string().optional(),
    versao: zod_1.z.string().optional(),
});
/**
 * POST /api/rag/consultar
 * Consulta regras regulatórias usando RAG
 */
router.post('/consultar', auth_1.authenticate, (0, permissions_1.requirePermission)('requisito_framework', 'view'), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var dados, resultado, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                dados = consultaRegrasSchema.parse(req.body);
                return [4 /*yield*/, rag_service_1.RAGService.consultarRegras(dados.pergunta, {
                        framework: dados.framework,
                        maxRegras: dados.maxRegras,
                        includeContext: dados.includeContext,
                    })];
            case 1:
                resultado = _a.sent();
                res.json({
                    sucesso: true,
                    dados: resultado,
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                if (error_1 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({
                            sucesso: false,
                            erro: 'Dados inválidos',
                            detalhes: error_1.errors,
                        })];
                }
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/rag/regras
 * Adiciona uma nova regra regulatória
 */
router.post('/regras', auth_1.authenticate, (0, permissions_1.requirePermission)('requisito_framework', 'create'), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var dados, requisito, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                dados = adicionarRegraSchema.parse(req.body);
                return [4 /*yield*/, rag_service_1.RAGService.adicionarRegra(dados.framework, dados.codigo, dados.titulo, dados.descricao, dados.categoria, dados.versao)];
            case 1:
                requisito = _a.sent();
                res.status(201).json({
                    sucesso: true,
                    dados: requisito,
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                if (error_2 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({
                            sucesso: false,
                            erro: 'Dados inválidos',
                            detalhes: error_2.errors,
                        })];
                }
                if (error_2 instanceof errorHandler_1.AppError && error_2.statusCode === 409) {
                    return [2 /*return*/, res.status(409).json({
                            sucesso: false,
                            erro: error_2.message,
                        })];
                }
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/rag/regras
 * Lista regras regulatórias
 */
router.get('/regras', auth_1.authenticate, (0, permissions_1.requirePermission)('requisito_framework', 'view'), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var framework, limit, offset, resultado, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                framework = req.query.framework;
                limit = parseInt(req.query.limit) || 50;
                offset = parseInt(req.query.offset) || 0;
                if (framework && !['ANEEL', 'ONS', 'BPMN'].includes(framework)) {
                    return [2 /*return*/, res.status(400).json({
                            sucesso: false,
                            erro: 'Framework deve ser ANEEL, ONS ou BPMN',
                        })];
                }
                return [4 /*yield*/, rag_service_1.RAGService.listarRegras(framework, limit, offset)];
            case 1:
                resultado = _a.sent();
                res.json({
                    sucesso: true,
                    dados: resultado,
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/rag/regras/:id/re-vetorizar
 * Re-vetoriza uma regra existente
 */
router.post('/regras/:id/re-vetorizar', auth_1.authenticate, (0, permissions_1.requirePermission)('requisito_framework', 'update'), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, rag_service_1.RAGService.reVetorizarRegra(id)];
            case 1:
                _a.sent();
                res.json({
                    sucesso: true,
                    mensagem: 'Regra re-vetorizada com sucesso',
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/rag/regras/batch
 * Processa múltiplas regras em lote
 */
router.post('/regras/batch', auth_1.authenticate, (0, permissions_1.requirePermission)('requisito_framework', 'create'), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var regras, batchSize, resultado, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                regras = zod_1.z.array(adicionarRegraSchema).parse(req.body.regras);
                batchSize = parseInt(req.body.batchSize) || 5;
                return [4 /*yield*/, rag_service_1.RAGService.processarRegrasEmLote(regras, batchSize)];
            case 1:
                resultado = _a.sent();
                res.json({
                    sucesso: true,
                    dados: resultado,
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                if (error_5 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({
                            sucesso: false,
                            erro: 'Dados inválidos',
                            detalhes: error_5.errors,
                        })];
                }
                next(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/rag/buscar
 * Busca regras similares (sem RAG, apenas busca semântica)
 */
router.get('/buscar', auth_1.authenticate, (0, permissions_1.requirePermission)('requisito_framework', 'view'), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var query, framework, limit, threshold, resultados, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = req.query.q;
                framework = req.query.framework;
                limit = parseInt(req.query.limit) || 10;
                threshold = parseFloat(req.query.threshold) || 0.7;
                if (!query || query.length < 3) {
                    return [2 /*return*/, res.status(400).json({
                            sucesso: false,
                            erro: 'Query deve ter pelo menos 3 caracteres',
                        })];
                }
                if (framework && !['ANEEL', 'ONS', 'BPMN'].includes(framework)) {
                    return [2 /*return*/, res.status(400).json({
                            sucesso: false,
                            erro: 'Framework deve ser ANEEL, ONS ou BPMN',
                        })];
                }
                return [4 /*yield*/, rag_service_1.RAGService.buscarRegrasSimilares(query, {
                        framework: framework,
                        limit: limit,
                        threshold: threshold,
                    })];
            case 1:
                resultados = _a.sent();
                res.json({
                    sucesso: true,
                    dados: resultados,
                });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                next(error_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
