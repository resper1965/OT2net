"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2,
  Factory,
  MapPin,
  Users,
  FileText,
  CheckSquare,
  BarChart3,
  Target,
  Workflow,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface FaseAtividade {
  id: string;
  nome: string;
  descricao: string;
  menuUrl: string;
  icon: any;
  concluida?: boolean;
}

interface FaseInfo {
  id: string;
  numero: number;
  nome: string;
  descricao: string;
  cor: string;
  atividades: FaseAtividade[];
}

const FASES_DETALHADAS: FaseInfo[] = [
  {
    id: "onboarding",
    numero: -1,
   nome: "Onboarding & Setup",
    descricao: "Cadastrar estrutura organizacional do cliente",
    cor: "bg-sky-500",
    atividades: [
      {
        id: "org",
        nome: "Organizações",
        descricao: "Cadastrar grupo econômico (ex: Eletrobras, CEMIG)",
        menuUrl: "/dashboard/organizacoes",
        icon: Building2,
      },
      {
        id: "emp",
        nome: "Empresas",
        descricao: "Cadastrar subsidiárias (Geradoras, Transmissoras, Distribuidoras)",
        menuUrl: "/dashboard/empresas",
        icon: Factory,
      },
      {
        id: "sites",
        nome: "Sites",
        descricao: "Cadastrar instalações (Subestações, Usinas, COS)",
        menuUrl: "/dashboard/sites",
        icon: MapPin,
      },
      {
        id: "stake",
        nome: "Equipe & Stakeholders",
        descricao: "Cadastrar membros da equipe e stakeholders do projeto",
        menuUrl: "/dashboard/equipe",
        icon: Users,
      },
    ],
  },
  {
    id: "discovery",
    numero: 0,
    nome: "Discovery & AS-IS",
    descricao: "Coletar e normalizar processos operacionais",
    cor: "bg-amber-500",
    atividades: [
      {
        id: "desc",
        nome: "Coleta de Processos",
        descricao: "Preencher descrições textuais de processos operacionais",
        menuUrl: "/dashboard/processos/novo",
        icon: FileText,
      },
      {
        id: "proc",
        nome: "Processar com IA",
        descricao: "Normalizar processos com Vertex AI (BPMN + Mermaid)",
        menuUrl: "/dashboard/processos",
        icon: Workflow,
      },
      {
        id: "cat",
        nome: "Catálogo",
        descricao: "Revisar e aprovar processos normalizados",
        menuUrl: "/dashboard/catalogo",
        icon: CheckSquare,
      },
    ],
  },
  {
    id: "assessment",
    numero: 1,
    nome: "Assessment",
    descricao: "Análise de conformidade e maturidade",
    cor: "bg-violet-500",
    atividades: [
      {
        id: "conf",
        nome: "Matriz de Conformidade",
        descricao: "Verificar conformidade com ONS RO-CB.BR.01 e ANEEL 964/21",
        menuUrl: "#", // Futuro
        icon: CheckSquare,
      },
      {
        id: "mat",
        nome: "Assessment de Maturidade",
        descricao: "Avaliar maturidade (CIS Controls, IEC 62443)",
        menuUrl: "#", // Futuro
        icon: BarChart3,
      },
    ],
  },
  {
    id: "plano-diretor",
    numero: 2,
    nome: "Plano Diretor",
    descricao: "Roadmap de iniciativas priorizadas",
    cor: "bg-pink-500",
    atividades: [
      {
        id: "init",
        nome: "Backlog de Iniciativas",
        descricao: "Criar e priorizar iniciativas de melhoria",
        menuUrl: "#", // Futuro
        icon: Target,
      },
      {
        id: "road",
        nome: "Roadmap",
        descricao: "Visualizar roadmap e estimativas de investimento",
        menuUrl: "#", // Futuro
        icon: BarChart3,
      },
    ],
  },
  {
    id: "pmo",
    numero: 3,
    nome: "PMO & Execução",
    descricao: "Acompanhamento de execução",
    cor: "bg-green-500",
    atividades: [
      {
        id: "dash-pmo",
        nome: "Dashboard PMO",
        descricao: "Acompanhar KPIs, progresso e alertas",
        menuUrl: "#", // Futuro
        icon: BarChart3,
      },
      {
        id: "tasks",
        nome: "Gestão de Tarefas",
        descricao: "Gerenciar tarefas e dependências",
        menuUrl: "#", // Futuro
        icon: CheckSquare,
      },
    ],
  },
];

interface ProjectPhaseActivitiesProps {
  faseAtual?: string;
  projetoId?: string;
}

export function ProjectPhaseActivities({ faseAtual = "discovery", projetoId }: ProjectPhaseActivitiesProps) {
  // Mapear fase_atual do banco para ID da fase
  const faseMap: Record<string, string> = {
    "onboarding": "onboarding",
    "discovery": "discovery",
    "assessment": "assessment",
    "plano-diretor": "plano-diretor",
    "pmo": "pmo",
  };

  const faseAtualId = faseMap[faseAtual] || "discovery";
  const faseAtualIndex = FASES_DETALHADAS.findIndex(f => f.id === faseAtualId);

  return (
    <div className="space-y-6">
      {FASES_DETALHADAS.map((fase, index) => {
        const isFaseAtual = fase.id === faseAtualId;
        const isFaseConcluida = index < faseAtualIndex;
        const isFaseFutura = index > faseAtualIndex;

        return (
          <Card
            key={fase.id}
            className={cn(
              "transition-all",
              isFaseAtual && "ring-2 ring-amber-500 shadow-lg",
              isFaseConcluida && "opacity-75"
            )}
          >
            <CardHeader className={cn(
              "border-b",
              isFaseAtual && "bg-amber-50 dark:bg-amber-950/30"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full", fase.cor)} />
                  <div>
                    <CardTitle className="text-lg">
                      Fase {fase.numero}: {fase.nome}
                    </CardTitle>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      {fase.descricao}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={isFaseAtual ? "default" : isFaseConcluida ? "outline" : "secondary"}
                  className={cn(
                    isFaseAtual && "bg-amber-500"
                  )}
                >
                  {isFaseConcluida && "✓ Concluída"}
                  {isFaseAtual && "⚡ Atual"}
                  {isFaseFutura && "Planejada"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fase.atividades.map((atividade) => {
                  const Icon = atividade.icon;
                  const isDisponivel = atividade.menuUrl !== "#";

                  return (
                    <div
                      key={atividade.id}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-lg border",
                        isDisponivel
                          ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow"
                          : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 opacity-60"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg",
                        isDisponivel ? "bg-zinc-100 dark:bg-zinc-800" : "bg-zinc-200 dark:bg-zinc-700"
                      )}>
                        <Icon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-black dark:text-zinc-50">
                          {atividade.nome}
                        </h4>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                          {atividade.descricao}
                        </p>
                        {isDisponivel ? (
                          <Button
                            asChild
                            variant="link"
                            size="sm"
                            className="px-0 h-auto mt-2"
                          >
                            <Link href={atividade.menuUrl}>
                              Acessar <ChevronRight className="h-3 w-3 ml-1" />
                            </Link>
                          </Button>
                        ) : (
                          <Badge variant="outline" className="mt-2 text-xs">
                            Em breve
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
