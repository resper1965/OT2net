"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "./SidebarProvider";

export function SidebarTrigger() {
  const { toggle } = useSidebar();

  return (
    <button
      onClick={toggle}
      className="lg:hidden p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      aria-label="Toggle menu"
    >
      <Menu className="h-5 w-5 text-zinc-900 dark:text-zinc-50" />
    </button>
  );
}

