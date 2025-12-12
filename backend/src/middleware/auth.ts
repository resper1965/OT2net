import { auth } from '../lib/firebase';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { applyTenantIsolation } from './tenant';
import { UserRole } from '@prisma/client';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    tenant_id?: string;
    cliente_id?: string | null;
  };
  prisma?: any;
}

/**
 * Middleware de autenticação Firebase
 * Valida token JWT e injeta user + prisma com RLS no request
 */
export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization header' });
      return;
    }

    const authToken = authHeader.split('Bearer ')[1];
    
    // Validar token com Firebase Admin
    const decodedToken = await auth.verifyIdToken(authToken);
    
    // Extrair claims customizados
    const { uid, email } = decodedToken;
    const role = (decodedToken as any).role || 'VISUALIZADOR';
    const tenant_id = (decodedToken as any).tenant_id;

    if (!tenant_id) {
      res.status(403).json({ 
        error: 'User not associated with a tenant',
        hint: 'Contact administrator to assign tenant'
      });
      return;
    }

    // Anexar informações do usuário
    req.user = {
      id: uid,
      email: email || '',
      role,
      tenant_id
    };

    // Aplicar RLS ao Prisma Client
    const isolationExtension = applyTenantIsolation(tenant_id);
    req.prisma = isolationExtension(prisma);

    next();
  } catch (error: any) {
    console.error('Authentication error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      res.status(401).json({ error: 'Token expired' });
    } else if (error.code === 'auth/argument-error') {
      res.status(401).json({ error: 'Invalid token format' });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
}

// Export alias for compatibility
export const authenticate = authenticateToken;
