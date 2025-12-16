"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Target, Plus } from "lucide-react";
import Link from "next/link";
import { InitiativeFormDialog } from "@/components/initiatives/InitiativeFormDialog";
import { RoadmapTimeline } from "@/components/initiatives/RoadmapTimeline";
import { BudgetDashboard } from "@/components/initiatives/BudgetDashboard";

export default function Fase2Page() {
  const params = useParams();
  const id = params.id as string;
  const [projeto, setProjeto] = useState<any>(null);
  const [iniciativas, setIniciativas] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [projetoData, iniciativasData] = await Promise.all([
        api.projetos.get(id),
        api.iniciativas.list({ projeto_id: id }),
      ]);
      setProjeto(projetoData);
      setIniciativas(iniciativasData.data || []);
    } catch (error) {
      console.error(error);
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
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Target className="h-8 w-8 text-blue-600" />
              Fase 2: Plano Diretor
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">{projeto?.nome}</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Iniciativa
        </Button>
      </div>

      <Tabs defaultValue="initiatives">
        <TabsList>
          <TabsTrigger value="initiatives">Iniciativas</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="budget">Orçamento</TabsTrigger>
        </TabsList>

        <TabsContent value="initiatives">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {iniciativas.map((ini) => (
                <div key={ini.id} className="p-4 border rounded hover:border-blue-500 cursor-pointer">
                  <h3 className="font-semibold mb-2">{ini.nome}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">{ini.status}</span>
                    <span className="font-medium text-blue-600">{ini.prioridade}</span>
                  </div>
                </div>
              ))}
              {iniciativas.length === 0 && (
                <div className="col-span-3 text-center text-zinc-500 py-8">
                  Nenhuma iniciativa cadastrada
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap">
          <RoadmapTimeline iniciativas={iniciativas} />
        </TabsContent>

        <TabsContent value="budget">
          <BudgetDashboard iniciativas={iniciativas} />
        </TabsContent>
      </Tabs>

      <InitiativeFormDialog
        open={showForm}
        onClose={() => setShowForm(false)}
        projeto_id={id}
        onSuccess={() => {
          setShowForm(false);
          loadData();
        }}
      />
    </div>
  );
}
