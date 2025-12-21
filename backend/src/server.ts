import dotenv from "dotenv";
import path from "path";
import app from "./app";
import { logger } from "./utils/logger";

// Carregar variáveis de ambiente (.env.local tem prioridade)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config(); // Fallback para .env se .env.local não existir

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  logger.info({ port: PORT, env: process.env.NODE_ENV }, "Backend server started");
});

