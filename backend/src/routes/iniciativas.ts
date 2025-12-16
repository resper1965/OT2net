import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth';
import { requirePermission } from '../middleware/permissions';
import { validate } from '../middleware/validation';

const router = Router();

const createIniciativaSchema = z.object({
  projeto_id: z.string().uuid().optional(),
  nome: z.string().min(1),
  descricao: z.string().optional(),
  dominio_governanca: z.string().optional(),
  status: z.enum(['planejada', 'aprovada', 'em_execucao', 'concluida']).default('planejada'),
  progresso_percentual: z.number().min(0).max(100).default(0),
  saude: z.enum(['verde', 'amarelo', 'vermelho']).default('verde'),
  responsavel_id: z.string().uuid().optional(),
  data_inicio: z.string().datetime().optional(),
  data_fim_prevista: z.string().datetime().optional(),
  prioridade: z.enum(['CRITICA', 'ALTA', 'MEDIA', 'BAIXA']).optional(),
  custo_estimado: z.number().optional(),
  beneficio_estimado: z.string().optional(),
});

const updateIniciativaSchema = createIniciativaSchema.partial();

router.get('/', authenticateToken, requirePermission('iniciativas', 'read'), async (req: any, res, next) => {
  try {
    const { projeto_id, status } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (projeto_id) where.projeto_id = projeto_id;
    if (status) where.status = status;

    const [iniciativas, total] = await Promise.all([
      req.prisma.iniciativa.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { prioridade: 'asc' },
          { data_inicio: 'asc' }
        ],
        include: {
          projeto: { select: { nome: true } },
        },
      }),
      req.prisma.iniciativa.count({ where }),
    ]);

    res.json({ data: iniciativas, meta: { total, page, limit } });
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticateToken, requirePermission('iniciativas', 'create'), validate({ body: createIniciativaSchema }), async (req: any, res, next) => {
  try {
    const iniciativa = await req.prisma.iniciativa.create({
      data: {
        ...req.validatedData,
        tenant_id: req.user.tenant_id,
      },
    });
    res.status(201).json(iniciativa);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticateToken, requirePermission('iniciativas', 'read'), async (req: any, res, next) => {
  try {
    const iniciativa = await req.prisma.iniciativa.findUnique({
      where: { id: req.params.id },
      include: { projeto: true },
    });
    if (!iniciativa) return res.status(404).json({ error: 'Não encontrada' });
    res.json(iniciativa);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', authenticateToken, requirePermission('iniciativas', 'update'), validate({ body: updateIniciativaSchema }), async (req: any, res, next) => {
  try {
    const iniciativa = await req.prisma.iniciativa.update({
      where: { id: req.params.id },
      data: req.validatedData,
    });
    res.json(iniciativa);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, requirePermission('iniciativas', 'delete'), async (req: any, res, next) => {
  try {
    await req.prisma.iniciativa.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
