"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StakeholdersPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            Stakeholders
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Gerenciar stakeholders do projeto
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
            <p className="text-zinc-600 dark:text-zinc-400">
              Funcionalidade em desenvolvimento. Em breve você poderá gerenciar stakeholders aqui.
            </p>
            <Link
              href="/dashboard"
              className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Voltar ao dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

