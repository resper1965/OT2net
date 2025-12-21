import { prisma } from "@/lib/prisma";
import { VertexAIService } from "./vertexAiService";
import { logger } from "../utils/logger";

export class EvidenceGeneratorService {
  private aiService: VertexAIService;

  constructor() {
    this.aiService = new VertexAIService();
  }

  /**
   * Gera um relatório de evidência técnica para auditoria baseado em um processo e suas conformidades.
   */
  async gerarEvidenciaAuditavel(processoId: string) {
    logger.info({ processoId }, "Gerando evidência auditável");

    const processo = await prisma.processoNormalizado.findUnique({
      where: { id: processoId },
      include: {
        etapas: true,
        riscos: true
      }
    });

    if (!processo) throw new Error("Processo não encontrado.");

    const prompt = `
      Aja como um Auditor Líder de Conformidade OT (IEC 62443 / NIST CSF).
      Gere um Relatório de Evidência Técnica (Markdown) para o seguinte processo:
      
      PROCESSO: ${processo.nome}
      ETAPAS: ${JSON.stringify(processo.etapas.map(e => e.nome))}
      RISCOS ASSOCIADOS: ${JSON.stringify(processo.riscos.map(r => r.nome))}
      
      O relatório deve conter:
      1. Título Profissional.
      2. Resumo da Verificação Técnica.
      3. Tabela de Conformidade por Etapa.
      4. Veredito do Auditor (IA).
      5. Instruções para o Auditor Humano validar a evidência física (ex: print do log, configuração do firewall).

      USE UM TOM FORMAL E ESTRUTURA AUDITÁVEL.
    `;

    try {
      const markdown = await this.aiService.generateResponse(prompt);
      
      // Aqui poderíamos salvar em um bucket ou tabela de documentos
      return {
        filename: `EVIDENCIA_${processo.nome.replace(/\s+/g, '_')}_${Date.now()}.md`,
        content: markdown,
        generated_at: new Date()
      };
    } catch (error) {
      logger.error({ error }, "Erro ao gerar evidência");
      throw error;
    }
  }
}
