"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Workflow,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { usePageTitleEffect } from "@/hooks/use-page-title";

interface DescricaoRaw {
  id: string;
  titulo: string;
  descricao_completa: string;
  status_processamento: string;
  created_at: string;
}

export default function ProcessosPage() {
  usePageTitleEffect("Descrições Raw");
  const [descricoes, setDescricoes] = useState<DescricaoRaw[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("all");
  const [processDialog, setProcessDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });
  const toast = useToast();

  useEffect(() => {
    loadDescricoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroStatus]);

  async function loadDescricoes() {
    try {
      setLoading(true);
      const statusFilter = filtroStatus === "all" ? undefined : filtroStatus;
      const data = await api.descricoesRaw.list(undefined, undefined, statusFilter);
      setDescricoes(Array.isArray(data) ? data : []);
    } catch (err) {
      // Erro já tratado
    } finally {
      setLoading(false);
    }
  }

  function handleProcessarClick(id: string) {
    setProcessDialog({ open: true, id });
  }

  async function handleProcessarConfirm() {
    if (!processDialog.id) {return;}

    try {
      await api.descricoesRaw.processar(processDialog.id, true);
      toast.success("Processamento iniciado! Verifique o status em alguns instantes.");
      await loadDescricoes();
      setProcessDialog({ open: false, id: null });
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Erro ao processar");
    }
  }

  // Cálculos de estatísticas
  const processosPendentes = descricoes.filter((p) => p.status_processamento === "pendente").length;
  const processosProcessando = descricoes.filter((p) => p.status_processamento === "processando")
    .length;
  const processosProcessados = descricoes.filter((p) => p.status_processamento === "processado")
    .length;
  // const processosComErro = descricoes.filter((p) => p.status_processamento === "erro").length;

  // Filtros
  const filteredDescricoes = descricoes.filter((descricao) => {
    const matchesSearch =
      descricao.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      descricao.descricao_completa.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) {return false;}

    if (filtroStatus === "all") {return true;}
    return descricao.status_processamento === filtroStatus;
  });

  function getStatusColor(status: string) {
    switch (status) {
      case "processado":
        return {
          className: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
          icon: CheckCircle2,
        };
      case "processando":
        return {
          className: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200",
          icon: Clock,
        };
      case "erro":
        return {
          className: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200",
          icon: AlertCircle,
        };
      default:
        return {
          className: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200",
          icon: Clock,
        };
    }
  }

  return (
    <div>
      <div>
        {/* KPI Cards */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Workflow className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-2xl font-bold text-black dark:text-zinc-50">
                  {descricoes.length}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Total de Processos
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <span className="text-2xl font-bold text-black dark:text-zinc-50">
                  {processosPendentes}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Pendentes</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-black dark:text-zinc-50">
                  {processosProcessando}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Processando</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-2xl font-bold text-black dark:text-zinc-50">
                  {processosProcessados}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Processados</p>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Buscar por título ou descrição..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos os status</option>
                  <option value="pendente">Pendente</option>
                  <option value="processando">Processando</option>
                  <option value="processado">Processado</option>
                  <option value="erro">Erro</option>
                </select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">Carregando processos...</p>
          </div>
        ) : filteredDescricoes.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-12 text-center">
            <Workflow className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              {searchQuery || filtroStatus !== "all"
                ? "Nenhum processo encontrado com os filtros aplicados"
                : "Nenhuma descrição cadastrada"}
            </p>
            {!searchQuery && filtroStatus === "all" && (
              <Link href="/dashboard/processos/novo">
                <Button variant="default">Cadastrar primeira descrição</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
                Processos ({filteredDescricoes.length})
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {filteredDescricoes.map((descricao) => {
                  const status = getStatusColor(descricao.status_processamento);
                  const StatusIcon = status.icon;
                  return (
                    <div
                      key={descricao.id}
                      className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2 text-black dark:text-zinc-50">
                            {descricao.titulo}
                          </h3>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                            {descricao.descricao_completa}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ml-4 ${status.className}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {descricao.status_processamento}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/processos/${descricao.id}`}>
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                        </Link>
                        {descricao.status_processamento === "pendente" && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleProcessarClick(descricao.id)}
                          >
                            Processar com IA
                          </Button>
                        )}
                        {descricao.status_processamento === "processado" && (
                          <Link href={`/dashboard/processos/${descricao.id}/revisao`}>
                            <Button variant="default" size="sm">
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Revisar
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          open={processDialog.open}
          onOpenChange={(open) => setProcessDialog({ open, id: processDialog.id })}
          title="Processar com IA"
          description="Deseja processar esta descrição com IA? O processamento pode levar alguns instantes."
          confirmText="Processar"
          cancelText="Cancelar"
          variant="default"
          onConfirm={handleProcessarConfirm}
        />
      </div>
    </div>
  );
}
