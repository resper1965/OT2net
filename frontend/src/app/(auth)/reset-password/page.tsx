"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import NessLogo from "@/components/NessLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Verificar se há hash de recuperação na URL
    const hash = window.location.hash;
    if (hash) {
      // O Supabase processa automaticamente o hash
    }
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres");
      setLoading(false);
      return;
    }

    const toastId = toast.loading("Redefinindo senha...");

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast.success("Senha redefinida com sucesso!", { id: toastId });
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Erro ao redefinir senha", { id: toastId });
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
            <h2 className="text-2xl font-bold text-foreground">Senha redefinida!</h2>
            <p className="text-muted-foreground">
              Redirecionando para o login...
            </p>
          </div>
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
                Redefinir senha
              </h2>
              <p className="text-sm text-muted-foreground">
                Digite sua nova senha
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Nova senha
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="bg-input border-border focus-visible:ring-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirmar nova senha
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Digite a senha novamente"
                    className="bg-input border-border focus-visible:ring-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Força da senha:</div>
                  <div className="flex gap-1">
                    <div className={`h-1 flex-1 rounded ${password.length >= 8 ? 'bg-primary' : 'bg-border'}`} />
                    <div className={`h-1 flex-1 rounded ${password.length >= 12 ? 'bg-primary' : 'bg-border'}`} />
                    <div className={`h-1 flex-1 rounded ${/[A-Z]/.test(password) && /[0-9]/.test(password) ? 'bg-primary' : 'bg-border'}`} />
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Redefinindo..." : "Redefinir senha"}
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
