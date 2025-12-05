"use client";

import { cn } from "@/lib/utils";
import { Loader2, type LucideIcon } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <Loader2 
      className={cn(
        "animate-spin text-primary",
        sizeClasses[size],
        className
      )} 
    />
  );
}

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function LoadingState({ message = "Carregando...", size = "lg", className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-12", className)}>
      <LoadingSpinner size={size} />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
