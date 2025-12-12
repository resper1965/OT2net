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
exports.GeminiService = void 0;
var generative_ai_1 = require("@google/generative-ai");
var logger_1 = require("../utils/logger");
var prisma_1 = require("../lib/prisma");
var errorHandler_1 = require("../middleware/errorHandler");
/**
 * Serviço de integração com Google Gemini AI
 */
var GeminiService = /** @class */ (function () {
    function GeminiService() {
    }
    GeminiService.initialize = function () {
        if (!this.genAI) {
            if (!process.env.GEMINI_API_KEY) {
                logger_1.logger.warn('GEMINI_API_KEY não configurada');
                throw new errorHandler_1.AppError('GEMINI_API_KEY não configurada', 500);
            }
            this.genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            this.modelPro = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
            this.modelFlash = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            this.embeddingModel = this.genAI.getGenerativeModel({ model: 'text-embedding-004' });
        }
    };
    /**
     * Envia mensagem para Gemini API
     * @param prompt Prompt do usuário
     * @param systemInstruction Instrução de sistema (opcional)
     * @param useFlash Se true, usa modelo Flash (mais rápido/barato). Se false, usa Pro. Default: false
     * @param jsonMode Se true, força resposta em JSON. Default: false
     */
    GeminiService.sendMessage = function (prompt, options) {
        return __awaiter(this, void 0, void 0, function () {
            var modelParams, generationConfig, model, specificModel, result, response, text, usage, error_1, errorMessage;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.initialize();
                        modelParams = {};
                        if (options === null || options === void 0 ? void 0 : options.systemInstruction) {
                            modelParams.systemInstruction = options.systemInstruction;
                        }
                        generationConfig = {
                            temperature: (_a = options === null || options === void 0 ? void 0 : options.temperature) !== null && _a !== void 0 ? _a : 0.7,
                        };
                        if (options === null || options === void 0 ? void 0 : options.jsonMode) {
                            generationConfig.responseMimeType = "application/json";
                        }
                        model = (options === null || options === void 0 ? void 0 : options.useFlash) ? this.modelFlash : this.modelPro;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        specificModel = this.genAI.getGenerativeModel({
                            model: (options === null || options === void 0 ? void 0 : options.useFlash) ? 'gemini-1.5-flash' : 'gemini-1.5-pro',
                            systemInstruction: options === null || options === void 0 ? void 0 : options.systemInstruction,
                            generationConfig: generationConfig
                        });
                        return [4 /*yield*/, specificModel.generateContent(prompt)];
                    case 2:
                        result = _b.sent();
                        return [4 /*yield*/, result.response];
                    case 3:
                        response = _b.sent();
                        text = response.text();
                        usage = response.usageMetadata;
                        if (usage) {
                            logger_1.logger.info({
                                inputTokens: usage.promptTokenCount,
                                outputTokens: usage.candidatesTokenCount,
                                model: (options === null || options === void 0 ? void 0 : options.useFlash) ? 'flash' : 'pro'
                            }, 'Chamada Gemini realizada');
                            // Registrar no banco (Assíncrono)
                            this.logCall('gemini_generation', usage.promptTokenCount, usage.candidatesTokenCount, true);
                        }
                        return [2 /*return*/, {
                                content: text,
                                usage: usage
                            }];
                    case 4:
                        error_1 = _b.sent();
                        errorMessage = error_1.message || 'Erro desconhecido na chamada Gemini';
                        logger_1.logger.error({ error: errorMessage }, 'Erro Gemini API');
                        this.logCall('gemini_generation', 0, 0, false, errorMessage);
                        throw new errorHandler_1.AppError("Erro Gemini: ".concat(errorMessage), 500);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gera embedding para texto
     */
    GeminiService.generateEmbedding = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var result, embedding, error_2, errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.initialize();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.embeddingModel.embedContent(text)];
                    case 2:
                        result = _a.sent();
                        embedding = result.embedding.values;
                        return [2 /*return*/, embedding];
                    case 3:
                        error_2 = _a.sent();
                        errorMessage = error_2.message;
                        logger_1.logger.error({ error: errorMessage }, 'Erro ao gerar embedding Gemini');
                        throw new errorHandler_1.AppError("Erro Embedding: ".concat(errorMessage), 500);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Registra chamada no banco (placeholder para manter compatibilidade com logica anterior)
     */
    GeminiService.logCall = function (funcionalidade, inputTokens, outputTokens, sucesso, erro) {
        return __awaiter(this, void 0, void 0, function () {
            var custo, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        custo = 0;
                        return [4 /*yield*/, prisma_1.prisma.chamadaIA.create({
                                data: {
                                    funcionalidade: funcionalidade,
                                    tokens_input: inputTokens,
                                    tokens_output: outputTokens,
                                    custo: custo,
                                    sucesso: sucesso,
                                    erro: erro || null
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        logger_1.logger.warn('Falha ao registrar log de IA');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return GeminiService;
}());
exports.GeminiService = GeminiService;
