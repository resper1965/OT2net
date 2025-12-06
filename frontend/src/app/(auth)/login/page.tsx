"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import NessLogo from "@/components/NessLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
// import { OAuthButtons } from "@/components/auth/OAuthButtons";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Verificar se já está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          const redirectTo = searchParams?.get("redirect") || "/dashboard";
          router.push(redirectTo);
        }
      } catch {
        // Erro ao verificar autenticação - ignora silenciosamente
      }
    };
    checkAuth();
  }, [router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Entrando...");

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {throw signInError;}

      if (data.user && data.session) {
        toast.success("Login realizado com sucesso!", { id: toastId });
        
        const redirectTo = searchParams?.get("redirect") || "/dashboard";
        router.refresh();
        router.push(redirectTo);
      } else {
        throw new Error("Falha ao criar sessão de autenticação");
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Erro ao fazer login", { id: toastId });
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="space-y-8 rounded-xl bg-card p-8 shadow-2xl border border-border">
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-lg bg-primary/10 p-3 ring-1 ring-primary/20">
              <NessLogo className="h-8" variant="dark" />
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Entrar na plataforma
              </h2>
              <p className="text-sm text-muted-foreground">
                Digite suas credenciais para acessar
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="bg-input border-border focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Senha
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-input border-border focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-border bg-input text-primary focus:ring-primary focus:ring-offset-background"
                />
                <label htmlFor="remember-me" className="text-foreground cursor-pointer">
                  Lembrar-me
                </label>
              </div>

              <Link
                href="/forgot-password"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
        
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Desenvolvido por{" "}
          <span className="font-semibold text-primary">ness.</span>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-8 rounded-xl bg-card p-8 shadow-2xl border border-border">
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-lg bg-primary/10 p-3 ring-1 ring-primary/20">
              <NessLogo className="h-8" variant="dark" />
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold text-foreground">Entrar na plataforma</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm">Carregando...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
