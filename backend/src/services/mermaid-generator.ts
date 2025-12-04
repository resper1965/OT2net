import { ProcessoNormalizado, ProcessoEtapa } from '@prisma/client';

interface ProcessoComEtapas extends ProcessoNormalizado {
  processo_etapas?: ProcessoEtapa[];
}

/**
 * Gera um diagrama Mermaid a partir de um processo normalizado
 */
export class MermaidGeneratorService {
  /**
   * Gera um diagrama de fluxo Mermaid para um processo
   */
  static generateFlowchart(processo: ProcessoComEtapas): string {
    const etapas = processo.processo_etapas || [];
    const etapasOrdenadas = [...etapas].sort((a, b) => a.ordem - b.ordem);

    let mermaid = 'graph TD\n';
    mermaid += `    Start([${processo.nome}])\n`;

    if (processo.gatilho) {
      mermaid += `    Trigger[Gatilho: ${processo.gatilho}]\n`;
      mermaid += `    Start --> Trigger\n`;
    }

    if (etapasOrdenadas.length === 0) {
      mermaid += `    Start --> End([Fim])\n`;
    } else {
      etapasOrdenadas.forEach((etapa, index) => {
        const nodeId = `E${index + 1}`;
        const label = etapa.nome.length > 30 
          ? `${etapa.nome.substring(0, 27)}...` 
          : etapa.nome;
        
        mermaid += `    ${nodeId}[${label}]\n`;
        
        if (index === 0) {
          if (processo.gatilho) {
            mermaid += `    Trigger --> ${nodeId}\n`;
          } else {
            mermaid += `    Start --> ${nodeId}\n`;
          }
        } else {
          const prevNodeId = `E${index}`;
          mermaid += `    ${prevNodeId} --> ${nodeId}\n`;
        }

        if (index === etapasOrdenadas.length - 1) {
          mermaid += `    ${nodeId} --> End([Fim])\n`;
        }
      });
    }

    // Adicionar estilo
    mermaid += `    style Start fill:#00ade8,stroke:#333,stroke-width:2px,color:#fff\n`;
    mermaid += `    style End fill:#00ade8,stroke:#333,stroke-width:2px,color:#fff\n`;

    return mermaid;
  }

  /**
   * Gera um diagrama de sequência Mermaid para um processo
   */
  static generateSequence(processo: ProcessoComEtapas): string {
    const etapas = processo.processo_etapas || [];
    const etapasOrdenadas = [...etapas].sort((a, b) => a.ordem - b.ordem);

    let mermaid = 'sequenceDiagram\n';
    mermaid += `    participant User as Usuário\n`;
    mermaid += `    participant System as Sistema\n`;

    if (processo.gatilho) {
      mermaid += `    User->>System: ${processo.gatilho}\n`;
    }

    etapasOrdenadas.forEach((etapa, index) => {
      mermaid += `    System->>System: ${etapa.nome}\n`;
      if (etapa.descricao) {
        mermaid += `    Note over System: ${etapa.descricao.substring(0, 50)}\n`;
      }
    });

    mermaid += `    System->>User: Processo concluído\n`;

    return mermaid;
  }

  /**
   * Gera um diagrama de estado Mermaid para um processo
   */
  static generateStateDiagram(processo: ProcessoComEtapas): string {
    const etapas = processo.processo_etapas || [];
    const etapasOrdenadas = [...etapas].sort((a, b) => a.ordem - b.ordem);

    let mermaid = 'stateDiagram-v2\n';
    mermaid += `    [*] --> Inicio: ${processo.gatilho || 'Início'}\n`;

    etapasOrdenadas.forEach((etapa, index) => {
      const stateName = etapa.nome.replace(/[^a-zA-Z0-9]/g, '_');
      mermaid += `    ${index === 0 ? 'Inicio' : etapasOrdenadas[index - 1].nome.replace(/[^a-zA-Z0-9]/g, '_')} --> ${stateName}: ${etapa.nome}\n`;
    });

    if (etapasOrdenadas.length > 0) {
      const lastState = etapasOrdenadas[etapasOrdenadas.length - 1].nome.replace(/[^a-zA-Z0-9]/g, '_');
      mermaid += `    ${lastState} --> [*]: Concluído\n`;
    } else {
      mermaid += `    Inicio --> [*]: Concluído\n`;
    }

    return mermaid;
  }
}


