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
    let text = response.candidates[0].content.parts[0].text;

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

export const aiRouter = router;
