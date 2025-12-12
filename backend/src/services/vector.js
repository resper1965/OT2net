"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.VectorService = void 0;
var gemini_1 = require("./gemini");
var vertex_search_1 = require("./vertex-search");
var prisma_1 = require("../lib/prisma");
var logger_1 = require("../utils/logger");
var errorHandler_1 = require("../middleware/errorHandler");
/**
 * Serviço de vetorização e busca semântica
 * Usa pgvector para armazenar embeddings e busca por similaridade
 */
var VectorService = /** @class */ (function () {
    function VectorService() {
    }
    /**
    /**
     * Gera embedding usando Vertex AI (Gecko)
     */
    VectorService.generateEmbedding = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, gemini_1.GeminiService.generateEmbedding(text)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Vetoriza um requisito de framework e salva no banco
     */
    VectorService.vectorizeRequisito = function (requisitoId_1, texto_1) {
        return __awaiter(this, arguments, void 0, function (requisitoId, texto, tenantId // Default null para compatibilidade, ideal ser obrigatório
        ) {
            var embedding, error_1;
            if (tenantId === void 0) { tenantId = null; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, gemini_1.GeminiService.generateEmbedding(texto)
                            // 1. Atualizar Postgres (Persistence + Fallback)
                            // Mesmo usando Vertex, guardamos o vetor no banco se coluna existir, ou apenas metadados
                        ];
                    case 1:
                        embedding = _a.sent();
                        // 1. Atualizar Postgres (Persistence + Fallback)
                        // Mesmo usando Vertex, guardamos o vetor no banco se coluna existir, ou apenas metadados
                        return [4 /*yield*/, prisma_1.prisma.$executeRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        UPDATE requisitos_framework\n        SET embedding = ", "::vector,\n            data_vetorizacao = NOW()\n        WHERE id = ", "::uuid\n      "], ["\n        UPDATE requisitos_framework\n        SET embedding = ", "::vector,\n            data_vetorizacao = NOW()\n        WHERE id = ", "::uuid\n      "
                                // 2. Indexar no Vertex AI (Busca Performática Multitenant)
                            ])), embedding, requisitoId)];
                    case 2:
                        // 1. Atualizar Postgres (Persistence + Fallback)
                        // Mesmo usando Vertex, guardamos o vetor no banco se coluna existir, ou apenas metadados
                        _a.sent();
                        // 2. Indexar no Vertex AI (Busca Performática Multitenant)
                        return [4 /*yield*/, vertex_search_1.VertexSearchService.upsertVector(requisitoId, embedding, tenantId)];
                    case 3:
                        // 2. Indexar no Vertex AI (Busca Performática Multitenant)
                        _a.sent();
                        logger_1.logger.info({ requisitoId: requisitoId, tenantId: tenantId }, 'Requisito vetorizado e indexado com sucesso');
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        logger_1.logger.error({ requisitoId: requisitoId, error: error_1.message }, 'Erro ao vetorizar requisito');
                        throw new errorHandler_1.AppError("Erro ao vetorizar requisito: ".concat(error_1.message), 500);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Busca requisitos similares usando busca semântica
     * @param queryEmbedding Embedding da query de busca
     * @param limit Número máximo de resultados
     * @param threshold Threshold mínimo de similaridade (0-1)
     */
    VectorService.buscarRequisitosSimilares = function (queryEmbedding_1) {
        return __awaiter(this, arguments, void 0, function (queryEmbedding, limit, threshold, framework, tenantId // null para global
        ) {
            var vertexResults_1, ids, requisitos_1, resultados, error_2;
            if (limit === void 0) { limit = 10; }
            if (threshold === void 0) { threshold = 0.7; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, vertex_search_1.VertexSearchService.search(queryEmbedding, tenantId || null, limit)];
                    case 1:
                        vertexResults_1 = _a.sent();
                        if (vertexResults_1.length === 0) {
                            return [2 /*return*/, []];
                        }
                        ids = vertexResults_1.map(function (r) { return r.id; });
                        return [4 /*yield*/, prisma_1.prisma.requisitoFramework.findMany({
                                where: {
                                    id: { in: ids }
                                },
                                select: {
                                    id: true,
                                    framework: true,
                                    codigo: true,
                                    titulo: true,
                                    descricao: true,
                                    // embedding: false // carrega muito peso desnecessario
                                }
                            })
                            // Mapear scores de similaridade do Vertex (se disponivel) ou reordenar
                        ];
                    case 2:
                        requisitos_1 = _a.sent();
                        resultados = ids.map(function (id) {
                            var req = requisitos_1.find(function (r) { return r.id === id; });
                            var vertexRes = vertexResults_1.find(function (r) { return r.id === id; });
                            if (!req)
                                return null;
                            return __assign(__assign({}, req), { similaridade: vertexRes ? (1 - vertexRes.distancia) : 0 // Vertex geralmente retorna distância
                             });
                        }).filter(Boolean);
                        return [2 /*return*/, resultados];
                    case 3:
                        error_2 = _a.sent();
                        logger_1.logger.error({ error: error_2.message }, 'Erro na busca semântica');
                        throw new errorHandler_1.AppError("Erro na busca sem\u00E2ntica: ".concat(error_2.message), 500);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Analisa conformidade de uma entidade com requisitos regulatórios
     * @param entidadeTipo Tipo da entidade (processo, controle, documento)
     * @param entidadeId ID da entidade
     * @param texto Texto da entidade para análise
     */
    VectorService.analisarConformidade = function (entidadeTipo, entidadeId, texto, tenantId) {
        return __awaiter(this, void 0, void 0, function () {
            var embedding, requisitosSimilares, analises, error_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, gemini_1.GeminiService.generateEmbedding(texto)
                            // Buscar requisitos similares (Global ou do Tenant)
                        ];
                    case 1:
                        embedding = _a.sent();
                        return [4 /*yield*/, this.buscarRequisitosSimilares(embedding, 20, 0.6, // Threshold
                            undefined, tenantId // Passando o tenantId
                            )
                            // Criar análises de conformidade
                        ];
                    case 2:
                        requisitosSimilares = _a.sent();
                        return [4 /*yield*/, Promise.all(requisitosSimilares.map(function (requisito) { return __awaiter(_this, void 0, void 0, function () {
                                var status;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            status = 'nao_atendido';
                                            if (requisito.similaridade >= 0.9) {
                                                status = 'atendido';
                                            }
                                            else if (requisito.similaridade >= 0.7) {
                                                status = 'parcialmente_atendido';
                                            }
                                            return [4 /*yield*/, prisma_1.prisma.analiseConformidade.create({
                                                    data: {
                                                        tenant_id: tenantId,
                                                        requisito_id: requisito.id,
                                                        entidade_tipo: entidadeTipo,
                                                        entidade_id: entidadeId,
                                                        similaridade: requisito.similaridade,
                                                        status: status,
                                                        analisado_por_ia: true,
                                                    },
                                                })];
                                        case 1: 
                                        // Criar análise
                                        return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); }))];
                    case 3:
                        analises = _a.sent();
                        logger_1.logger.info({ entidadeTipo: entidadeTipo, entidadeId: entidadeId, count: analises.length }, 'Análise de conformidade realizada');
                        return [2 /*return*/, analises];
                    case 4:
                        error_3 = _a.sent();
                        logger_1.logger.error({ entidadeTipo: entidadeTipo, entidadeId: entidadeId, error: error_3.message }, 'Erro na análise de conformidade');
                        throw new errorHandler_1.AppError("Erro na an\u00E1lise de conformidade: ".concat(error_3.message), 500);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Processa vetorização em lote de requisitos
     */
    VectorService.processarVetorizacaoEmLote = function (requisitos_2) {
        return __awaiter(this, arguments, void 0, function (requisitos, batchSize) {
            var resultados, i, batch;
            var _this = this;
            if (batchSize === void 0) { batchSize = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resultados = {
                            sucesso: 0,
                            erro: 0,
                            erros: [],
                        };
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < requisitos.length)) return [3 /*break*/, 5];
                        batch = requisitos.slice(i, i + batchSize);
                        return [4 /*yield*/, Promise.allSettled(batch.map(function (requisito) { return __awaiter(_this, void 0, void 0, function () {
                                var error_4;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, this.vectorizeRequisito(requisito.id, requisito.texto)];
                                        case 1:
                                            _a.sent();
                                            resultados.sucesso++;
                                            return [3 /*break*/, 3];
                                        case 2:
                                            error_4 = _a.sent();
                                            resultados.erro++;
                                            resultados.erros.push({
                                                id: requisito.id,
                                                erro: error_4.message,
                                            });
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }))
                            // Delay entre batches para evitar rate limiting
                        ];
                    case 2:
                        _a.sent();
                        if (!(i + batchSize < requisitos.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i += batchSize;
                        return [3 /*break*/, 1];
                    case 5:
                        logger_1.logger.info({ sucesso: resultados.sucesso, erro: resultados.erro }, 'Vetorização em lote concluída');
                        return [2 /*return*/, resultados];
                }
            });
        });
    };
    return VectorService;
}());
exports.VectorService = VectorService;
var templateObject_1;
