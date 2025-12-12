import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * GET /api/dashboard/stats
 * Retorna estatísticas agregadas para o dashboard principal
 */
router.get('/stats', authenticateToken, async (req: any, res, next) => {
  try {
    const { tenant_id } = req.user;

    // Executar queries em paralelo para performance
    const [
      totalOrganizacoes,
      totalEmpresas,
      totalSites,
      totalProjetos,
      projetosAtivos,
      descricoesRaw,
      descricoesProcessadas,
      processosNormalizados,
      processosAprovados,
    ] = await Promise.all([
      req.prisma.organizacao.count(),
      req.prisma.empresa.count(),
      req.prisma.site.count(),
      req.prisma.projeto.count(),
      req.prisma.projeto.count({
        where: { status: 'em_andamento' }
      }),
      req.prisma.descricaoOperacionalRaw.count(),
      req.prisma.descricaoOperacionalRaw.count({
        where: { status_processamento: 'processado' }
      }),
      req.prisma.processoNormalizado.count(),
      req.prisma.processoNormalizado.count({
        where: { status: 'aprovado' }
      }),
    ]);

    // Calcular métricas derivadas
    const taxaProcessamento = descricoesRaw > 0 
      ? Math.round((descricoesProcessadas / descricoesRaw) * 100) 
      : 0;

    const taxaAprovacao = processosNormalizados > 0
      ? Math.round((processosAprovados / processosNormalizados) * 100)
      : 0;

    // Buscar projetos recentes
    const projetosRecentes = await req.prisma.projeto.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        nome: true,
        fase_atual: true,
        status: true,
        created_at: true
      }
    });

    // Atividade recente (últimos 7 dias)
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

    const descricoesUltimos7Dias = await req.prisma.descricaoOperacionalRaw.count({
      where: {
        created_at: {
          gte: seteDiasAtras
        }
      }
    });

    res.json({
      overview: {
        organizacoes: totalOrganizacoes,
        empresas: totalEmpresas,
        sites: totalSites,
        projetos: totalProjetos,
        projetosAtivos: projetosAtivos
      },
      processos: {
        descricoesTotal: descricoesRaw,
        descricoesProcessadas: descricoesProcessadas,
        taxaProcessamento: taxaProcessamento,
        processosNormalizados: processosNormalizados,
        processosAprovados: processosAprovados,
        taxaAprovacao: taxaAprovacao
      },
      atividade: {
        descricoesUltimos7Dias: descricoesUltimos7Dias
      },
      projetosRecentes: projetosRecentes
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/dashboard/charts/processos-timeline
 * Retorna dados para gráfico de timeline de processamento
 */
router.get('/charts/processos-timeline', authenticateToken, async (req: any, res, next) => {
  try {
    const { days = 30 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days as string));

    const processosPorDia = await req.prisma.$queryRaw`
      SELECT 
        DATE(created_at) as data,
        COUNT(*) as total
      FROM descricoes_raw
      WHERE tenant_id = ${req.user.tenant_id}
        AND created_at >= ${daysAgo}
      GROUP BY DATE(created_at)
      ORDER BY data ASC
    `;

    res.json(processosPorDia);
  } catch (error) {
    next(error);
  }
});

export default router;
