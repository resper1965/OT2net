"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    clientes: 0,
    empresas: 0,
    projetos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [clientes, empresas, projetos] = await Promise.all([
          api.clientes.list(),
          api.empresas.list(),
          api.projetos.list(),
        ]);

        setStats({
          clientes: Array.isArray(clientes) ? clientes.length : 0,
          empresas: Array.isArray(empresas) ? empresas.length : 0,
          projetos: Array.isArray(projetos) ? projetos.length : 0,
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const menuItems = [
    {
      title: "Clientes",
      href: "/dashboard/clientes",
      description: "Gerenciar clientes",
      count: stats.clientes,
    },
    {
      title: "Empresas",
      href: "/dashboard/empresas",
      description: "Gerenciar empresas",
      count: stats.empresas,
    },
    {
      title: "Sites",
      href: "/dashboard/sites",
      description: "Gerenciar sites",
      count: 0,
    },
    {
      title: "Projetos",
      href: "/dashboard/projetos",
      description: "Gerenciar projetos",
      count: stats.projetos,
    },
    {
      title: "Stakeholders",
      href: "/dashboard/stakeholders",
      description: "Gerenciar stakeholders",
      count: 0,
    },
    {
      title: "Equipe",
      href: "/dashboard/equipe",
      description: "Gerenciar equipe do projeto",
      count: 0,
    },
    {
      title: "Processos",
      href: "/dashboard/processos",
      description: "Coletar e normalizar processos",
      count: 0,
    },
    {
      title: "Catálogo",
      href: "/dashboard/catalogo",
      description: "Catálogo de processos e ativos",
      count: 0,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-black dark:text-zinc-50">Dashboard</h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <h2 className="text-xl font-semibold mb-2 text-black dark:text-zinc-50">
                  {item.title}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">{item.description}</p>
                {item.count > 0 && (
                  <div className="text-sm font-medium text-zinc-500 dark:text-zinc-500">
                    {item.count} {item.count === 1 ? "item" : "itens"}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
