import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth';
import { requirePermission } from '../middleware/permissions';

const router = Router();

const createIndicadorSchema = z.object({
  projeto_id: z.string().uuid().optional(),
  iniciativa_id: z.string().uuid().optional(),
  nome: z.string().min(1),
  descricao: z.string().optional(),
  tipo: z.enum(['SEGURANCA', 'DISPONIBILIDADE', 'CUSTO', 'TEMPO', 'QUALIDADE']),
  baseline: z.number().optional(),
  target: z.number(),
  threshold_verde: z.number().optional(),
  threshold_amarelo: z.number().optional(),
  threshold_vermelho: z.number().optional(),
});

const addValorSchema = z.object({
  valor: z.number(),
  data_medicao: z.string().datetime(),
  observacao: z.string().optional(),
});

// GET /api/indicadores?projeto_id=xxx
router.get('/', authenticateToken, requirePermission('indicadores', 'read'), async (req: any, res, next) => {
  try {
    const { projeto_id, tipo } = req.query;
    const where: any = {};
    if (projeto_id) where.projeto_id = projeto_id;
    if (tipo) where.tipo = tipo;

    const indicadores = await req.prisma.indicador.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    res.json({ data: indicadores, count: indicadores.length });
  } catch (error) {
    next(error);
  }
});

// POST /api/indicadores - Create KPI
router.post('/', authenticateToken, requirePermission('indicadores', 'create'), async (req: any, res, next) => {
  try {
    const data = createIndicadorSchema.parse(req.body);

    // Auto-set thresholds if not provided
    if (!data.threshold_verde && !data.threshold_amarelo && !data.threshold_vermelho) {
      data.threshold_verde = data.target * 1.1;
      data.threshold_amarelo = data.target * 0.9;
      data.threshold_vermelho = data.target * 0.7;
    }

    const indicador = await req.prisma.indicador.create({
      data: {
        ...data,
        tenant_id: req.user.tenant_id,
        dominio_governanca: 'GESTAO_PROJETO', // Default
      },
    });

    res.status(201).json(indicador);
  } catch (error) {
    next(error);
  }
});

// GET /api/indicadores/:id - Get single with historical values
router.get('/:id', authenticateToken, requirePermission('indicadores', 'read'), async (req: any, res, next) => {
  try {
    const { id } = req.params;

    const indicador = await req.prisma.indicador.findUnique({
      where: { id },
      include: {
        valores: {
          orderBy: { data_medicao: 'desc' },
          take: 50,
        },
      },
    });

    if (!indicador) {
      return res.status(404).json({ error: 'Indicador não encontrado' });
    }

    // Calculate current status
    const latestValor = indicador.valores?.[0];
    let status = 'SEM_DADOS';
    if (latestValor) {
      if (latestValor.valor >= (indicador.threshold_verde || indicador.target)) {
        status = 'VERDE';
      } else if (latestValor.valor >= (indicador.threshold_amarelo || indicador.target * 0.8)) {
        status = 'AMARELO';
      } else {
        status = 'VERMELHO';
      }
    }

    res.json({ ...indicador, status, atual: latestValor?.valor || null });
  } catch (error) {
    next(error);
  }
});

// POST /api/indicadores/:id/valores - Add measurement
router.post('/:id/valores', authenticateToken, requirePermission('indicadores', 'update'), async (req: any, res, next) => {
  try {
    const { id } = req.params;
    const data = addValorSchema.parse(req.body);

    const valor = await req.prisma.valorIndicador.create({
      data: {
        indicador_id: id,
        ...data,
      },
    });

    res.status(201).json(valor);
  } catch (error) {
    next(error);
  }
});

// GET /api/indicadores/projeto/:projeto_id/dashboard
router.get('/projeto/:projeto_id/dashboard', authenticateToken, requirePermission('indicadores', 'read'), async (req: any, res, next) => {
  try {
    const { projeto_id } = req.params;

    const indicadores = await req.prisma.indicador.findMany({
      where: { projeto_id },
      include: {
        valores: {
          orderBy: { data_medicao: 'desc' },
          take: 1,
        },
      },
    });

    const dashboard = indicadores.map((ind: any) => {
      const latestValor = ind.valores?.[0];
      let status = 'SEM_DADOS';
      if (latestValor) {
        if (latestValor.valor >= (ind.threshold_verde || ind.target)) {
          status = 'VERDE';
        } else if (latestValor.valor >= (ind.threshold_amarelo || ind.target * 0.8)) {
          status = 'AMARELO';
        } else {
          status = 'VERMELHO';
        }
      }

      return {
        id: ind.id,
        nome: ind.nome,
        tipo: ind.tipo,
        atual: latestValor?.valor || null,
        target: ind.target,
        status,
        ultima_atualizacao: latestValor?.data_medicao || null,
      };
    });

    res.json({ indicadores: dashboard, count: dashboard.length });
  } catch (error) {
    next(error);
  }
});

export default router;
