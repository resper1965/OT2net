import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const createStakeholderSchema = z.object({
  projeto_id: z.string().uuid().optional(),
  identificacao_pessoal: z.object({
    nome: z.string().optional(),
    cpf: z.string().optional(),
    rg: z.string().optional(),
  }).optional(),
  vinculo_profissional: z.object({
    cargo: z.string().optional(),
    departamento: z.string().optional(),
    empresa: z.string().optional(),
  }).optional(),
  contatos: z.object({
    email: z.string().email().optional(),
    telefone: z.string().optional(),
    celular: z.string().optional(),
  }).optional(),
  localizacao: z.string().optional(),
  papel_no_projeto: z.string().optional(),
  poder_influencia: z.string().optional(),
  expertise: z.string().optional(),
});

const updateStakeholderSchema = createStakeholderSchema.partial();

// GET /api/stakeholders - Listar todos os stakeholders
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { projeto_id } = req.query;
    const where = projeto_id ? { projeto_id: projeto_id as string } : {};
    
    const stakeholders = await prisma.stakeholder.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        projeto: true,
      },
    });
    res.json(stakeholders);
  } catch (error) {
    next(error);
  }
});

// GET /api/stakeholders/:id - Obter stakeholder por ID
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const stakeholder = await prisma.stakeholder.findUnique({
      where: { id },
      include: {
        projeto: true,
      },
    });

    if (!stakeholder) {
      return res.status(404).json({ error: 'Stakeholder não encontrado' });
    }

    res.json(stakeholder);
  } catch (error) {
    next(error);
  }
});

// POST /api/stakeholders - Criar novo stakeholder
router.post(
  '/',
  authenticateToken,
  validate({ body: createStakeholderSchema }),
  async (req, res, next) => {
    try {
      const stakeholder = await prisma.stakeholder.create({
        data: req.body,
      });
      res.status(201).json(stakeholder);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/stakeholders/:id - Atualizar stakeholder
router.put(
  '/:id',
  authenticateToken,
  validate({ body: updateStakeholderSchema }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const stakeholder = await prisma.stakeholder.update({
        where: { id },
        data: req.body,
      });
      res.json(stakeholder);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Stakeholder não encontrado' });
      }
      next(error);
    }
  }
);

// DELETE /api/stakeholders/:id - Deletar stakeholder
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.stakeholder.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Stakeholder não encontrado' });
    }
    next(error);
  }
});

export default router;








