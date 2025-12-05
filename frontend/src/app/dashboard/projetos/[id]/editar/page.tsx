"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { Button } from "@/components/ui/button";

export default function EditarProjetoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const toast = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    fase_atual: "fase-1",
    progresso_geral: 0,
    cliente_id: "",
  });

  useEffect(() => {
    if (id) {
      loadProjeto();
    }
  }, [id]);

  async function loadProjeto() {
    try {
      setLoadingData(true);
      const data = await api.projetos.get(id);
      setFormData({
        nome: data.nome || "",
        descricao: data.descricao || "",
        fase_atual: data.fase_atual || "fase-1",
        progresso_geral: data.progresso_geral || 0,
        cliente_id: data.cliente_id || "",
      });
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Erro ao carregar projeto");
      console.error("Erro:", error);
    } finally {
      setLoadingData(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.projetos.update(id, formData);
      toast.success("Projeto atualizado com sucesso");
      router.push(`/dashboard/projetos/${id}`);
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Erro ao atualizar projeto");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href={`/dashboard/projetos/${id}`}
            className="text-zinc-600 dark:text-zinc-400 hover:underline mb-4 inline-block"
          >
            ← Voltar para Detalhes
          </Link>
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">Editar Projeto</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
              Nome *
            </label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                Fase Atual
              </label>
              <select
                value={formData.fase_atual}
                onChange={(e) => setFormData({ ...formData, fase_atual: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              >
                <option value="fase-1">Fase 1</option>
                <option value="fase-2">Fase 2</option>
                <option value="fase-3">Fase 3</option>
                <option value="fase-4">Fase 4</option>
                <option value="fase-5">Fase 5</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                Progresso Geral (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progresso_geral}
                onChange={(e) =>
                  setFormData({ ...formData, progresso_geral: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} isLoading={loading} variant="primary">
              Salvar
            </Button>
            <Link href={`/dashboard/projetos/${id}`}>
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
