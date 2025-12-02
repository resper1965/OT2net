import pino from 'pino'

/**
 * Logger estruturado usando Pino
 * Em desenvolvimento, usa pino-pretty para output legível
 * Em produção, usa JSON estruturado
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() }
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
})

/**
 * Helpers para logging contextual
 */
export const logContext = {
  request: (req: any) => ({
    method: req.method,
    path: req.path,
    ip: req.ip,
    userId: req.userId,
  }),
  error: (error: Error) => ({
    message: error.message,
    stack: error.stack,
    name: error.name,
  }),
}

