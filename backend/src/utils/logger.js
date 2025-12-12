"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logContext = exports.logger = void 0;
var pino_1 = require("pino");
/**
 * Logger estruturado usando Pino
 * Em desenvolvimento, usa pino-pretty para output legível
 * Em produção, usa JSON estruturado
 */
exports.logger = (0, pino_1.default)({
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        }
        : undefined,
    formatters: {
        level: function (label) {
            return { level: label.toUpperCase() };
        },
    },
    timestamp: pino_1.default.stdTimeFunctions.isoTime,
});
/**
 * Helpers para logging contextual
 */
exports.logContext = {
    request: function (req) { return ({
        method: req.method,
        path: req.path,
        ip: req.ip,
        userId: req.userId,
    }); },
    error: function (error) { return ({
        message: error.message,
        stack: error.stack,
        name: error.name,
    }); },
};
