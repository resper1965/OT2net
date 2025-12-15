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

// GET /api/projetos - Listar todos os projetos com paginação
router.get('/', authenticateToken, requirePermission('projetos', 'read'), async (req: any, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { organizacao_id } = req.query;
    const where = organizacao_id ? { organizacao_id: organizacao_id as string } : {};
    
    const [projetos, total] = await Promise.all([
      req.prisma.projeto.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          organizacao: true,
          membros_equipe: true,
          stakeholders: true,
        },
      }),
      req.prisma.projeto.count({ where }),
    ]);
    
    res.json({
      data: projetos,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      }
    });
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

// ============================================
// Endpoints de Gerenciamento de Fases
// ============================================

// GET /api/projetos/:id/fases - Listar todas as fases do projeto com progresso
router.get('/:id/fases', authenticateToken, async (req: any, res, next) => {
  try {
    const { id } = req.params;

    // Verificar se projeto existe
    const projeto = await req.prisma.projeto.findUnique({
      where: { id },
    });

    if (!projeto) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    // Buscar todas as fases do sistema
    const fases = await req.prisma.fase.findMany({
      orderBy: { ordem: 'asc' },
      include: {
        etapas: {
          orderBy: { ordem: 'asc' },
        },
      },
    });

    // Buscar status de cada fase para este projeto
    const projetoFases = await req.prisma.projetoFase.findMany({
      where: { projeto_id: id },
    });

    // Buscar etapas completadas
    const etapasCompletadas = await req.prisma.projetoEtapaCompletada.findMany({
      where: { projeto_id: id },
    });

    // Montar resposta com progresso calculado
    const fasesComProgresso = fases.map((fase: any) => {
      const projetoFase = projetoFases.find((pf: any) => pf.fase_id === fase.id);
      const etapasDaFase = fase.etapas;
      const etapasCompletadasDaFase = etapasCompletadas.filter((ec: any) =>
        etapasDaFase.some((e: any) => e.id === ec.fase_etapa_id)
      );

      const totalEtapas = etapasDaFase.length;
      const etapasCompletadasCount = etapasCompletadasDaFase.length;
      const progresso = totalEtapas > 0 ? (etapasCompletadasCount / totalEtapas) * 100 : 0;

      // Determinar status
      let status = projetoFase?.status || 'nao_iniciada';
      if (progresso === 100) {
        status = 'concluida';
      } else if (progresso > 0) {
        status = 'em_andamento';
      }

      return {
        ...fase,
        projeto_fase: projetoFase || null,
        status,
        progresso: Math.round(progresso),
        etapas_completadas: etapasCompletadasDaFase.map((ec: any) => ({
          ...ec,
          etapa: etapasDaFase.find((e: any) => e.id === ec.fase_etapa_id),
        })),
      };
    });

    res.json(fasesComProgresso);
  } catch (error) {
    next(error);
  }
});

// POST /api/projetos/:id/fases/:faseId/etapas/:etapaId/completar
// Marca uma etapa como concluída e atualiza progresso
router.post(
  '/:id/fases/:faseId/etapas/:etapaId/completar',
  authenticateToken,
  async (req: any, res, next) => {
    try {
      const { id: projetoId, faseId, etapaId } = req.params;
      const { observacoes } = req.body;
      const userId = req.user?.uid; // Firebase UID

      // Verificar se projeto existe
      const projeto = await req.prisma.projeto.findUnique({
        where: { id: projetoId },
      });

      if (!projeto) {
        return res.status(404).json({ error: 'Projeto não encontrado' });
      }

      // Verificar se etapa existe
      const etapa = await req.prisma.faseEtapa.findUnique({
        where: { id: etapaId },
      });

      if (!etapa || etapa.fase_id !== faseId) {
        return res.status(404).json({ error: 'Etapa não encontrada' });
      }

      // Verificar se já foi completada
      const jaCompletada = await req.prisma.projetoEtapaCompletada.findUnique({
        where: {
          projeto_id_fase_etapa_id: {
            projeto_id: projetoId,
            fase_etapa_id: etapaId,
          },
        },
      });

      if (jaCompletada) {
        return res.status(400).json({ error: 'Etapa já foi completada' });
      }

      // Marcar etapa como completada
      const etapaCompletada = await req.prisma.projetoEtapaCompletada.create({
        data: {
          projeto_id: projetoId,
          fase_etapa_id: etapaId,
          completada_por: userId,
          observacoes,
        },
      });

      // Recalcular progresso da fase
      const todasEtapasDaFase = await req.prisma.faseEtapa.findMany({
        where: { fase_id: faseId },
      });

      const etapasCompletadasDaFase = await req.prisma.projetoEtapaCompletada.findMany({
        where: {
          projeto_id: projetoId,
          fase_etapa_id: {
            in: todasEtapasDaFase.map((e: any) => e.id),
          },
        },
      });

      const progresso = (etapasCompletadasDaFase.length / todasEtapasDaFase.length) * 100;
      const status = progresso === 100 ? 'concluida' : 'em_andamento';

      // Atualizar ou criar ProjetoFase
      const projetoFase = await req.prisma.projetoFase.upsert({
        where: {
          projeto_id_fase_id: {
            projeto_id: projetoId,
            fase_id: faseId,
          },
        },
        update: {
          progresso,
          status,
          data_conclusao: status === 'concluida' ? new Date() : null,
        },
        create: {
          projeto_id: projetoId,
          fase_id: faseId,
          progresso,
          status,
          data_inicio: new Date(),
          data_conclusao: status === 'concluida' ? new Date() : null,
        },
      });

      res.json({
        etapa_completada: etapaCompletada,
        projeto_fase: projetoFase,
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/projetos/:id/fases/:faseId/etapas/:etapaId/completar
// Desmarca uma etapa como concluída
router.delete(
  '/:id/fases/:faseId/etapas/:etapaId/completar',
  authenticateToken,
  async (req: any, res, next) => {
    try {
      const { id: projetoId, faseId, etapaId } = req.params;

      // Deletar etapa completada
      await req.prisma.projetoEtapaCompletada.delete({
        where: {
          projeto_id_fase_etapa_id: {
            projeto_id: projetoId,
            fase_etapa_id: etapaId,
          },
        },
      });

      // Recalcular progresso da fase
      const todasEtapasDaFase = await req.prisma.faseEtapa.findMany({
        where: { fase_id: faseId },
      });

      const etapasCompletadasDaFase = await req.prisma.projetoEtapaCompletada.findMany({
        where: {
          projeto_id: projetoId,
          fase_etapa_id: {
            in: todasEtapasDaFase.map((e: any) => e.id),
          },
        },
      });

      const progresso = (etapasCompletadasDaFase.length / todasEtapasDaFase.length) * 100;
      const status = progresso === 0 ? 'nao_iniciada' : 'em_andamento';

      // Atualizar ProjetoFase
      await req.prisma.projetoFase.update({
        where: {
          projeto_id_fase_id: {
            projeto_id: projetoId,
            fase_id: faseId,
          },
        },
        data: {
          progresso,
          status,
          data_conclusao: null,
        },
      });

      res.status(204).send();
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Etapa não estava completada' });
      }
      next(error);
    }
  }
);

export default router;









