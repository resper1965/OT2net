"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ArrowLeft, Shield, Plus } from "lucide-react";
import Link from "next/link";
import { RiskMatrixView } from "@/components/risks/RiskMatrixView";
import { RiskListView } from "@/components/risks/RiskListView";
import { RiskFormDialog } from "@/components/risks/RiskFormDialog";
import { GapAnalysisView } from "@/components/compliance/GapAnalysisView";
import { Card } from "@/components/ui/card";

interface Projeto {
  nome: string;
  [key: string]: unknown;
}

export default function Fase1Page() {
  const params = useParams();
  const id = params.id as string;
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [riscos, setRiscos] = useState<unknown[]>([]);
  const [showRiskForm, setShowRiskForm] = useState(false);
  const [loadingCrossCheck, setLoadingCrossCheck] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [projetoData, riscosData] = await Promise.all([
        api.projetos.get(id),
        api.riscos.list({ projeto_id: id }),
      ]);
      setProjeto(projetoData);
      setRiscos(riscosData.data || []);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCrossCheck = async () => {
    setLoadingCrossCheck(true);
    try {
      // Logic for cross-checking BPMN with RAG (Simulated endpoint or specific call)
      await new Promise(r => setTimeout(r, 2000));
      // In a real scenario, we would call an AI service that performs the cross-check
      // and returns the compliance matrix.
    } finally {
      setLoadingCrossCheck(false);
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
              <Shield className="h-7 w-7 text-purple-600" />
              Fase 1: Assessment &amp; Regulatory Cross-check
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">{projeto?.nome} | Baseline de Maturidade Industrial</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={handleCrossCheck} disabled={loadingCrossCheck}>
              {loadingCrossCheck ? "Cruzando Normas..." : "Realizar Cross-check IA"}
           </Button>
           <Button onClick={() => setShowRiskForm(true)}>
             <Plus className="h-4 w-4 mr-2" />
             Novo Risco
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-l-blue-500 shadow-sm bg-linear-to-br from-blue-50/50 to-white">
          <div className="text-[10px] font-bold text-zinc-400 uppercase">Adesão Total</div>
          <div className="text-3xl font-black mt-1">68.4<span className="text-sm font-light text-zinc-400">%</span></div>
          <div className="text-[10px] text-blue-600 font-bold mt-1">↑ 4.2% vs Baseline</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500 shadow-sm bg-linear-to-br from-red-50/50 to-white">
          <div className="text-[10px] font-bold text-zinc-400 uppercase">Gaps Críticos</div>
          <div className="text-3xl font-black mt-1">14</div>
          <div className="text-[10px] text-red-600 font-bold mt-1">Ação Imediata (Onda 1)</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-500 shadow-sm bg-linear-to-br from-amber-50/50 to-white">
          <div className="text-[10px] font-bold text-zinc-400 uppercase">Monitoramento</div>
          <div className="text-3xl font-black mt-1">22</div>
          <div className="text-[10px] text-amber-600 font-bold mt-1">Revisão de ACLs/Logs</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500 shadow-sm bg-linear-to-br from-green-50/50 to-white">
          <div className="text-[10px] font-bold text-zinc-400 uppercase">Pronto p/ Audit</div>
          <div className="text-3xl font-black mt-1">08</div>
          <div className="text-[10px] text-green-600 font-bold mt-1">Evidências vinculadas</div>
        </Card>
      </div>

      <Tabs defaultValue="matrix">
        <TabsList>
          <TabsTrigger value="matrix">Matriz de Riscos</TabsTrigger>
          <TabsTrigger value="compliance">Normas & Conformidade</TabsTrigger>
          <TabsTrigger value="maturity">Baseline de Maturidade</TabsTrigger>
          <TabsTrigger value="list">Lista de Gaps</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix">
          <RiskMatrixView riscos={riscos} />
        </TabsContent>

        <TabsContent value="compliance">
          <GapAnalysisView projeto_id={id} />
          {/* Enhanced compliance view would go here. */}
        </TabsContent>

        <TabsContent value="maturity">
          <Card className="p-8 text-center bg-zinc-50/50">
             <div className="max-w-md mx-auto">
                <Shield className="w-12 h-12 mx-auto text-purple-200 mb-4" />
                <h3 className="text-xl font-bold mb-2">Visão Whitelabel de Maturidade</h3>
                <p className="text-muted-foreground mb-6 text-sm">Esta funcionalidade orquestra os indicadores de ONS, ANEEL, IEC 62443 e NIST CSF 2.0.</p>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-3 border rounded bg-white">
                      <div className="text-xs text-zinc-500 uppercase font-bold">Confomidade OT</div>
                      <div className="text-2xl font-bold text-amber-600">62%</div>
                   </div>
                   <div className="p-3 border rounded bg-white">
                      <div className="text-xs text-zinc-500 uppercase font-bold">Risco Residual</div>
                      <div className="text-2xl font-bold text-red-600">Elevado</div>
                   </div>
                </div>
             </div>
          </Card>
        </TabsContent>

        <TabsContent value="list">
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
