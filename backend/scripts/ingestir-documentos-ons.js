"use strict";
/**
 * Script para ingestão de documentos da ONS
 *
 * Este script permite:
 * 1. Importar metadados de documentos ONS de um arquivo JSON
 * 2. Opcionalmente fazer download dos PDFs e extrair texto
 * 3. Vetorizar e armazenar no banco de dados
 *
 * Uso:
 *   # Apenas importar metadados (sem download de PDFs)
 *   tsx scripts/ingestir-documentos-ons.ts data/ons-documentos-metadados.json
 *
 *   # Importar e fazer download dos PDFs (requer bibliotecas adicionais)
 *   tsx scripts/ingestir-documentos-ons.ts data/ons-documentos-metadados.json --download
 */
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
var rag_service_1 = require("../src/services/rag-service");
var logger_1 = require("../src/utils/logger");
var fs = require("fs");
var path = require("path");
var https = require("https");
var http = require("http");
var url_1 = require("url");
/**
 * Faz download de um arquivo PDF da URL fornecida
 */
function downloadPDF(url, outputPath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var parsedUrl = new url_1.URL(url);
                    var client = parsedUrl.protocol === 'https:' ? https : http;
                    var file = fs.createWriteStream(outputPath);
                    client
                        .get(url, function (response) {
                        if (response.statusCode === 301 || response.statusCode === 302) {
                            // Seguir redirect
                            return downloadPDF(response.headers.location, outputPath)
                                .then(resolve)
                                .catch(reject);
                        }
                        if (response.statusCode !== 200) {
                            file.close();
                            fs.unlinkSync(outputPath);
                            reject(new Error("Falha ao baixar: ".concat(response.statusCode)));
                            return;
                        }
                        response.pipe(file);
                        file.on('finish', function () {
                            file.close();
                            resolve();
                        });
                    })
                        .on('error', function (err) {
                        file.close();
                        if (fs.existsSync(outputPath)) {
                            fs.unlinkSync(outputPath);
                        }
                        reject(err);
                    });
                })];
        });
    });
}
/**
 * Extrai texto de um PDF (requer biblioteca pdf-parse)
 * Retorna null se a biblioteca não estiver disponível
 */
function extrairTextoPDF(pdfPath) {
    return __awaiter(this, void 0, void 0, function () {
        var pdfParse, dataBuffer, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('pdf-parse'); }).catch(function () { return null; })];
                case 1:
                    pdfParse = _a.sent();
                    if (!pdfParse) {
                        logger_1.logger.warn('Biblioteca pdf-parse não encontrada. Instale com: npm install pdf-parse');
                        return [2 /*return*/, null];
                    }
                    dataBuffer = fs.readFileSync(pdfPath);
                    return [4 /*yield*/, pdfParse.default(dataBuffer)];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.text];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error({ error: error_1.message }, 'Erro ao extrair texto do PDF');
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Processa um documento ONS
 */
function processarDocumento(documento_1) {
    return __awaiter(this, arguments, void 0, function (documento, downloadPDFs) {
        var resultado, tempDir, fileName, pdfPath, texto, trechoTexto, error_2;
        if (downloadPDFs === void 0) { downloadPDFs = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resultado = __assign({}, documento);
                    if (!(downloadPDFs && documento.url && documento.tipo === 'PDF')) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    tempDir = path.join(process.cwd(), 'temp');
                    if (!fs.existsSync(tempDir)) {
                        fs.mkdirSync(tempDir, { recursive: true });
                    }
                    fileName = "".concat(documento.codigo.replace(/[^a-zA-Z0-9]/g, '_'), ".pdf");
                    pdfPath = path.join(tempDir, fileName);
                    logger_1.logger.info({ url: documento.url, path: pdfPath }, 'Fazendo download do PDF');
                    return [4 /*yield*/, downloadPDF(documento.url, pdfPath)];
                case 2:
                    _a.sent();
                    logger_1.logger.info({ path: pdfPath }, 'PDF baixado, extraindo texto');
                    return [4 /*yield*/, extrairTextoPDF(pdfPath)];
                case 3:
                    texto = _a.sent();
                    if (texto) {
                        resultado.conteudoTexto = texto;
                        resultado.conteudoExtraido = true;
                        // Se conseguiu extrair texto, usar no lugar da descrição
                        if (texto.length > documento.descricao.length) {
                            trechoTexto = texto.substring(0, 2000).trim();
                            resultado.descricao = "".concat(documento.descricao, "\n\nConte\u00FAdo extra\u00EDdo:\n").concat(trechoTexto, "...");
                        }
                    }
                    // Limpar arquivo temporário
                    if (fs.existsSync(pdfPath)) {
                        fs.unlinkSync(pdfPath);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    logger_1.logger.warn({ codigo: documento.codigo, error: error_2.message }, 'Erro ao processar PDF, usando apenas metadados');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, resultado];
            }
        });
    });
}
/**
 * Função principal de ingestão
 */
