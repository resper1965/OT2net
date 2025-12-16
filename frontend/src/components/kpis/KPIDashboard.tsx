import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface KPIDashboardProps {
  projeto_id: string;
}

export function KPIDashboard({ projeto_id }: KPIDashboardProps) {
  const [kpis, setKpis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKPIs();
  }, [projeto_id]);

  const loadKPIs = async () => {
    try {
      const data = await api.indicadores.getDashboard(projeto_id);
      setKpis(data.indicadores || []);
    } catch (error) {
      console.error("Erro ao carregar KPIs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VERDE":
        return "bg-green-500";
      case "AMARELO":
        return "bg-yellow-500";
      case "VERMELHO":
        return "bg-red-500";
      default:
        return "bg-zinc-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "VERDE":
        return "No Alvo";
      case "AMARELO":
        return "Atenção";
      case "VERMELHO":
        return "Crítico";
      default:
        return "Sem Dados";
    }
  };

  if (loading) {
    return <div className="p-6">Carregando KPIs...</div>;
  }

  if (kpis.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-zinc-500">
          Nenhum KPI cadastrado para este projeto
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.id}>
          <CardHeader>
            <CardTitle className="text-base">{kpi.nome}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Atual:</span>
                <span className="text-2xl font-bold">{kpi.atual !== null ? kpi.atual.toFixed(2) : "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Meta:</span>
                <span className="text-lg font-semibold">{kpi.target.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Status:</span>
                <span className={`px-3 py-1 rounded text-white text-sm font-medium ${getStatusColor(kpi.status)}`}>
                  {getStatusText(kpi.status)}
                </span>
              </div>
              {kpi.ultima_atualizacao && (
                <div className="text-xs text-zinc-500 pt-2 border-t">
                  Atualizado: {new Date(kpi.ultima_atualizacao).toLocaleDateString("pt-BR")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
