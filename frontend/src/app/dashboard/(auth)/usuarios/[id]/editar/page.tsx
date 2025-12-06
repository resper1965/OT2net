"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil?: string;
  organizacao?: string;
  status?: string;
}

export default function EditarUsuarioPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [_loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    nome: "",
    perfil: "Consultor",
    organizacao: "",
    status: "ativo",
  });
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (id) {
      loadUsuario();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadUsuario() {
    try {
      setLoadingData(true);
      const data = await api.usuarios.get(id);
      setUsuario(data);
      setFormData({
        nome: data.nome || "",
        perfil: data.perfil || "Consultor",
        organizacao: data.organizacao || "",
        status: data.status || "ativo",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      toast.error("Erro ao carregar usuário: " + errorMessage);
    } finally {
      setLoadingData(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.usuarios.update(id, formData);
      toast.success("Usuário atualizado com sucesso!");
      router.push(`/dashboard/usuarios/${id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      toast.error("Erro ao atualizar usuário: " + errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
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

  if (!usuario) {
    return (
      <div>
        <div className="max-w-full">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-800 dark:text-red-200">Usuário não encontrado</p>
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
            href={`/dashboard/usuarios/${id}`}
            className="text-zinc-600 dark:text-zinc-400 hover:underline mb-4 inline-block"
          >
          </Link>
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">Editar Usuário</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
              Nome Completo *
            </label>
            <Input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
              Email
            </label>
            <Input
              type="email"
              value={usuario.email}
              disabled
              className="w-full bg-zinc-50 dark:bg-zinc-800"
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              O email não pode ser alterado aqui. Use o painel do Supabase para alterar.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
              Perfil *
            </label>
            <select
              value={formData.perfil}
              onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Consultor">Consultor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
              Organização
            </label>
            <Input
              type="text"
              value={formData.organizacao}
              onChange={(e) => setFormData({ ...formData, organizacao: e.target.value })}
              className="w-full"
              placeholder="Opcional"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" variant="default">
              Salvar Alterações
            </Button>
            <Link href={`/dashboard/usuarios/${id}`}>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

