"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var organizacoes_1 = require("./organizacoes");
var empresas_1 = require("./empresas");
var sites_1 = require("./sites");
var membros_equipe_1 = require("./membros-equipe");
var projetos_1 = require("./projetos");
var relatorios_1 = require("./relatorios");
var descricoes_raw_1 = require("./descricoes-raw");
var processos_normalizados_1 = require("./processos-normalizados");
var rag_1 = require("./rag");
var dashboard_1 = require("./dashboard");
var export_1 = require("./export");
var router = Router();
// Health check
router.get('/health', function (req, res) {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Dashboard
router.use('/dashboard', dashboard_1.default);
// Export
router.use('/export', export_1.default);
// Rotas de cadastramento (User Story 1)
router.use('/organizacoes', organizacoes_1.default);
router.use('/empresas', empresas_1.default);
router.use('/sites', sites_1.default);
router.use('/membros-equipe', membros_equipe_1.default);
router.use('/projetos', projetos_1.default);
router.use('/relatorios', relatorios_1.default);
// Rotas de processamento (User Story 2)
router.use('/descricoes-raw', descricoes_raw_1.default);
router.use('/processos-normalizados', processos_normalizados_1.default);
// Rotas de RAG (Regras Regulatórias)
router.use('/rag', rag_1.default);
exports.default = router;
