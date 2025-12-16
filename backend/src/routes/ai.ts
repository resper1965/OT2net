import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { generativeModel } from '../lib/vertex';

const router = Router();

router.post('/normalizar', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { descricao } = req.body;

    if (!descricao) {
      res.status(400).json({ error: 'Descrição é obrigatória' });
      return;
    }

    const prompt = `
      Você é um Especialista em Processos de Negócio (BPM) e Governança de TI.
      Sua tarefa é analisar a seguinte descrição operacional bruta e normalizá-la em um processo estruturado.

      DESCRIÇÃO ORIGINAL:
      "${descricao}"

      SAÍDA ESPERADA (JSON):
      {
        "titulo": "Nome curto e profissional para o processo",
        "resumo": "Resumo executivo do que o processo faz (max 2 frases)",
        "atores": ["Lista", "de", "cargos/personas", "envolvidos"],
        "mermaid_code": "Código Mermaid graph TD representando o fluxo passo a passo. Use formas retangulares para processos e losangos para decisões. Não use subgraphs complexos, mantenha simples.",
        "passos": [
          { "ordem": 1, "acao": "Descrição da ação", "responsavel": "Cargo" }
        ],
        "riscos_identificados": ["Possível risco 1", "Possível risco 2"]
      }
      
      Responda APENAS o JSON. Sem markdown.
    `;

    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    const candidates = response.candidates;
    
    if (!candidates || !candidates[0] || !candidates[0].content || !candidates[0].content.parts || !candidates[0].content.parts[0]) {
       throw new Error("Resposta inválida do modelo IA");
    }

    let text = candidates[0].content.parts[0].text;

    // Limpar markdown se houver (```json ... ```)
    if (text?.startsWith('```json')) {
      text = text.replace(/```json/g, '').replace(/```/g, '');
    }

    const jsonResult = JSON.parse(text || '{}');

    res.json(jsonResult);
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
      ${processo.dificuldades?.map((d: any) => `- ${d.descricao}`).join('\n') || 'Nenhuma'}

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

    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    const candidates = response.candidates;
    
    if (!candidates || !candidates[0] || !candidates[0].content || !candidates[0].content.parts || !candidates[0].content.parts[0]) {
       throw new Error("Resposta inválida do modelo IA");
    }

    let text = candidates[0].content.parts[0].text;

    if (text?.startsWith('```json')) {
      text = text.replace(/```json/g, '').replace(/```/g, '');
    }

    const jsonResult = JSON.parse(text || '{}');

    res.json(jsonResult);
  } catch (error: any) {
    console.error('Erro na análise de riscos IA:', error);
    res.status(500).json({ error: 'Falha ao processar com IA', details: error.message });
  }
});

export const aiRouter = router;
