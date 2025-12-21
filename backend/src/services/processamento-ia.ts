import { VertexAIService } from './vertexAiService'
import { GeminiService } from './gemini'
import { prisma } from '../lib/prisma'
import { logger } from '../utils/logger'
import { AppError } from '../middleware/errorHandler'
import type { Prisma } from '@prisma/client'

interface ProcessamentoResult {
  processo: {
    nome: string
    objetivo?: string
    gatilho?: string
    frequencia?: string
    duracao_estimada?: string
    criticidade?: string
    tipo_processo?: string
    dependencias?: string[]
    observacoes_gerais?: string
  }
  etapas: Array<{
    ordem: number
    nome: string
    descricao: string
    tipo_etapa?: string
    sistemas_envolvidos?: string[]
    ativos_envolvidos?: string[]
    tempo_estimado?: string
  }>
  ativos: Array<{
    tipo: string
    nome: string
    categoria?: string
    localizacao?: string
    criticidade?: string
    caracteristicas_tecnicas?: Record<string, any>
    rede_conectividade?: string
    protocolos?: string[]
  }>
  dificuldades?: Array<{
    descricao: string
    categoria?: string
    impacto?: string
    frequencia?: string
    sistemas_afetados?: string[]
  }>
  workarounds?: Array<{
    descricao: string
    razao?: string
    risco_percebido?: string
    categoria?: string
  }>
  approval_text?: string
  mermaid_graph?: string
}

const SYSTEM_PROMPT = `Você é um Líder de Arquitetura de Software e Especialista em IA para Governança de OT (Tecnologia Operacional).
Sua tarefa é atuar como o motor de tradução entre a "realidade do campo" e as "exigências regulatórias".

Você deve analisar descrições operacionais (entrevistas/shadowing) e gerar um pacote de normalização estruturado.

O foco principal é a distinção entre a "Jornada Real do Operador" (AS-IS) e o "Processo Teórico/Ideal".
Identifique pontos onde o técnico precisa "driblar" (workaround) controles para manter a operação funcionando (ex: senhas compartilhadas por urgência, ignorar alertas por excesso de ruído).

Retorne APENAS um JSON válido no seguinte formato:
{
  "approval_text": "Texto profissional resumindo o entendimento do processo para validação técnica.",
  "mermaid_graph": "Código Mermaid válido (flowchart TD). Diferencie visualmente (ex: cores) passos que são 'workarounds'.",
  "comparacao_teorica": "Análise de alto nível comparando a realidade descrita com o que seria o processo ideal/padrão industrial.",
  "fluxo_referencia": "Código Mermaid para o processo 'Padrão Ouro/Teórico' segundo normas de OT.",
  "gaps_conformidade": [
    {
      "etapa": "Nome da etapa real",
      "referencia": "Como deveria ser",
      "norma": "ANEEL/ONS/IEC62443/NIST",
      "severidade": "baixa|media|alta"
    }
  ],
  "dribles_identificados": [
    {
      "descricao": "O que o operador faz fora do padrão",
      "motivo": "Por que ele faz isso (ex: rapidez, falha do sistema)",
      "risco_operacional": "Impacto real no negócio ou segurança"
    }
  ],
  "processo": {
    "nome": "Nome do processo",
    "objetivo": "Objetivo real observado",
    "gatilho": "Evento real disparador",
    "frequencia": "Frequência observada",
    "criticidade": "baixa|media|alta",
    "tipo_processo": "operacional|manutencao|emergencia"
  },
  "etapas": [
    {
      "ordem": 1,
      "nome": "Nome da etapa",
      "ator": "Papel/Responsável",
      "descricao": "O que acontece nesta etapa",
      "tipo_bpmn": "task|gateway|start|end",
      "is_workaround": true|false,
      "raci": { "R": "Papel", "A": "Papel", "C": "Papel", "I": "Papel" }
    }
  ],
  "ativos": [
    {
      "tipo": "sistema|equipamento|ferramenta",
      "nome": "Nome do ativo",
      "criticidade": "baixa|media|alta"
    }
  ]
}

IMPORTANTE:
- "mermaid_graph" deve ser compatível com a versão mais recente do Mermaid.
- Identifique claramente os "dribles" na estrutura de etapas também.
- Retorne APENAS o JSON.
`

