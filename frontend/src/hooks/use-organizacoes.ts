import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Organizacao {
  id: string;
  razao_social: string;
  cnpj: string;
  classificacao?: string;
  updated_at?: string;
}

export function useOrganizacoes() {
  const { data: organizacoes = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['organizacoes'],
    queryFn: () => api.organizacoes.list(),
  });

  return { 
    organizacoes, 
    loading, 
    error: error ? (error as Error).message : null, 
    refetch 
  };
}
