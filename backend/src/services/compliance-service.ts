import { prisma } from "@/lib/prisma";
import { RAGService, FrameworkType } from "./rag-service";
import { VertexAIService } from "./vertexAiService";
import { logger } from "../utils/logger";

export class ComplianceService {
  private aiService: VertexAIService;

  constructor() {
    this.aiService = new VertexAIService();
  }

  /**
   * Realiza um cruzamento automatizado entre um processo normalizado e frameworks regulatórios.
   */
  async realizarCrossCheck(processoId: string, frameworks: FrameworkType[]) {
    logger.info({ processoId, frameworks }, "Iniciando cross-check regulatório");

    const etapas = await prisma.processoEtapa.findMany({
      where: { processo_normalizado_id: processoId },
      orderBy: { ordem: "asc" }
    });

    if (etapas.length === 0) {
      throw new Error("Processo sem etapas para análise.");
    }

    const resultados = [];

    for (const framework of frameworks) {
      const ragResult = await RAGService.consultarRegras(
        `Quais os requisitos de segurança e conformidade para as seguintes etapas de operação OT: ${etapas.map(e => e.nome).join(", ")}?`,
        { framework }
      );

      const prompt = `
        Aja como um Auditor de Cyber OT.
        Analise a adesão das etapas reais abaixo ao framework ${framework} considerando o contexto normativo fornecido.
        
        ETAPAS REAIS:
        ${JSON.stringify(etapas.map(e => ({ nome: e.nome, descricao: e.descricao })))}
        
        CONTEXTO NORMATIVO (RAG):
        ${ragResult.contexto || ragResult.resposta}
        
        Retorne um JSON com:
        {
          "framework": "${framework}",
          "score_conformidade": 0-100,
          "gaps": [
            { "etapa": "nome", "problema": "descrição", "recomendacao": "ação", "severidade": "alta|media|baixa" }
          ],
          "pontos_fortes": ["..."]
        }
      `;

      const analise = await this.aiService.generateResponse(prompt);
      resultados.push(JSON.parse(analise));
    }

    return resultados;
  }
}
