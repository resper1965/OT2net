import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// GET /api/fases - Listar todas as fases do sistema
router.get('/', authenticateToken, async (req: any, res, next) => {
  try {
    const fases = await req.prisma.fase.findMany({
      orderBy: { ordem: 'asc' },
      include: {
        etapas: {
          orderBy: { ordem: 'asc' },
        },
      },
    });

    res.json(fases);
  } catch (error) {
    next(error);
  }
});

// GET /api/fases/:codigo - Obter fase específica por código
router.get('/:codigo', authenticateToken, async (req: any, res, next) => {
  try {
    const { codigo } = req.params;
    const fase = await req.prisma.fase.findUnique({
      where: { codigo },
      include: {
        etapas: {
          orderBy: { ordem: 'asc' },
        },
      },
    });

    if (!fase) {
      return res.status(404).json({ error: 'Fase não encontrada' });
    }

    res.json(fase);
  } catch (error) {
    next(error);
  }
});

export default router;
