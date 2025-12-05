"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Factory, Search, Filter, Plus, Download } from "lucide-react";
import { usePageTitleEffect } from "@/hooks/use-page-title";

interface Empresa {
  id: string;
  identificacao: string;
  tipo?: string;
  status?: string;
  cliente_id?: string;
}

export default function EmpresasPage() {
  usePageTitleEffect("Empresas");
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });
  const toast = useToast();

  useEffect(() => {
    loadEmpresas();
  }, []);

  async function loadEmpresas() {
    try {
      const data = await api.empresas.list();
      setEmpresas(Array.isArray(data) ? data : []);
    } catch (error) {
      // Erro já tratado
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
      await api.empresas.delete(deleteDialog.id);
      await loadEmpresas();
      toast.success("Empresa excluída com sucesso");
      setDeleteDialog({ open: false, id: null });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Erro ao excluir empresa");
    }
  }

  // Filtros
  const filteredEmpresas = empresas.filter((empresa) => {
    const matchesSearch =
      empresa.identificacao.toLowerCase().includes(searchQuery.toLowerCase()) ||
      empresa.tipo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      empresa.status?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div>
      <div>
        {/* KPI Card */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Total de Empresas</p>
                  <p className="text-2xl font-bold text-black dark:text-zinc-50">{empresas.length}</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Factory className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Com Tipo</p>
                  <p className="text-2xl font-bold text-black dark:text-zinc-50">
                    {empresas.filter((e) => e.tipo).length}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Factory className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Ativas</p>
                  <p className="text-2xl font-bold text-black dark:text-zinc-50">
                    {empresas.filter((e) => e.status === "ativo" || !e.status).length}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Factory className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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
                  placeholder="Buscar por identificação, tipo ou status..."
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

        {/* Content Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
            </div>
          ) : filteredEmpresas.length === 0 ? (
            <div className="text-center py-12 p-6">
              <Factory className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                {searchQuery
                  ? "Nenhuma empresa encontrada com os filtros aplicados"
                  : "Nenhuma empresa cadastrada"}
              </p>
              {!searchQuery && (
                <Link href="/dashboard/empresas/novo">
                  <Button variant="primary">Cadastrar primeira empresa</Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
                  Lista de Empresas ({filteredEmpresas.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Identificação
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                    {filteredEmpresas.map((empresa) => (
                      <tr key={empresa.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-black dark:text-zinc-50">
                          {empresa.identificacao}
                        </td>
                        <td className="px-6 py-4">
                          {empresa.tipo ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                              {empresa.tipo}
                            </span>
                          ) : (
                            <span className="text-sm text-zinc-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {empresa.status ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                              {empresa.status}
                            </span>
                          ) : (
                            <span className="text-sm text-zinc-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              href={`/dashboard/empresas/${empresa.id}/editar`}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              Editar
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(empresa.id)}
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


