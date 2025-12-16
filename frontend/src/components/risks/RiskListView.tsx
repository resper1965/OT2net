import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash } from "lucide-react";
import { api } from "@/lib/api";

interface RiskListViewProps {
  riscos: any[];
  onRefresh: () => void;
}

export function RiskListView({ riscos, onRefresh }: RiskListViewProps) {
  const getNivelBadge = (nivel: string) => {
    const colors: Record<string, string> = {
      CRITICO: "bg-red-600",
      ALTO: "bg-orange-500",
      MEDIO: "bg-yellow-500",
      BAIXO: "bg-green-500",
    };
    return <Badge className={colors[nivel] || "bg-gray-500"}>{nivel}</Badge>;
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este risco?")) {
      try {
        await api.riscos.delete(id);
        onRefresh();
      } catch (error) {
        console.error("Erro ao excluir risco:", error);
      }
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Probabilidade</TableHead>
          <TableHead>Impacto</TableHead>
          <TableHead>Nível</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {riscos.map((risco) => (
          <TableRow key={risco.id}>
            <TableCell className="font-medium">{risco.nome}</TableCell>
            <TableCell>{risco.categoria}</TableCell>
            <TableCell>{risco.probabilidade}/5</TableCell>
            <TableCell>{Math.max(risco.impacto_seguranca, risco.impacto_operacional)}/5</TableCell>
            <TableCell>{getNivelBadge(risco.nivel_risco)}</TableCell>
            <TableCell>{risco.status}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(risco.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
