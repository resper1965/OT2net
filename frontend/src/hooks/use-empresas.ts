import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Empresa {
  id: string;
  razao_social: string;
  cnpj: string;
  organizacao_id: string;
  tipo?: string;
  status?: string;
  [key: string]: unknown;
}

export interface UseEmpresasReturn {
  empresas: Empresa[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useEmpresas(organizacaoId?: string) {
  const { data: empresas = [], isLoading: loading, error, refetch } = useQuery<Empresa[]>({
    queryKey: ['empresas', organizacaoId],
    queryFn: () => api.empresas.list(organizacaoId),
  });

  return { empresas, loading, error, refetch };
}
