/**
 * Script para importar regras da ANEEL, ONS e normas BPMN 2.0
 * 
 * Este script permite importar regras regulatórias e normas de arquivos JSON
 * e vetorizá-las automaticamente usando o serviço RAG.
 * 
 * Uso:
 *   tsx scripts/importar-regras-aneel-ons.ts <arquivo.json>
 * 
 * Formato do arquivo JSON:
 * [
 *   {
 *     "framework": "ANEEL" | "ONS" | "BPMN",
 *     "codigo": "Código da regra/norma",
 *     "titulo": "Título da regra/norma",
 *     "descricao": "Descrição completa da regra/norma",
 *     "categoria": "Categoria (opcional)",
 *     "versao": "Versão (opcional)"
 *   }
 * ]
 */

import { RAGService, FrameworkType } from '../src/services/rag-service'
import { logger } from '../src/utils/logger'
import * as fs from 'fs'
import * as path from 'path'

interface RegraImportacao {
  framework: FrameworkType
  codigo: string
  titulo: string
  descricao: string
  categoria?: string
  versao?: string
}

async function importarRegras(arquivo: string) {
  try {
    const arquivoPath = path.resolve(process.cwd(), arquivo)

    if (!fs.existsSync(arquivoPath)) {
      throw new Error(`Arquivo não encontrado: ${arquivoPath}`)
    }

    logger.info({ arquivo: arquivoPath }, 'Lendo arquivo de regras')

    // Ler e parsear arquivo JSON
    const conteudo = fs.readFileSync(arquivoPath, 'utf-8')
    const regras: RegraImportacao[] = JSON.parse(conteudo)

    if (!Array.isArray(regras)) {
      throw new Error('O arquivo deve conter um array de regras')
    }

    logger.info({ total: regras.length }, 'Regras encontradas no arquivo')

    // Validar regras
    const regrasValidas: RegraImportacao[] = []
    const regrasInvalidas: Array<{ regra: any; erro: string }> = []

    for (const regra of regras) {
      if (!regra.framework || !['ANEEL', 'ONS', 'BPMN'].includes(regra.framework)) {
        regrasInvalidas.push({
          regra,
          erro: 'Framework deve ser ANEEL, ONS ou BPMN',
        })
        continue
      }

      if (!regra.codigo || !regra.titulo || !regra.descricao) {
        regrasInvalidas.push({
          regra,
          erro: 'Código, título e descrição são obrigatórios',
        })
        continue
      }

      regrasValidas.push(regra)
    }

    if (regrasInvalidas.length > 0) {
      logger.warn(
        { invalidas: regrasInvalidas.length },
        'Regras inválidas encontradas'
      )
      console.log('\nRegras inválidas:')
      regrasInvalidas.forEach(({ regra, erro }) => {
        console.log(`  - ${regra.codigo || 'Sem código'}: ${erro}`)
      })
    }

    if (regrasValidas.length === 0) {
      throw new Error('Nenhuma regra válida encontrada')
    }

    logger.info(
      { validas: regrasValidas.length, invalidas: regrasInvalidas.length },
      'Processando regras válidas'
    )

    // Processar regras em lote
    const resultado = await RAGService.processarRegrasEmLote(regrasValidas, 5)

    console.log('\n=== Resultado da Importação ===')
    console.log(`✅ Sucesso: ${resultado.sucesso}`)
    console.log(`❌ Erros: ${resultado.erro}`)

    if (resultado.erros.length > 0) {
      console.log('\nErros encontrados:')
      resultado.erros.forEach(({ codigo, erro }) => {
        console.log(`  - ${codigo}: ${erro}`)
      })
    }

    logger.info(
      { sucesso: resultado.sucesso, erro: resultado.erro },
      'Importação concluída'
    )
  } catch (error: any) {
    logger.error({ error: error.message }, 'Erro ao importar regras')
    console.error('\n❌ Erro:', error.message)
    process.exit(1)
  }
}

// Executar script
const arquivo = process.argv[2]

if (!arquivo) {
  console.error('Uso: tsx scripts/importar-regras-aneel-ons.ts <arquivo.json>')
  console.error('\nExemplo:')
  console.error('  tsx scripts/importar-regras-aneel-ons.ts data/regras-aneel.json')
  process.exit(1)
}

importarRegras(arquivo)
  .then(() => {
    console.log('\n✅ Importação concluída com sucesso!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error.message)
    process.exit(1)
  })

