interface NessLogoProps {
  className?: string;
  variant?: "default" | "light" | "dark";
}

/**
 * Componente do logo da Ness
 * Regra de marca:
 * - "ness" usa fonte Montserrat Medium
 * - Cor branca ou preta dependendo do fundo (dark/light)
 * - O ponto "." sempre em #00ade8
 */
export default function NessLogo({
  className = "",
  variant = "default",
}: NessLogoProps) {
  // Determina a cor do texto "ness" baseado no variant
  // default: adapta ao tema (branco em dark, preto em light)
  // light: preto (para fundos claros)
  // dark: branco (para fundos escuros)
  const textColor =
    variant === "light"
      ? "text-black"
      : variant === "dark"
        ? "text-white"
        : "text-white dark:text-black"; // Adapta ao tema

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center">
        <span
          className={`text-3xl font-medium tracking-tight ${textColor}`}
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
