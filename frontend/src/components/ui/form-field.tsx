"use client";

import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  required,
  description,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
