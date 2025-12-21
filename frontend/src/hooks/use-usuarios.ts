import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil?: string;
  organizacao?: string;
  status?: string;
  created_at?: string;
}

interface UseUsuariosReturn {
  usuarios: Usuario[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useUsuarios(): UseUsuariosReturn {
  const { data: usuarios = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => api.usuarios.list(),
  });

  return {
    usuarios: Array.isArray(usuarios) ? usuarios : [],
    loading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}
