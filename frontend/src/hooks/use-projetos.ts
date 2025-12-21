import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface Projeto {
  id: string;
  nome: string;
  progresso_geral?: number;
  fase_atual?: string;
  cliente_id?: string;
  created_at?: string;
  [key: string]: unknown;
}

interface UseProjetosReturn {
  projetos: Projeto[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProjetos(clienteId?: string): UseProjetosReturn {
  const { data: projetos = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['projetos', clienteId],
    queryFn: () => api.projetos.list(clienteId),
  });

  return {
    projetos,
    loading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}


