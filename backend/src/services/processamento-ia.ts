import { AnthropicService } from './anthropic'
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
}

const SYSTEM_PROMPT = `Você é um especialista em normalização de processos operacionais de Tecnologia Operacional (TO).

Sua tarefa é analisar descrições operacionais raw (em linguagem natural) e extrair informações estruturadas sobre processos, etapas, ativos, dificuldades e workarounds.

Retorne APENAS um JSON válido no seguinte formato:
{
  "processo": {
    "nome": "Nome do processo",
    "objetivo": "Objetivo do processo",
    "gatilho": "O que inicia o processo",
    "frequencia": "Frequência de execução",
    "duracao_estimada": "Tempo estimado",
    "criticidade": "baixa|media|alta",
    "tipo_processo": "operacional|manutencao|emergencia|etc",
    "dependencias": ["processo1", "processo2"],
    "observacoes_gerais": "Observações adicionais"
  },
  "etapas": [
    {
      "ordem": 1,
      "nome": "Nome da etapa",
      "descricao": "Descrição detalhada",
      "tipo_etapa": "acao|decisao|verificacao|etc",
      "sistemas_envolvidos": ["sistema1", "sistema2"],
      "ativos_envolvidos": ["ativo1", "ativo2"],
      "tempo_estimado": "Tempo estimado"
    }
  ],
  "ativos": [
    {
      "tipo": "sistema|equipamento|documento|pessoa",
      "nome": "Nome do ativo",
      "categoria": "Categoria",
      "localizacao": "Localização",
      "criticidade": "baixa|media|alta",
      "caracteristicas_tecnicas": {},
      "rede_conectividade": "Rede",
      "protocolos": ["protocolo1", "protocolo2"]
    }
  ],
  "dificuldades": [
    {
      "descricao": "Descrição da dificuldade",
      "categoria": "tecnica|operacional|organizacional",
      "impacto": "baixo|medio|alto",
      "frequencia": "rara|ocasional|frequente",
      "sistemas_afetados": ["sistema1"]
    }
  ],
  "workarounds": [
    {
      "descricao": "Descrição do workaround",
      "razao": "Por que existe",
      "risco_percebido": "baixo|medio|alto",
      "categoria": "temporario|permanente"
    }
  ]
}

IMPORTANTE:
- Retorne APENAS o JSON, sem markdown, sem explicações
- Seja preciso e detalhado
- Identifique todos os ativos mencionados (sistemas, equipamentos, documentos, pessoas)
- Identifique dificuldades e workarounds mencionados
- Mantenha a ordem lógica das etapas`

export class ProcessamentoIAService {
  /**
   * Processa uma descrição operacional raw e retorna processo normalizado
   */
  static async processarDescricaoRaw(descricaoRawId: string): Promise<ProcessamentoResult> {
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
      // Construir prompt
      const prompt = `Analise a seguinte descrição operacional e extraia o processo normalizado:

Título: ${descricaoRaw.titulo}

Descrição:
${descricaoRaw.descricao_completa}

${descricaoRaw.frequencia ? `Frequência: ${descricaoRaw.frequencia}` : ''}
${descricaoRaw.impacto ? `Impacto: ${descricaoRaw.impacto}` : ''}
${descricaoRaw.dificuldades ? `Dificuldades mencionadas: ${descricaoRaw.dificuldades}` : ''}`

      // Chamar Claude API
      const response = await AnthropicService.sendMessage(
        'processamento_descricao_raw',
        [
          {
            role: 'user',
            content: prompt,
          },
        ],
        {
          system: SYSTEM_PROMPT,
          temperature: 0.3, // Menor temperatura para mais consistência
          maxTokens: 4096,
        }
      )

      // Extrair JSON da resposta
      const content = response.content[0]
      if (content.type !== 'text') {
        throw new AppError('Resposta da IA não é texto', 500)
      }

      // Parse JSON (pode estar dentro de markdown code blocks)
      let jsonText = content.text.trim()
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```json\n?/, '').replace(/```$/, '').trim()
      }

      const resultado: ProcessamentoResult = JSON.parse(jsonText)

      // Salvar resultado no banco
      await prisma.descricaoOperacionalRaw.update({
        where: { id: descricaoRawId },
        data: {
          status_processamento: 'processado',
          resultado_processamento: resultado as any,
          processado_por_ia: true,
        },
      })

      logger.info({ descricaoRawId }, 'Descrição raw processada com sucesso')

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
    resultado: ProcessamentoResult
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
  static async processarECriar(descricaoRawId: string) {
    const resultado = await this.processarDescricaoRaw(descricaoRawId)
    const processo = await this.criarProcessoNormalizado(descricaoRawId, resultado)
    return processo
  }
}

