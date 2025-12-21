"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function InvitePage() {
  // const params = useParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Provisório: Em produção, validaríamos o token com o backend para obter o email
  // const token = params.token as string;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Criar usuário no Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Atualizar perfil
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name,
        });

        // 3. (Opcional) Notificar backend sobre o uso do token
        // await api.post('/invites/accept', { token, uid: userCredential.user.uid });
      }

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Signup error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Este email já está em uso.");
      } else if (err.code === 'auth/weak-password') {
        setError("A senha deve ter pelo menos 6 caracteres.");
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Criar sua Conta</CardTitle>
        <CardDescription className="text-center">
          Preencha seus dados para aceitar o convite
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Criar Conta
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
