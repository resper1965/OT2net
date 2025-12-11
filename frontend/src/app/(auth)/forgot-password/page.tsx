"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import NessLogo from "@/components/NessLogo";
import { auth } from "@/lib/firebase/client";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSubmitted(true);
      toast.success("Email de recuperação enviado!");
    } catch (err: unknown) {
      console.error(err);
      const error = err as { code?: string };
      if (error.code === 'auth/user-not-found') {
         // Por segurança, as vezes é melhor não dizer que o user não existe, 
         // mas para UX interna vamos avisar ou tratar genericamente.
         toast.error("Usuário não encontrado.");
      } else {
        toast.error("Erro ao enviar email. Tente novamente.");
      }
    } finally {
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
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Recuperar Senha
              </h2>
              <p className="text-sm text-muted-foreground">
                {submitted 
                  ? "Verifique sua caixa de entrada" 
                  : "Digite seu email para receber o link de redefinição"
                }
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-center text-sm text-muted-foreground">
                <p>Enviamos um email para <strong>{email}</strong></p>
                <p className="mt-1">Siga as instruções para redefinir sua senha.</p>
              </div>
              <Button asChild className="w-full" variant="outline">
                <Link href="/login">Voltar para Login</Link>
              </Button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input border-border focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Enviando..." : "Enviar Link de Recuperação"}
                </Button>

                <Button asChild variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                  <Link href="/login" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para Login
                  </Link>
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
