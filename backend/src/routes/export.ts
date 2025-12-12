import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * GET /api/processos-normalizados/:id/export-bpmn
 * Exporta o BPMN XML de um processo normalizado
 */
router.get('/:id/export-bpmn', authenticateToken, async (req: any, res, next) => {
  try {
    const { id } = req.params;
    
    const processo = await req.prisma.processoNormalizado.findUnique({
      where: { id },
      select: {
        nome: true,
        objetivo: true,
        // Assumindo que o BPMN está armazenado em resultado_processamento ou campo específico
        descricao_raw: {
          select: {
            resultado_processamento: true
          }
        }
      }
    });

    if (!processo) {
      return res.status(404).json({ error: 'Processo não encontrado' });
    }

    // Extrair BPMN do resultado_processamento
    const bpmnData = processo.descricao_raw?.resultado_processamento as any;
    const bpmnXml = bpmnData?.bpmn_xml || bpmnData?.bpmn || generatePlaceholderBPMN(processo.nome, processo.objetivo);

    // Set headers para download
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', `attachment; filename="${sanitizeFilename(processo.nome)}.bpmn"`);
    
    res.send(bpmnXml);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/processos-normalizados/:id/export-mermaid
 * Exporta o diagrama Mermaid de um processo
 */
router.get('/:id/export-mermaid', authenticateToken, async (req: any, res, next) => {
  try {
    const { id } = req.params;
    
    const processo = await req.prisma.processoNormalizado.findUnique({
      where: { id },
      select: {
        nome: true,
        descricao_raw: {
          select: {
            resultado_processamento: true
          }
        }
      }
    });

    if (!processo) {
      return res.status(404).json({ error: 'Processo não encontrado' });
    }

    const mermaidData = processo.descricao_raw?.resultado_processamento as any;
    const mermaidGraph = mermaidData?.mermaid_graph || mermaidData?.mermaid || `flowchart TD\n  A[${processo.nome}]`;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${sanitizeFilename(processo.nome)}.mmd"`);
    
    res.send(mermaidGraph);
  } catch (error) {
    next(error);
  }
});

// Helper: Sanitizar nome do arquivo
function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

// Helper: Gerar BPMN placeholder se não existir
function generatePlaceholderBPMN(nome: string, objetivo?: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
             xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
             xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
             targetNamespace="http://bpmn.io/schema/bpmn"
             id="Definitions_1">
  <process id="Process_1" isExecutable="false">
    <startEvent id="StartEvent_1" name="Início"/>
    <task id="Task_1" name="${nome}">
      <documentation>${objetivo || ''}</documentation>
    </task>
    <endEvent id="EndEvent_1" name="Fim"/>
    <sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1"/>
    <sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="EndEvent_1"/>
  </process>
</definitions>`;
}

export default router;
