import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const createMembroEquipeSchema = z.object({
  projeto_id: z.string().uuid().optional(),
  usuario_id: z.string().uuid().optional(),
  papel: z.string().optional(),
  responsabilidade: z.string().optional(),
  autoridade: z.string().optional(),
  consultado: z.string().optional(),
  informado: z.string().optional(),
});

const updateMembroEquipeSchema = createMembroEquipeSchema.partial();

// GET /api/membros-equipe - Listar todos os membros
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { projeto_id } = req.query;
    const where = projeto_id ? { projeto_id: projeto_id as string } : {};
    
    const membros = await prisma.membroEquipe.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        projeto: true,
      },
    });
    res.json(membros);
  } catch (error) {
    next(error);
  }
});

// GET /api/membros-equipe/:id - Obter membro por ID
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const membro = await prisma.membroEquipe.findUnique({
      where: { id },
      include: {
        projeto: true,
      },
    });

    if (!membro) {
      return res.status(404).json({ error: 'Membro não encontrado' });
    }

    res.json(membro);
  } catch (error) {
    next(error);
  }
});

// POST /api/membros-equipe - Criar novo membro
router.post(
  '/',
  authenticateToken,
  validate({ body: createMembroEquipeSchema }),
  async (req, res, next) => {
    try {
      const membro = await prisma.membroEquipe.create({
        data: req.body,
      });
      res.status(201).json(membro);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/membros-equipe/:id - Atualizar membro
router.put(
  '/:id',
  authenticateToken,
  validate({ body: updateMembroEquipeSchema }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const membro = await prisma.membroEquipe.update({
        where: { id },
        data: req.body,
      });
      res.json(membro);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Membro não encontrado' });
      }
      next(error);
    }
  }
);

// DELETE /api/membros-equipe/:id - Deletar membro
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.membroEquipe.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Membro não encontrado' });
    }
    next(error);
  }
});

export default router;








