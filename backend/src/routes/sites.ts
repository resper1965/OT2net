import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const createSiteSchema = z.object({
  empresa_id: z.string().uuid().optional(),
  identificacao: z.string().min(1),
  classificacao: z.string().optional(),
  criticidade_operacional: z.string().optional(),
  localizacao_geografica: z.object({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    endereco: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().optional(),
  }).optional(),
  infraestrutura_comunicacao: z.record(z.string(), z.any()).optional(),
  sistemas_principais: z.array(z.string()).optional(),
  responsaveis: z.record(z.string(), z.any()).optional(),
  seguranca_fisica: z.record(z.string(), z.any()).optional(),
});

const updateSiteSchema = createSiteSchema.partial();

// GET /api/sites - Listar todos os sites
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { empresa_id } = req.query;
    const where = empresa_id ? { empresa_id: empresa_id as string } : {};
    
    const sites = await prisma.site.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        empresa: {
          include: {
            cliente: true,
          },
        },
      },
    });
    res.json(sites);
  } catch (error) {
    next(error);
  }
});

// GET /api/sites/:id - Obter site por ID
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const site = await prisma.site.findUnique({
      where: { id },
      include: {
        empresa: {
          include: {
            cliente: true,
          },
        },
      },
    });

    if (!site) {
      return res.status(404).json({ error: 'Site não encontrado' });
    }

    res.json(site);
  } catch (error) {
    next(error);
  }
});

// POST /api/sites - Criar novo site
router.post(
  '/',
  authenticateToken,
  validate({ body: createSiteSchema }),
  async (req, res, next) => {
    try {
      const site = await prisma.site.create({
        data: req.body,
      });
      res.status(201).json(site);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/sites/:id - Atualizar site
router.put(
  '/:id',
  authenticateToken,
  validate({ body: updateSiteSchema }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const site = await prisma.site.update({
        where: { id },
        data: req.body,
      });
      res.json(site);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Site não encontrado' });
      }
      next(error);
    }
  }
);

// DELETE /api/sites/:id - Deletar site
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.site.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Site não encontrado' });
    }
    next(error);
  }
});

export default router;








