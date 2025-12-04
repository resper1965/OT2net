"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import NessLogo from "@/components/NessLogo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Aguarda um momento para garantir que a sessão seja salva
        await new Promise((resolve) => setTimeout(resolve, 100));
        // Força o redirecionamento usando window.location para garantir que funcione
        window.location.href = "/dashboard";
        return;
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao fazer login");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-slate-800 p-8 shadow-xl border border-slate-700">
        <div className="flex flex-col items-center space-y-4">
          <NessLogo className="mb-4" variant="dark" />
          <h2 className="text-center text-3xl font-bold text-white">Entrar na plataforma</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700/50 px-3 py-2 text-white placeholder-slate-400 focus:border-[#00ade8] focus:outline-none focus:ring-1 focus:ring-[#00ade8] transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700/50 px-3 py-2 text-white placeholder-slate-400 focus:border-[#00ade8] focus:outline-none focus:ring-1 focus:ring-[#00ade8] transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-600 bg-slate-700/50 text-[#00ade8] focus:ring-[#00ade8] focus:ring-offset-slate-800"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                Lembrar-me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-[#00ade8] hover:text-[#00c5ff] transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#00ade8] px-4 py-2 font-medium text-white hover:bg-[#00c5ff] focus:outline-none focus:ring-2 focus:ring-[#00ade8] focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
