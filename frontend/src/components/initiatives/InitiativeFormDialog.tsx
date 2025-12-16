import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { api } from "@/lib/api";

interface InitiativeFormDialogProps {
  open: boolean;
  onClose: () => void;
  projeto_id: string;
  onSuccess: () => void;
  editData?: any;
}

export function InitiativeFormDialog({ open, onClose, projeto_id, onSuccess, editData }: InitiativeFormDialogProps) {
  const [formData, setFormData] = useState({
    nome: editData?.nome || "",
    descricao: editData?.descricao || "",
    prioridade: editData?.prioridade || "MEDIA",
    status: editData?.status || "planejada",
    custo_estimado: editData?.custo_estimado || "",
    data_inicio: editData?.data_inicio || "",
    data_fim_prevista: editData?.data_fim_prevista || "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...formData,
        projeto_id,
        custo_estimado: formData.custo_estimado ? parseFloat(formData.custo_estimado) : undefined,
      };

      if (editData) {
        await api.iniciativas.update(editData.id, data);
      } else {
        await api.iniciativas.create(data);
      }
      
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar iniciativa:", error);
      alert("Erro ao salvar iniciativa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? "Editar Iniciativa" : "Nova Iniciativa"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome *</Label>
            <Input
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
              placeholder="Ex: Implementação de Firewall ICS"
            />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
              placeholder="Descrição detalhada da iniciativa"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Prioridade</Label>
              <Select value={formData.prioridade} onValueChange={(v) => setFormData({ ...formData, prioridade: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CRITICA">Crítica</SelectItem>
                  <SelectItem value="ALTA">Alta</SelectItem>
                  <SelectItem value="MEDIA">Média</SelectItem>
                  <SelectItem value="BAIXA">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planejada">Planejada</SelectItem>
                  <SelectItem value="aprovada">Aprovada</SelectItem>
                  <SelectItem value="em_execucao">Em Execução</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Custo Estimado (R$)</Label>
              <Input
                type="number"
                value={formData.custo_estimado}
                onChange={(e) => setFormData({ ...formData, custo_estimado: e.target.value })}
                placeholder="50000"
              />
            </div>
            <div>
              <Label>Data Início</Label>
              <Input
                type="date"
                value={formData.data_inicio}
                onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
              />
            </div>
            <div>
              <Label>Data Fim Prevista</Label>
              <Input
                type="date"
                value={formData.data_fim_prevista}
                onChange={(e) => setFormData({ ...formData, data_fim_prevista: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
