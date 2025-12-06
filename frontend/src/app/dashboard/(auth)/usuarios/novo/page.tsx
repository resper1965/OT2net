"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NovoUsuarioPage() {
  const router = useRouter();
  const [_loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    perfil: "Consultor",
    organizacao: "",
  });
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.usuarios.create(formData);
      toast.success("Usuário criado com sucesso!");
      router.push("/dashboard/usuarios");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      toast.error("Erro ao criar usuário: " + errorMessage);
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">Novo Usuário</h1>
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
              Email *
            </label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
              Senha Temporária *
            </label>
            <Input
              type="password"
              required
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              className="w-full"
              placeholder="O usuário deverá alterar no primeiro acesso"
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Senha temporária. O usuário deverá alterar no primeiro acesso.
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
              Criar Usuário
            </Button>
            <Link href="/dashboard/usuarios">
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

