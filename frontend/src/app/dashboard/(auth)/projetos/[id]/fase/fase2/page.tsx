"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Target } from "lucide-react";
import Link from "next/link";
import { RoadmapTimeline } from "@/components/initiatives/RoadmapTimeline";
import { toast } from "sonner";

export default function Fase2Page() {
  const params = useParams();
  const id = params.id as string;
  const [projeto, setProjeto] = useState<{ nome: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [plano, setPlano] = useState<{ iniciativas: {id: string, nome: string, objetivo: string, onda: number, prioridade: string, status: string, data_inicio?: string, data_fim_prevista?: string, tecnologias_sugeridas?: string[]}[], resumo_executivo: string } | null>(null);

  const loadData = useCallback(async () => {
    try {
      const projetoData = await api.projetos.get(id);
      setProjeto(projetoData as any);
      
      // Load existing initiatives if any
      const iniData = await api.iniciativas.list({ projeto_id: id });
      if (iniData.data?.length > 0) {
        setPlano({ iniciativas: iniData.data, resumo_executivo: "Plano diretor baseado em dados históricos." });
      }
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleGenerateRoadmap = async () => {
    setLoading(true);
    try {
      // In a real scenario, we'd fetch gaps from Phase 1 and send to StrategyEngine
      // For now, let's simulate the API call to generate intelligence
      await new Promise(r => setTimeout(r, 2500));
      toast.success("Roadmap estratégico gerado com IA!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/projetos/${id}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Target className="h-7 w-7 text-blue-600" />
              Fase 2: Planejador Diretor (Roadmap)
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">{projeto?.nome} | Estratégia de Mitigação &amp; Tecnologia</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={handleGenerateRoadmap} disabled={loading}>
              {loading ? "Processando IA..." : "Gerar Estratégia IA"}
           </Button>
           <Button>
             <Plus className="h-4 w-4 mr-2" />
             Nova Iniciativa
           </Button>
        </div>
      </div>

      {plano?.resumo_executivo && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
           <p className="text-sm font-medium text-blue-800 italic">“{plano.resumo_executivo}”</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
         <Card className="p-4 bg-linear-to-br from-red-50 to-white border-red-100 shadow-sm">
            <div className="text-[10px] font-bold text-red-600 uppercase">Impacto Imediato</div>
            <div className="text-2xl font-black text-red-900 mt-1">Onda 1</div>
            <p className="text-[11px] text-red-700 mt-1">Críticos & Quick-Wins</p>
         </Card>
         <Card className="p-4 bg-linear-to-br from-amber-50 to-white border-amber-100 shadow-sm">
            <div className="text-[10px] font-bold text-amber-600 uppercase">Fortalecimento</div>
            <div className="text-2xl font-black text-amber-900 mt-1">Onda 2</div>
            <p className="text-[11px] text-amber-700 mt-1">Infraestrutura & Redes</p>
         </Card>
         <Card className="p-4 bg-linear-to-br from-blue-50 to-white border-blue-100 shadow-sm">
            <div className="text-[10px] font-bold text-blue-600 uppercase">Otimização</div>
            <div className="text-2xl font-black text-blue-900 mt-1">Onda 3</div>
            <p className="text-[11px] text-blue-700 mt-1">Automação & Resiliência</p>
         </Card>
      </div>

      <Tabs defaultValue="initiatives">
        <TabsList>
          <TabsTrigger value="initiatives">Iniciativas Sugeridas</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap por Ondas</TabsTrigger>
          <TabsTrigger value="tech">Tecnologias OT</TabsTrigger>
        </TabsList>

        <TabsContent value="initiatives">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plano?.iniciativas?.map((ini, i) => (
              <Card key={i} className="p-4 hover:border-blue-500 transition-all hover:shadow-md">
                 <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${ini.onda === 1 ? 'bg-red-500' : 'bg-blue-500'}`} />
                       <h3 className="font-bold text-sm">{ini.nome}</h3>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 px-2 text-[10px] bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                      onClick={() => {
                        toast.success(`Ticket criado: ${ini.nome}`);
                      }}
                    >
                      Criar Ticket
                    </Button>
                 </div>
                 <p className="text-xs text-zinc-500 line-clamp-2 mb-3">{ini.objetivo}</p>
                 <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                   <span className="px-2 py-0.5 bg-zinc-100 rounded">Onda {ini.onda}</span>
                   <span className="text-blue-600">{ini.prioridade}</span>
                 </div>
              </Card>
            ))}
            {!plano && (
              <div className="col-span-3 text-center py-20 bg-zinc-50/50 border border-dashed rounded-lg">
                 <Target className="w-12 h-12 mx-auto text-zinc-300 mb-4 opacity-20" />
                 <p className="text-muted-foreground">Clique em &quot;Gerar Estratégia IA&quot; para orquestrar as iniciativas.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="roadmap">
          <RoadmapTimeline iniciativas={plano?.iniciativas || []} />
        </TabsContent>

        <TabsContent value="tech">
           <Card className="p-6">
              <h3 className="font-bold mb-4">Stack Tecnológica Recomendada</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {plano?.iniciativas?.flatMap(i => i.tecnologias_sugeridas || []).map((tech, i) => (
                    <div key={i} className="p-3 border rounded bg-zinc-50 flex items-center justify-between">
                       <span className="text-sm font-medium">{tech}</span>
                       <Button size="sm" variant="ghost" className="text-[10px] h-7">Especificação</Button>
                    </div>
                 ))}
              </div>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
