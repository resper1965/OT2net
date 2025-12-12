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
var router = (0, express_1.Router)();
/**
 * GET /api/processos-normalizados/:id/export-bpmn
 * Exporta o BPMN XML de um processo normalizado
 */
router.get('/:id/export-bpmn', auth_1.authenticateToken, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, processo, bpmnData, bpmnXml, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, req.prisma.processoNormalizado.findUnique({
                        where: { id: id },
                        select: {
                            nome: true,
                            objetivo: true,
                            // Assumindo que o BPMN está armazenado em resultado_processamento ou campo específico
                            descricao_raw: {
                                select: {
                                    resultado_processamento: true
                                }
                            }
                        }
                    })];
            case 1:
                processo = _b.sent();
                if (!processo) {
                    return [2 /*return*/, res.status(404).json({ error: 'Processo não encontrado' })];
                }
                bpmnData = (_a = processo.descricao_raw) === null || _a === void 0 ? void 0 : _a.resultado_processamento;
                bpmnXml = (bpmnData === null || bpmnData === void 0 ? void 0 : bpmnData.bpmn_xml) || (bpmnData === null || bpmnData === void 0 ? void 0 : bpmnData.bpmn) || generatePlaceholderBPMN(processo.nome, processo.objetivo);
                // Set headers para download
                res.setHeader('Content-Type', 'application/xml');
                res.setHeader('Content-Disposition', "attachment; filename=\"".concat(sanitizeFilename(processo.nome), ".bpmn\""));
                res.send(bpmnXml);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/processos-normalizados/:id/export-mermaid
 * Exporta o diagrama Mermaid de um processo
 */
router.get('/:id/export-mermaid', auth_1.authenticateToken, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, processo, mermaidData, mermaidGraph, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, req.prisma.processoNormalizado.findUnique({
                        where: { id: id },
                        select: {
                            nome: true,
                            descricao_raw: {
                                select: {
                                    resultado_processamento: true
                                }
                            }
                        }
                    })];
            case 1:
                processo = _b.sent();
                if (!processo) {
                    return [2 /*return*/, res.status(404).json({ error: 'Processo não encontrado' })];
                }
                mermaidData = (_a = processo.descricao_raw) === null || _a === void 0 ? void 0 : _a.resultado_processamento;
                mermaidGraph = (mermaidData === null || mermaidData === void 0 ? void 0 : mermaidData.mermaid_graph) || (mermaidData === null || mermaidData === void 0 ? void 0 : mermaidData.mermaid) || "flowchart TD\n  A[".concat(processo.nome, "]");
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Content-Disposition', "attachment; filename=\"".concat(sanitizeFilename(processo.nome), ".mmd\""));
                res.send(mermaidGraph);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Helper: Sanitizar nome do arquivo
function sanitizeFilename(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50);
}
// Helper: Gerar BPMN placeholder se não existir
function generatePlaceholderBPMN(nome, objetivo) {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<definitions xmlns=\"http://www.omg.org/spec/BPMN/20100524/MODEL\"\n             xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\"\n             xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\"\n             xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\"\n             targetNamespace=\"http://bpmn.io/schema/bpmn\"\n             id=\"Definitions_1\">\n  <process id=\"Process_1\" isExecutable=\"false\">\n    <startEvent id=\"StartEvent_1\" name=\"In\u00EDcio\"/>\n    <task id=\"Task_1\" name=\"".concat(nome, "\">\n      <documentation>").concat(objetivo || '', "</documentation>\n    </task>\n    <endEvent id=\"EndEvent_1\" name=\"Fim\"/>\n    <sequenceFlow id=\"Flow_1\" sourceRef=\"StartEvent_1\" targetRef=\"Task_1\"/>\n    <sequenceFlow id=\"Flow_2\" sourceRef=\"Task_1\" targetRef=\"EndEvent_1\"/>\n  </process>\n</definitions>");
}
exports.default = router;
