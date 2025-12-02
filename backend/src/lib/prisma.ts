import { PrismaClient } from "@prisma/client";

/**
 * Cliente Prisma singleton para uso no backend Express
 * 
 * ⚠️ IMPORTANTE: Prisma bypassa RLS do Supabase
 * Implementar autorização manualmente nos controllers/middleware
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

