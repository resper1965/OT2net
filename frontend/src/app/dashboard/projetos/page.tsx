"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { Button } from "@/components/ui/button";
import { FolderKanban, FileText } from "lucide-react";

interface Projeto {
  id: string;
  nome: string;
  descricao?: string;
  fase_atual?: string;
  progresso_geral?: number;
}

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadProjetos();
  }, []);

  async function loadProjetos() {
    try {
      const data = await api.projetos.list();
      setProjetos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro:", error);
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

  const projetosComProgresso = projetos.filter((p) => p.progresso_geral !== undefined);
  const progressoMedio = projetosComProgresso.length > 0
    ? Math.round(projetosComProgresso.reduce((acc, p) => acc + (p.progresso_geral || 0), 0) / projetosComProgresso.length)
    : 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-2">Projetos</h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                Gerencie e acompanhe o progresso dos projetos
              </p>
            </div>
            <Link href="/dashboard/projetos/novo">
              <Button variant="primary">Novo Projeto</Button>
            </Link>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Total de Projetos</p>
                  <p className="text-2xl font-bold text-black dark:text-zinc-50">{projetos.length}</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <FolderKanban className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Progresso Médio</p>
                  <p className="text-2xl font-bold text-black dark:text-zinc-50">{progressoMedio}%</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <FolderKanban className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Em Andamento</p>
                  <p className="text-2xl font-bold text-black dark:text-zinc-50">
                    {projetos.filter((p) => p.progresso_geral && p.progresso_geral > 0 && p.progresso_geral < 100).length}
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <FolderKanban className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
          </div>
        ) : projetos.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-12 text-center">
            <FolderKanban className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">Nenhum projeto cadastrado</p>
            <Link href="/dashboard/projetos/novo">
              <Button variant="primary">Criar primeiro projeto</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projetos.map((projeto) => (
              <div
                key={projeto.id}
                className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold text-black dark:text-zinc-50 flex-1">
                    {projeto.nome}
                  </h2>
                  {projeto.fase_atual && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 ml-2">
                      {projeto.fase_atual}
                    </span>
                  )}
                </div>
                {projeto.descricao && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
                    {projeto.descricao}
                  </p>
                )}
                {projeto.progresso_geral !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-600 dark:text-zinc-400">Progresso</span>
                      <span className="text-black dark:text-zinc-50 font-medium">
                        {projeto.progresso_geral}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          projeto.progresso_geral >= 75
                            ? "bg-green-500"
                            : projeto.progresso_geral >= 50
                            ? "bg-blue-500"
                            : projeto.progresso_geral >= 25
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${projeto.progresso_geral}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/dashboard/projetos/${projeto.id}`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full" size="sm">
                      Ver Detalhes
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => generateReport(projeto.id)}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


