import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Site {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  empresa_id: string;
  endereco?: string;
  [key: string]: unknown;
}

export function useSites(empresaId?: string) {
  const { data: sites = [], isLoading: loading, error, refetch } = useQuery<Site[]>({
    queryKey: ['sites', empresaId],
    queryFn: () => api.sites.list(empresaId),
  });

  return { sites, loading, error, refetch };
}
