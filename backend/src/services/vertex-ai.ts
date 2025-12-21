import { VertexAI, GenerativeModel } from '@google-cloud/vertexai';

export class VertexAIService {
  private vertexAi: VertexAI;
  private flashModel: GenerativeModel;
  private proModel: GenerativeModel;

  constructor() {
    const project = process.env.GOOGLE_CLOUD_PROJECT_ID || 'ot2net';
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

    this.vertexAi = new VertexAI({
      project: project,
      location: location,
    });

    this.flashModel = this.vertexAi.getGenerativeModel({
      model: 'gemini-1.5-flash-001',
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.1,
        topP: 0.8,
        topK: 40,
      },
      safetySettings: [],
    });

    this.proModel = this.vertexAi.getGenerativeModel({
      model: 'gemini-1.5-pro-001',
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
      },
    });
  }

  getFlashModel(): GenerativeModel {
    return this.flashModel;
  }

  getProModel(): GenerativeModel {
    return this.proModel;
  }

  async generateJson(prompt: string, modelType: 'flash' | 'pro' = 'flash'): Promise<any> {
    const model = modelType === 'pro' ? this.proModel : this.flashModel;
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('No content generated');
      }

      // Clean markdown code blocks if present
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.error('Vertex AI Generation Error:', error);
      throw error;
    }
  }

  // async getEmbeddings(text: string): Promise<number[]> {
  //   try {
  //     // Using gemini-1.5-flash or dedicated embedding model
  //     // For embedding, usually 'text-embedding-004' is preferred if available in Vertex AI
  //     const model = this.vertexAi.getGenerativeModel({ model: 'text-embedding-004' });
  //     
  //     // @ts-ignore - embedContent not available in current SDK version
  //     const result = await model.embedContent(text);
  //     const embedding = result.embedding?.values;
  //     
  //     if (!embedding) {
  //       throw new Error('No embedding generated');
  //     }
  //
  //     return embedding;
  //   } catch (error) {
  //     console.error('Vertex AI Embedding Error:', error);
  //     // Fallback or rethrow
  //     throw error;
  //   }
  // }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.flashModel.generateContent('Say "OK" if you are healthy.');
      const response = await result.response;
      return !!response.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
      console.error('Vertex AI Health Check Failed:', error);
      return false;
    }
  }
}

export const vertexService = new VertexAIService();
