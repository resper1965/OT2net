"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  Factory, 
  MapPin, 
  FileText, 
  CheckCircle2,
  TrendingUp,
  Activity
} from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";

interface DashboardStats {
  overview: {
    organizacoes: number;
    empresas: number;
    sites: number;
    projetos: number;
    projetosAtivos: number;
  };
  processos: {
    descricoesTotal: number;
    descricoesProcessadas: number;
    taxaProcessamento: number;
    processosNormalizados: number;
    processosAprovados: number;
    taxaAprovacao: number;
  };
  atividade: {
    descricoesUltimos7Dias: number;
  };
}

export function DashboardKPIs() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
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
          <div className="text-2xl font-bold">{stats.overview.organizacoes}</div>
          <p className="text-xs text-zinc-500 mt-1">
            {stats.overview.empresas} empresas cadastradas
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
          <div className="text-2xl font-bold">{stats.overview.sites}</div>
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
          <div className="text-2xl font-bold">{stats.overview.projetosAtivos}</div>
          <p className="text-xs text-zinc-500 mt-1">
            de {stats.overview.projetos} totais
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
          <div className="text-2xl font-bold">{stats.processos.taxaProcessamento}%</div>
          <p className="text-xs text-zinc-500 mt-1">
            {stats.processos.descricoesProcessadas} de {stats.processos.descricoesTotal} descrições
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
          <div className="text-2xl font-bold">{stats.processos.taxaAprovacao}%</div>
          <p className="text-xs text-zinc-500 mt-1">
            {stats.processos.processosAprovados} de {stats.processos.processosNormalizados} processos
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
          <div className="text-2xl font-bold">{stats.atividade.descricoesUltimos7Dias}</div>
          <p className="text-xs text-zinc-500 mt-1">
            Novas descrições
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
