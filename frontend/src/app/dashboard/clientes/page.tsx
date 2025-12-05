"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

interface Cliente {
  id: string;
  razao_social: string;
  cnpj: string;
  classificacao?: string;
  created_at: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClientes();
  }, []);

  async function loadClientes() {
    try {
      setLoading(true);
      const data = await api.clientes.list();
      setClientes(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar clientes");
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;

    try {
      await api.clientes.delete(id);
      await loadClientes();
    } catch (err: any) {
      alert("Erro ao excluir cliente: " + (err.message || "Erro desconhecido"));
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">Clientes</h1>
          <Link
            href="/dashboard/clientes/novo"
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Novo Cliente
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
          </div>
        ) : clientes.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">Nenhum cliente cadastrado</p>
            <Link href="/dashboard/clientes/novo" className="text-black dark:text-white underline">
              Cadastrar primeiro cliente
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Razão Social
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    CNPJ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Classificação
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/dashboard/clientes/${cliente.id}`}
                        className="text-sm font-medium text-black dark:text-zinc-50 hover:underline"
                      >
                        {cliente.razao_social}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                      {cliente.cnpj}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                      {cliente.classificacao || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/dashboard/clientes/${cliente.id}/editar`}
                        className="text-blue-600 dark:text-blue-400 hover:underline mr-4"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(cliente.id)}
                        className="text-red-600 dark:text-red-400 hover:underline"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


