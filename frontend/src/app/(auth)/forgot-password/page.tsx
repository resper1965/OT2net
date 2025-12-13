"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Se este email estiver registrado, você receberá um link para redefinir sua senha.");
    } catch (err: any) {
      console.error("Reset error:", err);
      // Don't reveal if user exists or not for security, unless it's a format error
      if (err.code === 'auth/invalid-email') {
        setError("Email inválido.");
      } else {
         // Generic success message even on error to prevent enumeration, or generic error
         // For UX/Dev let's show success or generic error
         setMessage("Se este email estiver registrado, você receberá um link para redefinir sua senha.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Redefinir Senha</CardTitle>
        <CardDescription className="text-center">
          Digite seu email para receber o link de recuperação
        </CardDescription>
      </CardHeader>
      <CardContent>
        {message ? (
          <div className="space-y-4 text-center">
            <div className="flex justify-center text-green-500">
                <CheckCircle2 className="h-12 w-12" />
            </div>
            <p className="text-sm text-muted-foreground">{message}</p>
            <Button asChild className="w-full mt-4" variant="outline">
                <Link href="/login">Voltar para Login</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enviar Link
            </Button>
          </form>
        )}
      </CardContent>
      {!message && (
        <CardFooter className="flex justify-center">
            <Link href="/login" className="flex items-center text-sm text-muted-foreground hover:text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Login
            </Link>
        </CardFooter>
      )}
    </Card>
  );
}
