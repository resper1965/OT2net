import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { logger } from "@/lib/logger";

interface Cliente {
  id: string;
  razao_social: string;
  cnpj?: string;
  classificacao?: string;
  [key: string]: unknown;
}

interface UseClientesReturn {
  clientes: Cliente[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useClientes(): UseClientesReturn {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.clientes.list();
      setClientes(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar clientes";
      setError(errorMessage);
      logger.error("Erro ao carregar clientes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  return {
    clientes,
    loading,
    error,
    refetch: loadClientes,
  };
}


