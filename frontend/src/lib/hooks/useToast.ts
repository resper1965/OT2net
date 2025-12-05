"use client";

import { toast } from "sonner";

export function useToast() {
  return {
    success: (message: string, title?: string) => {
      return toast.success(title || "Sucesso", {
        description: message,
      });
    },
    error: (message: string, title?: string) => {
      return toast.error(title || "Erro", {
        description: message,
      });
    },
    warning: (message: string, title?: string) => {
      return toast.warning(title || "Aviso", {
        description: message,
      });
    },
    info: (message: string, title?: string) => {
      return toast.info(title || "Informação", {
        description: message,
      });
    },
    promise: <T,>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: any) => string);
      }
    ) => {
      return toast.promise(promise, {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      });
    },
  };
}

