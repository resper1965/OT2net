"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Target, Plus } from "lucide-react";
import Link from "next/link";

export default function Fase2Page() {
  const params = useParams();
  const id = params.id as string;
  const [projeto, setProjeto] = useState<any>(null);
  const [iniciativas, setIniciativas] = useState<any[]>([]);

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
        <Button>
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
                <div key={ini.id} className="p-4 border rounded">
                  <h3 className="font-semibold">{ini.nome}</h3>
                  <p className="text-sm text-zinc-600">{ini.status}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap">
          <Card className="p-6">Roadmap em desenvolvimento</Card>
        </TabsContent>

        <TabsContent value="budget">
          <Card className="p-6">Dashboard de orçamento</Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
