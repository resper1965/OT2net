import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Schema de validação
const createOrganizacaoSchema = z.object({
  razao_social: z.string().min(1),
  cnpj: z.string().min(14).max(18),
  endereco: z.object({
    logradouro: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().optional(),
    cep: z.string().optional(),
  }).optional(),
  contatos: z.object({
    telefone: z.string().optional(),
    email: z.string().email().optional(),
    responsavel: z.string().optional(),
  }).optional(),
  classificacao: z.string().optional(),
  estrutura: z.record(z.string(), z.any()).optional(),
  agencias_reguladoras: z.array(z.string()).optional(),
  certificacoes: z.array(z.string()).optional(),
});

const updateOrganizacaoSchema = createOrganizacaoSchema.partial();

// GET /api/organizacoes - Listar todas as organizações
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const organizacoes = await prisma.organizacao.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        empresas: true,
        projetos: true,
      },
    });
    res.json(organizacoes);
  } catch (error) {
    next(error);
  }
});

// GET /api/organizacoes/:id - Obter organização por ID
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizacao = await prisma.organizacao.findUnique({
      where: { id },
      include: {
        empresas: {
          include: {
            sites: true,
          },
        },
        projetos: true,
      },
    });

    if (!organizacao) {
      return res.status(404).json({ error: 'Organização não encontrada' });
    }

    res.json(organizacao);
  } catch (error) {
    next(error);
  }
});

// POST /api/organizacoes - Criar nova organização
router.post(
  '/',
  authenticateToken,
  validate({ body: createOrganizacaoSchema }),
  async (req, res, next) => {
    try {
      const organizacao = await prisma.organizacao.create({
        data: req.body,
      });
      res.status(201).json(organizacao);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'CNPJ já cadastrado' });
      }
      next(error);
    }
  }
);

// PUT /api/organizacoes/:id - Atualizar organização
router.put(
  '/:id',
  authenticateToken,
  validate({ body: updateOrganizacaoSchema }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const organizacao = await prisma.organizacao.update({
        where: { id },
        data: req.body,
      });
      res.json(organizacao);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Organização não encontrada' });
      }
      next(error);
    }
  }
);

// DELETE /api/organizacoes/:id - Deletar organização
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.organizacao.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Organização não encontrada' });
    }
    next(error);
  }
});

export default router;
