"use strict";
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
exports.ProcessamentoIAService = void 0;
var vertexAiService_1 = require("./vertexAiService");
var prisma_1 = require("../lib/prisma");
var logger_1 = require("../utils/logger");
var errorHandler_1 = require("../middleware/errorHandler");
var SYSTEM_PROMPT = "Voc\u00EA \u00E9 um consultor s\u00EAnior de processos TO (Tecnologia Operacional) e especialista em BPMN.\nSua tarefa \u00E9 analisar descri\u00E7\u00F5es operacionais e gerar um pacote de valida\u00E7\u00E3o para o cliente.\n\nRetorne APENAS um JSON v\u00E1lido no seguinte formato:\n{\n  \"approval_text\": \"Texto profissional e cordial (em portugu\u00EAs) dirigido ao entrevistado, resumindo o entendimento do processo para valida\u00E7\u00E3o. Deve ser executivo mas detalhado o suficiente para confirmar o fluxo.\",\n  \"mermaid_graph\": \"C\u00F3digo Mermaid v\u00E1lido (flowchart TD) representando o processo. Use n\u00F3s claros e estilize se poss\u00EDvel.\",\n  \"processo\": {\n    \"nome\": \"Nome do processo\",\n    \"objetivo\": \"Objetivo do processo\",\n    \"gatilho\": \"O que inicia o processo\",\n    \"frequencia\": \"Frequ\u00EAncia de execu\u00E7\u00E3o\",\n    \"duracao_estimada\": \"Tempo estimado\",\n    \"criticidade\": \"baixa|media|alta\",\n    \"tipo_processo\": \"operacional|manutencao|emergencia|etc\",\n    \"dependencias\": [\"processo1\", \"processo2\"],\n    \"observacoes_gerais\": \"Observa\u00E7\u00F5es adicionais\"\n  },\n  \"etapas\": [\n    {\n      \"ordem\": 1,\n      \"nome\": \"Nome da etapa\",\n      \"descricao\": \"Descri\u00E7\u00E3o detalhada\",\n      \"tipo_etapa\": \"acao|decisao|verificacao|etc\",\n      \"sistemas_envolvidos\": [\"sistema1\", \"sistema2\"],\n      \"ativos_envolvidos\": [\"ativo1\", \"ativo2\"],\n      \"tempo_estimado\": \"Tempo estimado\"\n    }\n  ],\n  \"ativos\": [\n    {\n      \"tipo\": \"sistema|equipamento|documento|pessoa\",\n      \"nome\": \"Nome do ativo\",\n      \"categoria\": \"Categoria\",\n      \"localizacao\": \"Localiza\u00E7\u00E3o\",\n      \"criticidade\": \"baixa|media|alta\",\n      \"caracteristicas_tecnicas\": {},\n      \"rede_conectividade\": \"Rede\",\n      \"protocolos\": [\"protocolo1\", \"protocolo2\"]\n    }\n  ],\n  \"dificuldades\": [\n    {\n      \"descricao\": \"Descri\u00E7\u00E3o da dificuldade\",\n      \"categoria\": \"tecnica|operacional|organizacional\",\n      \"impacto\": \"baixo|medio|alto\",\n      \"frequencia\": \"rara|ocasional|frequente\",\n      \"sistemas_afetados\": [\"sistema1\"]\n    }\n  ],\n  \"workarounds\": [\n    {\n      \"descricao\": \"Descri\u00E7\u00E3o do workaround\",\n      \"razao\": \"Por que existe\",\n      \"risco_percebido\": \"baixo|medio|alto\",\n      \"categoria\": \"temporario|permanente\"\n    }\n  ]\n}\n\nIMPORTANTE:\n- \"approval_text\" deve ser pronto para apresenta\u00E7\u00E3o.\n- \"mermaid_graph\" deve ser sintaticamente correto.\n- Mantenha a extra\u00E7\u00E3o estruturada (processo, etapas, etc) precisa.\n- Retorne APENAS o JSON.\n";
var ProcessamentoIAService = /** @class */ (function () {
    function ProcessamentoIAService() {
    }
    /**
     * Processa uma descrição operacional raw e retorna processo normalizado
     */
    ProcessamentoIAService.processarDescricaoRaw = function (descricaoRawId, tenantId) {
        return __awaiter(this, void 0, void 0, function () {
            var descricaoRaw, vertexService, bpmnJson, extractionPrompt, rawRes, cleanJson, structuredData, resultado, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.descricaoOperacionalRaw.findUnique({
                            where: { id: descricaoRawId },
                        })];
                    case 1:
                        descricaoRaw = _a.sent();
                        if (!descricaoRaw) {
                            throw new errorHandler_1.AppError('Descrição raw não encontrada', 404);
                        }
                        // Atualizar status
                        return [4 /*yield*/, prisma_1.prisma.descricaoOperacionalRaw.update({
                                where: { id: descricaoRawId },
                                data: { status_processamento: 'processando' },
                            })];
                    case 2:
                        // Atualizar status
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 7, , 9]);
                        vertexService = new vertexAiService_1.VertexAIService();
                        return [4 /*yield*/, vertexService.generateBpmnJson(descricaoRaw.descricao_completa)];
                    case 4:
                        bpmnJson = _a.sent();
                        extractionPrompt = "\n      ".concat(SYSTEM_PROMPT, "\n      \n      Descri\u00E7\u00E3o Operacional:\n      ").concat(descricaoRaw.descricao_completa, "\n      ");
                        return [4 /*yield*/, vertexService.generateResponse(extractionPrompt + "\nReturn ONLY JSON.")];
                    case 5:
                        rawRes = _a.sent();
                        cleanJson = rawRes.replace(/```json\\n?|\\n?```/g, "").trim();
                        // Sanitize standard markers if AI adds them despite instruction
                        if (cleanJson.startsWith('```'))
                            cleanJson = cleanJson.replace(/^```(json)?/, '').replace(/```$/, '');
                        structuredData = JSON.parse(cleanJson);
                        resultado = __assign(__assign({}, structuredData), { bpmn: bpmnJson });
                        // Salvar resultado no banco
                        return [4 /*yield*/, prisma_1.prisma.descricaoOperacionalRaw.update({
                                where: { id: descricaoRawId },
                                data: {
                                    status_processamento: 'processado',
                                    resultado_processamento: resultado,
                                    processado_por_ia: true,
                                },
                            })];
                    case 6:
                        // Salvar resultado no banco
                        _a.sent();
                        logger_1.logger.info({ descricaoRawId: descricaoRawId }, 'Descrição raw processada com sucesso (Vertex AI)');
                        return [2 /*return*/, resultado];
                    case 7:
                        error_1 = _a.sent();
                        // Atualizar status de erro
                        return [4 /*yield*/, prisma_1.prisma.descricaoOperacionalRaw.update({
                                where: { id: descricaoRawId },
                                data: {
                                    status_processamento: 'erro',
                                    resultado_processamento: { erro: error_1.message },
                                },
                            })];
                    case 8:
                        // Atualizar status de erro
                        _a.sent();
                        logger_1.logger.error({ descricaoRawId: descricaoRawId, error: error_1.message }, 'Erro ao processar descrição raw');
                        throw new errorHandler_1.AppError("Erro ao processar descri\u00E7\u00E3o: ".concat(error_1.message), 500);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Cria processo normalizado a partir do resultado do processamento
     */
    ProcessamentoIAService.criarProcessoNormalizado = function (descricaoRawId, resultado, tenantId) {
        return __awaiter(this, void 0, void 0, function () {
            var descricaoRaw, processo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.descricaoOperacionalRaw.findUnique({
                            where: { id: descricaoRawId },
                        })];
                    case 1:
                        descricaoRaw = _a.sent();
                        if (!descricaoRaw) {
                            throw new errorHandler_1.AppError('Descrição raw não encontrada', 404);
                        }
                        return [4 /*yield*/, prisma_1.prisma.processoNormalizado.create({
                                data: {
                                    descricao_raw_id: descricaoRawId,
                                    tenant_id: tenantId,
                                    nome: resultado.processo.nome,
                                    objetivo: resultado.processo.objetivo,
                                    gatilho: resultado.processo.gatilho,
                                    frequencia: resultado.processo.frequencia,
                                    duracao_estimada: resultado.processo.duracao_estimada,
                                    criticidade: resultado.processo.criticidade,
                                    tipo_processo: resultado.processo.tipo_processo,
                                    dependencias: resultado.processo.dependencias || [],
                                    observacoes_gerais: resultado.processo.observacoes_gerais,
                                    nivel_confianca_normalizacao: 0.8, // Pode ser calculado baseado em validação
                                    status: 'pendente',
                                    versao: 1,
                                },
                            })
                            // Criar etapas
                        ];
                    case 2:
                        processo = _a.sent();
                        if (!(resultado.etapas && resultado.etapas.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, prisma_1.prisma.processoEtapa.createMany({
                                data: resultado.etapas.map(function (etapa) { return ({
                                    processo_normalizado_id: processo.id,
                                    ordem: etapa.ordem,
                                    nome: etapa.nome,
                                    descricao: etapa.descricao,
                                    tipo_etapa: etapa.tipo_etapa,
                                    sistemas_envolvidos: etapa.sistemas_envolvidos || [],
                                    ativos_envolvidos: etapa.ativos_envolvidos || [],
                                    tempo_estimado: etapa.tempo_estimado,
                                }); }),
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!(resultado.ativos && resultado.ativos.length > 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, prisma_1.prisma.ativo.createMany({
                                data: resultado.ativos.map(function (ativo) { return ({
                                    processo_normalizado_id: processo.id,
                                    tenant_id: tenantId,
                                    site_id: descricaoRaw.site_id,
                                    tipo: ativo.tipo,
                                    nome: ativo.nome,
                                    categoria: ativo.categoria,
                                    localizacao: ativo.localizacao,
                                    criticidade: ativo.criticidade,
                                    caracteristicas_tecnicas: ativo.caracteristicas_tecnicas || {},
                                    rede_conectividade: ativo.rede_conectividade,
                                    protocolos: ativo.protocolos || [],
                                }); }),
                            })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!(resultado.dificuldades && resultado.dificuldades.length > 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, prisma_1.prisma.dificuldadeOperacional.createMany({
                                data: resultado.dificuldades.map(function (dificuldade) { return ({
                                    processo_normalizado_id: processo.id,
                                    descricao: dificuldade.descricao,
                                    categoria: dificuldade.categoria,
                                    impacto: dificuldade.impacto,
                                    frequencia: dificuldade.frequencia,
                                    sistemas_afetados: dificuldade.sistemas_afetados || [],
                                }); }),
                            })];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        if (!(resultado.workarounds && resultado.workarounds.length > 0)) return [3 /*break*/, 10];
                        return [4 /*yield*/, prisma_1.prisma.workaround.createMany({
                                data: resultado.workarounds.map(function (workaround) { return ({
                                    processo_normalizado_id: processo.id,
                                    descricao: workaround.descricao,
                                    razao: workaround.razao,
                                    risco_percebido: workaround.risco_percebido,
                                    categoria: workaround.categoria,
                                }); }),
                            })];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10:
                        logger_1.logger.info({ processoId: processo.id, descricaoRawId: descricaoRawId }, 'Processo normalizado criado');
                        return [2 /*return*/, processo];
                }
            });
        });
    };
    /**
     * Processa e cria processo normalizado em uma única operação
     */
    ProcessamentoIAService.processarECriar = function (descricaoRawId, tenantId) {
        return __awaiter(this, void 0, void 0, function () {
            var resultado, processo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.processarDescricaoRaw(descricaoRawId, tenantId)];
                    case 1:
                        resultado = _a.sent();
                        return [4 /*yield*/, this.criarProcessoNormalizado(descricaoRawId, resultado, tenantId)];
                    case 2:
                        processo = _a.sent();
                        return [2 /*return*/, processo];
                }
            });
        });
    };
    return ProcessamentoIAService;
}());
exports.ProcessamentoIAService = ProcessamentoIAService;
