"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { Button } from "@/components/ui/button";

export default function NovaDescricaoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [formData, setFormData] = useState({
    titulo: "",
    descricao_completa: "",
    frequencia: "",
    impacto: "",
    dificuldades: "",
    cargo: "",
    turno: "",
    metodo_coleta: "entrevista",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.descricoesRaw.create(formData);
      toast.success("Descrição criada com sucesso");
      router.push("/dashboard/processos");
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Erro ao criar descrição");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="max-w-full">
        <div className="mb-8">
          <Link
            href="/dashboard/processos"
            className="text-zinc-600 dark:text-zinc-400 hover:underline mb-4 inline-block"
          >
          </Link>
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
            Nova Descrição Operacional
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
              Título *
            </label>
            <input
              type="text"
              required
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              placeholder="Ex: Processo de inicialização do sistema"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
              Descrição Completa *
            </label>
            <textarea
              required
              rows={10}
              value={formData.descricao_completa}
              onChange={(e) => setFormData({ ...formData, descricao_completa: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              placeholder="Descreva o processo operacional em detalhes..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                Frequência
              </label>
              <input
                type="text"
                value={formData.frequencia}
                onChange={(e) => setFormData({ ...formData, frequencia: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                placeholder="Ex: Diária, Semanal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                Impacto
              </label>
              <input
                type="text"
                value={formData.impacto}
                onChange={(e) => setFormData({ ...formData, impacto: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                placeholder="Ex: Alto, Médio, Baixo"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
              Dificuldades Encontradas
            </label>
            <textarea
              rows={3}
              value={formData.dificuldades}
              onChange={(e) => setFormData({ ...formData, dificuldades: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              placeholder="Descreva as dificuldades operacionais..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                Cargo do Operador
              </label>
              <input
                type="text"
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                Turno
              </label>
              <input
                type="text"
                value={formData.turno}
                onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                placeholder="Ex: Manhã, Tarde, Noite"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} isLoading={loading} variant="primary">
              Salvar
            </Button>
            <Link href="/dashboard/processos">
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