function ingestirDocumentosONS(arquivo_1) {
    return __awaiter(this, arguments, void 0, function (arquivo, downloadPDFs) {
        var arquivoPath, conteudo, documentos, documentosValidos, documentosInvalidos, _i, documentos_1, doc, documentosProcessados, _a, documentosValidos_1, doc, processado, error_3, regrasParaImportar, resultado, comConteudoExtraido, error_4;
        if (downloadPDFs === void 0) { downloadPDFs = false; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 10, , 11]);
                    arquivoPath = path.resolve(process.cwd(), arquivo);
                    if (!fs.existsSync(arquivoPath)) {
                        throw new Error("Arquivo n\u00E3o encontrado: ".concat(arquivoPath));
                    }
                    logger_1.logger.info({ arquivo: arquivoPath, downloadPDFs: downloadPDFs }, 'Iniciando ingestão de documentos ONS');
                    conteudo = fs.readFileSync(arquivoPath, 'utf-8');
                    documentos = JSON.parse(conteudo);
                    if (!Array.isArray(documentos)) {
                        throw new Error('O arquivo deve conter um array de documentos');
                    }
                    logger_1.logger.info({ total: documentos.length }, 'Documentos encontrados no arquivo');
                    documentosValidos = [];
                    documentosInvalidos = [];
                    for (_i = 0, documentos_1 = documentos; _i < documentos_1.length; _i++) {
                        doc = documentos_1[_i];
                        if (!doc.framework || doc.framework !== 'ONS') {
                            documentosInvalidos.push({
                                documento: doc,
                                erro: 'Framework deve ser ONS',
                            });
                            continue;
                        }
                        if (!doc.codigo || !doc.titulo || !doc.descricao) {
                            documentosInvalidos.push({
                                documento: doc,
                                erro: 'Código, título e descrição são obrigatórios',
                            });
                            continue;
                        }
                        documentosValidos.push(doc);
                    }
                    if (documentosInvalidos.length > 0) {
                        logger_1.logger.warn({ invalidos: documentosInvalidos.length }, 'Documentos inválidos encontrados');
                        console.log('\nDocumentos inválidos:');
                        documentosInvalidos.forEach(function (_a) {
                            var documento = _a.documento, erro = _a.erro;
                            console.log("  - ".concat(documento.codigo || 'Sem código', ": ").concat(erro));
                        });
                    }
                    if (documentosValidos.length === 0) {
                        throw new Error('Nenhum documento válido encontrado');
                    }
                    logger_1.logger.info({ validos: documentosValidos.length, invalidos: documentosInvalidos.length }, 'Processando documentos válidos');
                    documentosProcessados = [];
                    _a = 0, documentosValidos_1 = documentosValidos;
                    _b.label = 1;
                case 1:
                    if (!(_a < documentosValidos_1.length)) return [3 /*break*/, 8];
                    doc = documentosValidos_1[_a];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 6, , 7]);
                    return [4 /*yield*/, processarDocumento(doc, downloadPDFs)];
                case 3:
                    processado = _b.sent();
                    documentosProcessados.push(processado);
                    if (!(downloadPDFs && doc.tipo === 'PDF')) return [3 /*break*/, 5];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_3 = _b.sent();
                    logger_1.logger.warn({ codigo: doc.codigo, error: error_3.message }, 'Erro ao processar documento, continuando...');
                    // Adicionar mesmo assim com metadados apenas
                    documentosProcessados.push(doc);
                    return [3 /*break*/, 7];
                case 7:
                    _a++;
                    return [3 /*break*/, 1];
                case 8:
                    regrasParaImportar = documentosProcessados.map(function (doc) { return ({
                        framework: doc.framework,
                        codigo: doc.codigo,
                        titulo: doc.titulo,
                        descricao: doc.descricao,
                        categoria: doc.categoria,
                        versao: doc.versao,
                    }); });
                    // Importar usando RAGService
                    logger_1.logger.info({ total: regrasParaImportar.length }, 'Iniciando vetorização e importação');
                    return [4 /*yield*/, rag_service_1.RAGService.processarRegrasEmLote(regrasParaImportar, 3)];
                case 9:
                    resultado = _b.sent();
                    console.log('\n=== Resultado da Ingestão ===');
                    console.log("\u2705 Sucesso: ".concat(resultado.sucesso));
                    console.log("\u274C Erros: ".concat(resultado.erro));
                    if (resultado.erros.length > 0) {
                        console.log('\nErros encontrados:');
                        resultado.erros.forEach(function (_a) {
                            var codigo = _a.codigo, erro = _a.erro;
                            console.log("  - ".concat(codigo, ": ").concat(erro));
                        });
                    }
                    comConteudoExtraido = documentosProcessados.filter(function (d) { return d.conteudoExtraido; }).length;
                    if (downloadPDFs && comConteudoExtraido > 0) {
                        console.log("\n\uD83D\uDCC4 PDFs processados: ".concat(comConteudoExtraido, "/").concat(documentosValidos.length));
                    }
                    logger_1.logger.info({
                        sucesso: resultado.sucesso,
                        erro: resultado.erro,
                        pdfsProcessados: comConteudoExtraido,
                    }, 'Ingestão concluída');
                    return [3 /*break*/, 11];
                case 10:
                    error_4 = _b.sent();
                    logger_1.logger.error({ error: error_4.message }, 'Erro ao ingerir documentos ONS');
                    console.error('\n❌ Erro:', error_4.message);
                    process.exit(1);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
// Executar script
var arquivo = process.argv[2];
var downloadPDFs = process.argv.includes('--download');
if (!arquivo) {
    console.error('Uso: tsx scripts/ingestir-documentos-ons.ts <arquivo.json> [--download]');
    console.error('\nExemplo:');
    console.error('  # Apenas importar metadados');
    console.error('  tsx scripts/ingestir-documentos-ons.ts data/ons-documentos-metadados.json');
    console.error('\n  # Importar e fazer download dos PDFs (requer pdf-parse)');
    console.error('  tsx scripts/ingestir-documentos-ons.ts data/ons-documentos-metadados.json --download');
    console.error('\n  # Instalar pdf-parse para extração de texto:');
    console.error('  npm install pdf-parse');
    process.exit(1);
}
ingestirDocumentosONS(arquivo, downloadPDFs)
    .then(function () {
    console.log('\n✅ Ingestão concluída com sucesso!');
    process.exit(0);
})
    .catch(function (error) {
    console.error('\n❌ Erro fatal:', error.message);
    process.exit(1);
});
