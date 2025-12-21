import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { vertexService } from '../services/vertex-ai';

const router = Router();

// GET /api/ai/health - Verify Vertex AI connectivity
router.get('/health', async (req: Request, res: Response): Promise<void> => {
  try {
    const isHealthy = await vertexService.healthCheck();
    if (isHealthy) {
      res.json({ status: 'ok', model: 'gemini-1.5-flash', message: 'Vertex AI connectivity confirmed' });
    } else {
      res.status(503).json({ status: 'error', message: 'Vertex AI health check failed' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/normalizar', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { descricao } = req.body;

    if (!descricao) {
      res.status(400).json({ error: 'Descrição é obrigatória' });
      return;
    }

    const prompt = `
      Você é um Arquiteto de Sistemas Senior especializado em BPMN 2.0 e Governança Corporativa (Foco em OT/Cibersegurança: ANEEL, ONS, CyberArk).
      Seu objetivo é atuar como o motor lógico de uma aplicação que transforma descrições informais de processos em fluxos técnicos validados.

      TAREFA:
      Analisar a descrição operacional bruta e normalizá-la em um PROCESSO ESTRUTURADO BPMN 2.0.

      DESCRIÇÃO RAW:
      "${descricao}"

      DIRETRIZES TÉCNICAS (BPMN 2.0 STRICT):
      1. Normalização: Identifique Pools (Organizações) e Lanes (Departamentos/Papéis).
      2. Descrição Estruturada: Texto técnico e sequencial.
      3. Mermaid: Gere código compatível com Mermaid.js (graph TD).
      4. RACI: Para CADA passo, identifique quem é R, A, C, I.

      SAÍDA ESPERADA (JSON):
      {
        "processo_identificado": {
          "nome": "string",
          "objetivo": "string",
          "passos": [
            {
              "id": "step_1",
              "acao": "string",
              "ator": "string",
              "tipo_bpmn": "Task | Gateway | Event",
              "raci": { "R": "string", "A": "string", "C": "string", "I": "string" }
            }
          ],
          "mermaid_code": "string",
          "validacao_tecnica": "string",
          "riscos_identificados": ["string"]
        }
      }
    `;

    // Use Flash for speed
    const model = vertexService.getFlashModel();
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const response = await result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No content generated');
    }

    // Since we requested JSON mime type, we can parse directly
    const jsonResult = JSON.parse(text);
    res.json(jsonResult.processo_identificado); // Return the inner object to match expected frontend data
  } catch (error: any) {
    console.error('Erro na normalização IA:', error);
    res.status(500).json({ error: 'Falha ao processar com IA', details: error.message });
  }
});

// POST /api/ai/analyze-risk - Analyze risks from processed description
router.post('/analyze-risk', authenticateToken, async (req: any, res: Response): Promise<void> => {
  try {
    const { processo_normalizado_id, framework_id } = req.body;

    if (!processo_normalizado_id) {
      res.status(400).json({ error: 'processo_normalizado_id é obrigatório' });
      return;
    }

    // Get normalized process
    const processo = await req.prisma.processoNormalizado.findUnique({
      where: { id: processo_normalizado_id },
      include: {
        etapas: true,
        ativos: true,
        dificuldades: true,
      },
    });

    if (!processo) {
      res.status(404).json({ error: 'Processo não encontrado' });
      return;
    }

    const prompt = `
      Você é um Especialista em Cybersecurity e Riscos Operacionais para Tecnologia Operacional (OT).
      Analise o seguinte processo normalizado e identifique riscos de segurança e operacionais.

      PROCESSO:
      Nome: ${processo.nome}
      Objetivo: ${processo.objetivo || 'N/A'}
      Criticidade: ${processo.criticidade || 'N/A'}
      
      ETAPAS:
      ${processo.etapas?.map((e: any) => `${e.ordem}. ${e.nome} - ${e.descricao}`).join('\n')}
      
      ATIVOS ENVOLVIDOS:
      ${processo.ativos?.map((a: any) => `- ${a.nome} (${a.tipo})`).join('\n') || 'Nenhum'}
      
      DIFICULDADES RELATADAS:
      ${processo.dificuldades?.map((d: any) => `- ${d.descricao}`).join('\n') || 'Nenhum'}

      SAÍDA ESPERADA (JSON):
      {
        "riscos_identificados": [
          {
            "nome": "Nome curto do risco",
            "categoria": "TECNICO" | "OPERACIONAL" | "SEGURANCA" | "COMPLIANCE",
            "descricao": "Descrição detalhada do risco",
            "probabilidade": 1-5,
            "impacto_seguranca": 1-5,
            "impacto_operacional": 1-5,
            "fonte": "Etapa ou ativo que origina o risco",
            "controles_recomendados": ["Controle 1", "Controle 2"]
          }
        ],
        "recomendacoes_gerais": ["Recomendação 1", "Recomendação 2"]
      }

      Responda APENAS o JSON. Sem markdown.
    `;

    // Use Pro for risk analysis (deeper reasoning)
    const jsonResult = await vertexService.generateJson(prompt, 'pro');

    res.json(jsonResult);
  } catch (error: any) {
    console.error('Erro na análise de riscos IA:', error);
    res.status(500).json({ error: 'Falha ao processar com IA', details: error.message });
  }
});

export const aiRouter = router;
