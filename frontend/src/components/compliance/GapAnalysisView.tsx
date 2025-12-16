import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

interface GapAnalysisViewProps {
  projeto_id: string;
}

export function GapAnalysisView({ projeto_id }: GapAnalysisViewProps) {
  const [gapReport, setGapReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGapReport();
  }, [projeto_id]);

  const loadGapReport = async () => {
    try {
      const data = await api.analisesConformidade.getGapReport(projeto_id);
      setGapReport(data);
    } catch (error) {
      console.error("Erro ao carregar gap report:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Carregando análise de conformidade...</div>;
  }

  if (!gapReport || !gapReport.summary) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-zinc-500">
          Nenhuma análise de conformidade disponível
        </CardContent>
      </Card>
    );
  }

  const { summary, gaps_by_category } = gapReport;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Conformidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/10 rounded">
              <div className="text-3xl font-bold text-green-600">{summary.atende}</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Atende</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded">
              <div className="text-3xl font-bold text-yellow-600">{summary.atende_parcial}</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Parcial</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/10 rounded">
              <div className="text-3xl font-bold text-red-600">{summary.nao_atende}</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Não Atende</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded">
              <div className="text-3xl font-bold text-blue-600">{summary.compliance_rate}%</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Taxa de Conformidade</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gaps por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(gaps_by_category).length === 0 ? (
            <p className="text-zinc-500">Nenhum gap identificado</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(gaps_by_category).map(([category, gaps]: [string, any]) => (
                <div key={category} className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold mb-2">{category}</h4>
                  <div className="space-y-2">
                    {gaps.map((gap: any, idx: number) => (
                      <div key={idx} className="text-sm">
                        <div className="font-medium">
                          {gap.requisito}: {gap.titulo}
                        </div>
                        {gap.gaps && gap.gaps.length > 0 && (
                          <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 ml-4">
                            {gap.gaps.map((g: string, i: number) => (
                              <li key={i}>{g}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
