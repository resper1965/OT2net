"use client";

import { usePermissions, type Resource, type PermissionAction } from '@/hooks/usePermissions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  resource: Resource | string;
  action: PermissionAction;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Componente para proteção de rotas baseado em permissões
 * Renderiza children apenas se o usuário tiver permissão
 * Caso contrário, redireciona ou renderiza fallback
 */
export function ProtectedRoute({ 
  resource, 
  action, 
  children, 
  fallback,
  redirectTo = '/dashboard'
}: ProtectedRouteProps) {
  const { can } = usePermissions();
  const router = useRouter();
  
  const hasPermission = can(resource, action);
  
  useEffect(() => {
    if (!hasPermission && !fallback) {
      router.push(redirectTo);
    }
  }, [hasPermission, fallback, redirectTo, router]);
  
  if (!hasPermission) {
    if (fallback) return <>{fallback}</>;
    return null;
  }
  
  return <>{children}</>;
}

interface ProtectedContentProps {
  resource: Resource | string;
  action: PermissionAction;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Componente para proteger conteúdo sem redirecionar
 * Útil para esconder elementos da UI baseado em permissões
 */
export function ProtectedContent({
  resource,
  action,
  children,
  fallback = null
}: ProtectedContentProps) {
  const { can } = usePermissions();
  
  if (!can(resource, action)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Componente para proteger conteúdo baseado em roles específicos
 */
export function RoleGuard({
  allowedRoles,
  children,
  fallback = null
}: RoleGuardProps) {
  const { role } = usePermissions();
  
  if (!role || !allowedRoles.includes(role)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}
