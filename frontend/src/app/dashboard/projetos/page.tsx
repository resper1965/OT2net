"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

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
      }
    } catch (error: any) {
      alert("Erro ao gerar relatório: " + (error.message || "Erro desconhecido"));
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">Projetos</h1>
          <Link
            href="/dashboard/projetos/novo"
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Novo Projeto
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
          </div>
        ) : projetos.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">Nenhum projeto cadastrado</p>
            <Link href="/dashboard/projetos/novo" className="text-black dark:text-white underline">
              Criar primeiro projeto
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projetos.map((projeto) => (
              <div
                key={projeto.id}
                className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6"
              >
                <h2 className="text-xl font-semibold mb-2 text-black dark:text-zinc-50">
                  {projeto.nome}
                </h2>
                {projeto.descricao && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                    {projeto.descricao}
                  </p>
                )}
                {projeto.progresso_geral !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-600 dark:text-zinc-400">Progresso</span>
                      <span className="text-black dark:text-zinc-50">
                        {projeto.progresso_geral}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                      <div
                        className="bg-black dark:bg-white h-2 rounded-full"
                        style={{ width: `${projeto.progresso_geral}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/dashboard/projetos/${projeto.id}`}
                    className="flex-1 px-4 py-2 text-center border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-black dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    Ver Detalhes
                  </Link>
                  <button
                    onClick={() => generateReport(projeto.id)}
                    className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg text-sm text-black dark:text-zinc-50 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                  >
                    PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


