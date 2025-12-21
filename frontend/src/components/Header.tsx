"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { User as FirebaseUser } from "firebase/auth";
import {
  Search,
  Bell,
  ChevronRight,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { SidebarTrigger } from "./layout/SidebarTrigger";

export function Header() {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: FirebaseUser | null) => {
      if (user) {
        setUserEmail(user.email);
        setUserName(user.displayName || user.email?.split("@")[0] || null);
      } else {
        setUserEmail(null);
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  async function handleLogout() {
    await auth.signOut();
    window.location.href = "/login";
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

  // Gerar breadcrumbs baseado no pathname
  function getBreadcrumbs() {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }];

    paths.forEach((path, index) => {
      if (path !== "dashboard") {
        const href = "/" + paths.slice(0, index + 1).join("/");
        const label = path
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        breadcrumbs.push({ label, href });
      }
    });

    return breadcrumbs;
  }

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Left: Menu Toggle + Breadcrumbs */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <SidebarTrigger />

          {/* Breadcrumbs */}
          <nav className="hidden md:flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-zinc-400" />
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-black dark:text-zinc-50 truncate">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 truncate"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile: Mostrar apenas página atual */}
          <div className="md:hidden">
            <span className="font-medium text-black dark:text-zinc-50 text-sm truncate">
              {breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard"}
            </span>
          </div>
        </div>

        {/* Right: Search + Notifications + User Menu */}
        <div className="flex items-center gap-2">
          {/* Search Button (pode ser expandido para busca global) */}
          <button
            className="hidden md:flex items-center justify-center w-9 h-9 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Buscar"
          >
            <Search className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          </button>

          {/* Notifications */}
          <button
            className="relative flex items-center justify-center w-9 h-9 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Notificações"
          >
            <Bell className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            {/* Badge de notificações pode ser adicionado aqui */}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-2 border-zinc-200 dark:border-zinc-700">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {getInitials(userName, userEmail)}
                </span>
              </div>
              <span className="hidden lg:block text-sm font-medium text-black dark:text-zinc-50 truncate max-w-[120px]">
                {userName || userEmail}
              </span>
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-lg z-50">
                  <div className="p-3 border-b border-zinc-200 dark:border-zinc-700">
                    <p className="text-sm font-medium text-black dark:text-zinc-50 truncate">
                      {userName || "Usuário"}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                      {userEmail}
                    </p>
                  </div>
                  <div className="p-1">
                    <Link
                      href="/dashboard/conta"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Minha Conta
                    </Link>
                    <Link
                      href="/dashboard/conta"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Configurações
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

