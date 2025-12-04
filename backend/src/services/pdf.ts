import PDFDocument from 'pdfkit';
import { prisma } from '../lib/prisma';
import { StorageService } from './storage';

interface OnboardingData {
  cliente: any;
  empresas: any[];
  sites: any[];
  stakeholders: any[];
  membros_equipe: any[];
  projeto: any;
}

export class PDFService {
  /**
   * Gera relatório de onboarding em PDF
   */
  static async generateOnboardingReport(projetoId: string): Promise<Buffer> {
    // Buscar dados completos do projeto
    const projeto = await prisma.projeto.findUnique({
      where: { id: projetoId },
      include: {
        cliente: {
          include: {
            empresas: {
              include: {
                sites: true,
              },
            },
          },
        },
        stakeholders: true,
        membros_equipe: true,
      },
    });

    if (!projeto) {
      throw new Error('Projeto não encontrado');
    }

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));

    // Cabeçalho
    doc.fontSize(20).text('Relatório de Onboarding', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Projeto: ${projeto.nome}`, { align: 'center' });
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
    doc.moveDown(2);

    // Seção: Cliente
    if (projeto.cliente) {
      doc.fontSize(16).text('1. DADOS DO CLIENTE', { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      doc.text(`Razão Social: ${projeto.cliente.razao_social}`);
      doc.text(`CNPJ: ${projeto.cliente.cnpj}`);
      if (projeto.cliente.classificacao) {
        doc.text(`Classificação: ${projeto.cliente.classificacao}`);
      }
      if (projeto.cliente.agencias_reguladoras?.length > 0) {
        doc.text(`Agências Reguladoras: ${projeto.cliente.agencias_reguladoras.join(', ')}`);
      }
      doc.moveDown();
    }

    // Seção: Empresas
    if (projeto.cliente?.empresas && projeto.cliente.empresas.length > 0) {
      doc.fontSize(16).text('2. EMPRESAS', { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      
      projeto.cliente.empresas.forEach((empresa, index) => {
        doc.text(`${index + 1}. ${empresa.identificacao}`);
        if (empresa.tipo) doc.text(`   Tipo: ${empresa.tipo}`);
        if (empresa.status) doc.text(`   Status: ${empresa.status}`);
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // Seção: Sites
    const allSites = projeto.cliente?.empresas?.flatMap(e => e.sites || []) || [];
    if (allSites.length > 0) {
      doc.fontSize(16).text('3. SITES', { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      
      allSites.forEach((site, index) => {
        doc.text(`${index + 1}. ${site.identificacao}`);
        if (site.classificacao) doc.text(`   Classificação: ${site.classificacao}`);
        if (site.criticidade_operacional) {
          doc.text(`   Criticidade: ${site.criticidade_operacional}`);
        }
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // Seção: Stakeholders
    if (projeto.stakeholders && projeto.stakeholders.length > 0) {
      doc.fontSize(16).text('4. STAKEHOLDERS', { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      
      projeto.stakeholders.forEach((stakeholder, index) => {
        const identificacao = stakeholder.identificacao_pessoal as any;
        doc.text(`${index + 1}. ${identificacao?.nome || 'N/A'}`);
        if (stakeholder.papel_no_projeto) {
          doc.text(`   Papel: ${stakeholder.papel_no_projeto}`);
        }
        if (stakeholder.expertise) {
          doc.text(`   Expertise: ${stakeholder.expertise}`);
        }
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // Seção: Equipe do Projeto
    if (projeto.membros_equipe && projeto.membros_equipe.length > 0) {
      doc.fontSize(16).text('5. EQUIPE DO PROJETO (RASCI)', { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      
      projeto.membros_equipe.forEach((membro, index) => {
        doc.text(`${index + 1}. ${membro.papel || 'N/A'}`);
        if (membro.responsabilidade) doc.text(`   Responsável: ${membro.responsabilidade}`);
        if (membro.autoridade) doc.text(`   Autoridade: ${membro.autoridade}`);
        if (membro.consultado) doc.text(`   Consultado: ${membro.consultado}`);
        if (membro.informado) doc.text(`   Informado: ${membro.informado}`);
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // Rodapé
    doc.fontSize(10).text(
      `Gerado em ${new Date().toLocaleString('pt-BR')} - OT2net`,
      { align: 'center' }
    );

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);
    });
  }

  /**
   * Gera PDF e faz upload para Supabase Storage
   */
  static async generateAndUploadOnboardingReport(
    projetoId: string
  ): Promise<string> {
    const pdfBuffer = await this.generateOnboardingReport(projetoId);
    const fileName = `onboarding-${projetoId}-${Date.now()}.pdf`;
    const filePath = `${projetoId}/${fileName}`;

    await StorageService.uploadFile('documentos', filePath, pdfBuffer, {
      contentType: 'application/pdf',
    });

    // Retornar URL assinada
    return await StorageService.getSignedUrl('documentos', filePath, 3600);
  }
}

