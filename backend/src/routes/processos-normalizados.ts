import { Router } from 'express';
import { requirePermission } from '../middleware/permissions';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { MermaidGeneratorService } from '../services/mermaid-generator';

const router = Router();

// GET /api/processos-normalizados - Listar processos normalizados
router.get('/', authenticateToken, requirePermission('processos_normalizados', 'read'), async (req: any, res, next) => {
  try {
    const { projeto_id, status } = req.query;
    const where: any = {};
    
    if (projeto_id) {
      where.descricao_raw = {
        projeto_id: projeto_id as string,
      };
    }
    if (status) where.status = status as string;
    
    const processos = await req.prisma.processoNormalizado.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        descricao_raw: {
          include: {
            projeto: true,
            site: true,
          },
        },
        etapas: {
          orderBy: { ordem: 'asc' },
        },
      },
    });
    
    res.json(processos);
  } catch (error) {
    next(error);
  }
});

// GET /api/processos-normalizados/:id - Obter processo normalizado por ID
router.get('/:id', authenticateToken, async (req: any, res, next) => {
  try {
    const { id } = req.params;
    const processo = await req.prisma.processoNormalizado.findUnique({
      where: { id },
      include: {
        descricao_raw: {
          include: {
            projeto: true,
            site: true,
          },
        },
        etapas: {
          orderBy: { ordem: 'asc' },
        },
        ativos: true,
        dificuldades: true,
        workarounds: true,
        riscos: true,
      },
    });

    if (!processo) {
      return res.status(404).json({ error: 'Processo normalizado não encontrado' });
    }

    res.json(processo);
  } catch (error) {
    next(error);
  }
});

// GET /api/processos-normalizados/:id/diagrama - Gerar diagrama Mermaid
router.get('/:id/diagrama', authenticateToken, async (req: any, res, next) => {
  try {
    const { id } = req.params;
    const { tipo = 'flowchart' } = req.query;

    const processo = await req.prisma.processoNormalizado.findUnique({
      where: { id },
      include: {
        etapas: {
          orderBy: { ordem: 'asc' },
        },
      },
    });

    if (!processo) {
      return res.status(404).json({ error: 'Processo normalizado não encontrado' });
    }

    let diagrama: string;
    switch (tipo) {
      case 'sequence':
        diagrama = MermaidGeneratorService.generateSequence(processo);
        break;
      case 'state':
        diagrama = MermaidGeneratorService.generateStateDiagram(processo);
        break;
      case 'flowchart':
      default:
        diagrama = MermaidGeneratorService.generateFlowchart(processo);
        break;
    }

    res.json({
      processo_id: id,
      tipo,
      diagrama,
      mime_type: 'text/plain',
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/processos-normalizados/:id - Atualizar processo normalizado
router.put(
  '/:id',
  authenticateToken,
  async (req: any, res, next) => {
    try {
      const { id } = req.params;
      const updateSchema = z.object({
        nome: z.string().optional(),
        objetivo: z.string().optional(),
        gatilho: z.string().optional(),
        frequencia: z.string().optional(),
        duracao_estimada: z.string().optional(),
        criticidade: z.string().optional(),
        dependencias: z.array(z.string()).optional(),
        observacoes_gerais: z.string().optional(),
        status: z.string().optional(),
      });

      const data = updateSchema.parse(req.body);
      
      const processo = await req.prisma.processoNormalizado.update({
        where: { id },
        data,
        include: {
          etapas: {
            orderBy: { ordem: 'asc' },
          },
        },
      });

      res.json(processo);
    } catch (error) {
      next(error);
    }
  }
);

export default router;


