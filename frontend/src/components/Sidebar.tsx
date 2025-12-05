"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Factory,
  MapPin,
  FolderKanban,
  Users,
  UserCog,
  Workflow,
  BookOpen,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import NessLogo from "./NessLogo";
import clsx from "clsx";

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function getUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUserEmail(session.user.email || null);
      }
    }
    getUser();
  }, []);

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Clientes",
      href: "/dashboard/clientes",
      icon: Building2,
    },
    {
      title: "Empresas",
      href: "/dashboard/empresas",
      icon: Factory,
    },
    {
      title: "Sites",
      href: "/dashboard/sites",
      icon: MapPin,
    },
    {
      title: "Projetos",
      href: "/dashboard/projetos",
      icon: FolderKanban,
    },
    {
      title: "Stakeholders",
      href: "/dashboard/stakeholders",
      icon: Users,
    },
    {
      title: "Equipe",
      href: "/dashboard/equipe",
      icon: UserCog,
    },
    {
      title: "Processos",
      href: "/dashboard/processos",
      icon: Workflow,
    },
    {
      title: "Catálogo",
      href: "/dashboard/catalogo",
      icon: BookOpen,
    },
  ];

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
        ) : (
          <Menu className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-full w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
              <NessLogo variant="dark" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={clsx(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            {userEmail && (
              <div className="mb-3 px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400 truncate">
                {userEmail}
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

