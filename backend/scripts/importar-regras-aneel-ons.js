"use strict";
/**
 * Script para importar regras da ANEEL, ONS e normas BPMN 2.0
 *
 * Este script permite importar regras regulatórias e normas de arquivos JSON
 * e vetorizá-las automaticamente usando o serviço RAG.
 *
 * Uso:
 *   tsx scripts/importar-regras-aneel-ons.ts <arquivo.json>
 *
 * Formato do arquivo JSON:
 * [
 *   {
 *     "framework": "ANEEL" | "ONS" | "BPMN",
 *     "codigo": "Código da regra/norma",
 *     "titulo": "Título da regra/norma",
 *     "descricao": "Descrição completa da regra/norma",
 *     "categoria": "Categoria (opcional)",
 *     "versao": "Versão (opcional)"
 *   }
 * ]
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
var rag_service_1 = require("../src/services/rag-service");
var logger_1 = require("../src/utils/logger");
var fs = require("fs");
var path = require("path");
function importarRegras(arquivo) {
    return __awaiter(this, void 0, void 0, function () {
        var arquivoPath, conteudo, regras, regrasValidas, regrasInvalidas, _i, regras_1, regra, resultado, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    arquivoPath = path.resolve(process.cwd(), arquivo);
                    if (!fs.existsSync(arquivoPath)) {
                        throw new Error("Arquivo n\u00E3o encontrado: ".concat(arquivoPath));
                    }
                    logger_1.logger.info({ arquivo: arquivoPath }, 'Lendo arquivo de regras');
                    conteudo = fs.readFileSync(arquivoPath, 'utf-8');
                    regras = JSON.parse(conteudo);
                    if (!Array.isArray(regras)) {
                        throw new Error('O arquivo deve conter um array de regras');
                    }
                    logger_1.logger.info({ total: regras.length }, 'Regras encontradas no arquivo');
                    regrasValidas = [];
                    regrasInvalidas = [];
                    for (_i = 0, regras_1 = regras; _i < regras_1.length; _i++) {
                        regra = regras_1[_i];
                        if (!regra.framework || !['ANEEL', 'ONS', 'BPMN'].includes(regra.framework)) {
                            regrasInvalidas.push({
                                regra: regra,
                                erro: 'Framework deve ser ANEEL, ONS ou BPMN',
                            });
                            continue;
                        }
                        if (!regra.codigo || !regra.titulo || !regra.descricao) {
                            regrasInvalidas.push({
                                regra: regra,
                                erro: 'Código, título e descrição são obrigatórios',
                            });
                            continue;
                        }
                        regrasValidas.push(regra);
                    }
                    if (regrasInvalidas.length > 0) {
                        logger_1.logger.warn({ invalidas: regrasInvalidas.length }, 'Regras inválidas encontradas');
                        console.log('\nRegras inválidas:');
                        regrasInvalidas.forEach(function (_a) {
                            var regra = _a.regra, erro = _a.erro;
                            console.log("  - ".concat(regra.codigo || 'Sem código', ": ").concat(erro));
                        });
                    }
                    if (regrasValidas.length === 0) {
                        throw new Error('Nenhuma regra válida encontrada');
                    }
                    logger_1.logger.info({ validas: regrasValidas.length, invalidas: regrasInvalidas.length }, 'Processando regras válidas');
                    return [4 /*yield*/, rag_service_1.RAGService.processarRegrasEmLote(regrasValidas, 5)];
                case 1:
                    resultado = _a.sent();
                    console.log('\n=== Resultado da Importação ===');
                    console.log("\u2705 Sucesso: ".concat(resultado.sucesso));
                    console.log("\u274C Erros: ".concat(resultado.erro));
                    if (resultado.erros.length > 0) {
                        console.log('\nErros encontrados:');
                        resultado.erros.forEach(function (_a) {
                            var codigo = _a.codigo, erro = _a.erro;
                            console.log("  - ".concat(codigo, ": ").concat(erro));
                        });
                    }
                    logger_1.logger.info({ sucesso: resultado.sucesso, erro: resultado.erro }, 'Importação concluída');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    logger_1.logger.error({ error: error_1.message }, 'Erro ao importar regras');
                    console.error('\n❌ Erro:', error_1.message);
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Executar script
var arquivo = process.argv[2];
if (!arquivo) {
    console.error('Uso: tsx scripts/importar-regras-aneel-ons.ts <arquivo.json>');
    console.error('\nExemplo:');
    console.error('  tsx scripts/importar-regras-aneel-ons.ts data/regras-aneel.json');
    process.exit(1);
}
importarRegras(arquivo)
    .then(function () {
    console.log('\n✅ Importação concluída com sucesso!');
    process.exit(0);
})
    .catch(function (error) {
    console.error('\n❌ Erro fatal:', error.message);
    process.exit(1);
});
