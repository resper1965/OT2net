import { prisma } from "@/lib/prisma";
import { logger } from "../utils/logger";
import { AppError } from "../utils/errors";

export interface CreateTicketDTO {
  tenant_id: string;
  projeto_id: string;
  iniciativa_id?: string;
  titulo: string;
  descricao: string;
  prioridade?: string;
  responsavel_id?: string;
  data_vencimento?: Date;
  external_id?: string;
}

export class TicketService {
  async listarTickets(projetoId: string) {
    return prisma.ticket.findMany({
      where: { projeto_id: projetoId },
      include: {
        iniciativa: true,
        responsavel: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async criarTicket(data: CreateTicketDTO) {
    logger.info({ projeto_id: data.projeto_id, titulo: data.titulo }, "Criando novo ticket");
    
    return prisma.ticket.create({
      data: {
        ...data,
        status: 'aberto'
      }
    });
  }

  async atualizarStatus(ticketId: string, status: string) {
    logger.info({ ticketId, status }, "Atualizando status do ticket");
    
    return prisma.ticket.update({
      where: { id: ticketId },
      data: { status }
    });
  }

  /**
   * Converte uma iniciativa estratégica em um ticket operacional
   */
  async converterIniciativaEmTicket(iniciativaId: string) {
    const iniciativa = await prisma.iniciativa.findUnique({
      where: { id: iniciativaId }
    });

    if (!iniciativa) throw new AppError("Iniciativa não encontrada", 404);

    return this.criarTicket({
      tenant_id: iniciativa.tenant_id,
      projeto_id: iniciativa.projeto_id,
      iniciativa_id: iniciativa.id,
      titulo: `Execução: ${iniciativa.nome}`,
      descricao: iniciativa.objetivo,
      prioridade: iniciativa.prioridade?.toLowerCase() || 'media'
    });
  }
}
