"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import NessLogo from "@/components/NessLogo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar se já está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
          const redirectTo = searchParams?.get("redirect") || "/dashboard";
          router.push(redirectTo);
        }
      } catch (err) {
        console.error("Erro ao verificar autenticação:", err);
      }
    };
    checkAuth();
  }, [router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user && data.session) {
        // Mostra mensagem de sucesso
        setSuccess(true);
        setLoading(false);

        // Aguarda um momento para o usuário ver a mensagem de sucesso
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Verifica novamente a sessão antes de redirecionar
        const {
          data: { session: verifiedSession },
        } = await supabase.auth.getSession();

        if (verifiedSession) {
          setIsAuthenticated(true);
          const redirectTo = searchParams?.get("redirect") || "/dashboard";
          
          // Aguarda um pouco mais para garantir que os cookies foram salvos
          await new Promise((resolve) => setTimeout(resolve, 300));
          
          // Tenta usar router.push primeiro, se falhar usa window.location
          try {
            router.push(redirectTo);
            // Fallback: se após 1.5 segundos ainda estiver na página de login, força redirect
            setTimeout(() => {
              if (window.location.pathname === "/login") {
                console.log("Forçando redirecionamento via window.location");
                window.location.href = redirectTo;
              }
            }, 1500);
          } catch (redirectError) {
            console.error("Erro no redirecionamento:", redirectError);
            window.location.href = redirectTo;
          }
        } else {
          setError("Sessão não foi criada corretamente. Tente novamente.");
          setSuccess(false);
          setLoading(false);
        }
      } else {
        throw new Error("Falha ao criar sessão de autenticação");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao fazer login");
      setLoading(false);
      setSuccess(false);
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
          {success && (
            <div className="rounded-md bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-400 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Login realizado com sucesso! Redirecionando...</span>
            </div>
          )}
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-slate-800 p-8 shadow-xl border border-slate-700">
          <div className="flex flex-col items-center space-y-4">
            <NessLogo className="mb-4" variant="dark" />
            <h2 className="text-center text-3xl font-bold text-white">Entrar na plataforma</h2>
            <p className="text-slate-400">Carregando...</p>
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
