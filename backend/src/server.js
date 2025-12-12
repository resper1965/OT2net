"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var dotenv_1 = require("dotenv");
var path_1 = require("path");
var routes_1 = require("./routes");
var auth_1 = require("./middleware/auth");
var permissions_1 = require("./middleware/permissions");
var errorHandler_1 = require("./middleware/errorHandler");
var rateLimiter_1 = require("./middleware/rateLimiter");
var logger_1 = require("./utils/logger");
// Carregar variáveis de ambiente (.env.local tem prioridade)
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env.local") });
dotenv_1.default.config(); // Fallback para .env se .env.local não existir
var app = (0, express_1.default)();
var PORT = Number(process.env.PORT) || 3001;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'https://ot2net.ness.com.br'] : ['http://localhost:3000', 'https://ot2net.ness.com.br'],
    credentials: true,
}));
app.use(express_1.default.json());
// Rate limiting
app.use((0, rateLimiter_1.rateLimiter)(15 * 60 * 1000, 100)); // 100 requests per 15 minutes
// Rotas principais
app.use("/api", routes_1.default);
// Exemplo de rota protegida
app.get("/api/me", auth_1.authenticate, function (req, res) {
    var user = req.user;
    logger_1.logger.info({ userId: user.id }, "User profile accessed");
    res.json({
        user: {
            id: user.id,
            email: user.email,
            metadata: user.user_metadata,
        },
    });
});
// Exemplo de rota com permissão específica
app.get("/api/projetos", auth_1.authenticate, (0, permissions_1.requirePermission)("projeto", "view"), function (req, res) {
    res.json({ message: "Lista de projetos (requer permissão de visualização)" });
});
// Exemplo de rota apenas para admin
app.get("/api/admin/users", auth_1.authenticate, permissions_1.requireAdmin, function (req, res) {
    res.json({ message: "Lista de usuários (apenas admin)" });
});
// Error handler (deve ser o último middleware)
app.use(errorHandler_1.errorHandler);
app.listen(PORT, function () {
    logger_1.logger.info({ port: PORT, env: process.env.NODE_ENV }, "Backend server started");
});
