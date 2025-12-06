"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { usePageTitleEffect } from "@/hooks/use-page-title";
import dynamic from "next/dynamic";

// Carregar Mermaid dinamicamente (client-side only)
const Mermaid = dynamic(() => import("@/components/Mermaid"), { ssr: false });

interface ProcessoNormalizado {
  id: string;
  nome: string;
  objetivo?: string;
  criticidade?: string;
  status: string;
  nivel_confianca_normalizacao?: number;
  created_at: string;
  descricao_raw?: {
    titulo: string;
    projeto?: {
      nome: string;
    };
  };
}

export default function CatalogoPage() {
  usePageTitleEffect("Catálogo de Processos");
  const [processos, setProcessos] = useState<ProcessoNormalizado[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProcesso, setSelectedProcesso] = useState<ProcessoNormalizado | null>(null);
  const [diagrama, setDiagrama] = useState<string | null>(null);
  const [diagramaTipo, setDiagramaTipo] = useState<"flowchart" | "sequence" | "state">("flowchart");
  const [loadingDiagrama, setLoadingDiagrama] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<string>("");
  const toast = useToast();

  const loadProcessos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.processosNormalizados.list(undefined, filtroStatus || undefined);
      setProcessos(Array.isArray(data) ? data : []);
    } catch {
      // Erro já tratado
    } finally {
      setLoading(false);
    }
  }, [filtroStatus]);

  useEffect(() => {
    loadProcessos();
  }, [loadProcessos]);

  async function loadDiagrama(processoId: string) {
    try {
      setLoadingDiagrama(true);
      const data = await api.processosNormalizados.getDiagrama(processoId, diagramaTipo);
      setDiagrama(data.diagrama);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar diagrama";
      toast.error(errorMessage);
    } finally {
      setLoadingDiagrama(false);
    }
  }

  function handleSelectProcesso(processo: ProcessoNormalizado) {
    setSelectedProcesso(processo);
    setDiagrama(null);
    if (processo.id) {
      loadDiagrama(processo.id);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "aprovado":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "pendente":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "rejeitado":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200";
    }
  }

  function getCriticidadeColor(criticidade?: string) {
    switch (criticidade?.toLowerCase()) {
      case "alta":
        return "text-red-600 dark:text-red-400";
      case "media":
        return "text-yellow-600 dark:text-yellow-400";
      case "baixa":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-zinc-600 dark:text-zinc-400";
    }
  }

  return (
    <div>
      <div>
        {/* Header */}
        <div className="mb-8">

          {/* Filtros e Busca */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-2">
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos os status</option>
                  <option value="pendente">Pendente</option>
                  <option value="aprovado">Aprovado</option>
                  <option value="rejeitado">Rejeitado</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Processos */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
                <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
                  Processos ({processos.length})
                </h2>
              </div>
              {loading ? (
                <div className="p-4 text-center">
                  <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
                </div>
              ) : processos.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-zinc-600 dark:text-zinc-400">Nenhum processo encontrado</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-200 dark:divide-zinc-700 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {processos.map((processo) => (
                    <button
                      key={processo.id}
                      onClick={() => handleSelectProcesso(processo)}
                      className={`w-full text-left p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${
                        selectedProcesso?.id === processo.id
                          ? "bg-zinc-100 dark:bg-zinc-800 border-l-4 border-blue-600"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-black dark:text-zinc-50">
                          {processo.nome}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            processo.status
                          )}`}
                        >
                          {processo.status}
                        </span>
                      </div>
                      {processo.objetivo && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-2">
                          {processo.objetivo}
                        </p>
                      )}
                      <div className="flex gap-2 items-center">
                        {processo.criticidade && (
                          <span
                            className={`text-xs font-medium ${getCriticidadeColor(processo.criticidade)}`}
                          >
                            {processo.criticidade}
                          </span>
                        )}
                        {processo.nivel_confianca_normalizacao !== undefined && (
                          <span className="text-xs text-zinc-500 dark:text-zinc-500">
                            Confiança: {(processo.nivel_confianca_normalizacao * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Visualização do Processo */}
          <div className="lg:col-span-2">
            {selectedProcesso ? (
              <div className="space-y-6">
                {/* Informações do Processo */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-black dark:text-zinc-50 mb-2">
                        {selectedProcesso.nome}
                      </h2>
                      {selectedProcesso.objetivo && (
                        <p className="text-zinc-600 dark:text-zinc-400">
                          {selectedProcesso.objetivo}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        selectedProcesso.status
                      )}`}
                    >
                      {selectedProcesso.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {selectedProcesso.criticidade && (
                      <div>
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Criticidade:
                        </span>
                        <span
                          className={`ml-2 font-medium ${getCriticidadeColor(selectedProcesso.criticidade)}`}
                        >
                          {selectedProcesso.criticidade}
                        </span>
                      </div>
                    )}
                    {selectedProcesso.nivel_confianca_normalizacao !== undefined && (
                      <div>
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Nível de Confiança:
                        </span>
                        <span className="ml-2 font-medium text-black dark:text-zinc-50">
                          {(selectedProcesso.nivel_confianca_normalizacao * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedProcesso.descricao_raw?.projeto && (
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      Projeto: {selectedProcesso.descricao_raw.projeto.nome}
                    </div>
                  )}
                </div>

                {/* Diagrama */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
                      Diagrama do Processo
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setDiagramaTipo("flowchart");
                          if (selectedProcesso.id) {loadDiagrama(selectedProcesso.id);}
                        }}
                        className={`px-3 py-1 rounded text-sm ${
                          diagramaTipo === "flowchart"
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-200 dark:bg-zinc-700 text-black dark:text-zinc-50"
                        }`}
                      >
                        Fluxo
                      </button>
                      <button
                        onClick={() => {
                          setDiagramaTipo("sequence");
                          if (selectedProcesso.id) {loadDiagrama(selectedProcesso.id);}
                        }}
                        className={`px-3 py-1 rounded text-sm ${
                          diagramaTipo === "sequence"
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-200 dark:bg-zinc-700 text-black dark:text-zinc-50"
                        }`}
                      >
                        Sequência
                      </button>
                      <button
                        onClick={() => {
                          setDiagramaTipo("state");
                          if (selectedProcesso.id) {loadDiagrama(selectedProcesso.id);}
                        }}
                        className={`px-3 py-1 rounded text-sm ${
                          diagramaTipo === "state"
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-200 dark:bg-zinc-700 text-black dark:text-zinc-50"
                        }`}
                      >
                        Estado
                      </button>
                    </div>
                  </div>

                  {loadingDiagrama ? (
                    <div className="text-center py-12">
                      <p className="text-zinc-600 dark:text-zinc-400">Carregando diagrama...</p>
                    </div>
                  ) : diagrama ? (
                    <div className="bg-white dark:bg-zinc-950 rounded-lg p-4 overflow-x-auto">
                      <Mermaid chart={diagrama} />
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-zinc-600 dark:text-zinc-400">Nenhum diagrama disponível</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-12 text-center">
                <p className="text-zinc-600 dark:text-zinc-400">
                  Selecione um processo para visualizar os detalhes e diagrama
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
