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
  User,
  Settings,
  Shield,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import NessLogo from "./NessLogo";
import { ThemeToggle } from "./ThemeToggle";
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
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function getUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUserEmail(session.user.email || null);
        setUserName(session.user.user_metadata?.full_name || session.user.user_metadata?.name || null);
        setUserAvatar(session.user.user_metadata?.avatar_url || null);
        
        // Verificar se é admin
        const perfil = session.user.user_metadata?.perfil;
        setIsAdmin(perfil === "admin");
      }
    }
    getUser();

    // Escutar mudanças na sessão
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUserEmail(session.user.email || null);
        setUserName(session.user.user_metadata?.full_name || session.user.user_metadata?.name || null);
        setUserAvatar(session.user.user_metadata?.avatar_url || null);
        
        // Verificar se é admin
        const perfil = session.user.user_metadata?.perfil;
        setIsAdmin(perfil === "admin");
      } else {
        setUserEmail(null);
        setUserName(null);
        setUserAvatar(null);
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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

  // Adicionar menu de usuários apenas para admins
  if (isAdmin) {
    menuItems.push({
      title: "Usuários",
      href: "/dashboard/usuarios",
      icon: Shield,
    });
  }

  function getInitials(name: string | null, email: string | null): string {
    if (name) {
      const parts = name.trim().split(/\s+/);
      if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
      }
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "U";
  }

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
              <NessLogo variant="default" />
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

          {/* User info, theme toggle and logout */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
            {/* User Grid */}
            {userEmail && (
              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-3">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName || userEmail}
                      className="h-10 w-10 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-700"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-2 border-zinc-200 dark:border-zinc-700">
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {getInitials(userName, userEmail)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {userName && (
                      <p className="text-sm font-medium text-black dark:text-zinc-50 truncate">
                        {userName}
                      </p>
                    )}
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                      {userEmail}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/dashboard/conta"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Conta</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-red-600 dark:text-red-400 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            )}
            {/* Theme Toggle */}
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="text-xs text-zinc-600 dark:text-zinc-400">Tema</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

