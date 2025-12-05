"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function SidebarLayout({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex min-h-screen w-full bg-zinc-50 dark:bg-black", className)}
      {...props}
    />
  );
}

export function MainContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col min-w-0 overflow-hidden",
        className
      )}
      {...props}
    />
  );
}



