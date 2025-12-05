"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface NessLogoProps {
  className?: string;
  variant?: "default" | "light" | "dark";
}

/**
 * Componente do logo da Ness
 * Regra de marca:
 * - "ness" usa fonte Montserrat Medium
 * - Cor branca ou preta dependendo do tema (dark/light)
 * - O ponto "." sempre em #00ade8
 * - Adapta automaticamente ao tema quando variant="default"
 */
export default function NessLogo({
  className = "",
  variant = "default",
}: NessLogoProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determina a cor do texto "ness" baseado no variant e tema atual
  const getTextColor = () => {
    if (variant === "light") return "text-black";
    if (variant === "dark") return "text-white";
    
    // variant === "default": adapta ao tema
    if (!mounted) {
      // Durante SSR, usa uma cor neutra
      return "text-zinc-900 dark:text-white";
    }
    
    const currentTheme = theme === "system" ? systemTheme : theme;
    return currentTheme === "dark" ? "text-white" : "text-black";
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center">
        <span
          className={`text-3xl font-medium tracking-tight ${getTextColor()}`}
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          ness
          <span className="text-3xl font-medium" style={{ color: "#00ade8" }}>
            .
          </span>
        </span>
      </div>
    </div>
  );
}
