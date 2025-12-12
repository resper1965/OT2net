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
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var tenant, org1, org2, empresas, sites, projetos, _a, descricoes, processosNorm;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('🌱 Starting database seed...');
                    // 1. TENANT
                    console.log('1️⃣  Creating tenant...');
                    return [4 /*yield*/, prisma.tenant.upsert({
                            where: { slug: 'demo' },
                            update: {},
                            create: {
                                name: 'Demo Company',
                                slug: 'demo'
                            }
                        })];
                case 1:
                    tenant = _b.sent();
                    console.log("\u2705 Tenant: ".concat(tenant.name));
                    // 2. ORGANIZAÇÕES
                    console.log('2️⃣  Creating organizações...');
                    return [4 /*yield*/, prisma.organizacao.create({
                            data: {
                                tenant_id: tenant.id,
                                razao_social: 'Eletrobras Holding S.A.',
                                cnpj: '00.001.180/0001-26',
                                agencias_reguladoras: ['ANEEL', 'ONS'],
                                certificacoes: ['ISO 27001', 'IEC 62443-2-1']
                            }
                        })];
                case 2:
                    org1 = _b.sent();
                    return [4 /*yield*/, prisma.organizacao.create({
                            data: {
                                tenant_id: tenant.id,
                                razao_social: 'CEMIG Geração e Transmissão S.A.',
                                cnpj: '06.981.176/0001-58',
                                agencias_reguladoras: ['ANEEL'],
                                certificacoes: ['ISO 27001']
                            }
                        })];
                case 3:
                    org2 = _b.sent();
                    console.log("\u2705 Organiza\u00E7\u00F5es: 2 created");
                    // 3. EMPRESAS (5)
                    console.log('3️⃣  Creating empresas...');
                    return [4 /*yield*/, Promise.all([
                            prisma.empresa.create({
                                data: {
                                    tenant_id: tenant.id,
                                    organizacao_id: org1.id,
                                    identificacao: 'Eletronorte',
                                    tipo: 'Geradora',
                                    status: 'ativa'
                                }
                            }),
                            prisma.empresa.create({
                                data: {
                                    tenant_id: tenant.id,
                                    organizacao_id: org1.id,
                                    identificacao: 'Furnas',
                                    tipo: 'Geradora/Transmissora',
                                    status: 'ativa'
                                }
                            }),
                            prisma.empresa.create({
                                data: {
                                    tenant_id: tenant.id,
                                    organizacao_id: org1.id,
                                    identificacao: 'Chesf',
                                    tipo: 'Geradora/Transmissora',
                                    status: 'ativa'
                                }
                            }),
                            prisma.empresa.create({
                                data: {
                                    tenant_id: tenant.id,
                                    organizacao_id: org2.id,
                                    identificacao: 'CEMIG GT',
                                    tipo: 'Geradora/Transmissora',
                                    status: 'ativa'
                                }
                            }),
                            prisma.empresa.create({
                                data: {
                                    tenant_id: tenant.id,
                                    organizacao_id: org2.id,
                                    identificacao: 'CEMIG Distribuição',
                                    tipo: 'Distribuidora',
                                    status: 'ativa'
                                }
                            }),
                        ])];
                case 4:
                    empresas = _b.sent();
                    console.log("\u2705 Empresas: ".concat(empresas.length, " created"));
                    // 4. SITES (10)
                    console.log('4️⃣  Creating sites...');
                    return [4 /*yield*/, Promise.all([
                            prisma.site.create({
                                data: {
                                    tenant_id: tenant.id,
                                    empresa_id: empresas[0].id,
                                    nome: 'UHE Tucuruí',
                                    tipo_instalacao: 'Usina Hidrelétrica'
                                }
                            }),
                            prisma.site.create({
                                data: {
                                    tenant_id: tenant.id,
                                    empresa_id: empresas[0].id,
                                    nome: 'SE Tucuruí 500kV',
                                    tipo_instalacao: 'Subestação'
                                }
                            }),
                            prisma.site.create({
                                data: {
                                    tenant_id: tenant.id,
                                    empresa_id: empresas[1].id,
                                    nome: 'UHE Furnas',
                                    tipo_instalacao: 'Usina Hidrelétrica'
                                }
                            }),
                            prisma.site.create({
                                data: {
                                    tenant_id: tenant.id,
                                    empresa_id: empresas[1].id,
                                    nome: 'UTE Santa Cruz',
                                    tipo_instalacao: 'Usina Termelétrica'
                                }
                            }),
                            prisma.site.create({
                                data: {
                                    tenant_id: tenant.id,
                                    empresa_id: empresas[2].id,
                                    nome: 'UHE Paulo Afonso IV',
                                    tipo_instalacao: 'Usina Hidrelétrica'
                                }
                            }),
                            prisma.site.create({
                                data: {
                                    tenant_id: tenant.id,
                                    empresa_id: empresas[2].id,
                                    nome: 'SE Angelim II 500kV',
                                    tipo_instalacao: 'Subestação'
                                }
                            }),
                            prisma.site.create({
                                data: {
                                    tenant_id: tenant.id,
                                    empresa_id: empresas[3].id,
                                    nome: 'UHE Emborcação',
                                    tipo_instalacao: 'Usina Hidrelétrica'
                                }
                            }),
                            prisma.site.create({
                                data: {
                                    tenant_id: tenant.id,
                                    empresa_id: empresas[3].id,
                                    nome: 'UHE Jaguara',
                                    tipo_instalacao: 'Usina Hidrelétrica'
                                }
                            }),
                            prisma.site.create({
                                data: {
                                    tenant_id: tenant.id,
                                    empresa_id: empresas[4].id,
                                    nome: 'SE Barreiro 138kV',
                                    tipo_instalacao: 'Subestação'
                                }
                            }),
                            prisma.site.create({
                                data: {
                                    tenant_id: tenant.id,
                                    empresa_id: empresas[4].id,
                                    nome: 'Centro de Operação do Sistema (COS)',
                                    tipo_instalacao: 'Centro de Controle'
                                }
                            }),
                        ])];
                case 5:
                    sites = _b.sent();
                    console.log("\u2705 Sites: ".concat(sites.length, " created"));
                    // 5. PROJETOS (3)
                    console.log('5️⃣  Creating projetos...');
                    return [4 /*yield*/, prisma.projeto.create({
                            data: {
                                tenant_id: tenant.id,
                                organizacao_id: org1.id,
                                nome: 'Adequação ANEEL 964/21 - Eletrobras',
                                objetivo: 'Compliance com Resolução ANEEL 964/21',
                                fase_atual: 'discovery',
                                status: 'em_andamento'
                            }
                        })];
                case 6:
                    _a = [
                        _b.sent()
                    ];
                    return [4 /*yield*/, prisma.projeto.create({
                            data: {
                                tenant_id: tenant.id,
                                organizacao_id: org2.id,
                                nome: 'Mapeamento AS-IS - CEMIG',
                                objetivo: 'Levantamento de processos operacionais',
                                fase_atual: 'discovery',
                                status: 'em_andamento'
                            }
                        })];
                case 7:
                    _a = _a.concat([
                        _b.sent()
                    ]);
                    return [4 /*yield*/, prisma.projeto.create({
                            data: {
                                tenant_id: tenant.id,
                                organizacao_id: org1.id,
                                nome: 'Assessment IEC 62443 - Furnas',
                                objetivo: 'Avaliação de conformidade IEC 62443',
                                fase_atual: 'planejamento',
                                status: 'planejado'
                            }
                        })];
                case 8:
                    projetos = _a.concat([
                        _b.sent()
                    ]);
                    console.log("\u2705 Projetos: ".concat(projetos.length, " created"));
                    // 6. DESCRIÇÕES RAW (20)
                    console.log('6️⃣  Creating descrições raw...');
                    return [4 /*yield*/, Promise.all(Array.from({ length: 20 }).map(function (_, i) {
                            var isProcessado = i < 10;
                            return prisma.descricaoOperacionalRaw.create({
                                data: {
                                    tenant_id: tenant.id,
                                    projeto_id: projetos[i < 12 ? 0 : 1].id,
                                    site_id: sites[i % 10].id,
                                    titulo: "Processo Operacional ".concat(i + 1),
                                    descricao_completa: "Descri\u00E7\u00E3o detalhada do processo ".concat(i + 1, ". Envolve verifica\u00E7\u00E3o SCADA, an\u00E1lise de alarmes e registro."),
                                    status_processamento: isProcessado ? 'processado' : 'pendente',
                                    resultado_processamento: isProcessado ? {
                                        approval_text: "Processo ".concat(i + 1, ": monitoramento de sistemas SCADA com impacto moderado."),
                                        mermaid_graph: "flowchart TD\n    A[In\u00EDcio] --> B[Verificar]\n    B --> C[Fim]",
                                        bpmn: { id: "proc-".concat(i) }
                                    } : null
                                }
                            });
                        }))];
                case 9:
                    descricoes = _b.sent();
                    console.log("\u2705 Descri\u00E7\u00F5es: ".concat(descricoes.length, " (").concat(descricoes.filter(function (d) { return d.status_processamento === 'processado'; }).length, " processadas)"));
                    // 7. PROCESSOS NORMALIZADOS (10)
                    console.log('7️⃣  Creating processos normalizados...');
                    return [4 /*yield*/, Promise.all(descricoes.slice(0, 10).map(function (desc, i) {
                            var _a, _b;
                            return prisma.processoNormalizado.create({
                                data: {
                                    tenant_id: tenant.id,
                                    descricao_raw_id: desc.id,
                                    nome: "".concat(desc.titulo, " (Normalizado)"),
                                    bpmn_json: { id: "norm-".concat(i) },
                                    approval_text: (_a = desc.resultado_processamento) === null || _a === void 0 ? void 0 : _a.approval_text,
                                    mermaid_graph: (_b = desc.resultado_processamento) === null || _b === void 0 ? void 0 : _b.mermaid_graph,
                                    nivel_confianca_normalizacao: 0.85,
                                    status: i < 5 ? 'aprovado' : 'revisao'
                                }
                            });
                        }))];
                case 10:
                    processosNorm = _b.sent();
                    console.log("\u2705 Processos Normalizados: ".concat(processosNorm.length, " created"));
                    console.log('\n🎉 Seed completed!');
                    console.log('📊 Summary:');
                    console.log("   - Tenants: 1");
                    console.log("   - Organiza\u00E7\u00F5es: 2");
                    console.log("   - Empresas: ".concat(empresas.length));
                    console.log("   - Sites: ".concat(sites.length));
                    console.log("   - Projetos: ".concat(projetos.length));
                    console.log("   - Descri\u00E7\u00F5es Raw: ".concat(descricoes.length));
                    console.log("   - Processos Normalizados: ".concat(processosNorm.length));
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('❌ Error:', e);
    process.exit(1);
})
    .finally(function () { return prisma.$disconnect(); });
