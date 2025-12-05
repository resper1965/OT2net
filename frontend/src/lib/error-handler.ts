/**
 * Utilitário para tratamento padronizado de erros
 */

import { logger } from "./logger";

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    logger.error("Erro na API:", error);
    return {
      message: error.message || "Erro desconhecido",
    };
  }

  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;
    return {
      message: (err.message as string) || "Erro desconhecido",
      status: err.status as number,
      code: err.code as string,
    };
  }

  return {
    message: "Erro desconhecido",
  };
}

export function getErrorMessage(error: unknown): string {
  const apiError = handleApiError(error);
  return apiError.message;
}

