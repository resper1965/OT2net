"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function EditarEmpresaPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    identificacao: "",
    tipo: "",
    participacao_acionaria: "",
    ambito_operacional: "",
    contexto_operacional: "",
    status: "",
    cliente_id: "",
  });

  useEffect(() => {
    if (id) {
      loadEmpresa();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadEmpresa() {
    try {
      setLoadingData(true);
      const data = await api.empresas.get(id);
      setFormData({
        identificacao: data.identificacao || "",
        tipo: data.tipo || "",
        participacao_acionaria: data.participacao_acionaria || "",
        ambito_operacional: data.ambito_operacional || "",
        contexto_operacional: data.contexto_operacional || "",
        status: data.status || "",
        cliente_id: data.cliente_id || "",
      });
    } catch (error: any) {
      alert("Erro ao carregar empresa: " + (error.message || "Erro desconhecido"));
      console.error("Erro:", error);
    } finally {
      setLoadingData(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.empresas.update(id, formData);
      router.push(`/dashboard/empresas/${id}`);
    } catch (error: any) {
      alert("Erro ao atualizar empresa: " + (error.message || "Erro desconhecido"));
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href={`/dashboard/empresas/${id}`}
            className="text-zinc-600 dark:text-zinc-400 hover:underline mb-4 inline-block"
          >
            ← Voltar para Detalhes
          </Link>
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">Editar Empresa</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
              Identificação *
            </label>
            <input
              type="text"
              required
              value={formData.identificacao}
              onChange={(e) => setFormData({ ...formData, identificacao: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                Tipo
              </label>
              <input
                type="text"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                Status
              </label>
              <input
                type="text"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
              Participação Acionária
            </label>
            <input
              type="text"
              value={formData.participacao_acionaria}
              onChange={(e) => setFormData({ ...formData, participacao_acionaria: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
              Âmbito Operacional
            </label>
            <textarea
              value={formData.ambito_operacional}
              onChange={(e) => setFormData({ ...formData, ambito_operacional: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
              Contexto Operacional
            </label>
            <textarea
              value={formData.contexto_operacional}
              onChange={(e) => setFormData({ ...formData, contexto_operacional: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <Link
              href={`/dashboard/empresas/${id}`}
              className="px-6 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-black dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
