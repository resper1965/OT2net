"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

interface DescricaoRaw {
  id: string;
  titulo: string;
  descricao_completa: string;
  status_processamento: string;
  created_at: string;
}

export default function ProcessosPage() {
  const [descricoes, setDescricoes] = useState<DescricaoRaw[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>("");

  useEffect(() => {
    loadDescricoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroStatus]);

  async function loadDescricoes() {
    try {
      setLoading(true);
      const data = await api.descricoesRaw.list(undefined, undefined, filtroStatus || undefined);
      setDescricoes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleProcessar(id: string) {
    if (!confirm("Processar esta descrição com IA?")) return;

    try {
      await api.descricoesRaw.processar(id, true);
      alert("Processamento iniciado! Verifique o status em alguns instantes.");
      await loadDescricoes();
    } catch (error: any) {
      alert("Erro ao processar: " + (error.message || "Erro desconhecido"));
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "processado":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "processando":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "erro":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200";
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
            Processos - Coleta de Descrições
          </h1>
          <Link
            href="/dashboard/processos/novo"
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Nova Descrição
          </Link>
        </div>

        <div className="mb-4">
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
          >
            <option value="">Todos os status</option>
            <option value="pendente">Pendente</option>
            <option value="processando">Processando</option>
            <option value="processado">Processado</option>
            <option value="erro">Erro</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
          </div>
        ) : descricoes.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">Nenhuma descrição cadastrada</p>
            <Link href="/dashboard/processos/novo" className="text-black dark:text-white underline">
              Cadastrar primeira descrição
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {descricoes.map((descricao) => (
              <div
                key={descricao.id}
                className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2 text-black dark:text-zinc-50">
                      {descricao.titulo}
                    </h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {descricao.descricao_completa}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      descricao.status_processamento
                    )}`}
                  >
                    {descricao.status_processamento}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/processos/${descricao.id}`}
                    className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-black dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    Ver Detalhes
                  </Link>
                  {descricao.status_processamento === "pendente" && (
                    <button
                      onClick={() => handleProcessar(descricao.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      Processar com IA
                    </button>
                  )}
                  {descricao.status_processamento === "processado" && (
                    <Link
                      href={`/dashboard/processos/${descricao.id}/revisao`}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                    >
                      Revisar
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
