"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Building2, Users, FolderKanban, FileText, TrendingUp, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import { usePageTitle } from "@/contexts/PageTitleContext";

interface DashboardStats {
  clientes: number;
  empresas: number;
  projetos: number;
  processos: number;
  processosAprovados: number;
  processosPendentes: number;
  processosEmProcessamento: number;
}

interface Projeto {
  id: string;
  nome: string;
  progresso_geral?: number;
  fase_atual?: string;
  cliente_id?: string;
}

interface Processo {
  id: string;
  titulo?: string;
  nome?: string;
  status?: string;
  status_processamento?: string;
  created_at: string;
}

export default function DashboardPage() {
  const { setTitle } = usePageTitle();
  const [stats, setStats] = useState<DashboardStats>({
    clientes: 0,
    empresas: 0,
    projetos: 0,
    processos: 0,
    processosAprovados: 0,
    processosPendentes: 0,
    processosEmProcessamento: 0,
  });
  const [projetosRecentes, setProjetosRecentes] = useState<Projeto[]>([]);
  const [processosRecentes, setProcessosRecentes] = useState<Processo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTitle("Dashboard");
  }, [setTitle]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      
      // Carregar estatísticas principais
      const [clientes, empresas, projetos, descricoes, processosNorm] = await Promise.all([
        api.clientes.list().catch(() => []),
        api.empresas.list().catch(() => []),
        api.projetos.list().catch(() => []),
        api.descricoesRaw?.list().catch(() => []) || Promise.resolve([]),
        api.processosNormalizados?.list().catch(() => []) || Promise.resolve([]),
      ]);

      const clientesArray = Array.isArray(clientes) ? clientes : [];
      const empresasArray = Array.isArray(empresas) ? empresas : [];
      const projetosArray = Array.isArray(projetos) ? projetos : [];
      const descricoesArray = Array.isArray(descricoes) ? descricoes : [];
      const processosArray = Array.isArray(processosNorm) ? processosNorm : [];

      // Calcular estatísticas de processos
      interface ProcessoItem {
        status?: string;
        status_processamento?: string;
      }
      
      const processosAprovados = processosArray.filter((p: ProcessoItem) => p.status === "aprovado" || p.status_processamento === "processado").length;
      const processosPendentes = descricoesArray.filter((p: ProcessoItem) => p.status_processamento === "pendente").length;
      const processosEmProcessamento = descricoesArray.filter((p: ProcessoItem) => p.status_processamento === "processando").length;

      setStats({
        clientes: clientesArray.length,
        empresas: empresasArray.length,
        projetos: projetosArray.length,
        processos: descricoesArray.length + processosArray.length,
        processosAprovados,
        processosPendentes,
        processosEmProcessamento,
      });

      // Projetos recentes (últimos 5)
      interface ItemComData {
        created_at?: string;
      }
      
      const projetosOrdenados = projetosArray
        .sort((a: ItemComData, b: ItemComData) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        .slice(0, 5);
      setProjetosRecentes(projetosOrdenados);

      // Processos recentes (últimos 5)
      const todosProcessos = [...descricoesArray, ...processosArray];
      const processosOrdenados = todosProcessos
        .sort((a: ItemComData, b: ItemComData) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        .slice(0, 5);
      setProcessosRecentes(processosOrdenados);
    } catch {
      // Erro já tratado
    } finally {
      setLoading(false);
    }
  }

  const kpiCards = [
    {
      title: "Clientes",
      value: stats.clientes,
      icon: Building2,
      href: "/dashboard/clientes",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Empresas",
      value: stats.empresas,
      icon: Users,
      href: "/dashboard/empresas",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Projetos",
      value: stats.projetos,
      icon: FolderKanban,
      href: "/dashboard/projetos",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Processos",
      value: stats.processos,
      icon: FileText,
      href: "/dashboard/processos",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  const statusCards = [
    {
      title: "Processos Aprovados",
      value: stats.processosAprovados,
      icon: CheckCircle2,
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Processos Pendentes",
      value: stats.processosPendentes,
      icon: Clock,
      color: "text-yellow-600 dark:text-yellow-400",
    },
    {
      title: "Em Processamento",
      value: stats.processosEmProcessamento,
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400",
    },
  ];

  function getProgressColor(progresso?: number) {
    if (!progresso) {return "bg-zinc-200 dark:bg-zinc-700";}
    if (progresso >= 75) {return "bg-green-500";}
    if (progresso >= 50) {return "bg-blue-500";}
    if (progresso >= 25) {return "bg-yellow-500";}
    return "bg-red-500";
  }

  function getStatusBadge(status?: string) {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("aprovado") || statusLower.includes("processado")) {
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200";
    }
    if (statusLower.includes("pendente")) {
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200";
    }
    if (statusLower.includes("processando")) {
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200";
    }
    if (statusLower.includes("erro") || statusLower.includes("rejeitado")) {
      return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200";
    }
    return "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200";
  }

  if (loading) {
    return (
      <div>
        <div>
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Link
                key={kpi.href}
                href={kpi.href}
                className="block p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                    <Icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                  <ArrowRight className="h-5 w-5 text-zinc-400" />
                </div>
                <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {kpi.title}
                </h3>
                <p className="text-3xl font-bold text-black dark:text-zinc-50">{kpi.value}</p>
              </Link>
            );
          })}
        </div>

        {/* Status Cards */}
        {stats.processos > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statusCards.map((status) => {
              const Icon = status.icon;
              return (
                <div
                  key={status.title}
                  className="p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className={`h-5 w-5 ${status.color}`} />
                    <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      {status.title}
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-black dark:text-zinc-50">{status.value}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Grid de Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projetos Recentes */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
                Projetos Recentes
              </h2>
              <Link href="/dashboard/projetos">
                <Button variant="ghost" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>
            {projetosRecentes.length === 0 ? (
              <div className="text-center py-8">
                <FolderKanban className="h-12 w-12 text-zinc-400 mx-auto mb-3" />
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  Nenhum projeto cadastrado
                </p>
                <Link href="/dashboard/projetos/novo">
                  <Button variant="default" size="sm">
                    Criar Projeto
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {projetosRecentes.map((projeto) => (
                  <Link
                    key={projeto.id}
                    href={`/dashboard/projetos/${projeto.id}`}
                    className="block p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-black dark:text-zinc-50">
                        {projeto.nome}
                      </h3>
                      {projeto.fase_atual && (
                        <span className="text-xs px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                          {projeto.fase_atual}
                        </span>
                      )}
                    </div>
                    {projeto.progresso_geral !== undefined && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                          <span>Progresso</span>
                          <span>{projeto.progresso_geral}%</span>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${getProgressColor(
                              projeto.progresso_geral
                            )}`}
                            style={{ width: `${projeto.progresso_geral}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Processos Recentes */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
                Processos Recentes
              </h2>
              <Link href="/dashboard/processos">
                <Button variant="ghost" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>
            {processosRecentes.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-zinc-400 mx-auto mb-3" />
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  Nenhum processo cadastrado
                </p>
                <Link href="/dashboard/processos/novo">
                  <Button variant="default" size="sm">
                    Criar Processo
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {processosRecentes.map((processo) => (
                  <Link
                    key={processo.id}
                    href={
                      processo.titulo
                        ? `/dashboard/processos/${processo.id}`
                        : `/dashboard/catalogo`
                    }
                    className="block p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-black dark:text-zinc-50 flex-1">
                        {processo.titulo || processo.nome || "Processo sem título"}
                      </h3>
                      {(processo.status || processo.status_processamento) && (
                        <span
                          className={`text-xs px-2 py-1 rounded ml-2 ${getStatusBadge(
                            processo.status || processo.status_processamento
                          )}`}
                        >
                          {processo.status || processo.status_processamento}
                        </span>
                      )}
                    </div>
                    {processo.created_at && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-500">
                        {new Date(processo.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="mt-8 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/clientes/novo">
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </Link>
            <Link href="/dashboard/empresas/novo">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Nova Empresa
              </Button>
            </Link>
            <Link href="/dashboard/projetos/novo">
              <Button variant="outline" className="w-full justify-start">
                <FolderKanban className="h-4 w-4 mr-2" />
                Novo Projeto
              </Button>
            </Link>
            <Link href="/dashboard/processos/novo">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Novo Processo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
