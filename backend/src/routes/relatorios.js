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
var zod_1 = require("zod");
var auth_1 = require("../middleware/auth");
var validation_1 = require("../middleware/validation");
var pdf_1 = require("../services/pdf");
var router = (0, express_1.Router)();
var generateReportSchema = zod_1.z.object({
    projeto_id: zod_1.z.string().uuid(),
    tipo: zod_1.z.enum(['onboarding']).default('onboarding'),
});
// POST /api/relatorios/onboarding - Gerar relatório de onboarding
router.post('/onboarding', auth_1.authenticateToken, (0, validation_1.validate)({ body: generateReportSchema }), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var projeto_id, signedUrl, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                projeto_id = req.body.projeto_id;
                return [4 /*yield*/, pdf_1.PDFService.generateAndUploadOnboardingReport(projeto_id)];
            case 1:
                signedUrl = _a.sent();
                res.json({
                    success: true,
                    url: signedUrl,
                    projeto_id: projeto_id,
                    tipo: 'onboarding',
                    gerado_em: new Date().toISOString(),
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                if (error_1.message === 'Projeto não encontrado') {
                    return [2 /*return*/, res.status(404).json({ error: error_1.message })];
                }
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/relatorios/onboarding/:projeto_id - Obter URL do relatório
router.get('/onboarding/:projeto_id', auth_1.authenticateToken, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var projeto_id, signedUrl, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                projeto_id = req.params.projeto_id;
                return [4 /*yield*/, pdf_1.PDFService.generateAndUploadOnboardingReport(projeto_id)];
            case 1:
                signedUrl = _a.sent();
                res.json({
                    url: signedUrl,
                    projeto_id: projeto_id,
                    tipo: 'onboarding',
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                if (error_2.message === 'Projeto não encontrado') {
                    return [2 /*return*/, res.status(404).json({ error: error_2.message })];
                }
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
