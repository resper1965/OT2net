"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type DialogContextType = {
  open: boolean;
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

type DialogProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function Dialog({ children, open: controlledOpen, onOpenChange }: DialogProps) {
  const isControlled = controlledOpen !== undefined && onOpenChange !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled
    ? (value: boolean | ((prev: boolean) => boolean)) => {
        const newValue = typeof value === "function" ? value(controlledOpen ?? false) : value;
        onOpenChange?.(newValue);
      }
    : (value: boolean | ((prev: boolean) => boolean)) => {
        setUncontrolledOpen(value);
      };

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({
  className,
  children,
  asChild,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }) {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("DialogTrigger must be inside Dialog");

  const { setOpen } = ctx;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: () => setOpen(true),
      ...props,
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <div
      onClick={() => setOpen(true)}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  overlayClassName?: string;
  closeOnClickOutside?: boolean;
  showCloseButton?: boolean;
}

export function DialogContent({
  children,
  className = "",
  overlayClassName = "",
  closeOnClickOutside = true,
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("DialogContent must be inside Dialog");

  const { open, setOpen } = ctx;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    },
    [setOpen]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (typeof window === "undefined" || !open) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-opacity duration-300",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        overlayClassName
      )}
      onClick={(e) => {
        if (closeOnClickOutside && e.target === e.currentTarget) {
          setOpen(false);
        }
      }}
    >
      <div
        className={cn(
          "relative bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg w-full max-w-[90vw] p-6 max-h-[90vh] overflow-y-auto transition-all duration-300 transform",
          open ? "scale-100 opacity-100" : "scale-95 opacity-0",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {showCloseButton && (
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}

export function DialogHeader({
  children,
  className = "",
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function DialogTitle({
  children,
  className = "",
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-xl font-semibold text-zinc-900 dark:text-zinc-50",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function DialogDescription({
  children,
  className = "",
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "mt-2 text-sm text-zinc-600 dark:text-zinc-400",
        className
      )}
    >
      {children}
    </p>
  );
}

export function DialogFooter({
  children,
  className = "",
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-6 flex justify-end gap-3", className)}>{children}</div>
  );
}

export function DialogClose({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("DialogClose must be inside Dialog");

  const { setOpen } = ctx;

  return (
    <button
      onClick={() => setOpen(false)}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </button>
  );
}

