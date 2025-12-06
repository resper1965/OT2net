"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/lib/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Calendar } from "lucide-react";
import { usePageTitleEffect } from "@/hooks/use-page-title";

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at?: string;
}

export default function ContaPage() {
  usePageTitleEffect("Minha Conta");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const toast = useToast();

  function getInitials(name: string): string {
    if (!name) {return "U";}
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const user = session.user;
      const name = user.user_metadata?.full_name || user.user_metadata?.name || "";
      const email = user.email || "";

      setProfile({
        id: user.id,
        email,
        name,
        avatar_url: user.user_metadata?.avatar_url,
        created_at: user.created_at,
      });

      setFormData({
        name,
        email,
      });
    } catch {
      toast.error("Erro ao carregar informações da conta");
    } finally {
      setLoading(false);
    }
  }, [router, toast]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function handleSave() {
    try {
      setSaving(true);

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.name,
          name: formData.name,
        },
      });

      if (error) {throw error;}

      toast.success("Perfil atualizado com sucesso!");
      await loadProfile();
    } catch (error: unknown) {
      const err = error as Error;
      toast.error("Erro ao atualizar perfil: " + (err.message || "Erro desconhecido"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div>
        <div>
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">Carregando informações da conta...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-800 dark:text-red-200">
              Erro ao carregar informações da conta
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-full">
        {/* Header */}
        <div className="mb-8">
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
              Informações do Perfil
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.name || profile.email}
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-700"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-2 border-zinc-200 dark:border-zinc-700">
                  <span className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                    {getInitials(profile.name || profile.email)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
                  {profile.name || "Usuário"}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{profile.email}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 w-full"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    type="email"
                    value={formData.email}
                    disabled
                    className="pl-10 bg-zinc-50 dark:bg-zinc-800 w-full"
                  />
                </div>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  O email não pode ser alterado
                </p>
              </div>

              {profile.created_at && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                    Membro desde
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                      type="text"
                      value={new Date(profile.created_at).toLocaleDateString("pt-BR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      disabled
                      className="pl-10 bg-zinc-50 dark:bg-zinc-800 w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <Button
                variant="default"
                onClick={handleSave}
               
                disabled={saving}
              >
                Salvar Alterações
              </Button>
              <Link href="/dashboard">
                <Button variant="outline">Cancelar</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

