/**
 * Script para ingestão de documentos da ONS
 * 
 * Este script permite:
 * 1. Importar metadados de documentos ONS de um arquivo JSON
 * 2. Opcionalmente fazer download dos PDFs e extrair texto
 * 3. Vetorizar e armazenar no banco de dados
 * 
 * Uso:
 *   # Apenas importar metadados (sem download de PDFs)
 *   tsx scripts/ingestir-documentos-ons.ts data/ons-documentos-metadados.json
 * 
 *   # Importar e fazer download dos PDFs (requer bibliotecas adicionais)
 *   tsx scripts/ingestir-documentos-ons.ts data/ons-documentos-metadados.json --download
 */

import { RAGService } from '../src/services/rag-service'
import { logger } from '../src/utils/logger'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'
import { URL } from 'url'

interface DocumentoONS {
  framework: 'ONS'
  codigo: string
  titulo: string
  descricao: string
  categoria?: string
  versao?: string
  url?: string
  tipo?: string
  observacao?: string
  modulo?: string
  submodulo?: string
  historico?: boolean
}

interface DocumentoComConteudo extends DocumentoONS {
  conteudoTexto?: string
  conteudoExtraido?: boolean
}

/**
 * Faz download de um arquivo PDF da URL fornecida
 */
async function downloadPDF(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url)
    const client = parsedUrl.protocol === 'https:' ? https : http

    const file = fs.createWriteStream(outputPath)

    client
      .get(url, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          // Seguir redirect
          return downloadPDF(response.headers.location!, outputPath)
            .then(resolve)
            .catch(reject)
        }

        if (response.statusCode !== 200) {
          file.close()
          fs.unlinkSync(outputPath)
          reject(new Error(`Falha ao baixar: ${response.statusCode}`))
          return
        }

        response.pipe(file)

        file.on('finish', () => {
          file.close()
          resolve()
        })
      })
      .on('error', (err) => {
        file.close()
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath)
        }
        reject(err)
      })
  })
}

/**
 * Extrai texto de um PDF (requer biblioteca pdf-parse)
 * Retorna null se a biblioteca não estiver disponível
 */
async function extrairTextoPDF(pdfPath: string): Promise<string | null> {
  try {
    // Tentar importar pdf-parse dinamicamente
    const pdfParse = await import('pdf-parse').catch(() => null)

    if (!pdfParse) {
      logger.warn('Biblioteca pdf-parse não encontrada. Instale com: npm install pdf-parse')
      return null
    }

    const dataBuffer = fs.readFileSync(pdfPath)
    const data = await pdfParse.default(dataBuffer)
    return data.text
  } catch (error: any) {
    logger.error({ error: error.message }, 'Erro ao extrair texto do PDF')
    return null
  }
}

/**
 * Processa um documento ONS
 */
