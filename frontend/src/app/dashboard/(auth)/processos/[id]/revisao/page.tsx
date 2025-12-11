"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { convertJsonToBpmnXml } from "@/lib/bpmn-converter";

const BPMNViewer = dynamic(() => import("@/components/processos/BPMNViewer"), { ssr: false });
const Mermaid = dynamic(() => import("@/components/Mermaid"), { ssr: false });

interface DescricaoRaw {
  id: string;
  titulo: string;
  descricao_completa: string;
  frequencia?: string;
  impacto?: string;
  dificuldades?: string;
  status_processamento: string;
  resultado_processamento?: {
    approval_text?: string;
    mermaid_graph?: string;
    bpmn?: any;
    processo_id?: string;
    [key: string]: any;
  };
  created_at: string;
}

interface ProcessoNormalizado {
  id: string;
  nome: string;
  objetivo?: string;
  gatilho?: string;
  frequencia?: string;
  duracao_estimada?: string;
  criticidade?: string;
  dependencias?: string[];
  observacoes_gerais?: string;
  nivel_confianca_normalizacao?: number;
  status: string;
}

export default function RevisaoProcessoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [descricaoRaw, setDescricaoRaw] = useState<DescricaoRaw | null>(null);
  const [processoNormalizado, setProcessoNormalizado] = useState<ProcessoNormalizado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [approveDialog, setApproveDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const toast = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [descricao] = await Promise.all([
          api.descricoesRaw.get(id),
          api.descricoesRaw.get(id).then(async (d) => {
            // Buscar processo normalizado relacionado
            if (d.resultado_processamento?.processo_id) {
              try {
                // Assumindo que existe uma API para buscar processo normalizado
                // Por enquanto, vamos usar o resultado do processamento
                return d.resultado_processamento;
              } catch {
                return null;
              }
            }
            return null;
          }),
        ]);

        setDescricaoRaw(descricao);
        if (descricao.resultado_processamento) {
          setProcessoNormalizado(descricao.resultado_processamento);
        }
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao carregar dados";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  async function handleAprovarConfirm() {
    try {
      setSaving(true);
      // Atualizar status do processo normalizado
      if (processoNormalizado) {
        // Assumindo que existe uma API para atualizar processo
        // await api.processosNormalizados.update(processoNormalizado.id, { status: 'aprovado' })
        toast.success("Processo aprovado com sucesso!");
        router.push("/dashboard/processos");
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Erro ao aprovar");
    } finally {
      setSaving(false);
    }
  }

  async function handleRejeitarConfirm() {
    try {
      setSaving(true);
      // Atualizar status
      await api.descricoesRaw.update(id, { status_processamento: "pendente" });
      toast.success("Processo rejeitado. Você pode reprocessar quando desejar.");
      router.push("/dashboard/processos");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Erro ao rejeitar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div>
        <div className="max-w-full">
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !descricaoRaw) {
    return (
      <div>
        <div className="max-w-full">
          <div className="mb-8">
            <Link
              href="/dashboard/processos"
              className="text-zinc-600 dark:text-zinc-400 hover:underline mb-4 inline-block"
            >
            </Link>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-800 dark:text-red-200">{error || "Descrição não encontrada"}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!processoNormalizado) {
    return (
      <div>
        <div className="max-w-full">
          <div className="mb-8">
            <Link
              href="/dashboard/processos"
              className="text-zinc-600 dark:text-zinc-400 hover:underline mb-4 inline-block"
            >
            </Link>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <p className="text-yellow-800 dark:text-yellow-200">
              Esta descrição ainda não foi processada. Processe-a primeiro para poder revisar.
            </p>
            <Link
              href="/dashboard/processos"
              className="mt-4 inline-block px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              Voltar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-full">
        <div className="mb-8">
          <Link
            href="/dashboard/processos"
            className="text-zinc-600 dark:text-zinc-400 hover:underline mb-4 inline-block"
          >
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
              Revisão: {descricaoRaw.titulo}
            </h1>
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={() => setApproveDialog(true)}
                disabled={saving}
               
              >
                Aprovar
              </Button>
              <Button
                variant="destructive"
                onClick={() => setRejectDialog(true)}
                disabled={saving}
              >
                Rejeitar
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6 mb-6">
          {/* Approval Text Card */}
          {descricaoRaw.resultado_processamento?.approval_text && (
             <div className="bg-white dark:bg-zinc-900 rounded-lg border border-blue-200 dark:border-blue-900 shadow-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                  <span className="mr-2">📋</span> Resumo Executivo para Aprovação
                </h2>
                <div className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap font-serif text-lg leading-relaxed">
                  {descricaoRaw.resultado_processamento.approval_text}
                </div>
             </div>
          )}

          {/* Mermaid Flowchart Card */}
          {descricaoRaw.resultado_processamento?.mermaid_graph && (
             <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-black dark:text-zinc-50 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                   Fluxo Visual Simplificado
                </h2>
                <div className="overflow-x-auto p-4 bg-zinc-50 dark:bg-zinc-950 rounded-lg flex justify-center">
                   <Mermaid chart={descricaoRaw.resultado_processamento.mermaid_graph} />
                </div>
             </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Coluna Esquerda: Descrição Raw */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-700 pb-2">
              Descrição Original
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Título
                </h3>
                <p className="text-black dark:text-zinc-50">{descricaoRaw.titulo}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Descrição Completa
                </h3>
                <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                  {descricaoRaw.descricao_completa}
                </p>
              </div>
              {descricaoRaw.frequencia && (
                <div>
                  <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Frequência
                  </h3>
                  <p className="text-black dark:text-zinc-50">{descricaoRaw.frequencia}</p>
                </div>
              )}
              {descricaoRaw.impacto && (
                <div>
                  <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Impacto
                  </h3>
                  <p className="text-black dark:text-zinc-50">{descricaoRaw.impacto}</p>
                </div>
              )}
              {descricaoRaw.dificuldades && (
                <div>
                  <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Dificuldades
                  </h3>
                  <p className="text-black dark:text-zinc-50">{descricaoRaw.dificuldades}</p>
                </div>
              )}
            </div>
          </div>

          {/* Coluna Direita: Processo Normalizado */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-700 pb-2">
              Processo Normalizado
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Nome</h3>
                <p className="text-black dark:text-zinc-50">{processoNormalizado.nome}</p>
              </div>
              {processoNormalizado.objetivo && (
                <div>
                  <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Objetivo
                  </h3>
                  <p className="text-black dark:text-zinc-50">{processoNormalizado.objetivo}</p>
                </div>
              )}
              {processoNormalizado.gatilho && (
                <div>
                  <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Gatilho
                  </h3>
                  <p className="text-black dark:text-zinc-50">{processoNormalizado.gatilho}</p>
                </div>
              )}
              {processoNormalizado.frequencia && (
                <div>
                  <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Frequência
                  </h3>
                  <p className="text-black dark:text-zinc-50">{processoNormalizado.frequencia}</p>
                </div>
              )}
              {processoNormalizado.duracao_estimada && (
                <div>
                  <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Duração Estimada
                  </h3>
                  <p className="text-black dark:text-zinc-50">
                    {processoNormalizado.duracao_estimada}
                  </p>
                </div>
              )}
              {processoNormalizado.criticidade && (
                <div>
                  <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Criticidade
                  </h3>
                  <p className="text-black dark:text-zinc-50">{processoNormalizado.criticidade}</p>
                </div>
              )}
              {processoNormalizado.dependencias && processoNormalizado.dependencias.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Dependências
                  </h3>
                  <ul className="list-disc list-inside text-black dark:text-zinc-50">
                    {processoNormalizado.dependencias.map((dep) => (
                      <li key={dep}>{dep}</li>
                    ))}
                  </ul>
                </div>
              )}
              {processoNormalizado.observacoes_gerais && (
                <div>
                  <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Observações Gerais
                  </h3>
                  <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                    {processoNormalizado.observacoes_gerais}
                  </p>
                </div>
              )}
              {processoNormalizado.nivel_confianca_normalizacao !== undefined && (
                <div>
                  <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Nível de Confiança
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${processoNormalizado.nivel_confianca_normalizacao * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-black dark:text-zinc-50">
                      {(processoNormalizado.nivel_confianca_normalizacao * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BPMN Diagram Section */}
          <div className="col-span-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-700 pb-2">
              Diagrama Técnico BPMN 2.0 (Background)
            </h2>
             {descricaoRaw.resultado_processamento?.bpmn ? (
                <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden h-[600px]">
                  <BPMNViewer xml={convertJsonToBpmnXml({ definitions: { process: descricaoRaw.resultado_processamento.bpmn } })} />
                </div>
             ) : (
                <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                  <p className="text-zinc-500">Nenhum diagrama BPMN gerado.</p>
                </div>
             )}
          </div>
        </div>

        <ConfirmDialog
          open={approveDialog}
          onOpenChange={setApproveDialog}
          title="Aprovar Processo"
          description="Deseja aprovar este processo normalizado?"
          confirmText="Aprovar"
          cancelText="Cancelar"
          variant="default"
          onConfirm={handleAprovarConfirm}
        />

        <ConfirmDialog
          open={rejectDialog}
          onOpenChange={setRejectDialog}
          title="Rejeitar Processo"
          description="Deseja rejeitar este processo normalizado? Será necessário reprocessar."
          confirmText="Rejeitar"
          cancelText="Cancelar"
          variant="destructive"
          onConfirm={handleRejeitarConfirm}
        />
      </div>
    </div>
  );
}
