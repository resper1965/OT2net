/**
 * Sistema de logging para produção
 * Remove console.log em produção e mantém apenas erros importantes
 */

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  log: (...args: unknown[]) => {
    // Log removido em produção - usar logger.info para desenvolvimento
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },
  error: (message: string, error?: unknown) => {
    // Em produção, apenas logar erros críticos
    if (isDevelopment) {
      console.error(message, error);
    } else {
      // Em produção, você pode enviar para um serviço de logging
      // Ex: Sentry, LogRocket, etc.
      if (error instanceof Error) {
        // Log apenas mensagens de erro, não o objeto completo
        console.error(message);
      }
    }
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
};


