import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requirePermission } from '../middleware/permissions';

const router = Router();

// GET /api/frameworks - List all compliance frameworks
router.get('/', authenticateToken, requirePermission('frameworks', 'read'), async (req: any, res, next) => {
  try {
    const frameworks = await req.prisma.requisitoFramework.groupBy({
      by: ['framework', 'versao'],
      _count: { id: true },
      orderBy: { framework: 'asc' },
    });

    const formatted = frameworks.map((f: any) => ({
      framework: f.framework,
      versao: f.versao || 'N/A',
      total_requisitos: f._count.id,
    }));

    res.json({ data: formatted });
  } catch (error) {
    next(error);
  }
});

// GET /api/frameworks/:framework/requisitos - Get requirements for a specific framework
router.get('/:framework/requisitos', authenticateToken, requirePermission('frameworks', 'read'), async (req: any, res, next) => {
  try {
    const { framework } = req.params;
    const { versao } = req.query;

    const where: any = { framework };
    if (versao) where.versao = versao;

    const requisitos = await req.prisma.requisitoFramework.findMany({
      where,
      orderBy: [{ categoria: 'asc' }, { codigo: 'asc' }],
      select: {
        id: true,
        codigo: true,
        titulo: true,
        descricao: true,
        categoria: true,
        versao: true,
      },
    });

    res.json({ data: requisitos, count: requisitos.length });
  } catch (error) {
    next(error);
  }
});

export default router;
