"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { ProjectPhaseTimeline } from "@/components/projetos/ProjectPhaseTimeline";
import { PhaseChecklist } from "@/components/projetos/PhaseChecklist";
import { LoadingState } from "@/components/ui/loading-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePageTitle } from "@/contexts/PageTitleContext";

interface Projeto {
  id: string;
  nome: string;
  descricao?: string;
  fase_atual?: string;
  progresso_geral?: number;
  organizacao_id?: string;
  created_at: string;
  updated_at: string;
}

interface FaseEtapa {
  id: string;
  nome: string;
  descricao: string;
  ordem: number;
  obrigatoria: boolean;
}

interface EtapaCompletada {
  id: string;
  fase_etapa_id: string;
  completada_em: string;
  completada_por?: string;
  observacoes?: string;
  etapa?: FaseEtapa;
}

interface Fase {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  ordem: number;
  cor: string;
  icone?: string;
  etapas: FaseEtapa[];
  status: string;
  progresso: number;
  etapas_completadas: EtapaCompletada[];
}

export default function ProjetoDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [fases, setFases] = useState<Fase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedFaseIndex, setSelectedFaseIndex] = useState(0);
  const toast = useToast();
  const { setTitle } = usePageTitle();

  useEffect(() => {
    if (projeto) {
      setTitle(projeto.nome);
    }
  }, [projeto, setTitle]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [projetoData, fasesData] = await Promise.all([
          api.projetos.get(id),
          fetch(`/api/projetos/${id}/fases`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }).then((res) => res.json()),
        ]);

        setProjeto(projetoData);
        setFases(Array.isArray(fasesData) ? fasesData : []);

        // Auto-select active phase
        const activeIndex = fasesData.findIndex(
          (f: Fase) => f.status === "em_andamento"
        );
        if (activeIndex !== -1) {
          setSelectedFaseIndex(activeIndex);
        }

        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao carregar dados";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  async function handleDeleteConfirm() {
    try {
      await api.projetos.delete(id);
      toast.success("Projeto excluído com sucesso");
      router.push("/dashboard/projetos");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Erro ao excluir projeto");
    }
  }

  async function generateReport() {
    try {
      const result = await api.relatorios.generateOnboarding(id);
      if (result.url) {
        window.open(result.url, "_blank");
        toast.success("Relatório gerado com sucesso");
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Erro ao gerar relatório");
    }
  }

  async function handleToggleEtapa(
    faseId: string,
    etapaId: string,
    observacoes?: string
  ) {
    try {
      const fase = fases.find((f) => f.id === faseId);
      if (!fase) return;

      const isCompleted = fase.etapas_completadas.some(
        (ec) => ec.fase_etapa_id === etapaId
      );

      if (isCompleted) {
        // Desmarcar
        await fetch(`/api/projetos/${id}/fases/${faseId}/etapas/${etapaId}/completar`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });
        toast.success("Etapa desmarcada");
      } else {
        // Marcar como concluída
        await fetch(`/api/projetos/${id}/fases/${faseId}/etapas/${etapaId}/completar`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({ observacoes }),
        });
        toast.success("Etapa concluída!");
      }

      // Recarregar fases
      const fasesData = await fetch(`/api/projetos/${id}/fases`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }).then((res) => res.json());
      setFases(Array.isArray(fasesData) ? fasesData : []);
    } catch (error) {
      console.error("Erro ao alternar etapa:", error);
      toast.error("Erro ao atualizar etapa");
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <LoadingState type="cards" rows={3} />
      </div>
    );
  }

  if (error || !projeto) {
    return (
      <div>
        <div className="mb-8">
          <Link
            href="/dashboard/projetos"
            className="text-zinc-600 dark:text-zinc-400 hover:underline mb-4 inline-block"
          >
            ← Voltar para Projetos
          </Link>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-red-800 dark:text-red-200">
            {error || "Projeto não encontrado"}
          </p>
        </div>
      </div>
    );
  }

  const selectedFase = fases[selectedFaseIndex];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Link
            href="/dashboard/projetos"
            className="text-zinc-600 dark:text-zinc-400 hover:underline text-sm mb-2 inline-block"
          >
            ← Voltar para Projetos
          </Link>
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
            {projeto.nome}
          </h1>
          {projeto.descricao && (
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">
              {projeto.descricao}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/projetos/${id}/editar`}>
            <Button variant="default">Editar</Button>
          </Link>
          <Button variant="secondary" onClick={generateReport}>
            Gerar PDF
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialog(true)}>
            Excluir
          </Button>
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-6">
          Progresso do Projeto
        </h2>
        <ProjectPhaseTimeline fases={fases} />
      </div>

      {/* Phase Details */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <Tabs
          value={selectedFaseIndex.toString()}
          onValueChange={(v) => setSelectedFaseIndex(parseInt(v))}
        >
          <TabsList className="grid w-full grid-cols-5 mb-6">
            {fases.map((fase, index) => (
              <TabsTrigger key={fase.id} value={index.toString()}>
                {fase.nome}
              </TabsTrigger>
            ))}
          </TabsList>

          {fases.map((fase, index) => (
            <TabsContent key={fase.id} value={index.toString()}>
              <PhaseChecklist
                faseNome={fase.nome}
                faseCor={fase.cor}
                etapas={fase.etapas}
                etapasCompletadas={fase.etapas_completadas}
                onToggleEtapa={(etapaId, obs) =>
                  handleToggleEtapa(fase.id, etapaId, obs)
                }
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Project Info */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h2 className="text-lg font-semibold mb-4 text-black dark:text-zinc-50">
          Informações do Projeto
        </h2>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Criado em
            </dt>
            <dd className="mt-1 text-sm text-black dark:text-zinc-50">
              {new Date(projeto.created_at).toLocaleString("pt-BR")}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Atualizado em
            </dt>
            <dd className="mt-1 text-sm text-black dark:text-zinc-50">
              {new Date(projeto.updated_at).toLocaleString("pt-BR")}
            </dd>
          </div>
        </dl>
      </div>

      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="Excluir Projeto"
        description="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
