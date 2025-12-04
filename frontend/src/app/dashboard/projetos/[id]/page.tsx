"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

interface Projeto {
  id: string;
  nome: string;
  descricao?: string;
  fase_atual?: string;
  progresso_geral?: number;
  cliente_id?: string;
  created_at: string;
  updated_at: string;
}

export default function ProjetoDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadProjeto();
    }
  }, [id]);

  async function loadProjeto() {
    try {
      setLoading(true);
      const data = await api.projetos.get(id);
      setProjeto(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar projeto");
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;

    try {
      await api.projetos.delete(id);
      router.push("/dashboard/projetos");
    } catch (err: any) {
      alert("Erro ao excluir projeto: " + (err.message || "Erro desconhecido"));
    }
  }

  async function generateReport() {
    try {
      const result = await api.relatorios.generateOnboarding(id);
      if (result.url) {
        window.open(result.url, "_blank");
      }
    } catch (error: any) {
      alert("Erro ao gerar relatório: " + (error.message || "Erro desconhecido"));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !projeto) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/dashboard/projetos"
              className="text-zinc-600 dark:text-zinc-400 hover:underline mb-4 inline-block"
            >
              ← Voltar para Projetos
            </Link>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-800 dark:text-red-200">{error || "Projeto não encontrado"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/dashboard/projetos"
            className="text-zinc-600 dark:text-zinc-400 hover:underline mb-4 inline-block"
          >
            ← Voltar para Projetos
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-black dark:text-zinc-50">{projeto.nome}</h1>
            <div className="flex gap-2">
              <Link
                href={`/dashboard/projetos/${id}/editar`}
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Editar
              </Link>
              <button
                onClick={generateReport}
                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-zinc-50 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
              >
                Gerar PDF
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-black dark:text-zinc-50">
              Informações Básicas
            </h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Nome</dt>
                <dd className="mt-1 text-sm text-black dark:text-zinc-50">{projeto.nome}</dd>
              </div>
              {projeto.fase_atual && (
                <div>
                  <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Fase Atual
                  </dt>
                  <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                    {projeto.fase_atual}
                  </dd>
                </div>
              )}
              {projeto.progresso_geral !== undefined && (
                <div className="col-span-2">
                  <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                    Progresso Geral
                  </dt>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                      <div
                        className="bg-black dark:bg-white h-2 rounded-full"
                        style={{ width: `${projeto.progresso_geral}%` }}
                      />
                    </div>
                    <span className="text-sm text-black dark:text-zinc-50">
                      {projeto.progresso_geral}%
                    </span>
                  </div>
                </div>
              )}
              {projeto.descricao && (
                <div className="col-span-2">
                  <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Descrição
                  </dt>
                  <dd className="mt-1 text-sm text-black dark:text-zinc-50 whitespace-pre-wrap">
                    {projeto.descricao}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Criado em</dt>
                <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                  {new Date(projeto.created_at).toLocaleString("pt-BR")}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Atualizado em
                </dt>
                <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                  {new Date(projeto.updated_at).toLocaleString("pt-BR")}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
