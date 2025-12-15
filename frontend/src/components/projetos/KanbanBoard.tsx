"use client";

import Link from "next/link";
import { 
  Building2, 
  Search, 
  Shield, 
  Map as MapIcon, 
  Rocket, 
  MoreHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Projeto {
  id: string;
  nome: string;
  descricao?: string;
  fase_atual?: string;
  progresso_geral?: number;
}

const PHASES = [
  { id: "fase-1", label: "Onboarding", icon: Building2, color: "bg-sky-500/10 text-sky-500 border-sky-200 dark:border-sky-800" },
  { id: "fase0", label: "Discovery", icon: Search, color: "bg-amber-500/10 text-amber-500 border-amber-200 dark:border-amber-800" },
  { id: "fase1", label: "Assessment", icon: Shield, color: "bg-violet-500/10 text-violet-500 border-violet-200 dark:border-violet-800" },
  { id: "fase2", label: "Plano Diretor", icon: MapIcon, color: "bg-pink-500/10 text-pink-500 border-pink-200 dark:border-pink-800" },
  { id: "fase3", label: "Execução", icon: Rocket, color: "bg-emerald-500/10 text-emerald-500 border-emerald-200 dark:border-emerald-800" },
];

export function KanbanBoard({ projetos }: { projetos: Projeto[] }) {
  const getProjectsByPhase = (phaseId: string) => {
    return projetos.filter(p => (p.fase_atual || "fase-1") === phaseId);
  };

  return (
    <div className="flex overflow-x-auto pb-4 gap-4 h-[calc(100vh-280px)]">
      {PHASES.map((phase) => {
        const PhaseIcon = phase.icon;
        const phaseProjects = getProjectsByPhase(phase.id);
        
        return (
          <div key={phase.id} className="min-w-[300px] w-[300px] flex flex-col bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className={`p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-inherit rounded-t-xl z-10 font-medium ${phase.color}`}>
              <div className="flex items-center gap-2">
                <PhaseIcon className="w-4 h-4" />
                <span>{phase.label}</span>
              </div>
              <Badge variant="secondary" className="bg-white/50 dark:bg-black/20">
                {phaseProjects.length}
              </Badge>
            </div>
            
            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              {phaseProjects.map((projeto) => (
                <Link key={projeto.id} href={`/dashboard/projetos/${projeto.id}`} className="block group">
                  <Card className="hover:shadow-md transition-shadow dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 cursor-pointer">
                    <CardHeader className="p-4 pb-2 space-y-0">
                      <CardTitle className="text-sm font-semibold leading-tight flex justify-between gap-2">
                        <span className="truncate" title={projeto.nome}>{projeto.nome}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 -mr-2 -mt-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">
                        {projeto.descricao || "Sem descrição"}
                      </p>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-zinc-500">
                          <span>Progresso</span>
                          <span>{projeto.progresso_geral || 0}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${projeto.progresso_geral || 0}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              
              {phaseProjects.length === 0 && (
                <div className="h-24 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 text-xs">
                  Sem projetos
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
