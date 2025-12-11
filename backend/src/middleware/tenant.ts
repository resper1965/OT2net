import { Prisma } from '@prisma/client';

/**
 * Modelos que não precisam de RLS (não têm tenant_id ou são globais)
 */
const EXCLUDED_MODELS = ['Tenant', 'Usuario'];

/**
 * Aplica Row-Level Security (RLS) automaticamente em todas as queries Prisma
 * Garante que cada tenant só acessa seus próprios dados
 * 
 * @param tenantId - ID do tenant autenticado
 * @returns Prisma Client estendido com RLS aplicado
 */
export function applyTenantIsolation(tenantId: string) {
  // Nota: Esta função retorna um novo client, não modifica o global
  // Usar em middleware: req.prisma = applyTenantIsolation(req.user.tenant_id)
  
  return (prisma: any) => prisma.$extends({
    name: 'tenantIsolation',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }: any) {
          // Skip modelos que não têm tenant_id
          if (EXCLUDED_MODELS.includes(model)) {
            return query(args);
          }

          // LEITURA: Injetar filtro tenant_id automaticamente
          if (['findMany', 'findFirst', 'findUnique', 'count', 'aggregate', 'groupBy'].includes(operation)) {
            args.where = {
              ...args.where,
              tenant_id: tenantId
            };
          }

          // ESCRITA: Injetar tenant_id nos dados criados
          if (operation === 'create') {
            args.data = {
              ...args.data,
              tenant_id: tenantId
            };
          }

          if (operation === 'createMany') {
            if (Array.isArray(args.data)) {
              args.data = args.data.map((item: any) => ({
                ...item,
                tenant_id: tenantId
              }));
            }
          }

          // UPDATE/DELETE: Validar que só modifica dados do próprio tenant
          if (['update', 'updateMany', 'delete', 'deleteMany'].includes(operation)) {
            args.where = {
              ...args.where,
              tenant_id: tenantId
            };
          }

          return query(args);
        }
      }
    }
  });
}

/**
 * Tipo para Request com Prisma Client isolado por tenant
 */
export interface RequestWithTenant extends Request {
  user: {
    id: string;
    email: string;
    role: string;
    tenant_id: string;
  };
  prisma: any; // Prisma client com RLS aplicado
}
