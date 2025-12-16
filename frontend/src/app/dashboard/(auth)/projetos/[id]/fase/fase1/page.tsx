"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Plus } from "lucide-react";
import Link from "next/link";
import { RiskMatrixView } from "@/components/risks/RiskMatrixView";
import { RiskListView } from "@/components/risks/RiskListView";
import { RiskFormDialog } from "@/components/risks/RiskFormDialog";

export default function Fase1Page() {
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState("matrix");
  const [projeto, setProjeto] = useState<any>(null);
  const [riscos, setRiscos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRiskForm, setShowRiskForm] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [projetoData, riscosData] = await Promise.all([
        api.projetos.get(id),
        api.riscos.list({ projeto_id: id }),
      ]);
      setProjeto(projetoData);
      setRiscos(riscosData.data || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

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
              <Shield className="h-8 w-8 text-purple-600" />
              Fase 1: Assessment & Risk Analysis
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              {projeto?.nome}
            </p>
          </div>
        </div>
        <Button onClick={() => setShowRiskForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Risco
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="matrix">Matriz de Riscos</TabsTrigger>
          <TabsTrigger value="list">Lista de Riscos</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Matriz 5x5</CardTitle>
              <CardDescription>
                Visualização de riscos por probabilidade vs impacto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RiskMatrixView riscos={riscos} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <RiskListView riscos={riscos} onRefresh={loadData} />
        </TabsContent>
      </Tabs>

      {showRiskForm && (
        <RiskFormDialog
          open={showRiskForm}
          onClose={() => setShowRiskForm(false)}
          projeto_id={id}
          onSuccess={() => {
            loadData();
            setShowRiskForm(false);
          }}
        />
      )}
    </div>
  );
}
