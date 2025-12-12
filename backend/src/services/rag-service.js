"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.RAGService = void 0;
var gemini_1 = require("./gemini");
var prisma_1 = require("../lib/prisma");
var logger_1 = require("../utils/logger");
var errorHandler_1 = require("../middleware/errorHandler");
var RAGService = /** @class */ (function () {
    function RAGService() {
    }
    /**
     * Busca regras similares usando busca semântica
     */
    RAGService.buscarRegrasSimilares = function (query, options) {
        return __awaiter(this, void 0, void 0, function () {
            var queryEmbedding, limit, threshold, framework, resultados, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, gemini_1.GeminiService.generateEmbedding(query)];
                    case 1:
                        queryEmbedding = _a.sent();
                        limit = (options === null || options === void 0 ? void 0 : options.limit) || 10;
                        threshold = (options === null || options === void 0 ? void 0 : options.threshold) || 0.7;
                        framework = options === null || options === void 0 ? void 0 : options.framework;
                        return [4 /*yield*/, prisma_1.prisma.$queryRaw(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n        SELECT \n          id,\n          framework,\n          codigo,\n          titulo,\n          descricao,\n          categoria,\n          1 - (embedding <=> ", "::vector) as similaridade\n        FROM requisitos_framework\n        WHERE \n          embedding IS NOT NULL\n          AND (1 - (embedding <=> ", "::vector)) >= ", "\n          ", "\n        ORDER BY embedding <=> ", "::vector\n        LIMIT ", "\n      "], ["\n        SELECT \n          id,\n          framework,\n          codigo,\n          titulo,\n          descricao,\n          categoria,\n          1 - (embedding <=> ", "::vector) as similaridade\n        FROM requisitos_framework\n        WHERE \n          embedding IS NOT NULL\n          AND (1 - (embedding <=> ", "::vector)) >= ", "\n          ", "\n        ORDER BY embedding <=> ", "::vector\n        LIMIT ", "\n      "])), queryEmbedding, queryEmbedding, threshold, framework ? prisma_1.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["AND framework = ", ""], ["AND framework = ", ""])), framework) : prisma_1.prisma.$queryRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject([""], [""]))), queryEmbedding, limit)];
                    case 2:
                        resultados = _a.sent();
                        logger_1.logger.info({ count: resultados.length, threshold: threshold, framework: framework }, 'Busca semântica de regras realizada');
                        return [2 /*return*/, resultados];
                    case 3:
                        error_1 = _a.sent();
                        logger_1.logger.error({ error: error_1.message }, 'Erro na busca semântica de regras');
                        throw new errorHandler_1.AppError("Erro na busca sem\u00E2ntica: ".concat(error_1.message), 500);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Consulta regras regulatórias usando RAG com Gemini
     * Retorna resposta contextualizada baseada nas regras encontradas
     */
    RAGService.consultarRegras = function (pergunta, options) {
        return __awaiter(this, void 0, void 0, function () {
            var regrasSimilares, contexto, frameworkContext, systemInstruction, prompt_1, resposta, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.buscarRegrasSimilares(pergunta, {
                                framework: options === null || options === void 0 ? void 0 : options.framework,
                                limit: (options === null || options === void 0 ? void 0 : options.maxRegras) || 5,
                                threshold: 0.6, // Threshold mais baixo para capturar mais contexto
                            })];
                    case 1:
                        regrasSimilares = _b.sent();
                        if (regrasSimilares.length === 0) {
                            return [2 /*return*/, {
                                    resposta: 'Não foram encontradas regras regulatórias relevantes para sua consulta.',
                                    regrasEncontradas: [],
                                    contexto: null,
                                }];
                        }
                        contexto = regrasSimilares
                            .map(function (regra) { return "\n**".concat(regra.framework, " - ").concat(regra.codigo, ": ").concat(regra.titulo, "**\n").concat(regra.descricao, "\n").concat(regra.categoria ? "Categoria: ".concat(regra.categoria) : '', "\nSimilaridade: ").concat((regra.similaridade * 100).toFixed(1), "%\n"); })
                            .join('\n\n---\n\n');
                        frameworkContext = ((_a = regrasSimilares[0]) === null || _a === void 0 ? void 0 : _a.framework) || (options === null || options === void 0 ? void 0 : options.framework) || 'GERAL';
                        systemInstruction = '';
                        if (frameworkContext === 'BPMN') {
                            systemInstruction = "Voc\u00EA \u00E9 um especialista em BPMN 2.0 (Business Process Model and Notation 2.0), o padr\u00E3o internacional para modelagem de processos de neg\u00F3cio.\n\nSua fun\u00E7\u00E3o \u00E9 responder perguntas sobre normas e especifica\u00E7\u00F5es BPMN 2.0 relacionadas a:\n- Elementos de modelagem (atividades, eventos, gateways, fluxos)\n- Nota\u00E7\u00E3o e s\u00EDmbolos BPMN\n- Padr\u00F5es de modelagem e boas pr\u00E1ticas\n- Sem\u00E2ntica e execu\u00E7\u00E3o de processos\n- Conformidade com a especifica\u00E7\u00E3o BPMN 2.0\n\nUse APENAS as normas fornecidas no contexto para responder. Se a pergunta n\u00E3o estiver relacionada \u00E0s normas fornecidas, informe isso claramente.\n\nSeja preciso, cite os c\u00F3digos/se\u00E7\u00F5es das normas quando relevante, e forne\u00E7a respostas pr\u00E1ticas e acion\u00E1veis com exemplos quando apropriado.";
                        }
                        else {
                            systemInstruction = "Voc\u00EA \u00E9 um especialista em regula\u00E7\u00F5es da ANEEL (Ag\u00EAncia Nacional de Energia El\u00E9trica) e ONS (Operador Nacional do Sistema El\u00E9trico) sobre redes operativas.\n\nSua fun\u00E7\u00E3o \u00E9 responder perguntas sobre regras regulat\u00F3rias relacionadas a:\n- Redes operativas de energia el\u00E9trica\n- Requisitos de seguran\u00E7a e opera\u00E7\u00E3o\n- Normas t\u00E9cnicas e procedimentos\n- Conformidade regulat\u00F3ria\n\nUse APENAS as regras fornecidas no contexto para responder. Se a pergunta n\u00E3o estiver relacionada \u00E0s regras fornecidas, informe isso claramente.\n\nSeja preciso, cite os c\u00F3digos das regras quando relevante, e forne\u00E7a respostas pr\u00E1ticas e acion\u00E1veis.";
                        }
                        prompt_1 = "Com base nas seguintes regras regulat\u00F3rias, responda \u00E0 pergunta do usu\u00E1rio:\n\n".concat(contexto, "\n\n---\n\nPergunta do usu\u00E1rio: ").concat(pergunta, "\n\nForne\u00E7a uma resposta clara e precisa, citando as regras relevantes quando apropriado.");
                        return [4 /*yield*/, gemini_1.GeminiService.sendMessage(prompt_1, {
                                systemInstruction: systemInstruction,
                                temperature: 0.3, // Menor temperatura para respostas mais precisas
                            })];
                    case 2:
                        resposta = _b.sent();
                        return [2 /*return*/, {
                                resposta: resposta.content,
                                regrasEncontradas: regrasSimilares.map(function (r) { return ({
                                    id: r.id,
                                    framework: r.framework,
                                    codigo: r.codigo,
                                    titulo: r.titulo,
                                    similaridade: r.similaridade,
                                }); }),
                                contexto: (options === null || options === void 0 ? void 0 : options.includeContext) ? contexto : null,
                            }];
                    case 3:
                        error_2 = _b.sent();
                        logger_1.logger.error({ error: error_2.message }, 'Erro ao consultar regras via RAG');
                        throw new errorHandler_1.AppError("Erro ao consultar regras: ".concat(error_2.message), 500);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Vetoriza e salva uma regra regulatória ou norma no banco
     */
    RAGService.adicionarRegra = function (framework, codigo, titulo, descricao, categoria, versao) {
        return __awaiter(this, void 0, void 0, function () {
            var existente, textoCompleto, embedding, requisito, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, prisma_1.prisma.requisitoFramework.findFirst({
                                where: {
                                    framework: framework,
                                    codigo: codigo,
                                },
                            })];
                    case 1:
                        existente = _a.sent();
                        if (existente) {
                            throw new errorHandler_1.AppError("Regra ".concat(framework, " ").concat(codigo, " j\u00E1 existe"), 409);
                        }
                        textoCompleto = "".concat(titulo, "\n\n").concat(descricao);
                        return [4 /*yield*/, gemini_1.GeminiService.generateEmbedding(textoCompleto)
                            // Criar requisito usando Prisma
                            // @ts-ignore
                        ];
                    case 2:
                        embedding = _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.requisitoFramework.create({
                                data: {
                                    framework: framework,
                                    codigo: codigo,
                                    titulo: titulo,
                                    descricao: descricao,
                                    categoria: categoria || null,
                                    versao: versao || null,
                                    data_vetorizacao: new Date(),
                                },
                            })
                            // Atualizar embedding usando SQL raw (pgvector requer SQL direto)
                        ];
                    case 3:
                        requisito = _a.sent();
                        // Atualizar embedding usando SQL raw (pgvector requer SQL direto)
                        return [4 /*yield*/, prisma_1.prisma.$executeRaw(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n        UPDATE requisitos_framework\n        SET embedding = ", "::vector\n        WHERE id = ", "::uuid\n      "], ["\n        UPDATE requisitos_framework\n        SET embedding = ", "::vector\n        WHERE id = ", "::uuid\n      "])), embedding, requisito.id)];
                    case 4:
                        // Atualizar embedding usando SQL raw (pgvector requer SQL direto)
                        _a.sent();
                        logger_1.logger.info({ framework: framework, codigo: codigo, requisitoId: requisito.id }, 'Regra adicionada e vetorizada com sucesso');
                        return [2 /*return*/, requisito];
                    case 5:
                        error_3 = _a.sent();
                        if (error_3 instanceof errorHandler_1.AppError) {
                            throw error_3;
                        }
                        logger_1.logger.error({ framework: framework, codigo: codigo, error: error_3.message }, 'Erro ao adicionar regra');
                        throw new errorHandler_1.AppError("Erro ao adicionar regra: ".concat(error_3.message), 500);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Atualiza embedding de uma regra existente
     */
    RAGService.reVetorizarRegra = function (requisitoId) {
        return __awaiter(this, void 0, void 0, function () {
            var requisito, textoCompleto, embedding, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, prisma_1.prisma.requisitoFramework.findUnique({
                                where: { id: requisitoId },
                            })];
                    case 1:
                        requisito = _a.sent();
                        if (!requisito) {
                            throw new errorHandler_1.AppError('Requisito não encontrado', 404);
                        }
                        textoCompleto = "".concat(requisito.titulo, "\n\n").concat(requisito.descricao);
                        return [4 /*yield*/, gemini_1.GeminiService.generateEmbedding(textoCompleto)
                            // Atualizar embedding
                        ];
                    case 2:
                        embedding = _a.sent();
                        // Atualizar embedding
                        return [4 /*yield*/, prisma_1.prisma.$executeRaw(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n        UPDATE requisitos_framework\n        SET embedding = ", "::vector,\n            data_vetorizacao = NOW()\n        WHERE id = ", "::uuid\n      "], ["\n        UPDATE requisitos_framework\n        SET embedding = ", "::vector,\n            data_vetorizacao = NOW()\n        WHERE id = ", "::uuid\n      "])), embedding, requisitoId)];
                    case 3:
                        // Atualizar embedding
                        _a.sent();
                        logger_1.logger.info({ requisitoId: requisitoId }, 'Regra re-vetorizada com sucesso');
                        return [3 /*break*/, 5];
                    case 4:
                        error_4 = _a.sent();
                        if (error_4 instanceof errorHandler_1.AppError) {
                            throw error_4;
                        }
                        logger_1.logger.error({ requisitoId: requisitoId, error: error_4.message }, 'Erro ao re-vetorizar regra');
                        throw new errorHandler_1.AppError("Erro ao re-vetorizar regra: ".concat(error_4.message), 500);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Processa e vetoriza regras em lote
     */
    RAGService.processarRegrasEmLote = function (regras_1) {
        return __awaiter(this, arguments, void 0, function (regras, batchSize) {
            var resultados, i, batch;
            var _this = this;
            if (batchSize === void 0) { batchSize = 5; }
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
                        if (!(i < regras.length)) return [3 /*break*/, 5];
                        batch = regras.slice(i, i + batchSize);
                        return [4 /*yield*/, Promise.allSettled(batch.map(function (regra) { return __awaiter(_this, void 0, void 0, function () {
                                var error_5;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, this.adicionarRegra(regra.framework, regra.codigo, regra.titulo, regra.descricao, regra.categoria, regra.versao)];
                                        case 1:
                                            _a.sent();
                                            resultados.sucesso++;
                                            return [3 /*break*/, 3];
                                        case 2:
                                            error_5 = _a.sent();
                                            resultados.erro++;
                                            resultados.erros.push({
                                                codigo: regra.codigo,
                                                erro: error_5.message,
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
                        if (!(i + batchSize < regras.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i += batchSize;
                        return [3 /*break*/, 1];
                    case 5:
                        logger_1.logger.info({ sucesso: resultados.sucesso, erro: resultados.erro }, 'Processamento em lote de regras concluído');
                        return [2 /*return*/, resultados];
                }
            });
        });
    };
    /**
     * Lista regras por framework
     */
    RAGService.listarRegras = function (framework_1) {
        return __awaiter(this, arguments, void 0, function (framework, limit, offset) {
            var regras, total, error_6;
            if (limit === void 0) { limit = 50; }
            if (offset === void 0) { offset = 0; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, prisma_1.prisma.requisitoFramework.findMany({
                                where: framework ? { framework: framework } : undefined,
                                take: limit,
                                skip: offset,
                                orderBy: { created_at: 'desc' },
                                select: {
                                    id: true,
                                    framework: true,
                                    codigo: true,
                                    titulo: true,
                                    descricao: true,
                                    categoria: true,
                                    versao: true,
                                    data_vetorizacao: true,
                                    created_at: true,
                                },
                            })];
                    case 1:
                        regras = _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.requisitoFramework.count({
                                where: framework ? { framework: framework } : undefined,
                            })];
                    case 2:
                        total = _a.sent();
                        return [2 /*return*/, {
                                regras: regras,
                                total: total,
                                limit: limit,
                                offset: offset,
                            }];
                    case 3:
                        error_6 = _a.sent();
                        logger_1.logger.error({ error: error_6.message }, 'Erro ao listar regras');
                        throw new errorHandler_1.AppError("Erro ao listar regras: ".concat(error_6.message), 500);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return RAGService;
}());
exports.RAGService = RAGService;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