async function processarDocumento(
  documento: DocumentoONS,
  downloadPDFs: boolean = false
): Promise<DocumentoComConteudo> {
  const resultado: DocumentoComConteudo = { ...documento }

  // Se for PDF e download estiver habilitado
  if (downloadPDFs && documento.url && documento.tipo === 'PDF') {
    try {
      const tempDir = path.join(process.cwd(), 'temp')
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true })
      }

      const fileName = `${documento.codigo.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
      const pdfPath = path.join(tempDir, fileName)

      logger.info({ url: documento.url, path: pdfPath }, 'Fazendo download do PDF')

      await downloadPDF(documento.url, pdfPath)

      logger.info({ path: pdfPath }, 'PDF baixado, extraindo texto')

      const texto = await extrairTextoPDF(pdfPath)

      if (texto) {
        resultado.conteudoTexto = texto
        resultado.conteudoExtraido = true

        // Se conseguiu extrair texto, usar no lugar da descrição
        if (texto.length > documento.descricao.length) {
          // Combinar descrição original com trecho do texto extraído
          const trechoTexto = texto.substring(0, 2000).trim()
          resultado.descricao = `${documento.descricao}\n\nConteúdo extraído:\n${trechoTexto}...`
        }
      }

      // Limpar arquivo temporário
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath)
      }
    } catch (error: any) {
      logger.warn(
        { codigo: documento.codigo, error: error.message },
        'Erro ao processar PDF, usando apenas metadados'
      )
    }
  }

  return resultado
}

/**
 * Função principal de ingestão
 */
async function ingestirDocumentosONS(
  arquivo: string,
  downloadPDFs: boolean = false
) {
  try {
    const arquivoPath = path.resolve(process.cwd(), arquivo)

    if (!fs.existsSync(arquivoPath)) {
      throw new Error(`Arquivo não encontrado: ${arquivoPath}`)
    }

    logger.info({ arquivo: arquivoPath, downloadPDFs }, 'Iniciando ingestão de documentos ONS')

    // Ler e parsear arquivo JSON
    const conteudo = fs.readFileSync(arquivoPath, 'utf-8')
    const documentos: DocumentoONS[] = JSON.parse(conteudo)

    if (!Array.isArray(documentos)) {
      throw new Error('O arquivo deve conter um array de documentos')
    }

    logger.info({ total: documentos.length }, 'Documentos encontrados no arquivo')

    // Validar documentos
    const documentosValidos: DocumentoONS[] = []
    const documentosInvalidos: Array<{ documento: any; erro: string }> = []

    for (const doc of documentos) {
      if (!doc.framework || doc.framework !== 'ONS') {
        documentosInvalidos.push({
          documento: doc,
          erro: 'Framework deve ser ONS',
        })
        continue
      }

      if (!doc.codigo || !doc.titulo || !doc.descricao) {
        documentosInvalidos.push({
          documento: doc,
          erro: 'Código, título e descrição são obrigatórios',
        })
        continue
      }

      documentosValidos.push(doc)
    }

    if (documentosInvalidos.length > 0) {
      logger.warn(
        { invalidos: documentosInvalidos.length },
        'Documentos inválidos encontrados'
      )
      console.log('\nDocumentos inválidos:')
      documentosInvalidos.forEach(({ documento, erro }) => {
        console.log(`  - ${documento.codigo || 'Sem código'}: ${erro}`)
      })
    }

    if (documentosValidos.length === 0) {
      throw new Error('Nenhum documento válido encontrado')
    }

    logger.info(
      { validos: documentosValidos.length, invalidos: documentosInvalidos.length },
      'Processando documentos válidos'
    )

    // Processar documentos (com ou sem download de PDFs)
    const documentosProcessados: DocumentoComConteudo[] = []

    for (const doc of documentosValidos) {
      try {
        const processado = await processarDocumento(doc, downloadPDFs)
        documentosProcessados.push(processado)

        // Delay entre downloads para evitar rate limiting
        if (downloadPDFs && doc.tipo === 'PDF') {
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      } catch (error: any) {
        logger.warn(
          { codigo: doc.codigo, error: error.message },
          'Erro ao processar documento, continuando...'
        )
        // Adicionar mesmo assim com metadados apenas
        documentosProcessados.push(doc as DocumentoComConteudo)
      }
    }

    // Preparar regras para importação
    const regrasParaImportar = documentosProcessados.map((doc) => ({
      framework: doc.framework as 'ONS',
      codigo: doc.codigo,
      titulo: doc.titulo,
      descricao: doc.descricao,
      categoria: doc.categoria,
      versao: doc.versao,
    }))

    // Importar usando RAGService
    logger.info({ total: regrasParaImportar.length }, 'Iniciando vetorização e importação')

    const resultado = await RAGService.processarRegrasEmLote(regrasParaImportar, 3)

    console.log('\n=== Resultado da Ingestão ===')
    console.log(`✅ Sucesso: ${resultado.sucesso}`)
    console.log(`❌ Erros: ${resultado.erro}`)

    if (resultado.erros.length > 0) {
      console.log('\nErros encontrados:')
      resultado.erros.forEach(({ codigo, erro }) => {
        console.log(`  - ${codigo}: ${erro}`)
      })
    }

    // Estatísticas
    const comConteudoExtraido = documentosProcessados.filter((d) => d.conteudoExtraido).length
    if (downloadPDFs && comConteudoExtraido > 0) {
      console.log(`\n📄 PDFs processados: ${comConteudoExtraido}/${documentosValidos.length}`)
    }

    logger.info(
      {
        sucesso: resultado.sucesso,
        erro: resultado.erro,
        pdfsProcessados: comConteudoExtraido,
      },
      'Ingestão concluída'
    )
  } catch (error: any) {
    logger.error({ error: error.message }, 'Erro ao ingerir documentos ONS')
    console.error('\n❌ Erro:', error.message)
    process.exit(1)
  }
}

// Executar script
const arquivo = process.argv[2]
const downloadPDFs = process.argv.includes('--download')

if (!arquivo) {
  console.error('Uso: tsx scripts/ingestir-documentos-ons.ts <arquivo.json> [--download]')
  console.error('\nExemplo:')
  console.error('  # Apenas importar metadados')
  console.error('  tsx scripts/ingestir-documentos-ons.ts data/ons-documentos-metadados.json')
  console.error('\n  # Importar e fazer download dos PDFs (requer pdf-parse)')
  console.error('  tsx scripts/ingestir-documentos-ons.ts data/ons-documentos-metadados.json --download')
  console.error('\n  # Instalar pdf-parse para extração de texto:')
  console.error('  npm install pdf-parse')
  process.exit(1)
}

ingestirDocumentosONS(arquivo, downloadPDFs)
  .then(() => {
    console.log('\n✅ Ingestão concluída com sucesso!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error.message)
    process.exit(1)
  })

