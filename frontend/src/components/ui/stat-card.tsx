"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-lg border border-border p-6",
      "hover:shadow-md transition-shadow",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-primary/10 rounded-lg ring-1 ring-primary/20">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
