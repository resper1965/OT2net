"use client";

import { useState } from "react";
import { Check, User, Calendar, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
}

interface PhaseChecklistProps {
  faseNome: string;
  faseCor: string;
  etapas: FaseEtapa[];
  etapasCompletadas: EtapaCompletada[];
  onToggleEtapa: (etapaId: string, observacoes?: string) => Promise<void>;
  readonly?: boolean;
}

export function PhaseChecklist({
  faseNome,
  faseCor,
  etapas,
  etapasCompletadas,
  onToggleEtapa,
  readonly = false,
}: PhaseChecklistProps) {
  const [selectedEtapa, setSelectedEtapa] = useState<FaseEtapa | null>(null);
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(false);

  const sortedEtapas = [...etapas].sort((a, b) => a.ordem - b.ordem);

  const isEtapaCompletada = (etapaId: string) => {
    return etapasCompletadas.some((ec) => ec.fase_etapa_id === etapaId);
  };

  const getEtapaCompletada = (etapaId: string) => {
    return etapasCompletadas.find((ec) => ec.fase_etapa_id === etapaId);
  };

  const handleCheckboxClick = (etapa: FaseEtapa) => {
    if (readonly) { return; }

    const isCompleted = isEtapaCompletada(etapa.id);

    if (isCompleted) {
      // Desmarcar diretamente
      handleToggle(etapa.id);
    } else {
      // Abrir dialog para adicionar observações
      setSelectedEtapa(etapa);
      setObservacoes("");
    }
  };

  const handleToggle = async (etapaId: string, obs?: string) => {
    setLoading(true);
    try {
      await onToggleEtapa(etapaId, obs);
      setSelectedEtapa(null);
      setObservacoes("");
    } catch (error) {
      console.error("Erro ao alternar etapa:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedEtapa) {
      handleToggle(selectedEtapa.id, observacoes);
    }
  };

  const progressoPercentual = Math.round(
    (etapasCompletadas.length / etapas.length) * 100
  );

  return (
    <div className="space-y-4">
      {/* Header com Progresso */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
          {faseNome}
        </h3>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {etapasCompletadas.length} de {etapas.length} concluídas
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {progressoPercentual}% completo
            </div>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-zinc-200 dark:text-zinc-700"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke={faseCor}
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${
                  2 * Math.PI * 28 * (1 - progressoPercentual / 100)
                }`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                {progressoPercentual}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Etapas */}
      <div className="space-y-2">
        {sortedEtapas.map((etapa) => {
          const completada = getEtapaCompletada(etapa.id);
          const isCompleted = !!completada;

          return (
            <div
              key={etapa.id}
              className={cn(
                "group relative flex items-start gap-3 p-4 rounded-lg border transition-all",
                isCompleted
                  ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700",
                !readonly && "cursor-pointer"
              )}
              onClick={() => !readonly && handleCheckboxClick(etapa)}
            >
              {/* Checkbox */}
              <div className="shrink-0 mt-0.5">
                <div
                  className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                    isCompleted
                      ? "bg-green-500 border-green-500"
                      : "border-zinc-300 dark:border-zinc-600 group-hover:border-zinc-400 dark:group-hover:border-zinc-500"
                  )}
                >
                  {isCompleted && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4
                      className={cn(
                        "font-medium text-sm",
                        isCompleted
                          ? "text-green-900 dark:text-green-100 line-through"
                          : "text-black dark:text-zinc-50"
                      )}
                    >
                      {etapa.nome}
                      {etapa.obrigatoria && (
                        <span className="ml-2 text-xs text-red-500">*</span>
                      )}
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                      {etapa.descricao}
                    </p>
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    #{etapa.ordem}
                  </div>
                </div>

                {/* Metadata de Conclusão */}
                {completada && (
                  <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-900/30 space-y-2">
                    <div className="flex items-center gap-4 text-xs text-green-700 dark:text-green-300">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(completada.completada_em).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      {completada.completada_por && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>Concluída por usuário</span>
                        </div>
                      )}
                    </div>
                    {completada.observacoes && (
                      <div className="flex items-start gap-1 text-xs text-green-700 dark:text-green-300">
                        <MessageSquare className="w-3 h-3 mt-0.5 shrink-0" />
                        <span className="italic">{completada.observacoes}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dialog de Observações */}
      <Dialog open={!!selectedEtapa} onOpenChange={() => setSelectedEtapa(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcar Etapa como Concluída</DialogTitle>
            <DialogDescription>
              {selectedEtapa?.nome}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
                Observações (opcional)
              </label>
              <Textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Adicione detalhes sobre a conclusão desta etapa..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedEtapa(null)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={loading}>
              {loading ? "Salvando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
