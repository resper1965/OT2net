"use client";

import { useState } from "react";

import { api } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Mermaid from "@/components/ui/mermaid";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bot, FileText, Code2 } from "lucide-react";

interface NormalizationResult {
  approval_text?: string;
  mermaid_graph?: string;
  comparacao_teorica?: string;
  fluxo_referencia?: string;
  gaps_conformidade?: Array<{
    etapa: string;
    referencia: string;
    norma: string;
    severidade: 'baixa' | 'media' | 'alta';
  }>;
  dribles_identificados?: Array<{
    descricao: string;
    motivo: string;
    risco_operacional: string;
  }>;
  processo: {
    nome: string;
    objetivo: string;
    gatilho: string;
    frequencia: string;
    criticidade: string;
  };
  etapas: { 
    ordem: number; 
    nome: string;
    ator: string;
    descricao: string;
    tipo_bpmn: string;
    is_workaround: boolean;
    raci: { R: string; A: string; C: string; I: string; };
  }[];
}

export default function Fase0Page() {
  const toast = useToast();
  
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NormalizationResult | null>(null);

  async function handleNormalize() {
    if (!descricao.trim()) {
      toast.error("Por favor, insira uma descrição operacional.");
      return;
    }

    setLoading(true);
    try {
      const data = await api.ai.normalizeProcess({ titulo: "Processo OT", descricao_completa: descricao });
      setResult(data);
      toast.success("Processo normalizado com visão AS-IS vs To-Be!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao processar com IA.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fase 0: Módulo de Descoberta (Ingestão)</h1>
          <p className="text-muted-foreground">Shadowing e Entrevistas: Tradução da realidade de campo para BPMN 2.0.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        {/* Input Column */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Realidade de Campo (Shadowing)
            </CardTitle>
            <CardDescription>
              Insira scripts de entrevistas ou observações diretas da operação.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            <Textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o que acontece no campo, incluindo os improvisos necessários..."
              className="flex-1 resize-none p-4 font-mono text-sm leading-relaxed"
            />
            <Button 
              onClick={handleNormalize} 
              disabled={loading || !descricao.trim()}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            >
              {loading ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  IA Mapeando Jornada Real...
                </>
              ) : (
                <>
                  <Bot className="mr-2 h-4 w-4" />
                  Mapear Processo AS-IS
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Column */}
        <Card className="flex flex-col overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/50 border-blue-100 dark:border-blue-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-purple-500" />
              Análise de Realidade vs Teoria
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
            {result ? (
              <Tabs defaultValue="diagram" className="flex-1 flex flex-col">
                <div className="px-6 border-b border-zinc-200 dark:border-zinc-800">
                  <TabsList className="bg-transparent">
                    <TabsTrigger value="diagram">Jornada Real</TabsTrigger>
                    <TabsTrigger value="reference">Fluxo de Referência</TabsTrigger>
                    <TabsTrigger value="comparison">AS-IS vs To-Be</TabsTrigger>
                    <TabsTrigger value="dribbles">&quot;Dribles&quot; de Campo</TabsTrigger>
                    <TabsTrigger value="raci">Matriz RACI</TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-auto bg-white dark:bg-zinc-950 p-6">
                  <TabsContent value="diagram" className="m-0">
                    <div className="bg-white dark:bg-zinc-950 rounded-lg border p-6 min-h-[400px]">
                      {result.mermaid_graph ? (
                        <Mermaid chart={result.mermaid_graph} />
                      ) : (
                        <div className="text-muted-foreground italic text-center py-12">Diagrama não disponível</div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="reference" className="m-0">
                    <div className="bg-white dark:bg-zinc-950 rounded-lg border p-6 min-h-[400px]">
                      {result.fluxo_referencia ? (
                        <Mermaid chart={result.fluxo_referencia} />
                      ) : (
                        <div className="text-center py-12 text-zinc-500 italic">Fluxo de referência não gerado.</div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="comparison" className="m-0 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <div className="text-[10px] font-bold uppercase text-zinc-400 px-1">Versão Mapeada (AS-IS)</div>
                         <div className="bg-white dark:bg-zinc-950 rounded-lg border p-4 h-[300px] overflow-auto">
                            <Mermaid chart={result.mermaid_graph || ""} />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <div className="text-[10px] font-bold uppercase text-zinc-400 px-1">Versão de Referência (To-Be)</div>
                         <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-dashed p-4 h-[300px] overflow-auto">
                            <Mermaid chart={result.fluxo_referencia || ""} />
                         </div>
                      </div>
                    </div>

                    <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                      <h4 className="font-bold text-sm text-indigo-900 dark:text-indigo-100 mb-2 flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        Parecer da IA sobre a Realidade vs Teoria
                      </h4>
                      <p className="text-sm leading-relaxed text-indigo-800 dark:text-indigo-200">{result.comparacao_teorica}</p>
                    </div>

                    {result.gaps_conformidade && result.gaps_conformidade.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-bold text-sm px-1 flex items-center justify-between">
                          Gaps de Conformidade Identificados
                          <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{result.gaps_conformidade.length} CRÍTICOS</span>
                        </h4>
                        <div className="grid gap-3">
                          {result.gaps_conformidade.map((gap, i) => (
                            <div key={i} className="p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                              <div className="flex gap-4 items-center">
                                <div className={`w-1 h-12 rounded-full ${
                                   gap.severidade === 'alta' ? 'bg-red-500' : 
                                   gap.severidade === 'media' ? 'bg-amber-500' : 'bg-green-500'
                                }`} />
                                <div>
                                  <div className="text-sm font-bold group-hover:text-blue-600 transition-colors">{gap.etapa}</div>
                                  <div className="text-xs text-zinc-500 mt-1">
                                    <span className="font-medium text-zinc-700">Referência:</span> {gap.referencia}
                                  </div>
                                  <div className="text-[10px] mt-1 inline-block px-1.5 py-0.5 bg-zinc-100 rounded text-zinc-600 font-mono">
                                    {gap.norma}
                                  </div>
                                </div>
                              </div>
                              <div className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                gap.severidade === 'alta' ? 'bg-red-100 text-red-700 border border-red-200' : 
                                gap.severidade === 'media' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-green-100 text-green-700 border border-green-200'
                              }`}>
                                {gap.severidade}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="dribbles" className="m-0 space-y-4">
                     <div className="space-y-4">
                        {result.dribles_identificados?.map((drible, i) => (
                           <div key={i} className="p-4 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20 rounded-r-lg">
                              <h4 className="font-bold text-amber-800 dark:text-amber-300">{drible.descricao}</h4>
                              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1"><strong>Motivo:</strong> {drible.motivo}</p>
                              <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">⚠️ Risco: {drible.risco_operacional}</p>
                           </div>
                        ))}
                        {(!result.dribles_identificados || result.dribles_identificados.length === 0) && (
                           <div className="text-center py-12 text-zinc-500 italic">Nenhum &quot;drible&quot; identificado no processo descrito.</div>
                        )}
                     </div>
                  </TabsContent>

                  <TabsContent value="raci" className="m-0">
                     <Table>
                        <TableHeader>
                           <TableRow>
                              <TableHead>Etapa</TableHead>
                              <TableHead>Ator</TableHead>
                              <TableHead>RACI</TableHead>
                              <TableHead>Status</TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {result.etapas.map((step, i) => (
                              <TableRow key={i} className={step.is_workaround ? "bg-amber-50/50" : ""}>
                                 <TableCell className="font-medium">
                                    <div className="text-[10px] text-zinc-400 uppercase">{step.tipo_bpmn}</div>
                                    {step.nome}
                                 </TableCell>
                                 <TableCell>{step.ator}</TableCell>
                                 <TableCell>
                                    <div className="flex gap-1">
                                       {Object.entries(step.raci).map(([key, val]) => (
                                          <span key={key} title={val as string} className="w-5 h-5 flex items-center justify-center text-[10px] font-bold border rounded bg-zinc-100">
                                             {key}
                                          </span>
                                       ))}
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                    {step.is_workaround ? 
                                       <span className="text-[10px] px-2 py-0.5 bg-amber-200 text-amber-800 rounded-full font-bold">DRIBLE</span> : 
                                       <span className="text-[10px] px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-full">PADRÃO</span>
                                    }
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </TabsContent>
                </div>
              </Tabs>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-zinc-50/50 dark:bg-zinc-900/50">
                <Bot className="w-12 h-12 mb-4 opacity-20" />
                <p className="max-w-[200px]">Aguardando ingestão de dados para iniciar o mapeamento agnóstico.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

