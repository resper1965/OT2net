"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ArrowLeft, LineChart, Plus } from "lucide-react";
import Link from "next/link";
import { KPIDashboard } from "@/components/kpis/KPIDashboard";

export default function Fase3Page() {
  const params = useParams();
  const id = params.id as string;
  const [projeto, setProjeto] = useState<any>(null);

  useEffect(() => {
    api.projetos.get(id).then(setProjeto);
  }, [id]);

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
              <LineChart className="h-8 w-8 text-green-600" />
              Fase 3: PMO &amp; Tracking
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">{projeto?.nome}</p>
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo KPI
        </Button>
      </div>

      <Tabs defaultValue="kpis">
        <TabsList>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
          <TabsTrigger value="progress">Progresso</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="kpis">
          <KPIDashboard projeto_id={id} />
        </TabsContent>

        <TabsContent value="progress">
          <Card className="p-6">
            <div className="text-center text-zinc-500 py-8">
              Timeline de progresso em desenvolvimento
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="p-6">
            <div className="text-center text-zinc-500 py-8">
              Sistema de relatórios exportáveis em desenvolvimento
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
