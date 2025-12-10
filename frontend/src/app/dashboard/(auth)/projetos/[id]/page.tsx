"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";

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
  const [deleteDialog, setDeleteDialog] = useState(false);
  const toast = useToast();

  useEffect(() => {
    async function loadProjeto() {
      try {
        setLoading(true);
        const data = await api.projetos.get(id);
        setProjeto(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao carregar projeto";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProjeto();
    }
  }, [id]);

  async function handleDeleteConfirm() {
    try {
      await api.projetos.delete(id);
      toast.success("Projeto excluído com sucesso");
      router.push("/dashboard/projetos");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Erro ao excluir projeto");
    }
  }

  async function generateReport() {
    try {
      const result = await api.relatorios.generateOnboarding(id);
      if (result.url) {
        window.open(result.url, "_blank");
        toast.success("Relatório gerado com sucesso");
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Erro ao gerar relatório");
    }
  }

  if (loading) {
    return (
      <div>
        <div className="max-w-full">
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !projeto) {
    return (
      <div>
        <div className="max-w-full">
          <div className="mb-8">
            <Link
              href="/dashboard/projetos"
              className="text-zinc-600 dark:text-zinc-400 hover:underline mb-4 inline-block"
            >
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
      <div className="max-w-full">
        <div className="mb-8">
          <Link
            href="/dashboard/projetos"
            className="text-zinc-600 dark:text-zinc-400 hover:underline mb-4 inline-block"
          >
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-black dark:text-zinc-50">{projeto.nome}</h1>
            <div className="flex gap-2">
              <Link href={`/dashboard/projetos/${id}/editar`}>
                <Button variant="default">Editar</Button>
              </Link>
              <Button variant="secondary" onClick={generateReport}>
                Gerar PDF
              </Button>
              <Button variant="destructive" onClick={() => setDeleteDialog(true)}>
                Excluir
              </Button>
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

        <ConfirmDialog
          open={deleteDialog}
          onOpenChange={setDeleteDialog}
          title="Excluir Projeto"
          description="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
          variant="destructive"
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </div>
  );
}
