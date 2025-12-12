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
var express_1 = require("express");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
/**
 * GET /api/dashboard/stats
 * Retorna estatísticas agregadas para o dashboard principal
 */
router.get('/stats', auth_1.authenticateToken, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var tenant_id, _a, totalOrganizacoes, totalEmpresas, totalSites, totalProjetos, projetosAtivos, descricoesRaw, descricoesProcessadas, processosNormalizados, processosAprovados, taxaProcessamento, taxaAprovacao, projetosRecentes, seteDiasAtras, descricoesUltimos7Dias, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                tenant_id = req.user.tenant_id;
                return [4 /*yield*/, Promise.all([
                        req.prisma.organizacao.count(),
                        req.prisma.empresa.count(),
                        req.prisma.site.count(),
                        req.prisma.projeto.count(),
                        req.prisma.projeto.count({
                            where: { status: 'em_andamento' }
                        }),
                        req.prisma.descricaoOperacionalRaw.count(),
                        req.prisma.descricaoOperacionalRaw.count({
                            where: { status_processamento: 'processado' }
                        }),
                        req.prisma.processoNormalizado.count(),
                        req.prisma.processoNormalizado.count({
                            where: { status: 'aprovado' }
                        }),
                    ])];
            case 1:
                _a = _b.sent(), totalOrganizacoes = _a[0], totalEmpresas = _a[1], totalSites = _a[2], totalProjetos = _a[3], projetosAtivos = _a[4], descricoesRaw = _a[5], descricoesProcessadas = _a[6], processosNormalizados = _a[7], processosAprovados = _a[8];
                taxaProcessamento = descricoesRaw > 0
                    ? Math.round((descricoesProcessadas / descricoesRaw) * 100)
                    : 0;
                taxaAprovacao = processosNormalizados > 0
                    ? Math.round((processosAprovados / processosNormalizados) * 100)
                    : 0;
                return [4 /*yield*/, req.prisma.projeto.findMany({
                        take: 5,
                        orderBy: { created_at: 'desc' },
                        select: {
                            id: true,
                            nome: true,
                            fase_atual: true,
                            status: true,
                            created_at: true
                        }
                    })];
            case 2:
                projetosRecentes = _b.sent();
                seteDiasAtras = new Date();
                seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
                return [4 /*yield*/, req.prisma.descricaoOperacionalRaw.count({
                        where: {
                            created_at: {
                                gte: seteDiasAtras
                            }
                        }
                    })];
            case 3:
                descricoesUltimos7Dias = _b.sent();
                res.json({
                    overview: {
                        organizacoes: totalOrganizacoes,
                        empresas: totalEmpresas,
                        sites: totalSites,
                        projetos: totalProjetos,
                        projetosAtivos: projetosAtivos
                    },
                    processos: {
                        descricoesTotal: descricoesRaw,
                        descricoesProcessadas: descricoesProcessadas,
                        taxaProcessamento: taxaProcessamento,
                        processosNormalizados: processosNormalizados,
                        processosAprovados: processosAprovados,
                        taxaAprovacao: taxaAprovacao
                    },
                    atividade: {
                        descricoesUltimos7Dias: descricoesUltimos7Dias
                    },
                    projetosRecentes: projetosRecentes
                });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/dashboard/charts/processos-timeline
 * Retorna dados para gráfico de timeline de processamento
 */
router.get('/charts/processos-timeline', auth_1.authenticateToken, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, days, daysAgo, processosPorDia, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query.days, days = _a === void 0 ? 30 : _a;
                daysAgo = new Date();
                daysAgo.setDate(daysAgo.getDate() - parseInt(days));
                return [4 /*yield*/, req.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      SELECT \n        DATE(created_at) as data,\n        COUNT(*) as total\n      FROM descricoes_raw\n      WHERE tenant_id = ", "\n        AND created_at >= ", "\n      GROUP BY DATE(created_at)\n      ORDER BY data ASC\n    "], ["\n      SELECT \n        DATE(created_at) as data,\n        COUNT(*) as total\n      FROM descricoes_raw\n      WHERE tenant_id = ", "\n        AND created_at >= ", "\n      GROUP BY DATE(created_at)\n      ORDER BY data ASC\n    "])), req.user.tenant_id, daysAgo)];
            case 1:
                processosPorDia = _b.sent();
                res.json(processosPorDia);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
var templateObject_1;
