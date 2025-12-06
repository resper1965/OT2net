import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Schema de validação
const createClienteSchema = z.object({
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

const updateClienteSchema = createClienteSchema.partial();

// GET /api/clientes - Listar todos os clientes
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        empresas: true,
        projetos: true,
      },
    });
    res.json(clientes);
  } catch (error) {
    next(error);
  }
});

// GET /api/clientes/:id - Obter cliente por ID
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const cliente = await prisma.cliente.findUnique({
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

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    next(error);
  }
});

// POST /api/clientes - Criar novo cliente
router.post(
  '/',
  authenticateToken,
  validate({ body: createClienteSchema }),
  async (req, res, next) => {
    try {
      const cliente = await prisma.cliente.create({
        data: req.body,
      });
      res.status(201).json(cliente);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'CNPJ já cadastrado' });
      }
      next(error);
    }
  }
);

// PUT /api/clientes/:id - Atualizar cliente
router.put(
  '/:id',
  authenticateToken,
  validate({ body: updateClienteSchema }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const cliente = await prisma.cliente.update({
        where: { id },
        data: req.body,
      });
      res.json(cliente);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      next(error);
    }
  }
);

// DELETE /api/clientes/:id - Deletar cliente
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.cliente.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    next(error);
  }
});

export default router;








