import { Router } from 'express';
import { requirePermission } from '../middleware/permissions';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const createEmpresaSchema = z.object({
  organizacao_id: z.string().uuid().optional(),
  identificacao: z.string().min(1),
  tipo: z.string().optional(),
  participacao_acionaria: z.string().optional(),
  ambito_operacional: z.string().optional(),
  contexto_operacional: z.string().optional(),
  status: z.string().optional(),
});

const updateEmpresaSchema = createEmpresaSchema.partial();

// GET /api/empresas - Listar todas as empresas
router.get('/', authenticateToken, requirePermission('empresas', 'read'), async (req: any, res, next) => {
  try {
    const { organizacao_id } = req.query;
    const where = organizacao_id ? { organizacao_id: organizacao_id as string } : {};
    
    const empresas = await req.prisma.empresa.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        organizacao: true,
        sites: true,
      },
    });
    res.json(empresas);
  } catch (error) {
    next(error);
  }
});

// GET /api/empresas/:id - Obter empresa por ID
router.get('/:id', authenticateToken, async (req: any, res, next) => {
  try {
    const { id } = req.params;
    const empresa = await req.prisma.empresa.findUnique({
      where: { id },
      include: {
        organizacao: true,
        sites: true,
      },
    });

    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    res.json(empresa);
  } catch (error) {
    next(error);
  }
});

// POST /api/empresas - Criar nova empresa
router.post(
  '/',
  authenticateToken,
  validate({ body: createEmpresaSchema }),
  async (req: any, res, next) => {
    try {
      const empresa = await req.prisma.empresa.create({
        data: req.body,
      });
      res.status(201).json(empresa);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/empresas/:id - Atualizar empresa
router.put(
  '/:id',
  authenticateToken,
  validate({ body: updateEmpresaSchema }),
  async (req: any, res, next) => {
    try {
      const { id } = req.params;
      const empresa = await req.prisma.empresa.update({
        where: { id },
        data: req.body,
      });
      res.json(empresa);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Empresa não encontrada' });
      }
      next(error);
    }
  }
);

// DELETE /api/empresas/:id - Deletar empresa
router.delete('/:id', authenticateToken, requirePermission('empresas', 'delete'), async (req: any, res, next) => {
  try {
    const { id } = req.params;
    await req.prisma.empresa.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    next(error);
  }
});

export default router;









