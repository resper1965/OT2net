import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import { prisma } from '../lib/prisma';
import { OnboardingPDFDocument } from '../templates/OnboardingPDF';

export class PDFService {
  /**
   * Gera relatório de onboarding em PDF usando @react-pdf/renderer
   * @param projetoId ID do projeto
   * @returns Buffer do PDF gerado
   */
  static async generateOnboardingReport(projetoId: string): Promise<Buffer> {
    // Buscar dados do projeto
    const projeto = await prisma.projeto.findUnique({
      where: { id: projetoId },
      include: {
        organizacao: {
          select: {
            nome: true,
            cnpj: true,
            classificacao: true,
          },
        },
      },
    });

    if (!projeto) {
      throw new Error('Projeto não encontrado');
    }

    // Buscar empresas da organização
    const empresas = projeto.organizacao_id
      ? await prisma.empresa.findMany({
          where: { organizacao_id: projeto.organizacao_id },
          select: {
            identificacao: true,
            tipo: true,
            status: true,
          },
          take: 50,
        })
      : [];

    // Buscar sites
    const sites = projeto.organizacao_id
      ? await prisma.site.findMany({
          where: {
            empresa: {
              organizacao_id: projeto.organizacao_id,
            },
          },
          select: {
            nome: true,
            tipo_instalacao: true,
            localizacao: true,
          },
          take: 50,
        })
      : [];

    // Buscar membros da equipe e stakeholders (agora consolidados)
    const membrosEquipe = await prisma.membroEquipe.findMany({
      where: {
        OR: [
          { projeto_id: projetoId },
          ...(projeto.organizacao_id ? [{ organizacao_id: projeto.organizacao_id }] : []),
        ],
      },
      select: {
        nome: true,
        tipo: true,
        cargo: true,
        papel: true,
      },
      take: 50,
    });

    // Preparar dados para o PDF
    const pdfData = {
      projeto: {
        nome: projeto.nome,
        descricao: projeto.descricao || undefined,
        fase_atual: projeto.fase_atual || undefined,
        created_at: projeto.created_at?.toISOString() || new Date().toISOString(),
      },
      organizacao: projeto.organizacao
        ? {
            nome: projeto.organizacao.nome,
            cnpj: projeto.organizacao.cnpj || undefined,
            classificacao: projeto.organizacao.classificacao || undefined,
          }
        : undefined,
      empresas,
      sites,
      membrosEquipe,
    };

    // Gerar PDF usando @react-pdf/renderer
    const pdfDocument = React.createElement(OnboardingPDFDocument, { data: pdfData });
    const pdfBuffer = await ReactPDF.renderToBuffer(pdfDocument);

    return pdfBuffer;
  }

  /**
   * Gera PDF e retorna como data URI base64 (para download direto no navegador)
   */
  static async generateAndUploadOnboardingReport(projetoId: string): Promise<string> {
    const buffer = await this.generateOnboardingReport(projetoId);

    // Por enquanto, retornar data URI base64
    // Em produção com Cloud Storage:
    // const fileName = `onboarding-${projetoId}-${Date.now()}.pdf`;
    // await StorageService.uploadFile('documentos', fileName, buffer);
    // return await StorageService.getSignedUrl('documentos', fileName, 3600);

    const base64 = buffer.toString('base64');
    return `data:application/pdf;base64,${base64}`;
  }
}
