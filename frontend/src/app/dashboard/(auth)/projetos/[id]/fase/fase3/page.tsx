"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Bot, FileText } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function Fase3Page() {
  const params = useParams();
  const id = params.id as string;
  const [projeto, setProjeto] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const data = await api.projetos.get(id);
      setProjeto(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerateEvidence = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 3000));
      toast.success("Relatório de evidências gerado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar evidências.");
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
              <Bot className="h-7 w-7 text-indigo-600" />
              Fase 3: PMO & Monitoramento
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">{projeto?.nome} | Governança Contínua</p>
          </div>
        </div>
        <Button onClick={handleGenerateEvidence} disabled={loading}>
          {loading ? "Gerando..." : "Gerar Evidência p/ Auditoria"}
        </Button>
      </div>

      <Tabs defaultValue="kpis">
        <TabsList>
          <TabsTrigger value="kpis">Dashboard KPIs/KRIs</TabsTrigger>
          <TabsTrigger value="tracking">Execution Tracking</TabsTrigger>
          <TabsTrigger value="tickets">Tickets Internos</TabsTrigger>
          <TabsTrigger value="evidence">Preparação de Evidências</TabsTrigger>
        </TabsList>

        <TabsContent value="kpis">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             {[
               { label: 'Adesão Normativa', value: '78%', status: 'warning', trend: '+4%' },
               { label: 'Gaps Fechados', value: '12/45', status: 'neutral', trend: '3 em validação' },
               { label: 'Riscos Críticos', value: '03', status: 'danger', trend: '-2 vs ontem' },
               { label: 'SLA de Resposta', value: '94%', status: 'success', trend: 'Meta > 90%' }
             ].map((kpi, i) => (
               <Card key={i} className="p-4 shadow-sm hover:shadow-md transition-all border-zinc-100">
                 <div className="flex justify-between items-start">
                    <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-tight">{kpi.label}</div>
                    <span className="text-[9px] font-bold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">{kpi.trend}</span>
                 </div>
                 <div className="text-2xl font-black mt-1 text-zinc-900">{kpi.value}</div>
                 <div className="h-1.5 w-full mt-4 rounded-full bg-zinc-100 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${
                       kpi.status === 'success' ? 'bg-linear-to-r from-green-400 to-green-600 w-[94%]' :
                       kpi.status === 'warning' ? 'bg-linear-to-r from-amber-400 to-amber-600 w-[78%]' :
                       kpi.status === 'danger' ? 'bg-linear-to-r from-red-400 to-red-600 w-[30%]' : 'bg-linear-to-r from-zinc-300 to-zinc-500 w-[26%]'
                    }`} />
                 </div>
               </Card>
             ))}
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="py-12 text-center text-muted-foreground italic border rounded-lg bg-zinc-50/50">
           Integração com ferramentas de Ticketing (Jira/ServiceNow) em desenvolvimento.
        </TabsContent>

        <TabsContent value="tickets">
           <Card className="p-0 overflow-hidden">
              <div className="p-4 border-b bg-zinc-50 flex justify-between items-center">
                 <h3 className="font-bold text-sm">Tickets de Execução Técnica (SLA)</h3>
                 <Button size="sm" variant="outline" className="h-8">Sincronizar Externo</Button>
              </div>
              <div className="divide-y">
                 {[
                   { title: "Instalação de OT-IDS na subestação", status: "Em Progresso", priority: "Alta" },
                   { title: "Revisão de ACLs do Firewall Nível 3", status: "Aberto", priority: "Crítica" },
                   { title: "Backup do Servidor Historian", status: "Validado", priority: "Média" }
                 ].map((ticket, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-zinc-50/50">
                       <div className="flex items-center gap-3">
                          <div className={`w-1.5 h-8 rounded-full ${ticket.priority === 'Crítica' ? 'bg-red-600' : ticket.priority === 'Alta' ? 'bg-amber-500' : 'bg-blue-400'}`} />
                          <div>
                             <div className="text-sm font-medium">{ticket.title}</div>
                             <div className="text-[10px] text-zinc-400">Prioridade: {ticket.priority}</div>
                          </div>
                       </div>
                       <select className="text-[10px] border rounded px-1 py-0.5 bg-white">
                          <option>{ticket.status}</option>
                          <option>Aberto</option>
                          <option>Em Progresso</option>
                          <option>Validado</option>
                       </select>
                    </div>
                 ))}
              </div>
           </Card>
        </TabsContent>

        <TabsContent value="evidence">
          <Card className="p-0 overflow-hidden">
             <div className="p-4 border-b bg-zinc-50 flex justify-between items-center">
                <h3 className="font-bold text-sm">Resumo de Evidências Técnicas</h3>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded uppercase">Pronto para Auditoria</span>
             </div>
             <div className="divide-y">
                {[
                  { doc: "Configuração de Firewall - DMZ OT", status: "Validado", norma: "IEC 62443-3-3" },
                  { doc: "Relatório de Vulnerabilidades Mensal", status: "Pendente", norma: "NIST PR.RA-1" },
                  { doc: "Log de Acesso PAM (Terceiros)", status: "Validado", norma: "ISO 27001 A.9" }
                ].map((item, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-zinc-50/50">
                     <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-zinc-400" />
                        <div>
                          <div className="text-sm font-medium">{item.doc}</div>
                          <div className="text-[10px] text-zinc-400">{item.norma}</div>
                        </div>
                     </div>
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.status === 'Validado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {item.status}
                     </span>
                  </div>
                ))}
             </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
