import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  type: 'table' | 'cards' | 'form' | 'details' | 'list';
  rows?: number;
  className?: string;
}

/**
 * Componente universal de Loading State com skeleton loaders
 * Substitui estados de carregamento genéricos por animações profissionais
 */
export function LoadingState({ type, rows = 5, className }: LoadingStateProps) {
  if (type === 'table') {
    return (
      <div className={cn('space-y-3', className)}>
        {/* Header */}
        <Skeleton className="h-10 w-full" />
        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div className={cn('space-y-6', className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'details') {
    return (
      <div className={cn('space-y-6', className)}>
        {/* Header */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        {/* Content blocks */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  // Default: list
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
