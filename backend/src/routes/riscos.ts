import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth';
import { requirePermission } from '../middleware/permissions';
import { validate } from '../middleware/validation';

const router = Router();

// Validation Schemas
const createRiscoSchema = z.object({
  projeto_id: z.string().uuid().optional(),
  site_id: z.string().uuid().optional(),
  ativo_id: z.string().uuid().optional(),
  processo_id: z.string().uuid().optional(),
  
  nome: z.string().min(1),
  descricao: z.string(),
  categoria: z.enum(['TECNICO', 'OPERACIONAL', 'SEGURANCA', 'COMPLIANCE']),
  fonte: z.string().optional(),
  
  // Risk Scoring
  probabilidade: z.number().int().min(1).max(5),
  impacto_seguranca: z.number().int().min(1).max(5),
  impacto_operacional: z.number().int().min(1).max(5),
  impacto_financeiro: z.number().int().min(1).max(5).optional(),
  nivel_risco: z.enum(['CRITICO', 'ALTO', 'MEDIO', 'BAIXO']).optional(),
  
  controles_existentes: z.array(z.string()).optional(),
  controles_recomendados: z.array(z.string()).optional(),
  responsavel: z.string().optional(),
  prazo_mitigacao: z.string().datetime().optional(),
  status: z.enum(['IDENTIFICADO', 'EM_ANALISE', 'MITIGADO', 'ACEITO']).default('IDENTIFICADO'),
});

const updateRiscoSchema = createRiscoSchema.partial();

// Helper: Calculate risk level based on probability and impact
function calculateNivelRisco(probabilidade: number, impacto_seguranca: number, impacto_operacional: number): string {
  const maxImpacto = Math.max(impacto_seguranca, impacto_operacional);
  const score = probabilidade * maxImpacto;
  
  if (score >= 20) return 'CRITICO';
  if (score >= 12) return 'ALTO';
  if (score >= 6) return 'MEDIO';
  return 'BAIXO';
}

// GET /api/riscos - List all risks with filters
router.get('/', authenticateToken, requirePermission('riscos', 'read'), async (req: any, res, next) => {
  try {
    const { projeto_id, site_id, status, nivel_risco } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (projeto_id) where.projeto_id = projeto_id;
    if (site_id) where.site_id = site_id;
    if (status) where.status = status;
    if (nivel_risco) where.nivel_risco = nivel_risco;

    const [riscos, total] = await Promise.all([
      req.prisma.risco.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { nivel_risco: 'asc' }, // CRITICO first
          { created_at: 'desc' }
        ],
        include: {
          projeto: { select: { nome: true } },
          site: { select: { identificacao: true } },
          ativo: { select: { nome: true } },
        },
      }),
      req.prisma.risco.count({ where }),
    ]);

    res.json({
      data: riscos,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/riscos - Create a new risk
router.post('/', authenticateToken, requirePermission('riscos', 'create'), validate(createRiscoSchema), async (req: any, res, next) => {
  try {
    const data = req.validatedData;
    
    // Auto-calculate risk level if not provided
    if (!data.nivel_risco) {
      data.nivel_risco = calculateNivelRisco(
        data.probabilidade,
        data.impacto_seguranca,
        data.impacto_operacional
      );
    }

    const risco = await req.prisma.risco.create({
      data: {
        ...data,
        tenant_id: req.user.tenant_id,
      },
      include: {
        projeto: true,
        site: true,
        ativo: true,
      },
    });

    res.status(201).json(risco);
  } catch (error) {
    next(error);
  }
});

// GET /api/riscos/:id - Get single risk
router.get('/:id', authenticateToken, requirePermission('riscos', 'read'), async (req: any, res, next) => {
  try {
    const { id } = req.params;

    const risco = await req.prisma.risco.findUnique({
      where: { id },
      include: {
        projeto: true,
        site: true,
        ativo: true,
        processo_normalizado: true,
      },
    });

    if (!risco) {
      return res.status(404).json({ error: 'Risco não encontrado' });
    }

    res.json(risco);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/riscos/:id - Update risk
router.patch('/:id', authenticateToken, requirePermission('riscos', 'update'), validate({ body: updateRiscoSchema }), async (req: any, res, next) => {
  try {
    const { id } = req.params;
    const data = req.validatedData;

    // Recalculate risk level if scoring changed
    if (data.probabilidade || data.impacto_seguranca || data.impacto_operacional) {
      const existing = await req.prisma.risco.findUnique({ where: { id } });
      if (existing) {
        data.nivel_risco = calculateNivelRisco(
          data.probabilidade ?? existing.probabilidade,
          data.impacto_seguranca ?? existing.impacto_seguranca,
          data.impacto_operacional ?? existing.impacto_operacional
        );
      }
    }

    const risco = await req.prisma.risco.update({
      where: { id },
      data,
      include: {
        projeto: true,
        site: true,
        ativo: true,
      },
    });

    res.json(risco);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/riscos/:id - Delete risk
router.delete('/:id', authenticateToken, requirePermission('riscos', 'delete'), async (req: any, res, next) => {
  try {
    const { id } = req.params;

    await req.prisma.risco.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// GET /api/riscos/stats/matrix - Get risk matrix data
router.get('/stats/matrix', authenticateToken, requirePermission('riscos', 'read'), async (req: any, res, next) => {
  try {
    const { projeto_id } = req.query;
    
    const where: any = {};
    if (projeto_id) where.projeto_id = projeto_id;

    const riscos = await req.prisma.risco.findMany({
      where,
      select: {
        id: true,
        nome: true,
        probabilidade: true,
        impacto_seguranca: true,
        impacto_operacional: true,
        nivel_risco: true,
      },
    });

    // Group risks by probability and impact for matrix visualization
    const matrix: any = {};
    riscos.forEach((risco: any) => {
      const maxImpacto = Math.max(risco.impacto_seguranca, risco.impacto_operacional);
      const key = `${risco.probabilidade}-${maxImpacto}`;
      if (!matrix[key]) matrix[key] = [];
      matrix[key].push(risco);
    });

    res.json({ matrix, count: riscos.length });
  } catch (error) {
    next(error);
  }
});

export default router;
