import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Carregar variáveis de ambiente (.env.local tem prioridade)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config(); // Fallback para .env se .env.local não existir

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes will be added here

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

