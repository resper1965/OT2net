"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Filter, Plus, Download, Shield, UserCheck, UserX } from "lucide-react";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil?: string;
  organizacao?: string;
  status?: string;
  created_at?: string;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPerfil, setFilterPerfil] = useState<string>("all");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });
  const toast = useToast();

  useEffect(() => {
    loadUsuarios();
  }, []);

  async function loadUsuarios() {
    try {
      setLoading(true);
      const data = await api.usuarios.list();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Erro:", error);
      if (error.message?.includes("403") || error.message?.includes("Acesso negado")) {
        toast.error("Acesso negado. Apenas administradores podem gerenciar usuários.");
        window.location.href = "/dashboard";
      } else {
        toast.error("Erro ao carregar usuários");
      }
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
      await api.usuarios.delete(deleteDialog.id);
      await loadUsuarios();
      toast.success("Usuário excluído com sucesso");
      setDeleteDialog({ open: false, id: null });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Erro ao excluir usuário");
    }
  }

  // Cálculos de estatísticas
  const totalUsuarios = usuarios.length;
  const usuariosAdmin = usuarios.filter((u) => u.perfil === "admin").length;
  const usuariosConsultor = usuarios.filter((u) => u.perfil === "Consultor").length;
  const usuariosAtivos = usuarios.filter((u) => u.status === "ativo").length;

  // Filtros
  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch =
      usuario.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      usuario.organizacao?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterPerfil === "all") return true;
    return usuario.perfil === filterPerfil;
  });

  function getPerfilBadge(perfil?: string) {
    if (perfil === "admin") {
      return {
        label: "Administrador",
        className: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200",
        icon: Shield,
      };
    }
    return {
      label: perfil || "Consultor",
      className: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200",
      icon: UserCheck,
    };
  }

  function getStatusBadge(status?: string) {
    if (status === "ativo") {
      return {
        label: "Ativo",
        className: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
      };
    }
    return {
      label: "Inativo",
      className: "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200",
    };
  }

  function getInitials(name: string): string {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-2">
                Gestão de Usuários
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                Gerencie usuários e permissões do sistema
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Link href="/dashboard/usuarios/novo">
                <Button variant="primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              </Link>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-black dark:text-zinc-50">
                  {totalUsuarios}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Total de Usuários
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-black dark:text-zinc-50">
                  {usuariosAdmin}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Administradores</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-2xl font-bold text-black dark:text-zinc-50">
                  {usuariosConsultor}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Consultores</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <UserCheck className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-2xl font-bold text-black dark:text-zinc-50">
                  {usuariosAtivos}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Usuários Ativos</p>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Buscar por nome, email ou organização..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterPerfil}
                  onChange={(e) => setFilterPerfil(e.target.value)}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos os perfis</option>
                  <option value="admin">Administrador</option>
                  <option value="Consultor">Consultor</option>
                </select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">Carregando usuários...</p>
          </div>
        ) : filteredUsuarios.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-12 text-center">
            <Users className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              {searchQuery || filterPerfil !== "all"
                ? "Nenhum usuário encontrado com os filtros aplicados"
                : "Nenhum usuário cadastrado"}
            </p>
            {!searchQuery && filterPerfil === "all" && (
              <Link href="/dashboard/usuarios/novo">
                <Button variant="primary">Criar primeiro usuário</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
                Lista de Usuários ({filteredUsuarios.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Perfil
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Organização
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                  {filteredUsuarios.map((usuario) => {
                    const perfil = getPerfilBadge(usuario.perfil);
                    const PerfilIcon = perfil.icon;
                    const status = getStatusBadge(usuario.status);
                    return (
                      <tr
                        key={usuario.id}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-2 border-zinc-200 dark:border-zinc-700">
                              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                {getInitials(usuario.nome)}
                              </span>
                            </div>
                            <div>
                              <Link
                                href={`/dashboard/usuarios/${usuario.id}`}
                                className="text-sm font-medium text-black dark:text-zinc-50 hover:underline"
                              >
                                {usuario.nome}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-zinc-600 dark:text-zinc-400">
                            {usuario.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${perfil.className}`}
                          >
                            <PerfilIcon className="h-3 w-3" />
                            {perfil.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-zinc-600 dark:text-zinc-400">
                            {usuario.organizacao || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              href={`/dashboard/usuarios/${usuario.id}/editar`}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              Editar
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(usuario.id)}
                              className="text-red-600 dark:text-red-400 hover:underline"
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, id: deleteDialog.id })}
          title="Excluir Usuário"
          description="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita e o usuário perderá acesso ao sistema."
          confirmText="Excluir"
          cancelText="Cancelar"
          variant="destructive"
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </div>
  );
}

