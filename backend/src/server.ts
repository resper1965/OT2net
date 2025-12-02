import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { authenticate, optionalAuthenticate } from "./middleware/auth";
import { requirePermission, requireAdmin } from "./middleware/permissions";

// Carregar variáveis de ambiente (.env.local tem prioridade)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config(); // Fallback para .env se .env.local não existir

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Rate limiting
app.use(rateLimiter(15 * 60 * 1000, 100)); // 100 requests per 15 minutes

// Health check (público)
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Exemplo de rota protegida
app.get("/api/me", authenticate, (req, res) => {
  const user = (req as any).user;
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

// Routes will be added here

// Error handler (deve ser o último middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

