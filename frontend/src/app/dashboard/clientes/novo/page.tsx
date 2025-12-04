"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function NovoClientePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    razao_social: "",
    cnpj: "",
    endereco: {
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    },
    contatos: {
      telefone: "",
      email: "",
      responsavel: "",
    },
    classificacao: "",
    agencias_reguladoras: [] as string[],
    certificacoes: [] as string[],
  });
  const [agenciaInput, setAgenciaInput] = useState("");
  const [certificacaoInput, setCertificacaoInput] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.clientes.create(formData);
      router.push("/dashboard/clientes");
    } catch (error: any) {
      alert("Erro ao criar cliente: " + (error.message || "Erro desconhecido"));
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  }

  function addAgencia() {
    if (agenciaInput.trim()) {
      setFormData({
        ...formData,
        agencias_reguladoras: [...formData.agencias_reguladoras, agenciaInput.trim()],
      });
      setAgenciaInput("");
    }
  }

  function removeAgencia(index: number) {
    setFormData({
      ...formData,
      agencias_reguladoras: formData.agencias_reguladoras.filter((_, i) => i !== index),
    });
  }

  function addCertificacao() {
    if (certificacaoInput.trim()) {
      setFormData({
        ...formData,
        certificacoes: [...formData.certificacoes, certificacaoInput.trim()],
      });
      setCertificacaoInput("");
    }
  }

  function removeCertificacao(index: number) {
    setFormData({
      ...formData,
      certificacoes: formData.certificacoes.filter((_, i) => i !== index),
    });
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
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">Novo Cliente</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
              Razão Social *
            </label>
            <input
              type="text"
              required
              value={formData.razao_social}
              onChange={(e) => setFormData({ ...formData, razao_social: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
              CNPJ *
            </label>
            <input
              type="text"
              required
              value={formData.cnpj}
              onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              placeholder="00.000.000/0000-00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
              Classificação
            </label>
            <input
              type="text"
              value={formData.classificacao}
              onChange={(e) => setFormData({ ...formData, classificacao: e.target.value })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
            />
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
            <h2 className="text-lg font-semibold mb-4 text-black dark:text-zinc-50">Endereço</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                  Logradouro
                </label>
                <input
                  type="text"
                  value={formData.endereco.logradouro}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      endereco: { ...formData.endereco, logradouro: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                  Número
                </label>
                <input
                  type="text"
                  value={formData.endereco.numero}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      endereco: { ...formData.endereco, numero: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                  Cidade
                </label>
                <input
                  type="text"
                  value={formData.endereco.cidade}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      endereco: { ...formData.endereco, cidade: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                  Estado
                </label>
                <input
                  type="text"
                  value={formData.endereco.estado}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      endereco: { ...formData.endereco, estado: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
            <h2 className="text-lg font-semibold mb-4 text-black dark:text-zinc-50">
              Agências Reguladoras
            </h2>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={agenciaInput}
                onChange={(e) => setAgenciaInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAgencia())}
                className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                placeholder="Ex: ANEEL, ANP, etc."
              />
              <button
                type="button"
                onClick={addAgencia}
                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-zinc-50 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600"
              >
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.agencias_reguladoras.map((agencia, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm text-black dark:text-zinc-50 flex items-center gap-2"
                >
                  {agencia}
                  <button
                    type="button"
                    onClick={() => removeAgencia(index)}
                    className="text-red-600 dark:text-red-400 hover:underline"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
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
              href="/dashboard/clientes"
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
