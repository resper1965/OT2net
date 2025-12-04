"use client";

import { useEffect, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

interface UseRealtimeOptions {
  table: string;
  filter?: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
}

/**
 * Hook React para gerenciar subscriptions Realtime do Supabase
 */
export function useRealtime(options: UseRealtimeOptions) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Criar canal
    const channelName = `realtime:${options.table}${options.filter ? `:${options.filter}` : ""}`;
    const newChannel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: options.table,
          filter: options.filter,
        },
        (payload) => {
          options.onInsert?.(payload);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: options.table,
          filter: options.filter,
        },
        (payload) => {
          options.onUpdate?.(payload);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: options.table,
          filter: options.filter,
        },
        (payload) => {
          options.onDelete?.(payload);
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    setChannel(newChannel);

    // Cleanup
    return () => {
      if (newChannel) {
        supabase.removeChannel(newChannel);
      }
    };
  }, [options.table, options.filter]);

  return {
    channel,
    isConnected,
  };
}

/**
 * Hook específico para notificações de processamento IA
 */
export function useIAProcessingNotifications(projetoId?: string) {
  const [notifications, setNotifications] = useState<any[]>([]);

  const { isConnected } = useRealtime({
    table: "chamadas_ia",
    filter: projetoId ? `projeto_id=eq.${projetoId}` : undefined,
    onInsert: (payload) => {
      setNotifications((prev) => [payload.new, ...prev]);
    },
    onUpdate: (payload) => {
      setNotifications((prev) => prev.map((n) => (n.id === payload.new.id ? payload.new : n)));
    },
  });

  return {
    notifications,
    isConnected,
  };
}

/**
 * Hook específico para updates de iniciativas
 */
export function useIniciativasUpdates(projetoId: string) {
  const [updates, setUpdates] = useState<any[]>([]);

  const { isConnected } = useRealtime({
    table: "iniciativas",
    filter: `projeto_id=eq.${projetoId}`,
    onUpdate: (payload) => {
      setUpdates((prev) => [payload.new, ...prev]);
    },
  });

  return {
    updates,
    isConnected,
  };
}

/**
 * Hook específico para novas respostas de questionários
 */
export function useQuestionarioResponses(questionarioId: string) {
  const [responses, setResponses] = useState<any[]>([]);

  const { isConnected } = useRealtime({
    table: "respostas_questionario",
    filter: `questionario_id=eq.${questionarioId}`,
    onInsert: (payload) => {
      setResponses((prev) => [payload.new, ...prev]);
    },
  });

  return {
    responses,
    isConnected,
  };
}
