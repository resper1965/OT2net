"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SkeletonTable } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { Building2, Search, Filter, Plus, Download } from "lucide-react";

interface Cliente {
  id: string;
  razao_social: string;
  cnpj: string;
  classificacao?: string;
  created_at: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });
  const toast = useToast();

  useEffect(() => {
    loadClientes();
  }, []);

  async function loadClientes() {
    try {
      setLoading(true);
      const data = await api.clientes.list();
      setClientes(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar clientes");
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleDeleteClick(id: string) {
    setDeleteDialog({ open: true, id });
  }

  async function handleDeleteConfirm() {
    if (!deleteDialog.id) return;

    try {
      await api.clientes.delete(deleteDialog.id);
      await loadClientes();
      toast.success("Cliente excluído com sucesso");
      setDeleteDialog({ open: false, id: null });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Erro ao excluir cliente");
    }
  }

  // Filtros
  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch =
      cliente.razao_social.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cliente.cnpj.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cliente.classificacao?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-2">Clientes</h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                Gerencie seus clientes e organizações
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Link href="/dashboard/clientes/novo">
                <Button variant="primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </Link>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Total de Clientes</p>
                  <p className="text-2xl font-bold text-black dark:text-zinc-50">{clientes.length}</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Com Classificação</p>
                  <p className="text-2xl font-bold text-black dark:text-zinc-50">
                    {clientes.filter((c) => c.classificacao).length}
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Cadastrados</p>
                  <p className="text-2xl font-bold text-black dark:text-zinc-50">
                    {new Date().getFullYear()}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
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
                  placeholder="Buscar por razão social, CNPJ ou classificação..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Content Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
          {loading ? (
            <div className="p-6">
              <SkeletonTable rows={5} cols={4} />
            </div>
          ) : filteredClientes.length === 0 ? (
            <EmptyState
              icon={Building2}
              title={
                searchQuery
                  ? "Nenhum cliente encontrado"
                  : "Nenhum cliente cadastrado"
              }
              description={
                searchQuery
                  ? "Tente ajustar os filtros de busca"
                  : "Comece criando seu primeiro cliente"
              }
              action={
                !searchQuery
                  ? {
                      label: "Criar Primeiro Cliente",
                      onClick: () => (window.location.href = "/dashboard/clientes/novo"),
                      variant: "primary",
                    }
                  : undefined
              }
            />
          ) : (
            <>
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
                  Lista de Clientes ({filteredClientes.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Razão Social
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        CNPJ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Classificação
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                    {filteredClientes.map((cliente, index) => (
                      <tr
                        key={cliente.id}
                        className={cn(
                          "hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors",
                          index % 2 === 0 && "bg-zinc-50/30 dark:bg-zinc-900/30"
                        )}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            href={`/dashboard/clientes/${cliente.id}`}
                            className="text-sm font-medium text-black dark:text-zinc-50 hover:underline"
                          >
                            {cliente.razao_social}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                          {cliente.cnpj}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {cliente.classificacao ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                              {cliente.classificacao}
                            </span>
                          ) : (
                            <span className="text-sm text-zinc-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              href={`/dashboard/clientes/${cliente.id}/editar`}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              Editar
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(cliente.id)}
                              className="text-red-600 dark:text-red-400 hover:underline"
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, id: deleteDialog.id })}
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


