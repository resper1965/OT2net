"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserCog, Search, Filter } from "lucide-react";
import { usePageTitleEffect } from "@/hooks/use-page-title";

interface MembroEquipe {
  id: string;
  nome: string;
  cargo?: string;
  email?: string;
  projeto_id?: string;
  created_at?: string;
}

export default function EquipePage() {
  usePageTitleEffect("Equipe");
  const [membros, setMembros] = useState<MembroEquipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadMembros();
  }, []);

  async function loadMembros() {
    try {
      setLoading(true);
      const data = await api.membrosEquipe.list();
      setMembros(Array.isArray(data) ? data : []);
    } catch {
      // Erro já tratado
    } finally {
      setLoading(false);
    }
  }

  // Filtros
  const filteredMembros = membros.filter((membro) => {
    const matchesSearch =
      membro.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      membro.cargo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      membro.email?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div>
      <div>
        {/* KPI Cards */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <UserCog className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-black dark:text-zinc-50">
                  {membros.length}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Total de Membros
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <UserCog className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-2xl font-bold text-black dark:text-zinc-50">
                  {membros.filter((m) => m.email).length}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Com Email</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <UserCog className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-black dark:text-zinc-50">
                  {membros.filter((m) => m.cargo).length}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Com Cargo</p>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Buscar por nome, cargo ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">Carregando equipe...</p>
          </div>
        ) : filteredMembros.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-12 text-center">
            <UserCog className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              {searchQuery
                ? "Nenhum membro encontrado com os filtros aplicados"
                : "Nenhum membro cadastrado"}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
                Lista de Membros ({filteredMembros.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                  {filteredMembros.map((membro) => (
                    <tr
                      key={membro.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-black dark:text-zinc-50">
                          {membro.nome}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {membro.cargo ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                            {membro.cargo}
                          </span>
                        ) : (
                          <span className="text-sm text-zinc-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                          {membro.email || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/dashboard/equipe/${membro.id}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Ver Detalhes
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
