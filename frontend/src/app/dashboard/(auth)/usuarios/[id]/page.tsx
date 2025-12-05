"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Shield, UserCheck, Mail, Building2, Calendar } from "lucide-react";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil?: string;
  organizacao?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export default function UsuarioDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });
  const toast = useToast();

  useEffect(() => {
    if (id) {
      loadUsuario();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadUsuario() {
    try {
      setLoading(true);
      const data = await api.usuarios.get(id);
      setUsuario(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar usuário";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function handleDeleteClick() {
    setDeleteDialog({ open: true, id });
  }

  async function handleDeleteConfirm() {
    if (!deleteDialog.id) return;

    try {
      await api.usuarios.delete(deleteDialog.id);
      toast.success("Usuário excluído com sucesso!");
      router.push("/dashboard/usuarios");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error("Erro ao excluir usuário: " + (error.message || "Erro desconhecido"));
    }
  }

  function getInitials(name: string): string {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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

  if (error || !usuario) {
    return (
      <div>
        <div className="max-w-full">
          <div className="mb-8">
            <Link
              href="/dashboard/usuarios"
              className="text-zinc-600 dark:text-zinc-400 hover:underline mb-4 inline-block"
            >
            </Link>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-800 dark:text-red-200">{error || "Usuário não encontrado"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-full">
        <div className="mb-8">
          <Link
            href="/dashboard/usuarios"
            className="text-zinc-600 dark:text-zinc-400 hover:underline mb-4 inline-block"
          >
          </Link>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-2 border-zinc-200 dark:border-zinc-700">
                <span className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                  {getInitials(usuario.nome)}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-black dark:text-zinc-50">{usuario.nome}</h1>
                <p className="text-zinc-600 dark:text-zinc-400">{usuario.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/usuarios/${id}/editar`}>
                <Button variant="secondary">Editar</Button>
              </Link>
              <Button variant="destructive" onClick={handleDeleteClick}>
                Excluir
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-black dark:text-zinc-50">
              Informações do Usuário
            </h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </dt>
                <dd className="mt-1 text-sm text-black dark:text-zinc-50">{usuario.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  {usuario.perfil === "admin" ? (
                    <Shield className="h-4 w-4" />
                  ) : (
                    <UserCheck className="h-4 w-4" />
                  )}
                  Perfil
                </dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      usuario.perfil === "admin"
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                    }`}
                  >
                    {usuario.perfil === "admin" ? (
                      <>
                        <Shield className="h-3 w-3" />
                        Administrador
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-3 w-3" />
                        {usuario.perfil || "Consultor"}
                      </>
                    )}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Organização
                </dt>
                <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                  {usuario.organizacao || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Status</dt>
                <dd className="mt-1">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      usuario.status === "ativo"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    {usuario.status === "ativo" ? "Ativo" : "Inativo"}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {usuario.created_at && (
            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Criado em
                  </dt>
                  <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                    {new Date(usuario.created_at).toLocaleString("pt-BR")}
                  </dd>
                </div>
                {usuario.updated_at && (
                  <div>
                    <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Atualizado em
                    </dt>
                    <dd className="mt-1 text-sm text-black dark:text-zinc-50">
                      {new Date(usuario.updated_at).toLocaleString("pt-BR")}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>

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

