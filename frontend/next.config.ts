import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No Vercel, as serverless functions em /api são automaticamente expostas
  // O frontend pode chamar /api/* diretamente sem precisar de NEXT_PUBLIC_API_URL
  // Em desenvolvimento local, ainda usa o backend Express
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "",
  },
  output: "standalone",
  // Rewrites para desenvolvimento local (quando NEXT_PUBLIC_API_URL está definido)
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Se NEXT_PUBLIC_API_URL estiver definido (desenvolvimento local), faz proxy
    if (apiUrl && process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/:path*",
          destination: `${apiUrl}/api/:path*`,
        },
      ];
    }

    // Em produção no Vercel, as rotas /api/* são servidas pelas serverless functions
    return [];
  },
};

export default nextConfig;
