"use client";

import { auth, googleProvider } from "@/lib/firebase/client";
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { toast } from "sonner";

// ... icons ...

interface OAuthButtonsProps {
  mode?: "login" | "signup";
  redirectTo?: string;
}

export function OAuthButtons({ redirectTo = "/dashboard" }: OAuthButtonsProps) {
  const handleOAuth = async (provider: "google" | "github") => {
    const toastId = toast.loading(`Conectando com ${provider === "google" ? "Google" : "GitHub"}...`);

    try {
      let result;
      if (provider === "google") {
        result = await signInWithPopup(auth, googleProvider);
      } else {
        const githubProvider = new GithubAuthProvider();
        result = await signInWithPopup(auth, githubProvider);
      }

      const user = result.user;
      if (!user) {
        throw new Error("Falha na autenticação");
      }

      // Sucesso
      toast.success(`Bem-vindo, ${user.displayName || "Usuário"}!`, { id: toastId });
      
      // Redireciona
      window.location.href = redirectTo;

    } catch (err: unknown) {
      console.error(err);
      const error = err as Error;
      toast.error(error.message || `Erro ao conectar com ${provider}`, { id: toastId });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleOAuth("google")}
          className="w-full"
        >
          <GoogleIcon className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Ou continue com email
          </span>
        </div>
      </div>
    </div>
  );
}
