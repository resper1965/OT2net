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

  async generateBpmnJson(description: string): Promise<any> {
    const prompt = `
    You are a BPMN 2.0 expert. Your task is to analyze the following operational description and transform it into a strict BPMN 2.0 JSON structure.
    
    Description:
    ${description}
    
    Return ONLY a valid JSON object with the following structure:
    {
      "definitions": {
        "process": {
          "id": "Process_1",
          "name": "derived from description",
          "isExecutable": false,
          "laneSets": [
            {
              "id": "LaneSet_1",
              "lanes": [
                {
                  "id": "Lane_1",
                  "name": "Actor/Role Name",
                  "flowNodeRef": ["StartEvent_1", "Task_1", ...]
                }
              ]
            }
          ],
          "flowElements": [
            { "id": "StartEvent_1", "name": "Start", "type": "startEvent", "outgoing": ["Flow_1"] },
            { "id": "Task_1", "name": "Task Name", "type": "task", "incoming": ["Flow_1"], "outgoing": ["Flow_2"] },
            { "id": "EndEvent_1", "name": "End", "type": "endEvent", "incoming": ["Flow_X"] },
            { "id": "Gateway_1", "name": "Decision?", "type": "exclusiveGateway", "incoming": [...], "outgoing": [...] }
          ],
          "sequenceFlows": [
            { "id": "Flow_1", "sourceRef": "StartEvent_1", "targetRef": "Task_1" }
          ]
        }
      }
    }
    
    Rules:
    1. Identify all Actors/Roles and create Lanes for them.
    2. Convert actions into Tasks.
    3. Convert decisions into Exclusive Gateways.
    4. Ensure logically connected Sequence Flows.
    5. No markdown, no explanations. Just the JSON string.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      
      if (!response.candidates || !response.candidates[0] || !response.candidates[0].content || !response.candidates[0].content.parts || !response.candidates[0].content.parts[0]) {
        throw new Error("No response from Vertex AI");
      }

      let text = response.candidates[0].content.parts[0].text || "{}";
      // Clean up markdown code blocks if present
      text = text.replace(/```json\n?|\n?```/g, "").trim();
      
      return JSON.parse(text);
    } catch (error) {
       logger.error({ error }, "Error generating BPMN JSON");
       throw error;
    }
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
