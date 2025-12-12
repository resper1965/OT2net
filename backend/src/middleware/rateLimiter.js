"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = rateLimiter;
var store = {};
/**
 * Rate limiter simples em memória
 * Em produção, usar Redis com biblioteca como express-rate-limit
 */
function rateLimiter(windowMs, // 15 minutos
maxRequests // 100 requisições por janela
) {
    if (windowMs === void 0) { windowMs = 15 * 60 * 1000; }
    if (maxRequests === void 0) { maxRequests = 100; }
    return function (req, res, next) {
        var key = req.ip || 'unknown';
        var now = Date.now();
        // Limpar entradas expiradas
        Object.keys(store).forEach(function (k) {
            if (store[k].resetTime < now) {
                delete store[k];
            }
        });
        // Verificar ou criar entrada
        if (!store[key] || store[key].resetTime < now) {
            store[key] = {
                count: 1,
                resetTime: now + windowMs,
            };
            return next();
        }
        // Incrementar contador
        store[key].count++;
        // Verificar limite
        if (store[key].count > maxRequests) {
            var resetTime = new Date(store[key].resetTime).toISOString();
            return res.status(429).json({
                error: 'Muitas requisições',
                message: "Limite de ".concat(maxRequests, " requisi\u00E7\u00F5es excedido. Tente novamente ap\u00F3s ").concat(resetTime),
                retryAfter: Math.ceil((store[key].resetTime - now) / 1000),
            });
        }
        // Adicionar headers de rate limit
        res.setHeader('X-RateLimit-Limit', maxRequests.toString());
        res.setHeader('X-RateLimit-Remaining', (maxRequests - store[key].count).toString());
        res.setHeader('X-RateLimit-Reset', new Date(store[key].resetTime).toISOString());
        next();
    };
}
