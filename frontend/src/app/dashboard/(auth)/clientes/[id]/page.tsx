"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";

interface Cliente {
  id: string;
  razao_social: string;
  cnpj: string;
  endereco?: any;
  contatos?: any;
  classificacao?: string;
  estrutura?: any;
  agencias_reguladoras?: string[];
  certificacoes?: string[];
  created_at: string;
  updated_at: string;
}

export default function ClienteDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { setTitle } = usePageTitle();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (id) {
      loadCliente();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadCliente() {
    try {
      setLoading(true);
      const data = await api.clientes.get(id);
      setCliente(data);
      setTitle(data.razao_social || "Cliente");
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar cliente");
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    try {
      await api.clientes.delete(id);
      toast.success("Cliente excluído com sucesso");
      router.push("/dashboard/clientes");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Erro ao excluir cliente");
    }
  }

  if (loading) {
    return (
      <div>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/dashboard/clientes"
              className="text-zinc-600 dark:text-zinc-400 hover:underline mb-4 inline-block"
            >
              ← Voltar para Clientes
            </Link>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-800 dark:text-red-200">{error || "Cliente não encontrado"}</p>
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
            href="/dashboard/clientes"
            className="text-zinc-600 dark:text-zinc-400 hover:underline mb-4 inline-block"
          >
            ← Voltar para Clientes
          </Link>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Link href={`/dashboard/clientes/${id}/editar`}>
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
                  Razão Social
                </dt>
                <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                  {cliente.razao_social}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">CNPJ</dt>
                <dd className="mt-1 text-sm text-black dark:text-zinc-50">{cliente.cnpj}</dd>
              </div>
              {cliente.classificacao && (
                <div>
                  <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Classificação
                  </dt>
                  <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                    {cliente.classificacao}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {cliente.endereco && (
            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
              <h2 className="text-lg font-semibold mb-4 text-black dark:text-zinc-50">Endereço</h2>
              <dl className="grid grid-cols-2 gap-4">
                {cliente.endereco.logradouro && (
                  <div>
                    <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      Logradouro
                    </dt>
                    <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                      {cliente.endereco.logradouro}
                      {cliente.endereco.numero && `, ${cliente.endereco.numero}`}
                      {cliente.endereco.complemento && ` - ${cliente.endereco.complemento}`}
                    </dd>
                  </div>
                )}
                {cliente.endereco.bairro && (
                  <div>
                    <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Bairro</dt>
                    <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                      {cliente.endereco.bairro}
                    </dd>
                  </div>
                )}
                {cliente.endereco.cidade && (
                  <div>
                    <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Cidade</dt>
                    <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                      {cliente.endereco.cidade}
                      {cliente.endereco.estado && ` - ${cliente.endereco.estado}`}
                    </dd>
                  </div>
                )}
                {cliente.endereco.cep && (
                  <div>
                    <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">CEP</dt>
                    <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                      {cliente.endereco.cep}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {cliente.contatos && (
            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
              <h2 className="text-lg font-semibold mb-4 text-black dark:text-zinc-50">Contatos</h2>
              <dl className="grid grid-cols-2 gap-4">
                {cliente.contatos.telefone && (
                  <div>
                    <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      Telefone
                    </dt>
                    <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                      {cliente.contatos.telefone}
                    </dd>
                  </div>
                )}
                {cliente.contatos.email && (
                  <div>
                    <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Email</dt>
                    <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                      {cliente.contatos.email}
                    </dd>
                  </div>
                )}
                {cliente.contatos.responsavel && (
                  <div>
                    <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      Responsável
                    </dt>
                    <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                      {cliente.contatos.responsavel}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {cliente.agencias_reguladoras && cliente.agencias_reguladoras.length > 0 && (
            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
              <h2 className="text-lg font-semibold mb-4 text-black dark:text-zinc-50">
                Agências Reguladoras
              </h2>
              <div className="flex flex-wrap gap-2">
                {cliente.agencias_reguladoras.map((agencia, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm text-black dark:text-zinc-50"
                  >
                    {agencia}
                  </span>
                ))}
              </div>
            </div>
          )}

          {cliente.certificacoes && cliente.certificacoes.length > 0 && (
            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
              <h2 className="text-lg font-semibold mb-4 text-black dark:text-zinc-50">
                Certificações
              </h2>
              <div className="flex flex-wrap gap-2">
                {cliente.certificacoes.map((cert, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm text-black dark:text-zinc-50"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Criado em</dt>
                <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                  {new Date(cliente.created_at).toLocaleString("pt-BR")}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Atualizado em
                </dt>
                <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                  {new Date(cliente.updated_at).toLocaleString("pt-BR")}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <ConfirmDialog
          open={deleteDialog}
          onOpenChange={setDeleteDialog}
          title="Excluir Cliente"
          description="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
          variant="destructive"
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </div>
  );
}
