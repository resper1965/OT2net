"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";

interface Empresa {
  id: string;
  identificacao: string;
  tipo?: string;
  participacao_acionaria?: string;
  ambito_operacional?: string;
  contexto_operacional?: string;
  status?: string;
  cliente_id?: string;
  created_at: string;
  updated_at: string;
}

export default function EmpresaDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (id) {
      loadEmpresa();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadEmpresa() {
    try {
      setLoading(true);
      const data = await api.empresas.get(id);
      setEmpresa(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar empresa");
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    try {
      await api.empresas.delete(id);
      toast.success("Empresa excluída com sucesso");
      router.push("/dashboard/empresas");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Erro ao excluir empresa");
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

  if (error || !empresa) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/dashboard/empresas"
              className="text-zinc-600 dark:text-zinc-400 hover:underline mb-4 inline-block"
            >
              ← Voltar para Empresas
            </Link>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-800 dark:text-red-200">{error || "Empresa não encontrada"}</p>
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
            href="/dashboard/empresas"
            className="text-zinc-600 dark:text-zinc-400 hover:underline mb-4 inline-block"
          >
            ← Voltar para Empresas
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
              {empresa.identificacao}
            </h1>
            <div className="flex gap-2">
              <Link href={`/dashboard/empresas/${id}/editar`}>
                <Button variant="primary">Editar</Button>
              </Link>
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
                <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Identificação
                </dt>
                <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                  {empresa.identificacao}
                </dd>
              </div>
              {empresa.tipo && (
                <div>
                  <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Tipo</dt>
                  <dd className="mt-1 text-sm text-black dark:text-zinc-50">{empresa.tipo}</dd>
                </div>
              )}
              {empresa.status && (
                <div>
                  <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Status</dt>
                  <dd className="mt-1 text-sm text-black dark:text-zinc-50">{empresa.status}</dd>
                </div>
              )}
              {empresa.participacao_acionaria && (
                <div>
                  <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Participação Acionária
                  </dt>
                  <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                    {empresa.participacao_acionaria}
                  </dd>
                </div>
              )}
              {empresa.ambito_operacional && (
                <div>
                  <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Âmbito Operacional
                  </dt>
                  <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                    {empresa.ambito_operacional}
                  </dd>
                </div>
              )}
              {empresa.contexto_operacional && (
                <div>
                  <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Contexto Operacional
                  </dt>
                  <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                    {empresa.contexto_operacional}
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
                  {new Date(empresa.created_at).toLocaleString("pt-BR")}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Atualizado em
                </dt>
                <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                  {new Date(empresa.updated_at).toLocaleString("pt-BR")}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <ConfirmDialog
          open={deleteDialog}
          onOpenChange={setDeleteDialog}
          title="Excluir Empresa"
          description="Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
          variant="destructive"
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </div>
  );
}
