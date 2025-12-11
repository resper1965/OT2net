import { Router } from 'express';
import { requirePermission } from '../middleware/permissions';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const createProjetoSchema = z.object({
  organizacao_id: z.string().uuid().optional(),
  nome: z.string().min(1),
  descricao: z.string().optional(),
  fase_atual: z.string().optional(),
  progresso_geral: z.number().min(0).max(100).optional(),
});

const updateProjetoSchema = createProjetoSchema.partial();

// GET /api/projetos - Listar todos os projetos
router.get('/', authenticateToken, requirePermission('projetos', 'read'), async (req: any, res, next) => {
  try {
    const { organizacao_id } = req.query;
    const where = organizacao_id ? { organizacao_id: organizacao_id as string } : {};
    
    const projetos = await req.prisma.projeto.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        organizacao: true,
        membros_equipe: true,
        stakeholders: true,
      },
    });
    res.json(projetos);
  } catch (error) {
    next(error);
  }
});

// GET /api/projetos/:id - Obter projeto por ID
router.get('/:id', authenticateToken, async (req: any, res, next) => {
  try {
    const { id } = req.params;
    const projeto = await req.prisma.projeto.findUnique({
      where: { id },
      include: {
        organizacao: {
          include: {
            empresas: {
              include: {
                sites: true,
              },
            },
          },
        },
        membros_equipe: true,
        stakeholders: true,
      },
    });

    if (!projeto) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    res.json(projeto);
  } catch (error) {
    next(error);
  }
});

// POST /api/projetos - Criar novo projeto
router.post(
  '/',
  authenticateToken,
  validate({ body: createProjetoSchema }),
  async (req: any, res, next) => {
    try {
      const projeto = await req.prisma.projeto.create({
        data: req.body,
      });
      res.status(201).json(projeto);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/projetos/:id - Atualizar projeto
router.put(
  '/:id',
  authenticateToken,
  validate({ body: updateProjetoSchema }),
  async (req: any, res, next) => {
    try {
      const { id } = req.params;
      const projeto = await req.prisma.projeto.update({
        where: { id },
        data: req.body,
      });
      res.json(projeto);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Projeto não encontrado' });
      }
      next(error);
    }
  }
);

// DELETE /api/projetos/:id - Deletar projeto
router.delete('/:id', authenticateToken, requirePermission('projetos', 'delete'), async (req: any, res, next) => {
  try {
    const { id } = req.params;
    await req.prisma.projeto.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }
    next(error);
  }
});

export default router;









