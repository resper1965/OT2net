import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { logger } from "@/lib/logger";

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
  refetch: () => Promise<void>;
}

export function useProjetos(clienteId?: string): UseProjetosReturn {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjetos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.projetos.list(clienteId);
      setProjetos(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar projetos";
      setError(errorMessage);
      logger.error("Erro ao carregar projetos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjetos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clienteId]);

  return {
    projetos,
    loading,
    error,
    refetch: loadProjetos,
  };
}


