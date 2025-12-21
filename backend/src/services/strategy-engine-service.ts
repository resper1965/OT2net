import { prisma } from "@/lib/prisma";
import { VertexAIService } from "./vertexAiService";
import { logger } from "../utils/logger";

export interface GapAnalisado {
  etapa: string;
  problema: string;
  recomendacao: string;
  severidade: 'alta' | 'media' | 'baixa';
  norma: string;
}

export class StrategyEngineService {
  private aiService: VertexAIService;

  constructor() {
    this.aiService = new VertexAIService();
  }

  /**
   * Transforma gaps de conformidade em um Roadmap Estratégico (Iniciativas + Tecnologia)
   */
  async gerarPlanoDiretor(projetoId: string, gaps: GapAnalisado[]) {
    logger.info({ projetoId, gapCount: gaps.length }, "Gerando Plano Diretor Estratégico");

    const prompt = `
      Você é um Consultor Estratégico de OT e Arquiteto de Segurança Industrial.
      Com base nos GAPS de conformidade identicados abaixo, gere um Plano Diretor de Implementação.
      
      GAPS IDENTIFICADOS:
      ${JSON.stringify(gaps)}
      
      OBJETIVOS:
      1. Agrupar gaps em Iniciativas de Projeto lógicas (ex: 'Monitoramento de Rede', 'Gestão de Identidades').
      2. Sugerir tecnologias OT específicas (ex: Firewall Industrial, OT-IDS, PAM, Backup Offline).
      3. Distribuir em 3 Ondas:
         - Onda 1 (Imediata): Mitigação de riscos 'Alta' severidade.
         - Onda 2 (Curto Prazo): Governança e processos.
         - Onda 3 (Médio Prazo): Otimização e monitoramento contínuo.
      4. Definir Matriz RASCI organizacional para cada iniciativa.

      RETORNE APENAS UM JSON NO FORMATO:
      {
        "iniciativas": [
          {
            "nome": "Nome do Projeto",
            "objetivo": "O que resolve",
            "onda": 1|2|3,
            "prioridade": "ALTA|MEDIA|BAIXA",
            "tecnologias_sugeridas": ["Tech 1", "Tech 2"],
            "rasci_sugerido": { "R": "Papel", "A": "Papel", "C": "Papel", "I": "Papel" }
          }
        ],
        "resumo_executivo": "Texto curto sobre o foco estratégico do roadmap."
      }
    `;

    try {
      const response = await this.aiService.generateResponse(prompt);
      const plano = JSON.parse(response);

      // Salvar iniciativas no banco (opcional, dependendo do fluxo desejado)
      // Por agora, apenas retornamos para a UI exibir
      
      return plano;
    } catch (error) {
      logger.error({ error }, "Erro ao gerar Plano Diretor");
      throw error;
    }
  }
}
