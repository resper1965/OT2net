import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { ProcessamentoIAService } from '../services/processamento-ia';

const router = Router();

const createDescricaoRawSchema = z.object({
  projeto_id: z.string().uuid().optional(),
  site_id: z.string().uuid().optional(),
  titulo: z.string().min(1),
  descricao_completa: z.string().min(1),
  frequencia: z.string().optional(),
  impacto: z.string().optional(),
  dificuldades: z.string().optional(),
  pessoa_id: z.string().uuid().optional(),
  cargo: z.string().optional(),
  turno: z.string().optional(),
  metodo_coleta: z.string().optional(),
});

const updateDescricaoRawSchema = createDescricaoRawSchema.partial();

// GET /api/descricoes-raw - Listar descrições raw
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { projeto_id, site_id, status } = req.query;
    const where: any = {};
    
    if (projeto_id) where.projeto_id = projeto_id as string;
    if (site_id) where.site_id = site_id as string;
    if (status) where.status_processamento = status as string;
    
    const descricoes = await prisma.descricaoOperacionalRaw.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        projeto: true,
        site: true,
      },
    });
    
    res.json(descricoes);
  } catch (error) {
    next(error);
  }
});

// GET /api/descricoes-raw/:id - Obter descrição raw por ID
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const descricao = await prisma.descricaoOperacionalRaw.findUnique({
      where: { id },
      include: {
        projeto: true,
        site: true,
      },
    });

    if (!descricao) {
      return res.status(404).json({ error: 'Descrição raw não encontrada' });
    }

    res.json(descricao);
  } catch (error) {
    next(error);
  }
});

// POST /api/descricoes-raw - Criar nova descrição raw
router.post(
  '/',
  authenticateToken,
  validate({ body: createDescricaoRawSchema }),
  async (req, res, next) => {
    try {
      const descricao = await prisma.descricaoOperacionalRaw.create({
        data: req.body,
      });
      res.status(201).json(descricao);
    } catch (error: any) {
      next(error);
    }
  }
);

// PUT /api/descricoes-raw/:id - Atualizar descrição raw
router.put(
  '/:id',
  authenticateToken,
  validate({ body: updateDescricaoRawSchema }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const descricao = await prisma.descricaoOperacionalRaw.update({
        where: { id },
        data: req.body,
      });
      res.json(descricao);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Descrição raw não encontrada' });
      }
      next(error);
    }
  }
);

// DELETE /api/descricoes-raw/:id - Deletar descrição raw
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.descricaoOperacionalRaw.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Descrição raw não encontrada' });
    }
    next(error);
  }
});

// POST /api/descricoes-raw/:id/processar - Processar descrição raw com IA
router.post('/:id/processar', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { criar_processo } = req.query;
    
    if (criar_processo === 'true') {
      // Processar e criar processo normalizado
      const processo = await ProcessamentoIAService.processarECriar(id);
      res.json({
        success: true,
        processo,
        message: 'Descrição processada e processo normalizado criado',
      });
    } else {
      // Apenas processar
      const resultado = await ProcessamentoIAService.processarDescricaoRaw(id);
      res.json({
        success: true,
        resultado,
        message: 'Descrição processada com sucesso',
      });
    }
  } catch (error: any) {
    next(error);
  }
});

export default router;