export class ProcessamentoIAService {
  /**
   * Processa uma descrição operacional raw e retorna processo normalizado
   */
  static async processarDescricaoRaw(descricaoRawId: string, tenantId: string): Promise<ProcessamentoResult & { bpmn: any }> {
    // Buscar descrição raw
    const descricaoRaw = await prisma.descricaoOperacionalRaw.findUnique({
      where: { id: descricaoRawId },
    })

    if (!descricaoRaw) {
      throw new AppError('Descrição raw não encontrada', 404)
    }

    // Atualizar status
    await prisma.descricaoOperacionalRaw.update({
      where: { id: descricaoRawId },
      data: { status_processamento: 'processando' },
    })

    try {
      const vertexService = new VertexAIService();
      
      // 1. Generate BPMN 2.0 JSON (Keep strict generation for standard compliance)
      const bpmnJson = await vertexService.generateBpmnJson(descricaoRaw.descricao_completa);

      // 2. Generate Structured Data + Approval Text + Mermaid
      const extractionPrompt = `
      ${SYSTEM_PROMPT}
      
      Descrição Operacional:
      ${descricaoRaw.descricao_completa}
      `;
      
      const rawRes = await vertexService.generateResponse(extractionPrompt + "\nReturn ONLY JSON.");
      let cleanJson = rawRes.replace(/```json\\n?|\\n?```/g, "").trim();
      
      // Sanitize standard markers if AI adds them despite instruction
      if (cleanJson.startsWith('```')) cleanJson = cleanJson.replace(/^```(json)?/, '').replace(/```$/, '');

      const structuredData: ProcessamentoResult = JSON.parse(cleanJson);

      const resultado = {
        ...structuredData,
        bpmn: bpmnJson
      };

      // Salvar resultado no banco
      await prisma.descricaoOperacionalRaw.update({
        where: { id: descricaoRawId },
        data: {
          status_processamento: 'processado',
          resultado_processamento: resultado as any,
          processado_por_ia: true,
        },
      })

      logger.info({ descricaoRawId }, 'Descrição raw processada com sucesso (Vertex AI)')

      return resultado
    } catch (error: any) {
      // Atualizar status de erro
      await prisma.descricaoOperacionalRaw.update({
        where: { id: descricaoRawId },
        data: {
          status_processamento: 'erro',
          resultado_processamento: { erro: error.message } as Prisma.InputJsonValue,
        },
      })

      logger.error({ descricaoRawId, error: error.message }, 'Erro ao processar descrição raw')

      throw new AppError(`Erro ao processar descrição: ${error.message}`, 500)
    }
  }

  /**
   * Cria processo normalizado a partir do resultado do processamento
   */
  static async criarProcessoNormalizado(
    descricaoRawId: string,
    resultado: ProcessamentoResult,
    tenantId: string
  ) {
    const descricaoRaw = await prisma.descricaoOperacionalRaw.findUnique({
      where: { id: descricaoRawId },
    })

    if (!descricaoRaw) {
      throw new AppError('Descrição raw não encontrada', 404)
    }

    // Criar processo normalizado
    const processo = await prisma.processoNormalizado.create({
      data: {
        descricao_raw_id: descricaoRawId,
        tenant_id: tenantId,
        nome: resultado.processo.nome,
        objetivo: resultado.processo.objetivo,
        gatilho: resultado.processo.gatilho,
        frequencia: resultado.processo.frequencia,
        duracao_estimada: resultado.processo.duracao_estimada,
        criticidade: resultado.processo.criticidade,
        tipo_processo: resultado.processo.tipo_processo,
        dependencias: resultado.processo.dependencias || [],
        observacoes_gerais: resultado.processo.observacoes_gerais,
        nivel_confianca_normalizacao: 0.8, // Pode ser calculado baseado em validação
        status: 'pendente',
        versao: 1,
      },
    })

    // Criar etapas
    if (resultado.etapas && resultado.etapas.length > 0) {
      await prisma.processoEtapa.createMany({
        data: resultado.etapas.map((etapa) => ({
          processo_normalizado_id: processo.id,
          ordem: etapa.ordem,
          nome: etapa.nome,
          descricao: etapa.descricao,
          tipo_etapa: etapa.tipo_etapa,
          sistemas_envolvidos: etapa.sistemas_envolvidos || [],
          ativos_envolvidos: etapa.ativos_envolvidos || [],
          tempo_estimado: etapa.tempo_estimado,
        })),
      })
    }

    // Criar ativos
    if (resultado.ativos && resultado.ativos.length > 0) {
      await prisma.ativo.createMany({
        data: resultado.ativos.map((ativo) => ({
          processo_normalizado_id: processo.id,
          tenant_id: tenantId,
          site_id: descricaoRaw.site_id,
          tipo: ativo.tipo,
          nome: ativo.nome,
          categoria: ativo.categoria,
          localizacao: ativo.localizacao,
          criticidade: ativo.criticidade,
          caracteristicas_tecnicas: ativo.caracteristicas_tecnicas || {},
          rede_conectividade: ativo.rede_conectividade,
          protocolos: ativo.protocolos || [],
        })),
      })
    }

    // Criar dificuldades
    if (resultado.dificuldades && resultado.dificuldades.length > 0) {
      await prisma.dificuldadeOperacional.createMany({
        data: resultado.dificuldades.map((dificuldade) => ({
          processo_normalizado_id: processo.id,
          descricao: dificuldade.descricao,
          categoria: dificuldade.categoria,
          impacto: dificuldade.impacto,
          frequencia: dificuldade.frequencia,
          sistemas_afetados: dificuldade.sistemas_afetados || [],
        })),
      })
    }

    // Criar workarounds
    if (resultado.workarounds && resultado.workarounds.length > 0) {
      await prisma.workaround.createMany({
        data: resultado.workarounds.map((workaround) => ({
          processo_normalizado_id: processo.id,
          descricao: workaround.descricao,
          razao: workaround.razao,
          risco_percebido: workaround.risco_percebido,
          categoria: workaround.categoria,
        })),
      })
    }

    logger.info({ processoId: processo.id, descricaoRawId }, 'Processo normalizado criado')

    return processo
  }

  /**
   * Processa e cria processo normalizado em uma única operação
   */
  static async processarECriar(descricaoRawId: string, tenantId: string) {
    const resultado = await this.processarDescricaoRaw(descricaoRawId, tenantId)
    const processo = await this.criarProcessoNormalizado(descricaoRawId, resultado, tenantId)
    return processo
  }
}

