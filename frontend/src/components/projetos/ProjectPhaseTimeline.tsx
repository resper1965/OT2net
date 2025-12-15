"use client";

import { useMemo } from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Fase {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  ordem: number;
  cor: string;
  icone?: string;
  status: string;
  progresso: number;
}

interface ProjectPhaseTimelineProps {
  fases: Fase[];
  className?: string;
}

export function ProjectPhaseTimeline({ fases, className }: ProjectPhaseTimelineProps) {
  const sortedFases = useMemo(() => {
    return [...fases].sort((a, b) => a.ordem - b.ordem);
  }, [fases]);

  const getStatusIcon = (status: string, progresso: number) => {
    if (status === "concluida" || progresso === 100) {
      return CheckCircle2;
    }
    if (status === "em_andamento" || progresso > 0) {
      return Clock;
    }
    return Circle;
  };

  const getStatusColor = (status: string, progresso: number, cor: string) => {
    if (status === "concluida" || progresso === 100) {
      return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
    }
    if (status === "em_andamento" || progresso > 0) {
      return `bg-opacity-10 dark:bg-opacity-20`;
    }
    return "text-zinc-400 dark:text-zinc-600 bg-zinc-50 dark:bg-zinc-900";
  };

  const getStatusLabel = (status: string, progresso: number) => {
    if (status === "concluida" || progresso === 100) return "Concluída";
    if (status === "em_andamento" || progresso > 0) return "Em Andamento";
    return "Não Iniciada";
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Mobile: Vertical Timeline */}
      <div className="block lg:hidden space-y-4">
        {sortedFases.map((fase, index) => {
          const StatusIcon = getStatusIcon(fase.status, fase.progresso);
          const isActive = fase.status === "em_andamento" || (fase.progresso > 0 && fase.progresso < 100);
          const isCompleted = fase.status === "concluida" || fase.progresso === 100;

          return (
            <div key={fase.id} className="relative flex gap-4">
              {/* Vertical Line */}
              {index < sortedFases.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-800" />
              )}

              {/* Icon */}
              <div className="relative z-10 flex items-center justify-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all",
                    isCompleted && "bg-green-500 border-green-500",
                    isActive && "bg-white dark:bg-zinc-900 border-current animate-pulse",
                    !isActive && !isCompleted && "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                  )}
                  style={isActive && !isCompleted ? { borderColor: fase.cor } : {}}
                >
                  <StatusIcon
                    className={cn(
                      "h-6 w-6",
                      isCompleted && "text-white",
                      isActive && "text-current",
                      !isActive && !isCompleted && "text-zinc-400"
                    )}
                    style={isActive && !isCompleted ? { color: fase.cor } : {}}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-base text-black dark:text-zinc-50">
                    {fase.nome}
                  </h3>
                  <span
                    className={cn(
                      "px-2 py-0.5 text-xs font-medium rounded-full",
                      getStatusColor(fase.status, fase.progresso, fase.cor)
                    )}
                    style={
                      isActive
                        ? { backgroundColor: `${fase.cor}20`, color: fase.cor }
                        : {}
                    }
                  >
                    {getStatusLabel(fase.status, fase.progresso)}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  {fase.descricao}
                </p>
                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${fase.progresso}%`,
                        backgroundColor: isCompleted ? "#10b981" : fase.cor,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 min-w-[45px]">
                    {fase.progresso}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: Horizontal Timeline */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Horizontal Line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-zinc-200 dark:bg-zinc-800" />

          {/* Phases */}
          <div className="relative grid grid-cols-5 gap-4">
            {sortedFases.map((fase, index) => {
              const StatusIcon = getStatusIcon(fase.status, fase.progresso);
              const isActive = fase.status === "em_andamento" || (fase.progresso > 0 && fase.progresso < 100);
              const isCompleted = fase.status === "concluida" || fase.progresso === 100;

              return (
                <div key={fase.id} className="flex flex-col items-center">
                  {/* Icon */}
                  <div className="relative z-10 mb-4">
                    <div
                      className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all",
                        isCompleted && "bg-green-500 border-green-500",
                        isActive && "bg-white dark:bg-zinc-900 border-current",
                        !isActive && !isCompleted && "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                      )}
                      style={isActive && !isCompleted ? { borderColor: fase.cor } : {}}
                    >
                      <StatusIcon
                        className={cn(
                          "h-6 w-6",
                          isCompleted && "text-white",
                          isActive && "text-current",
                          !isActive && !isCompleted && "text-zinc-400"
                        )}
                        style={isActive && !isCompleted ? { color: fase.cor } : {}}
                      />
                    </div>
                    {isActive && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span
                          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                          style={{ backgroundColor: fase.cor }}
                        />
                        <span
                          className="relative inline-flex rounded-full h-3 w-3"
                          style={{ backgroundColor: fase.cor }}
                        />
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="font-semibold text-sm text-black dark:text-zinc-50 mb-1">
                      {fase.nome}
                    </h3>
                    <span
                      className={cn(
                        "inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-2",
                        getStatusColor(fase.status, fase.progresso, fase.cor)
                      )}
                      style={
                        isActive
                          ? { backgroundColor: `${fase.cor}20`, color: fase.cor }
                          : {}
                      }
                    >
                      {getStatusLabel(fase.status, fase.progresso)}
                    </span>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
                      {fase.descricao}
                    </p>
                    {/* Progress */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-500 rounded-full"
                          style={{
                            width: `${fase.progresso}%`,
                            backgroundColor: isCompleted ? "#10b981" : fase.cor,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        {fase.progresso}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
