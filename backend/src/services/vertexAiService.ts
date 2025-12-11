import { VertexAI, GenerativeModel } from "@google-cloud/vertexai";
import { logger } from "../utils/logger";

interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export class VertexAIService {
  private vertexAI: VertexAI;
  private model: GenerativeModel;
  private project: string;
  private location: string;

  constructor(project?: string, location?: string) {
    this.project = project || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ot2net";
    this.location = location || "us-central1";

    this.vertexAI = new VertexAI({
      project: this.project,
      location: this.location,
    });

    this.model = this.vertexAI.getGenerativeModel({
      model: "gemini-pro",
    });

    logger.info({ project: this.project, location: this.location }, "Vertex AI Service initialized");
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      
      if (!response.candidates || !response.candidates[0] || !response.candidates[0].content || !response.candidates[0].content.parts || !response.candidates[0].content.parts[0]) {
        return "No response generated";
      }

      const text = response.candidates[0].content.parts[0].text;
      return text || "No response generated";
    } catch (error) {
      logger.error({ error }, "Error generating content from Vertex AI");
      throw error;
    }
  }

  async chat(history: ChatMessage[], message: string): Promise<string> {
    try {
      const chat = this.model.startChat({
        history: history,
      });

      const result = await chat.sendMessage(message);
      const response = result.response;

      if (!response.candidates || !response.candidates[0] || !response.candidates[0].content || !response.candidates[0].content.parts || !response.candidates[0].content.parts[0]) {
        return "No response generated";
      }

      const text = response.candidates[0].content.parts[0].text;
      return text || "No response generated";
    } catch (error) {
      logger.error({ error }, "Error in chat with Vertex AI");
      throw error;
    }
  }
}
