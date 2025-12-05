"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const statusBadgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
  {
    variants: {
      variant: {
        success: "bg-success/10 text-success border border-success/20",
        warning: "bg-warning/10 text-warning border border-warning/20",
        error: "bg-destructive/10 text-destructive border border-destructive/20",
        info: "bg-info/10 text-info border border-info/20",
        default: "bg-muted text-muted-foreground border border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
}

export function StatusBadge({ className, variant, children, ...props }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}
