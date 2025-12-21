import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

interface Initiative {
  id: string;
  nome: string;
  custo_estimado?: number;
  prioridade?: string;
  status: string;
}

interface BudgetDashboardProps {
  iniciativas: Initiative[];
}

export function BudgetDashboard({ iniciativas }: BudgetDashboardProps) {
  const budgetData = useMemo(() => {
    const byPriority = iniciativas.reduce((acc: any, ini) => {
      const p = ini.prioridade || "NAO_DEFINIDA";
      if (!acc[p]) {acc[p] = 0;}
      acc[p] += ini.custo_estimado || 0;
      return acc;
    }, {});

    const byStatus = iniciativas.reduce((acc: any, ini) => {
      if (!acc[ini.status]) {acc[ini.status] = 0;}
      acc[ini.status] += ini.custo_estimado || 0;
      return acc;
    }, {});

    const total = iniciativas.reduce((sum, ini) => sum + (ini.custo_estimado || 0), 0);

    return { byPriority, byStatus, total };
  }, [iniciativas]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Orçamento Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{formatCurrency(budgetData.total)}</div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
            {iniciativas.length} iniciativa{iniciativas.length !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Por Prioridade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(budgetData.byPriority).map(([priority, value]: [string, any]) => (
              <div key={priority} className="flex justify-between items-center">
                <span className="text-sm capitalize">{priority.toLowerCase().replace("_", " ")}</span>
                <span className="font-semibold">{formatCurrency(value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(budgetData.byStatus).map(([status, value]: [string, any]) => (
              <div key={status} className="text-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded">
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1 capitalize">
                  {status.replace("_", " ")}
                </div>
                <div className="text-lg font-bold">{formatCurrency(value)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
