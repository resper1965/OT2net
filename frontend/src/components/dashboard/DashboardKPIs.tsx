"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  MapPin, 
  FileText, 
  CheckCircle2,
  TrendingUp,
  Activity
} from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";



export function DashboardKPIs() {


  const { data: stats, isLoading: loading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const data = await api.dashboard.getStats();
      if (!data?.overview) {
         // Optionally throw/return null if data is invalid,
         // or just let the defensive code in JSX handle it.
         console.warn("Invalid stats data format:", data);
      }
      return data;
    }
  });

  if (error) {
    console.error('Error loading dashboard stats:', error);
  }

  if (loading) {
    return <LoadingState type="cards" rows={6} />;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Organizações */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Organizações
          </CardTitle>
          <Building2 className="h-4 w-4 text-zinc-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.overview?.organizacoes ?? 0}</div>
          <p className="text-xs text-zinc-500 mt-1">
            {stats?.overview?.empresas ?? 0} empresas cadastradas
          </p>
        </CardContent>
      </Card>

      {/* Sites */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Sites
          </CardTitle>
          <MapPin className="h-4 w-4 text-zinc-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.overview?.sites ?? 0}</div>
          <p className="text-xs text-zinc-500 mt-1">
            Instalações mapeadas
          </p>
        </CardContent>
      </Card>

      {/* Projetos Ativos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Projetos Ativos
          </CardTitle>
          <Activity className="h-4 w-4 text-zinc-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.overview?.projetosAtivos ?? 0}</div>
          <p className="text-xs text-zinc-500 mt-1">
            de {stats?.overview?.projetos ?? 0} totais
          </p>
        </CardContent>
      </Card>

      {/* Descrições Processadas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Taxa de Processamento
          </CardTitle>
          <FileText className="h-4 w-4 text-zinc-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.processos?.taxaProcessamento ?? 0}%</div>
          <p className="text-xs text-zinc-500 mt-1">
            {stats?.processos?.descricoesProcessadas ?? 0} de {stats?.processos?.descricoesTotal ?? 0} descrições
          </p>
        </CardContent>
      </Card>

      {/* Processos Aprovados */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Taxa de Aprovação
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-zinc-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.processos?.taxaAprovacao ?? 0}%</div>
          <p className="text-xs text-zinc-500 mt-1">
            {stats?.processos?.processosAprovados ?? 0} de {stats?.processos?.processosNormalizados ?? 0} processos
          </p>
        </CardContent>
      </Card>

      {/* Atividade Recente */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Atividade (7 dias)
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-zinc-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.atividade?.descricoesUltimos7Dias ?? 0}</div>
          <p className="text-xs text-zinc-500 mt-1">
            Novas descrições
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
