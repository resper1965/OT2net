import { Router } from 'express';
import { requirePermission } from '../middleware/permissions';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const createMembroEquipeSchema = z.object({
  projeto_id: z.string().uuid().optional(),
  organizacao_id: z.string().uuid().optional(),
  usuario_id: z.string().uuid().optional(),
  
  // Identificação
  nome: z.string().min(1),
  email: z.string().email().optional(),
  cargo: z.string().optional(),
  departamento: z.string().optional(),
  telefone: z.string().optional(),
  
  // Classificação
  tipo: z.enum(['EQUIPE_INTERNA', 'STAKEHOLDER_EXTERNO', 'PATROCINADOR', 'CLIENTE', 'ENTREVISTADO']).default('EQUIPE_INTERNA'),
  papel: z.string().optional(),
  
  // RACI
  responsabilidade: z.string().optional(),
  autoridade: z.string().optional(),
  consultado: z.boolean().optional(),
  informado: z.boolean().optional(),
  
  // Stakeholder Management
  poder_influencia: z.enum(['ALTO', 'MEDIO', 'BAIXO']).optional(),
  nivel_interesse: z.enum(['ALTO', 'MEDIO', 'BAIXO']).optional(),
  estrategia_engajamento: z.string().optional(),
  expertise: z.string().optional(),
  localizacao: z.string().optional(),
  
  // Metadata
  ativo: z.boolean().optional(),
  observacoes: z.string().optional(),
});

const updateMembroEquipeSchema = createMembroEquipeSchema.partial();

// GET /api/membros-equipe - Listar todos os membros
router.get('/', authenticateToken, requirePermission('membros_equipe', 'read'), async (req: any, res, next) => {
  try {
    const { projeto_id, organizacao_id, tipo } = req.query;
    
    const where: any = {};
    if (projeto_id) where.projeto_id = projeto_id as string;
    if (organizacao_id) where.organizacao_id = organizacao_id as string;
    if (tipo) where.tipo = tipo as string;
    
    const membros = await req.prisma.membroEquipe.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        projeto: true,
        organizacao: true,
      },
    });
    res.json(membros);
  } catch (error) {
    next(error);
  }
});

// GET /api/membros-equipe/:id - Obter membro por ID
router.get('/:id', authenticateToken, async (req: any, res, next) => {
  try {
    const { id } = req.params;
    const membro = await req.prisma.membroEquipe.findUnique({
      where: { id },
      include: {
        projeto: true,
      },
    });

    if (!membro) {
      return res.status(404).json({ error: 'Membro não encontrado' });
    }

    res.json(membro);
  } catch (error) {
    next(error);
  }
});

// POST /api/membros-equipe - Criar novo membro
router.post(
  '/',
  authenticateToken,
  validate({ body: createMembroEquipeSchema }),
  async (req: any, res, next) => {
    try {
      const membro = await req.prisma.membroEquipe.create({
        data: req.body,
      });
      res.status(201).json(membro);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/membros-equipe/:id - Atualizar membro
router.put(
  '/:id',
  authenticateToken,
  validate({ body: updateMembroEquipeSchema }),
  async (req: any, res, next) => {
    try {
      const { id } = req.params;
      const membro = await req.prisma.membroEquipe.update({
        where: { id },
        data: req.body,
      });
      res.json(membro);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Membro não encontrado' });
      }
      next(error);
    }
  }
);

// DELETE /api/membros-equipe/:id - Deletar membro
router.delete('/:id', authenticateToken, requirePermission('membros_equipe', 'delete'), async (req: any, res, next) => {
  try {
    const { id } = req.params;
    await req.prisma.membroEquipe.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Membro não encontrado' });
    }
    next(error);
  }
});

export default router;









