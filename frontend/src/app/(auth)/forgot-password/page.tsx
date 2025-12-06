"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import NessLogo from "@/components/NessLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, AlertCircle, Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {throw error;}

      setSuccess(true);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao enviar email de recuperação");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-6 rounded-xl bg-card p-8 shadow-2xl border border-border text-center">
          <div className="mx-auto rounded-full bg-green-500/10 p-4 w-fit ring-1 ring-green-500/20">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Email enviado!</h2>
            <p className="text-muted-foreground">
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </p>
          </div>
          <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border-border bg-transparent hover:bg-accent focus:ring-ring h-11 px-6 w-full">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o login
          </Link>
        </div>
      </div>
    );
  }

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
                Recuperar senha
              </h2>
              <p className="text-sm text-muted-foreground">
                Digite seu email e enviaremos um link para redefinir sua senha
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleResetPassword}>
            {error && (
              <div className="flex items-center gap-3 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

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

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </Button>

            <div className="text-center">
              <Link href="/login" className="inline-flex items-center gap-2 font-medium text-primary hover:text-primary/80 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Voltar para o login
              </Link>
            </div>
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
