import { defineConfig } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
      "coverage/**",
      "dist/**",
    ],
  },
  {
    rules: {
      // Regras estritas de TypeScript
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "off", // Muito restritivo para React
      "@typescript-eslint/explicit-module-boundary-types": "off",
      
      // Regras estritas de React
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react/no-unescaped-entities": "error",
      "react/jsx-key": "error",
      
      // Regras de qualidade de código
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-alert": "warn",
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      
      // Regras de Next.js
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "error",
    },
  },
]);

export default eslintConfig;
