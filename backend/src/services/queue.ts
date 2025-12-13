import { PrismaClient } from '@prisma/client';
import { prisma } from '../lib/prisma';

export type JobType = 'GENERATE_DESCRIPTION_PROCESS' | 'GENERATE_REPORT_ONBOARDING' | 'SYNC_FIREBASE_USERS';

export class QueueService {
  private static instance: QueueService;
  private isProcessing = false;

  private constructor() {}

  static getInstance(): QueueService {
    if (!QueueService.instance) {
      QueueService.instance = new QueueService();
    }
    return QueueService.instance;
  }

  async addJob(tipo: JobType, payload: any, tenantId?: string, prioridade: number = 0) {
    return prisma.jobQueue.create({
      data: {
        tipo,
        payload,
        tenant_id: tenantId,
        prioridade,
        status: 'pending',
      }
    });
  }

  async processNextJob() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      // Buscar próximo job pendente por prioridade e data
      const job = await prisma.jobQueue.findFirst({
        where: {
          status: 'pending',
          agendado_para: {
            lte: new Date(),
          },
        },
        orderBy: [
          { prioridade: 'desc' },
          { created_at: 'asc' },
        ],
      });

      if (!job) {
        this.isProcessing = false;
        return;
      }

      // Marcar como processando
      await prisma.jobQueue.update({
        where: { id: job.id },
        data: { status: 'processing', tentativas: { increment: 1 } }, // Typos intencionais corrigidos abaixo: tentativas
      });

      // Executar lógica (mock por enquanto, conectar com services reais depois)
      console.log(`Processing job ${job.id} of type ${job.tipo}`);

      try {
        await this.executeJobLogic(job);
        
        await prisma.jobQueue.update({
          where: { id: job.id },
          data: { status: 'completed', processado_em: new Date() },
        });

      } catch (error: any) {
        console.error(`Error processing job ${job.id}:`, error);
        
        const status = job.tentativas >= job.max_tentativas ? 'failed' : 'pending'; // Retry logic
        const backoff = job.tentativas * 60 * 1000; // Linear backoff 1min, 2min...

        await prisma.jobQueue.update({
          where: { id: job.id },
          data: { 
            status, 
            erro: error.message,
            agendado_para: status === 'pending' ? new Date(Date.now() + backoff) : undefined
          },
        });
      }

    } catch (error) {
      console.error("Queue loop error:", error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async executeJobLogic(job: any) {
    switch (job.tipo) {
      case 'GENERATE_DESCRIPTION_PROCESS':
        // TODO: Chamar serviço de IA para gerar processo
        await new Promise(resolve => setTimeout(resolve, 1000)); // Mock
        break;
      case 'GENERATE_REPORT_ONBOARDING':
         // TODO: Chamar serviço de PDF
        break;
      default:
        console.warn(`Unknown job type: ${job.tipo}`);
    }
  }
}

// Singleton export
export const queueService = QueueService.getInstance();
