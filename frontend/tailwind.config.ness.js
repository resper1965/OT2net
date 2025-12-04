/**
 * Tailwind CSS Config - Design System Ness
 * Aplicar apenas quando necessário
 *
 * Para usar, importe no tailwind.config.js principal:
 * const nessConfig = require('./tailwind.config.ness.js');
 * module.exports = { ...config, ...nessConfig };
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        // Azul Primário (Assinatura)
        "ness-primary": {
          DEFAULT: "#00ade8",
          hover: {
            light: "#1ab0ff",
            dark: "#33BEE6",
          },
          pressed: "#008bb8",
          light: "#4dc2ff",
          dark: "#006988",
        },
        // Azul com Transparência
        "ness-primary-alpha": {
          100: "rgba(0, 173, 232, 0.05)",
          200: "rgba(0, 173, 232, 0.10)",
          300: "rgba(0, 173, 232, 0.15)",
        },
        // Neutros - Cinzas Profundos
        "ness-slate": {
          950: "#0a0d14",
          900: "#0f172a",
          850: "#1a1f28",
          800: "#1e293b",
          700: "#2d3544",
          600: "#3d4759",
          500: "#64748b",
          400: "#94a3b8",
          300: "#cbd5e1",
          200: "#e2e8f0",
          100: "#f1f5f9",
          50: "#f8fafc",
        },
        // Light Mode
        "ness-light": {
          bg: "#FFFFFF",
          fg: "#111827",
          card: "#F9FAFB",
          border: "#E5E7EB",
        },
        // Dark Mode
        "ness-dark": {
          bg: "#0B0D0E",
          fg: "#E5E7EB",
          card: "#111827",
          border: "#1F2937",
        },
        // Estados
        "ness-destructive": {
          light: "#EF4444",
          dark: "#F87171",
        },
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      fontWeight: {
        "brand-dot": "700",
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      addUtilities({
        ".brand-dot": {
          color: theme("colors.ness-primary.DEFAULT"),
          "font-weight": "700",
          "white-space": "nowrap",
        },
        ".dark .brand-dot": {
          color: theme("colors.ness-primary.hover.dark"),
        },
        ".ness-cta-primary": {
          background: "linear-gradient(135deg, #00ade8 0%, #008bb8 100%)",
          color: "white",
        },
        ".ness-badge": {
          "background-color": theme("colors.ness-primary-alpha.200"),
          border: `1px solid ${theme("colors.ness-primary-alpha.300")}`,
          color: theme("colors.ness-primary.hover.light"),
        },
        ".ness-focus-ring": {
          outline: `2px solid ${theme("colors.ness-primary.DEFAULT")}`,
          "outline-offset": "2px",
        },
        ".dark .ness-focus-ring": {
          "outline-color": theme("colors.ness-primary.hover.dark"),
        },
      });
    },
  ],
};
