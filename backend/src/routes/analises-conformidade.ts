import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth';
import { requirePermission } from '../middleware/permissions';

const router = Router();

const createAnaliseSchema = z.object({
  projeto_id: z.string().uuid(),
  requisito_id: z.string().uuid(),
  status: z.enum(['ATENDE', 'ATENDE_PARCIAL', 'NAO_ATENDE', 'NAO_APLICAVEL']),
  evidencias: z.array(z.string().uuid()).optional(),
  gaps: z.array(z.string()).optional(),
  recomendacoes: z.array(z.string()).optional(),
});

// GET /api/analises-conformidade?projeto_id=xxx
router.get('/', authenticateToken, requirePermission('analises', 'read'), async (req: any, res, next) => {
  try {
    const { projeto_id } = req.query;

    if (!projeto_id) {
      return res.status(400).json({ error: 'projeto_id é obrigatório' });
    }

    const analises = await req.prisma.analiseConformidade.findMany({
      where: { entidade_tipo: 'PROJETO', entidade_id: projeto_id },
      include: {
        requisito: {
          select: {
            codigo: true,
            titulo: true,
            framework: true,
            categoria: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    // Group by framework
    const grouped = analises.reduce((acc: any, analise: any) => {
      const fw = analise.requisito?.framework || 'OUTROS';
      if (!acc[fw]) acc[fw] = [];
      acc[fw].push(analise);
      return acc;
    }, {});

    res.json({ data: analises, grouped, count: analises.length });
  } catch (error) {
    next(error);
  }
});

// POST /api/analises-conformidade - Create compliance analysis
router.post('/', authenticateToken, requirePermission('analises', 'create'), async (req: any, res, next) => {
  try {
    const data = createAnaliseSchema.parse(req.body);

    const analise = await req.prisma.analiseConformidade.create({
      data: {
        ...data,
        tenant_id: req.user.tenant_id,
        entidade_tipo: 'PROJETO',
        entidade_id: data.projeto_id,
        analisado_por_ia: false,
      },
      include: {
        requisito: true,
      },
    });

    res.status(201).json(analise);
  } catch (error) {
    next(error);
  }
});

// GET /api/analises-conformidade/gap-report/:projeto_id
router.get('/gap-report/:projeto_id', authenticateToken, requirePermission('analises', 'read'), async (req: any, res, next) => {
  try {
    const { projeto_id } = req.params;

    const analises = await req.prisma.analiseConformidade.findMany({
      where: { entidade_tipo: 'PROJETO', entidade_id: projeto_id },
      include: {
        requisito: {
          select: {
            framework: true,
            categoria: true,
            codigo: true,
            titulo: true,
          },
        },
      },
    });

    // Calculate compliance metrics
    const total = analises.length;
    const atende = analises.filter((a: any) => a.status === 'ATENDE').length;
    const atende_parcial = analises.filter((a: any) => a.status === 'ATENDE_PARCIAL').length;
    const nao_atende = analises.filter((a: any) => a.status === 'NAO_ATENDE').length;

    const compliance_rate = total > 0 ? ((atende + atende_parcial * 0.5) / total) * 100 : 0;

    // Group gaps by category
    const gaps_by_category = analises
      .filter((a: any) => a.status === 'NAO_ATENDE' || a.status === 'ATENDE_PARCIAL')
      .reduce((acc: any, a: any) => {
        const cat = a.requisito?.categoria || 'OUTROS';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push({
          requisito: a.requisito?.codigo,
          titulo: a.requisito?.titulo,
          gaps: a.gaps,
          recomendacoes: a.recomendacoes,
        });
        return acc;
      }, {});

    res.json({
      summary: {
        total,
        atende,
        atende_parcial,
        nao_atende,
        compliance_rate: compliance_rate.toFixed(2),
      },
      gaps_by_category,
      analises,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
