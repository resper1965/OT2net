import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { PDFService } from '../services/pdf';
import { AppError } from '../middleware/errorHandler';

const router = Router();

const generateReportSchema = z.object({
  projeto_id: z.string().uuid(),
  tipo: z.enum(['onboarding']).default('onboarding'),
});

// POST /api/relatorios/onboarding - Gerar relatório de onboarding
router.post(
  '/onboarding',
  authenticateToken,
  validate({ body: generateReportSchema }),
  async (req, res, next) => {
    try {
      const { projeto_id } = req.body;

      // Gerar PDF e fazer upload
      const signedUrl = await PDFService.generateAndUploadOnboardingReport(projeto_id);

      res.json({
        success: true,
        url: signedUrl,
        projeto_id,
        tipo: 'onboarding',
        gerado_em: new Date().toISOString(),
      });
    } catch (error: any) {
      if (error.message === 'Projeto não encontrado') {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  }
);

// GET /api/relatorios/onboarding/:projeto_id - Obter URL do relatório
router.get('/onboarding/:projeto_id', authenticateToken, async (req, res, next) => {
  try {
    const { projeto_id } = req.params;

    // Por enquanto, sempre gera novo. Em produção, pode verificar se já existe
    const signedUrl = await PDFService.generateAndUploadOnboardingReport(projeto_id);

    res.json({
      url: signedUrl,
      projeto_id,
      tipo: 'onboarding',
    });
  } catch (error: any) {
    if (error.message === 'Projeto não encontrado') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
});

export default router;








