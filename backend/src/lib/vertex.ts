import { VertexAI } from '@google-cloud/vertexai';

// Instanciar Vertex AI
// Cloud Run injeta automaticamente as credenciais via Service Account
const project = process.env.GOOGLE_CLOUD_PROJECT_ID || 'ot2net'; 
const location = 'us-central1';

const vertex_ai = new VertexAI({
  project: project,
  location: location,
});

// Modelo otimizado para tarefas rápidas e estruturadas
const model = 'gemini-1.5-flash-001';

export const generativeModel = vertex_ai.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 0.1, // Baixa temperatura para outputs consistentes (JSON/Code)
    topP: 0.8,
    topK: 40,
  },
});
