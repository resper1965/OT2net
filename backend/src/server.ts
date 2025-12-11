import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import routes from "./routes";
import { authenticate } from "./middleware/auth";
import { requirePermission, requireAdmin } from "./middleware/permissions";
import { errorHandler } from "./middleware/errorHandler";
import { rateLimiter } from "./middleware/rateLimiter";
import { logger } from "./utils/logger";

// Carregar variáveis de ambiente (.env.local tem prioridade)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config(); // Fallback para .env se .env.local não existir

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'https://ot2net.ness.com.br'] : ['http://localhost:3000', 'https://ot2net.ness.com.br'],
  credentials: true,
}));
app.use(express.json());

// Rate limiting
app.use(rateLimiter(15 * 60 * 1000, 100)); // 100 requests per 15 minutes

// Rotas principais
app.use("/api", routes);

// Exemplo de rota protegida
app.get("/api/me", authenticate, (req, res) => {
  const user = (req as any).user;
  logger.info({ userId: user.id }, "User profile accessed");
  res.json({
    user: {
      id: user.id,
      email: user.email,
      metadata: user.user_metadata,
    },
  });
});

// Exemplo de rota com permissão específica
app.get("/api/projetos", authenticate, requirePermission("projeto", "view"), (req, res) => {
  res.json({ message: "Lista de projetos (requer permissão de visualização)" });
});

// Exemplo de rota apenas para admin
app.get("/api/admin/users", authenticate, requireAdmin, (req, res) => {
  res.json({ message: "Lista de usuários (apenas admin)" });
});

// Error handler (deve ser o último middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info({ port: PORT, env: process.env.NODE_ENV }, "Backend server started");
});

