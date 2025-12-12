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
exports.VertexSearchService = void 0;
var logger_1 = require("../utils/logger");
var errorHandler_1 = require("../middleware/errorHandler");
var VertexSearchService = /** @class */ (function () {
    function VertexSearchService() {
    }
    // Nota: Em um ambiente real, usaríamos @google-cloud/aiplatform
    // SDK oficial pode ser pesado, aqui simulamos a estrutura REST ou SDK wrapper
    /**
     * Busca vetores similares no Vertex AI com filtro de Tenant
     */
    VertexSearchService.search = function (queryVector_1, tenantId_1) {
        return __awaiter(this, arguments, void 0, function (queryVector, tenantId, // null = busca global apenas (se permitido) ou erro
        limit, filters // Filtros adicionais
        ) {
            var restricts;
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                if (!this.indexEndpointId) {
                    if (process.env.NODE_ENV === 'production') {
                        throw new errorHandler_1.AppError("Vertex AI Index Endpoint não configurado", 500);
                    }
                    logger_1.logger.warn("Vertex AI não configurado. Retornando resultados mockados.");
                    return [2 /*return*/, []];
                }
                try {
                    restricts = [];
                    if (tenantId) {
                        restricts.push({
                            namespace: "tenant_id",
                            allowList: [tenantId]
                        });
                    }
                    else {
                        // Se tenantId é null (Global RAG), filtramos por tenant_id = 'global' ou similar
                        // Ou buscamos sem restrição se a intenção for buscar em tudo (cuidado com vazamento)
                        // Assumindo estratégia: Busca Global explicita
                        restricts.push({
                            namespace: "scope",
                            allowList: ["global"]
                        });
                    }
                    // TODO: Implementar chamada real ao Vertex AI
                    // const client = new MatchServiceClient(...)
                    // const response = client.findNeighbors(...)
                    logger_1.logger.info({ tenantId: tenantId, count: limit }, "Busca no Vertex AI realizada (Simulada)");
                    return [2 /*return*/, []];
                }
                catch (error) {
                    logger_1.logger.error({ error: error.message }, "Erro ao buscar no Vertex AI");
                    throw new errorHandler_1.AppError("Erro Vertex AI: ".concat(error.message), 500);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Indexa ou atualiza um vetor no Vertex AI
     * Na prática, Vertex AI Index update é assíncrono (Batch ou Streaming)
     */
    VertexSearchService.upsertVector = function (id_1, vector_1, tenantId_1) {
        return __awaiter(this, arguments, void 0, function (id, vector, tenantId, metadata) {
            var datapoint;
            if (metadata === void 0) { metadata = {}; }
            return __generator(this, function (_a) {
                datapoint = {
                    datapointId: id,
                    featureVector: vector,
                    restricts: [
                        {
                            namespace: "tenant_id",
                            allowList: [tenantId || "global"] // "global" para itens comuns
                        },
                        {
                            namespace: "scope",
                            allowList: [tenantId ? "private" : "global"]
                        }
                    ],
                    // Metadados extras podem ser embedados se o índice suportar
                };
                try {
                    // Chamar API de upsert (Streaming Update)
                    // await client.upsertDatapoints(...)
                    logger_1.logger.info({ id: id, tenantId: tenantId }, "Vetor enviado para Vertex AI (Simulado)");
                }
                catch (error) {
                    logger_1.logger.error({ id: id, error: error.message }, "Erro ao indexar no Vertex AI");
                    // Em produção, talvez queiramos colocar em uma fila de retry
                    throw new errorHandler_1.AppError("Erro indexa\u00E7\u00E3o Vertex AI: ".concat(error.message), 500);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Remove vetor do índice
     */
    VertexSearchService.deleteVector = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // await client.removeDatapoints(...)
                    logger_1.logger.info({ id: id }, "Vetor removido do Vertex AI (Simulado)");
                }
                catch (error) {
                    logger_1.logger.warn({ id: id, error: error.message }, "Falha ao remover vetor Vertex AI");
                }
                return [2 /*return*/];
            });
        });
    };
    VertexSearchService.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    VertexSearchService.location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
    VertexSearchService.indexEndpointId = process.env.VERTEX_INDEX_ENDPOINT_ID;
    VertexSearchService.deployedIndexId = process.env.VERTEX_DEPLOYED_INDEX_ID;
    return VertexSearchService;
}());
exports.VertexSearchService = VertexSearchService;
