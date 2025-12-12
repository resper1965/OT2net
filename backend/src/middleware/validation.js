"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
var zod_1 = require("zod");
/**
 * Middleware de validação usando Zod
 * Valida body, query ou params da requisição
 */
function validate(schema) {
    return function (req, res, next) {
        try {
            if (schema.body) {
                req.body = schema.body.parse(req.body);
            }
            if (schema.query) {
                req.query = schema.query.parse(req.query);
            }
            if (schema.params) {
                req.params = schema.params.parse(req.params);
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                var errors = error.errors.map(function (err) { return ({
                    path: err.path.join('.'),
                    message: err.message,
                }); });
                return res.status(400).json({
                    error: 'Erro de validação',
                    message: 'Dados inválidos fornecidos',
                    details: errors,
                });
            }
            next(error);
        }
    };
}
