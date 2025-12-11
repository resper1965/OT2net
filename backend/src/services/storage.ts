import { supabaseAdmin } from '../lib/supabase'
import { logger } from '../utils/logger'
import { AppError } from '../middleware/errorHandler'

/**
 * Serviço de gerenciamento de arquivos no Supabase Storage
 */
export class StorageService {
  /**
   * Upload de arquivo para bucket
   */
  static async uploadFile(
    bucket: string,
    path: string,
    file: Buffer | File,
    options?: {
      contentType?: string
      cacheControl?: string
      upsert?: boolean
    }
  ) {
    try {
      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(path, file, {
          contentType: options?.contentType,
          cacheControl: options?.cacheControl || '3600',
          upsert: options?.upsert || false,
        })

      if (error) throw error

      logger.info({ bucket, path }, 'Arquivo enviado com sucesso')

      return data
    } catch (error: any) {
      logger.error({ bucket, path, error: error.message }, 'Erro ao fazer upload')
      throw new AppError(`Erro ao fazer upload: ${error.message}`, 500)
    }
  }

  /**
   * Download de arquivo
   */
  static async downloadFile(bucket: string, path: string) {
    try {
      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .download(path)

      if (error) throw error

      return data
    } catch (error: any) {
      logger.error({ bucket, path, error: error.message }, 'Erro ao fazer download')
      throw new AppError(`Erro ao fazer download: ${error.message}`, 500)
    }
  }

  /**
   * Gerar URL pública
   */
  static getPublicUrl(bucket: string, path: string): string {
    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  /**
   * Gerar URL assinada (temporária) para download privado
   */
  static async getSignedUrl(
    bucket: string,
    path: string,
    expiresIn: number = 3600 // 1 hora
  ) {
    try {
      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn)

      if (error) throw error

      return data.signedUrl
    } catch (error: any) {
      logger.error({ bucket, path, error: error.message }, 'Erro ao gerar URL assinada')
      throw new AppError(`Erro ao gerar URL assinada: ${error.message}`, 500)
    }
  }

  /**
   * Listar arquivos em um bucket/pasta
   */
  static async listFiles(
    bucket: string,
    folder?: string,
    options?: {
      limit?: number
      offset?: number
      sortBy?: { column: string; order: 'asc' | 'desc' }
    }
  ) {
    try {
      let query = supabaseAdmin.storage.from(bucket).list(folder || '', {
        limit: options?.limit || 100,
        offset: options?.offset || 0,
        sortBy: options?.sortBy || { column: 'name', order: 'asc' },
      })

      const { data, error } = await query

      if (error) throw error

      return data
    } catch (error: any) {
      logger.error({ bucket, folder, error: error.message }, 'Erro ao listar arquivos')
      throw new AppError(`Erro ao listar arquivos: ${error.message}`, 500)
    }
  }

  /**
   * Deletar arquivo
   */
  static async deleteFile(bucket: string, path: string) {
    try {
      const { error } = await supabaseAdmin.storage.from(bucket).remove([path])

      if (error) throw error

      logger.info({ bucket, path }, 'Arquivo deletado com sucesso')
    } catch (error: any) {
      logger.error({ bucket, path, error: error.message }, 'Erro ao deletar arquivo')
      throw new AppError(`Erro ao deletar arquivo: ${error.message}`, 500)
    }
  }

  /**
   * Mover arquivo
   */
  static async moveFile(
    bucket: string,
    fromPath: string,
    toPath: string
  ) {
    try {
      // Download
      const file = await this.downloadFile(bucket, fromPath)

      // Upload no novo local
      await this.uploadFile(bucket, toPath, file as any, { upsert: true })

      // Deletar original
      await this.deleteFile(bucket, fromPath)

      logger.info({ bucket, fromPath, toPath }, 'Arquivo movido com sucesso')
    } catch (error: any) {
      logger.error({ bucket, fromPath, toPath, error: error.message }, 'Erro ao mover arquivo')
      throw new AppError(`Erro ao mover arquivo: ${error.message}`, 500)
    }
  }

  /**
   * Helper para organizar arquivos por projeto/entidade
   */
  static getProjectPath(projetoId: string, tipo: string, filename: string): string {
    return `${projetoId}/${tipo}/${filename}`
  }

  static getEntityPath(
    projetoId: string,
    entidadeTipo: string,
    entidadeId: string,
    filename: string
  ): string {
    return `${projetoId}/${entidadeTipo}/${entidadeId}/${filename}`
  }
}

