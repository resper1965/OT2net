"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Fase {
  id: string;
  numero: number;
  nome: string;
  descricao: string;
  status: "completa" | "em_andamento" | "planejada";
  cor: string;
}

const FASES: Fase[] = [
  {
    id: "fase--1",
    numero: -1,
    nome: "Onboarding & Setup",
    descricao: "Captura de estrutura organizacional (Organizações, Empresas, Sites, Stakeholders)",
    status: "completa",
    cor: "bg-sky-500",
  },
  {
    id: "fase-0",
    numero: 0,
    nome: "Discovery & AS-IS",
    descricao: "Coleta de descrições operacionais + Normalização com IA (BPMN, Mermaid)",
    status: "em_andamento",
    cor: "bg-amber-500",
  },
  {
    id: "fase-1",
    numero: 1,
    nome: "Assessment",
    descricao: "Análise de conformidade (ONS, ANEEL) + Matriz de riscos + Gap analysis",
    status: "planejada",
    cor: "bg-violet-500",
  },
  {
    id: "fase-2",
    numero: 2,
    nome: "Plano Diretor",
    descricao: "Roadmap de iniciativas + Priorização (MoSCoW) + Estimativas de investimento",
    status: "planejada",
    cor: "bg-pink-500",
  },
  {
    id: "fase-3",
    numero: 3,
    nome: "PMO & Execução",
    descricao: "Dashboard PMO + Gestão de tarefas + Relatórios de status",
    status: "planejada",
    cor: "bg-green-500",
  },
];

export function ProjectPhasesTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fases do Projeto</CardTitle>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Metodologia de consultoria em Governança TO
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-800" />

          {/* Phases */}
          <div className="space-y-8">
            {FASES.map((fase) => (
              <div key={fase.id} className="relative flex gap-4">
                {/* Icon */}
                <div className="relative z-10 flex items-center justify-center">
                  {fase.status === "completa" ? (
                    <CheckCircle2 className="h-12 w-12 text-green-600 bg-white dark:bg-zinc-900 rounded-full" />
                  ) : fase.status === "em_andamento" ? (
                    <div className="relative">
                      <Circle className="h-12 w-12 text-amber-500 fill-amber-500/20 bg-white dark:bg-zinc-900 rounded-full" />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        </span>
                      </span>
                    </div>
                  ) : (
                    <Circle className="h-12 w-12 text-zinc-300 dark:text-zinc-700 bg-white dark:bg-zinc-900 rounded-full" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-black dark:text-zinc-50">
                      Fase {fase.numero}: {fase.nome}
                    </h3>
                    <Badge
                      variant={
                        fase.status === "completa"
                          ? "default"
                          : fase.status === "em_andamento"
                          ? "secondary"
                          : "outline"
                      }
                      className={cn(
                        fase.status === "em_andamento" && "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100"
                      )}
                    >
                      {fase.status === "completa" && "✓ Concluída"}
                      {fase.status === "em_andamento" && "⚡ Em Andamento"}
                      {fase.status === "planejada" && "Planejada"}
                    </Badge>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {fase.descricao}
                  </p>

                  {/* Phase Color Indicator */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", fase.cor)} />
                    <span className="text-xs text-zinc-500">
                      Cor da fase no sistema
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
