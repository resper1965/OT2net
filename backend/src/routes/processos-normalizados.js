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
var auth_1 = require("../middleware/auth");
var mermaid_generator_1 = require("../services/mermaid-generator");
var router = (0, express_1.Router)();
// GET /api/processos-normalizados - Listar processos normalizados
router.get('/', auth_1.authenticateToken, (0, permissions_1.requirePermission)('processos_normalizados', 'read'), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, projeto_id, status_1, where, processos, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, projeto_id = _a.projeto_id, status_1 = _a.status;
                where = {};
                if (projeto_id) {
                    where.descricao_raw = {
                        projeto_id: projeto_id,
                    };
                }
                if (status_1)
                    where.status = status_1;
                return [4 /*yield*/, req.prisma.processoNormalizado.findMany({
                        where: where,
                        orderBy: { created_at: 'desc' },
                        include: {
                            descricao_raw: {
                                include: {
                                    projeto: true,
                                    site: true,
                                },
                            },
                            etapas: {
                                orderBy: { ordem: 'asc' },
                            },
                        },
                    })];
            case 1:
                processos = _b.sent();
                res.json(processos);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/processos-normalizados/:id - Obter processo normalizado por ID
router.get('/:id', auth_1.authenticateToken, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, processo, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, req.prisma.processoNormalizado.findUnique({
                        where: { id: id },
                        include: {
                            descricao_raw: {
                                include: {
                                    projeto: true,
                                    site: true,
                                },
                            },
                            etapas: {
                                orderBy: { ordem: 'asc' },
                            },
                            ativos: true,
                            dificuldades: true,
                            workarounds: true,
                            riscos: true,
                        },
                    })];
            case 1:
                processo = _a.sent();
                if (!processo) {
                    return [2 /*return*/, res.status(404).json({ error: 'Processo normalizado não encontrado' })];
                }
                res.json(processo);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/processos-normalizados/:id/diagrama - Gerar diagrama Mermaid
router.get('/:id/diagrama', auth_1.authenticateToken, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, tipo, processo, diagrama, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                _a = req.query.tipo, tipo = _a === void 0 ? 'flowchart' : _a;
                return [4 /*yield*/, req.prisma.processoNormalizado.findUnique({
                        where: { id: id },
                        include: {
                            etapas: {
                                orderBy: { ordem: 'asc' },
                            },
                        },
                    })];
            case 1:
                processo = _b.sent();
                if (!processo) {
                    return [2 /*return*/, res.status(404).json({ error: 'Processo normalizado não encontrado' })];
                }
                diagrama = void 0;
                switch (tipo) {
                    case 'sequence':
                        diagrama = mermaid_generator_1.MermaidGeneratorService.generateSequence(processo);
                        break;
                    case 'state':
                        diagrama = mermaid_generator_1.MermaidGeneratorService.generateStateDiagram(processo);
                        break;
                    case 'flowchart':
                    default:
                        diagrama = mermaid_generator_1.MermaidGeneratorService.generateFlowchart(processo);
                        break;
                }
                res.json({
                    processo_id: id,
                    tipo: tipo,
                    diagrama: diagrama,
                    mime_type: 'text/plain',
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT /api/processos-normalizados/:id - Atualizar processo normalizado
router.put('/:id', auth_1.authenticateToken, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, updateSchema, data, processo, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                updateSchema = zod_1.z.object({
                    nome: zod_1.z.string().optional(),
                    objetivo: zod_1.z.string().optional(),
                    gatilho: zod_1.z.string().optional(),
                    frequencia: zod_1.z.string().optional(),
                    duracao_estimada: zod_1.z.string().optional(),
                    criticidade: zod_1.z.string().optional(),
                    dependencias: zod_1.z.array(zod_1.z.string()).optional(),
                    observacoes_gerais: zod_1.z.string().optional(),
                    status: zod_1.z.string().optional(),
                });
                data = updateSchema.parse(req.body);
                return [4 /*yield*/, req.prisma.processoNormalizado.update({
                        where: { id: id },
                        data: data,
                        include: {
                            etapas: {
                                orderBy: { ordem: 'asc' },
                            },
                        },
                    })];
            case 1:
                processo = _a.sent();
                res.json(processo);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
