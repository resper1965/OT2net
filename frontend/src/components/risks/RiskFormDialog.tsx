import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { api } from "@/lib/api";

interface RiskFormDialogProps {
  open: boolean;
  onClose: () => void;
  projeto_id: string;
  onSuccess: () => void;
}

export function RiskFormDialog({ open, onClose, projeto_id, onSuccess }: RiskFormDialogProps) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoria: "TECNICO",
    probabilidade: 3,
    impacto_seguranca: 3,
    impacto_operacional: 3,
    status: "IDENTIFICADO",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.riscos.create({ ...formData, projeto_id });
      onSuccess();
    } catch (error) {
      console.error("Erro ao criar risco:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Risco</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Categoria</Label>
              <Select value={formData.categoria} onValueChange={(v) => setFormData({ ...formData, categoria: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TECNICO">Técnico</SelectItem>
                  <SelectItem value="OPERACIONAL">Operacional</SelectItem>
                  <SelectItem value="SEGURANCA">Segurança</SelectItem>
                  <SelectItem value="COMPLIANCE">Compliance</SelectItem>
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
                  <SelectItem value="IDENTIFICADO">Identificado</SelectItem>
                  <SelectItem value="EM_ANALISE">Em Análise</SelectItem>
                  <SelectItem value="MITIGADO">Mitigado</SelectItem>
                  <SelectItem value="ACEITO">Aceito</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Probabilidade (1-5)</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={formData.probabilidade}
                onChange={(e) => setFormData({ ...formData, probabilidade: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label>Impacto Segurança (1-5)</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={formData.impacto_seguranca}
                onChange={(e) => setFormData({ ...formData, impacto_seguranca: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label>Impacto Operacional (1-5)</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={formData.impacto_operacional}
                onChange={(e) => setFormData({ ...formData, impacto_operacional: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
