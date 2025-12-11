import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export interface Organizacao {
  id: string;
  razao_social: string;
  cnpj: string;
  classificacao?: string;
  updated_at?: string;
}

export function useOrganizacoes() {
  const [organizacoes, setOrganizacoes] = useState<Organizacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadOrganizacoes();
  }, []);

  async function loadOrganizacoes() {
    try {
      setLoading(true);
      const data = await api.organizacoes.list();
      setOrganizacoes(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  return { organizacoes, loading, error, refetch: loadOrganizacoes };
}
