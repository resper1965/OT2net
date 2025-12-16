import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

interface Initiative {
  id: string;
  nome: string;
  data_inicio?: string;
  data_fim_prevista?: string;
  status: string;
  prioridade?: string;
}

interface RoadmapTimelineProps {
  iniciativas: Initiative[];
}

export function RoadmapTimeline({ iniciativas }: RoadmapTimelineProps) {
  const timelineData = useMemo(() => {
    if (!iniciativas || iniciativas.length === 0) return null;

    // Find min and max dates
    const dates = iniciativas
      .filter((i) => i.data_inicio && i.data_fim_prevista)
      .flatMap((i) => [new Date(i.data_inicio!), new Date(i.data_fim_prevista!)]);

    if (dates.length === 0) return null;

    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return { minDate, maxDate, totalDays };
  }, [iniciativas]);

  if (!timelineData) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-zinc-500">
          Nenhuma iniciativa com datas definidas
        </CardContent>
      </Card>
    );
  }

  const { minDate, maxDate, totalDays } = timelineData;

  const getBarPosition = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startOffset = Math.ceil((startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`,
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluida":
        return "bg-green-500";
      case "em_execucao":
        return "bg-blue-500";
      case "aprovada":
        return "bg-yellow-500";
      default:
        return "bg-zinc-400";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Roadmap</CardTitle>
        <CardDescription>
          {minDate.toLocaleDateString("pt-BR")} - {maxDate.toLocaleDateString("pt-BR")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {iniciativas
            .filter((i) => i.data_inicio && i.data_fim_prevista)
            .map((ini) => (
              <div key={ini.id} className="relative">
                <div className="text-sm font-medium mb-1">{ini.nome}</div>
                <div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded relative">
                  <div
                    className={`absolute top-0 bottom-0 rounded ${getStatusColor(ini.status)} flex items-center justify-center text-xs text-white font-medium`}
                    style={getBarPosition(ini.data_inicio!, ini.data_fim_prevista!)}
                  >
                    {ini.status}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
