"use client";

import { PanelLeftIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import Search from "@/components/layout/header/search";
import UserMenu from "@/components/layout/header/user-menu";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePageTitle } from "@/contexts/PageTitleContext";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const { title } = usePageTitle();

  return (
    <header className="bg-background/40 sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 border-b backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) md:rounded-tl-xl md:rounded-tr-xl">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2">
        <Button onClick={toggleSidebar} variant="ghost" className="h-9 w-9 p-0">
          <PanelLeftIcon className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        
        {/* Título da página */}
        <h1 className="text-lg font-semibold text-foreground flex-1">
          {title}
        </h1>

        {/* Busca e ações à direita */}
        <div className="ml-auto flex items-center gap-2">
          <Search />
          <ThemeToggle />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

