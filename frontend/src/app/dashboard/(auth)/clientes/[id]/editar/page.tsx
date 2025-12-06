"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { usePageTitleEffect } from "@/hooks/use-page-title";
import { Button } from "@/components/ui/button";

export default function EditarClientePage() {
  usePageTitleEffect("Editar Cliente");
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const toast = useToast();
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

  useEffect(() => {
    if (id) {
      loadCliente();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadCliente() {
    try {
      setLoadingData(true);
      const data = await api.clientes.get(id);
      setFormData({
        razao_social: data.razao_social || "",
        cnpj: data.cnpj || "",
        endereco: data.endereco || {
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: "",
          cep: "",
        },
        contatos: data.contatos || {
          telefone: "",
          email: "",
          responsavel: "",
        },
        classificacao: data.classificacao || "",
        agencias_reguladoras: data.agencias_reguladoras || [],
        certificacoes: data.certificacoes || [],
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar cliente";
      toast.error(errorMessage);
    } finally {
      setLoadingData(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.clientes.update(id, formData);
      toast.success("Cliente atualizado com sucesso");
      router.push(`/dashboard/clientes/${id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar cliente";
      toast.error(errorMessage);
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

  if (loadingData) {
    return (
      <div>
        <div>
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
            href={`/dashboard/clientes/${id}`}
            className="text-zinc-600 dark:text-zinc-400 hover:underline mb-4 inline-block"
          >
          </Link>
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
            <h2 className="text-lg font-semibold mb-4 text-black dark:text-zinc-50">Contatos</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                  Telefone
                </label>
                <input
                  type="text"
                  value={formData.contatos.telefone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contatos: { ...formData.contatos, telefone: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.contatos.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contatos: { ...formData.contatos, email: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                  Responsável
                </label>
                <input
                  type="text"
                  value={formData.contatos.responsavel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contatos: { ...formData.contatos, responsavel: e.target.value },
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

          <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
            <h2 className="text-lg font-semibold mb-4 text-black dark:text-zinc-50">
              Certificações
            </h2>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={certificacaoInput}
                onChange={(e) => setCertificacaoInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCertificacao())}
                className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                placeholder="Ex: ISO 27001, etc."
              />
              <button
                type="button"
                onClick={addCertificacao}
                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-zinc-50 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600"
              >
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.certificacoes.map((cert, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm text-black dark:text-zinc-50 flex items-center gap-2"
                >
                  {cert}
                  <button
                    type="button"
                    onClick={() => removeCertificacao(index)}
                    className="text-red-600 dark:text-red-400 hover:underline"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} variant="default">
              Salvar
            </Button>
            <Link href={`/dashboard/clientes/${id}`}>
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
