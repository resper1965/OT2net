"use strict";
/**
 * Script de importação de frameworks regulatórios
 *
 * Este script importa requisitos dos frameworks:
 * - REN 964/21
 * - ONS RO-CB.BR.01
 * - CIS Controls v8.1
 * - ISA/IEC-62443
 * - NIST SP 800-82
 *
 * Executar com: npx tsx backend/scripts/import-frameworks.ts
 */
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
var prisma_1 = require("../src/lib/prisma");
var logger_1 = require("../src/utils/logger");
/**
 * Framework: REN 964/21
 * Resolução Normativa ANEEL sobre Segurança Cibernética
 */
var REN_964_21 = [
    {
        codigo: 'REN-964-21-4.1',
        titulo: 'Governança de Segurança Cibernética',
        descricao: 'Estabelecer estrutura de governança para segurança cibernética, incluindo políticas, procedimentos e responsabilidades.',
        categoria: 'Governança',
        versao: '2021',
    },
    {
        codigo: 'REN-964-21-4.2',
        titulo: 'Gestão de Riscos Cibernéticos',
        descricao: 'Implementar processo de gestão de riscos cibernéticos, incluindo identificação, análise, tratamento e monitoramento.',
        categoria: 'Gestão de Riscos',
        versao: '2021',
    },
    // Adicionar mais requisitos conforme necessário
];
/**
 * Framework: ONS RO-CB.BR.01
 * Requisitos Operacionais do ONS para Segurança Cibernética
 */
var ONS_RO_CB_BR_01 = [
    {
        codigo: 'ONS-RO-CB.BR.01-1',
        titulo: 'Segmentação de Rede',
        descricao: 'Implementar segmentação de rede para isolar sistemas críticos e reduzir superfície de ataque.',
        categoria: 'Segurança de Rede',
        versao: '2023',
    },
    // Adicionar mais requisitos conforme necessário
];
/**
 * Framework: CIS Controls v8.1
 * Critical Security Controls
 */
var CIS_CONTROLS_V8_1 = [
    {
        codigo: 'CIS-1',
        titulo: 'Inventory and Control of Enterprise Assets',
        descricao: 'Actively manage (inventory, track, and correct) all enterprise assets (end-user devices, including portable and mobile, network devices, non-computing/IoT devices, and servers) connected to the infrastructure physically, virtually, remotely, and those within cloud environments, to accurately know the totality of assets that need to be monitored and protected within the enterprise.',
        categoria: 'Asset Management',
        versao: '8.1',
    },
    // Adicionar mais controles conforme necessário
];
/**
 * Framework: ISA/IEC-62443
 * Security for Industrial Automation and Control Systems
 */
var ISA_IEC_62443 = [
    {
        codigo: 'ISA-62443-3-3-SR1.1',
        titulo: 'Identification and Authentication Control',
        descricao: 'The control system shall enforce identification and authentication of all users, processes, and devices.',
        categoria: 'Access Control',
        versao: '3.3',
    },
    // Adicionar mais requisitos conforme necessário
];
/**
 * Framework: NIST SP 800-82
 * Guide to Industrial Control Systems (ICS) Security
 */
var NIST_SP_800_82 = [
    {
        codigo: 'NIST-800-82-5.1',
        titulo: 'ICS Security Program Development',
        descricao: 'Develop and maintain a comprehensive ICS security program that addresses security throughout the system lifecycle.',
        categoria: 'Security Program',
        versao: 'Rev. 2',
    },
    // Adicionar mais requisitos conforme necessário
];
function importFramework(frameworkName, requisitos) {
    return __awaiter(this, void 0, void 0, function () {
        var imported, skipped, _i, requisitos_1, req, existing, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.info({ framework: frameworkName, count: requisitos.length }, 'Importando framework');
                    imported = 0;
                    skipped = 0;
                    _i = 0, requisitos_1 = requisitos;
                    _a.label = 1;
                case 1:
                    if (!(_i < requisitos_1.length)) return [3 /*break*/, 7];
                    req = requisitos_1[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, prisma_1.default.requisitoFramework.findFirst({
                            where: {
                                framework: frameworkName,
                                codigo: req.codigo,
                            },
                        })];
                case 3:
                    existing = _a.sent();
                    if (existing) {
                        skipped++;
                        return [3 /*break*/, 6];
                    }
                    // Criar requisito
                    return [4 /*yield*/, prisma_1.default.requisitoFramework.create({
                            data: {
                                framework: frameworkName,
                                codigo: req.codigo,
                                titulo: req.titulo,
                                descricao: req.descricao,
                                categoria: req.categoria || null,
                                versao: req.versao || null,
                            },
                        })];
                case 4:
                    // Criar requisito
                    _a.sent();
                    imported++;
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    logger_1.logger.error({ framework: frameworkName, codigo: req.codigo, error: error_1.message }, 'Erro ao importar requisito');
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    logger_1.logger.info({ framework: frameworkName, imported: imported, skipped: skipped }, 'Framework importado');
                    return [2 /*return*/, { imported: imported, skipped: skipped }];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var resultados, _a, _b, _c, _d, _e, totalImported, totalSkipped;
        var _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    logger_1.logger.info('Iniciando importação de frameworks regulatórios...');
                    _f = {};
                    _a = 'REN_964_21';
                    return [4 /*yield*/, importFramework('REN_964_21', REN_964_21)];
                case 1:
                    _f[_a] = _g.sent();
                    _b = 'ONS_RO_CB_BR_01';
                    return [4 /*yield*/, importFramework('ONS_RO_CB_BR_01', ONS_RO_CB_BR_01)];
                case 2:
                    _f[_b] = _g.sent();
                    _c = 'CIS_CONTROLS_V8_1';
                    return [4 /*yield*/, importFramework('CIS_CONTROLS_V8_1', CIS_CONTROLS_V8_1)];
                case 3:
                    _f[_c] = _g.sent();
                    _d = 'ISA_IEC_62443';
                    return [4 /*yield*/, importFramework('ISA_IEC_62443', ISA_IEC_62443)];
                case 4:
                    _f[_d] = _g.sent();
                    _e = 'NIST_SP_800_82';
                    return [4 /*yield*/, importFramework('NIST_SP_800_82', NIST_SP_800_82)];
                case 5:
                    resultados = (_f[_e] = _g.sent(),
                        _f);
                    totalImported = Object.values(resultados).reduce(function (sum, r) { return sum + r.imported; }, 0);
                    totalSkipped = Object.values(resultados).reduce(function (sum, r) { return sum + r.skipped; }, 0);
                    logger_1.logger.info({ totalImported: totalImported, totalSkipped: totalSkipped }, 'Importação de frameworks concluída');
                    console.log('\n✅ Importação concluída!');
                    console.log("   - ".concat(totalImported, " requisitos importados"));
                    console.log("   - ".concat(totalSkipped, " requisitos j\u00E1 existentes (ignorados)"));
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    logger_1.logger.error({ error: e }, 'Erro na importação');
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
