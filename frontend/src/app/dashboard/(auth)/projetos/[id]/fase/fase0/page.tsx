"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Mermaid from "@/components/ui/mermaid";
import { Bot, FileText, Code2, Play } from "lucide-react";

export default function Fase0Page() {
  const params = useParams();
  const projectId = params.id as string;
  const { toast } = useToast();
  
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleNormalize() {
    if (!descricao.trim()) {
      toast.error("Por favor, insira uma descrição operacional.");
      return;
    }

    setLoading(true);
    try {
      const data = await api.ai.normalizar(descricao);
      setResult(data);
      toast.success("Processo normalizado com sucesso!");
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
          <h1 className="text-2xl font-bold tracking-tight">Fase 0: Discovery & AS-IS</h1>
          <p className="text-muted-foreground">Coleta e normalização de processos operacionais com IA.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        {/* Input Column */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Descrição Operacional
            </CardTitle>
            <CardDescription>
              Cole aqui a transcrição da entrevista ou descrição bruta do processo.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            <Textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: O operador recebe a solicitação via email, verifica no sistema SAP se o cliente está ativo. Se estiver, ele cria a ordem de serviço..."
              className="flex-1 resize-none p-4 font-mono text-sm leading-relaxed"
            />
            <Button 
              onClick={handleNormalize} 
              disabled={loading || !descricao.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            >
              {loading ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  Processando com Gemini AI...
                </>
              ) : (
                <>
                  <Bot className="mr-2 h-4 w-4" />
                  Normalizar Processo
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Column */}
        <Card className="flex flex-col overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-purple-500" />
              Resultado (BPMN/Flow)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            {result ? (
              <Tabs defaultValue="diagram" className="h-full flex flex-col">
                <div className="px-6 border-b border-zinc-200 dark:border-zinc-800">
                  <TabsList className="bg-transparent">
                    <TabsTrigger value="diagram">Diagrama</TabsTrigger>
                    <TabsTrigger value="details">Detalhes</TabsTrigger>
                    <TabsTrigger value="json">JSON</TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-auto bg-white dark:bg-zinc-950 p-6">
                  <TabsContent value="diagram" className="m-0 h-full w-full flex items-center justify-center">
                    {result.mermaid_code ? (
                      <div className="w-full bg-white p-4 rounded-lg shadow-sm border overflow-x-auto">
                        <Mermaid chart={result.mermaid_code} />
                      </div>
                    ) : (
                      <div className="text-muted-foreground italic">Diagrama não disponível</div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="details" className="m-0 space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{result.titulo}</h3>
                      <p className="text-muted-foreground mb-4">{result.resumo}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-zinc-500 uppercase">Atores</h4>
                        <ul className="list-disc list-inside text-sm">
                          {result.atores?.map((ator: string, i: number) => (
                            <li key={i}>{ator}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-zinc-500 uppercase">Riscos</h4>
                        <ul className="list-disc list-inside text-sm text-amber-600 dark:text-amber-400">
                          {result.riscos_identificados?.map((risco: string, i: number) => (
                            <li key={i}>{risco}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4">
                      <h4 className="text-sm font-medium text-zinc-500 uppercase">Passos</h4>
                      <div className="space-y-2">
                        {result.passos?.map((passo: any, i: number) => (
                          <div key={i} className="flex gap-3 text-sm border p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800">
                            <span className="font-mono text-xs text-zinc-400 w-6 pt-1">#{passo.ordem}</span>
                            <div className="flex-1">
                              <p className="text-zinc-800 dark:text-zinc-200">{passo.acao}</p>
                              {passo.responsavel && (
                                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  {passo.responsavel}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="json" className="m-0">
                    <pre className="text-xs bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg overflow-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </TabsContent>
                </div>
              </Tabs>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-zinc-50/50 dark:bg-zinc-900/50">
                <Bot className="w-12 h-12 mb-4 opacity-20" />
                <p>O resultado do processamento aparecerá aqui.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
