"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const inputVariants = cva(
  "flex w-full rounded-lg border transition-colors disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-0",
  {
    variants: {
      variant: {
        outline:
          "border-zinc-300 bg-white focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-blue-500",
        filled:
          "border-zinc-200 bg-zinc-50 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:ring-blue-500",
        none: "border-0 bg-transparent focus:ring-transparent",
      },
      size: {
        xs: "h-7 px-2 text-xs",
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-11 px-6 text-lg",
        xl: "h-12 px-8 text-xl",
      },
      isError: {
        true: "border-red-500 focus:ring-red-500",
        false: "",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "sm",
      isError: false,
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  isLoading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, variant, size, isError, isLoading, ...props },
    ref
  ) => {
    return (
      <div className="relative w-full">
        <input
          ref={ref}
          className={cn(inputVariants({ variant, size, isError }), className)}
          {...props}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-zinc-400" />
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };

