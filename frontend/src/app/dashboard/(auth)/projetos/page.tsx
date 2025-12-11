"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FolderKanban,
  FileText,
  Search,
  Filter,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Download,
} from "lucide-react";
import { usePageTitleEffect } from "@/hooks/use-page-title";

interface Projeto {
  id: string;
  nome: string;
  descricao?: string;
  fase_atual?: string;
  progresso_geral?: number;
  organizacao_id?: string;
  created_at?: string;
}

export default function ProjetosPage() {
  usePageTitleEffect("Projetos");
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const toast = useToast();

  useEffect(() => {
    loadProjetos();
  }, []);

  async function loadProjetos() {
    try {
      const data = await api.projetos.list();
      setProjetos(Array.isArray(data) ? data : []);
    } catch {
      // Erro já tratado pelo hook ou componente
    } finally {
      setLoading(false);
    }
  }

  async function generateReport(projetoId: string) {
    try {
      const result = await api.relatorios.generateOnboarding(projetoId);
      if (result.url) {
        window.open(result.url, "_blank");
        toast.success("Relatório gerado com sucesso");
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Erro ao gerar relatório");
    }
  }

  // Cálculos de estatísticas
  const projetosComProgresso = projetos.filter((p) => p.progresso_geral !== undefined);
  const progressoMedio =
    projetosComProgresso.length > 0
      ? Math.round(
          projetosComProgresso.reduce((acc, p) => acc + (p.progresso_geral || 0), 0) /
            projetosComProgresso.length
        )
      : 0;

  const projetosConcluidos = projetos.filter((p) => p.progresso_geral === 100).length;
  const projetosEmAndamento = projetos.filter(
    (p) => p.progresso_geral && p.progresso_geral > 0 && p.progresso_geral < 100
  ).length;
  // const projetosNaoIniciados = projetos.filter((p) => !p.progresso_geral || p.progresso_geral === 0)
  //   .length;

  // Filtros
  const filteredProjetos = projetos.filter((projeto) => {
    const matchesSearch =
      projeto.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      projeto.descricao?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) {return false;}

    if (filterStatus === "all") {return true;}
    if (filterStatus === "completed") {return projeto.progresso_geral === 100;}
    if (filterStatus === "in-progress")
      {return projeto.progresso_geral && projeto.progresso_geral > 0 && projeto.progresso_geral < 100;}
    if (filterStatus === "not-started")
      {return !projeto.progresso_geral || projeto.progresso_geral === 0;}

    return true;
  });

  function getProgressColor(progresso?: number) {
    if (!progresso) {return "bg-zinc-200 dark:bg-zinc-700";}
    if (progresso >= 75) {return "bg-green-500";}
    if (progresso >= 50) {return "bg-blue-500";}
    if (progresso >= 25) {return "bg-yellow-500";}
    return "bg-red-500";
  }

  function getStatusBadge(progresso?: number) {
    if (progresso === 100) {
      return {
        label: "Concluído",
        className: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
        icon: CheckCircle2,
      };
    }
    if (progresso && progresso > 0) {
      return {
        label: "Em Andamento",
        className: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200",
        icon: Clock,
      };
    }
    return {
      label: "Não Iniciado",
      className: "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200",
      icon: AlertCircle,
    };
  }

  return (
    <div>
      <div>
        {/* KPI Cards */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <FolderKanban className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-black dark:text-zinc-50">
                  {projetos.length}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total de Projetos</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-2xl font-bold text-black dark:text-zinc-50">
                  {projetosConcluidos}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Concluídos</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-black dark:text-zinc-50">
                  {projetosEmAndamento}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Em Andamento</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-2xl font-bold text-black dark:text-zinc-50">
                  {progressoMedio}%
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Progresso Médio</p>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 mb-6">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Link href="/dashboard/projetos/novo">
                <Button variant="default">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Projeto
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Buscar projetos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos</option>
                  <option value="not-started">Não Iniciados</option>
                  <option value="in-progress">Em Andamento</option>
                  <option value="completed">Concluídos</option>
                </select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>
          </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">Carregando projetos...</p>
          </div>
        ) : filteredProjetos.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-12 text-center">
            <FolderKanban className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              {searchQuery || filterStatus !== "all"
                ? "Nenhum projeto encontrado com os filtros aplicados"
                : "Nenhum projeto cadastrado"}
            </p>
            {!searchQuery && filterStatus === "all" && (
              <Link href="/dashboard/projetos/novo">
                <Button variant="default">Criar primeiro projeto</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
                  Projetos ({filteredProjetos.length})
                </h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Projeto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Progresso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Fase
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                  {filteredProjetos.map((projeto) => {
                    const status = getStatusBadge(projeto.progresso_geral);
                    const StatusIcon = status.icon;
                    return (
                      <tr
                        key={projeto.id}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <Link
                              href={`/dashboard/projetos/${projeto.id}`}
                              className="text-sm font-medium text-black dark:text-zinc-50 hover:underline"
                            >
                              {projeto.nome}
                            </Link>
                            {projeto.descricao && (
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">
                                {projeto.descricao}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${status.className}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 max-w-[200px]">
                              <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${getProgressColor(
                                    projeto.progresso_geral
                                  )}`}
                                  style={{ width: `${projeto.progresso_geral || 0}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-sm font-medium text-black dark:text-zinc-50 min-w-[45px]">
                              {projeto.progresso_geral || 0}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {projeto.fase_atual ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                              {projeto.fase_atual}
                            </span>
                          ) : (
                            <span className="text-sm text-zinc-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => generateReport(projeto.id)}
                              title="Gerar relatório"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Link href={`/dashboard/projetos/${projeto.id}`}>
                              <Button variant="outline" size="sm">
                                Ver Detalhes
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
