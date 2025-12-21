import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // No Vercel, as serverless functions em /api são automaticamente expostas
  // O frontend pode chamar /api/* diretamente sem precisar de NEXT_PUBLIC_API_URL
  // Em desenvolvimento local, ainda usa o backend Express
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "",
  },
  // output: "standalone", // Disabled to prevent SSG Firebase errors
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable type checking during production builds (already checked in CI)
    ignoreBuildErrors: true,
  },
  // Rewrites para desenvolvimento local (quando NEXT_PUBLIC_API_URL está definido)
  async rewrites() {
    // Configuração de Proxy para o Backend
    // Necessário tanto em dev quanto em prod (Cloud Run) para evitar CORS
    // e simplificar chamadas para /api/*
    
    // Fallback para URL do Backend no Cloud Run
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://ot2net-backend-21597837536.us-central1.run.app";

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
