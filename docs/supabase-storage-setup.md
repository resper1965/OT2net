# Configuração Supabase Storage

Este documento descreve como configurar e usar o Supabase Storage para gerenciamento de arquivos.

## Buckets Necessários

Criar os seguintes buckets no Supabase Dashboard:

1. **documentos** - Documentos do projeto (PDFs, DOCX)
2. **questionarios** - Anexos de questionários
3. **evidencias** - Evidências de conformidade
4. **diagramas** - Diagramas Mermaid exportados

## Como Criar Buckets

1. Acesse: https://app.supabase.com/project/hyeifxvxifhrapfdvfry/storage/buckets
2. Clique em "New bucket"
3. Configure:
   - **Name**: nome do bucket (ex: `documentos`)
   - **Public bucket**: `false` (privado, requer autenticação)
   - **File size limit**: 50 MB (ou conforme necessário)
   - **Allowed MIME types**: Deixe vazio para permitir todos, ou especifique (ex: `application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document`)

## RLS Policies

### Exemplo: Bucket `documentos`

```sql
-- Permitir upload apenas para usuários autenticados
CREATE POLICY "Users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documentos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Permitir leitura apenas para usuários do projeto
CREATE POLICY "Users can read project documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documentos' AND
  EXISTS (
    SELECT 1 FROM projetos p
    JOIN membros_equipe me ON me.projeto_id = p.id
    WHERE me.usuario_id = auth.uid()::text
    AND (storage.foldername(name))[1] = p.id::text
  )
);
```

## Uso no Frontend

### Upload de Arquivo

```typescript
import { supabase } from '@/lib/supabase/client'

async function uploadDocument(projetoId: string, file: File) {
  const path = `${projetoId}/documentos/${file.name}`
  
  const { data, error } = await supabase.storage
    .from('documentos')
    .upload(path, file)

  if (error) {
    console.error('Erro ao fazer upload:', error)
    return
  }

  return data
}
```

### Download de Arquivo

```typescript
// URL pública (se bucket for público)
const { data } = supabase.storage
  .from('documentos')
  .getPublicUrl(path)

// URL assinada (para buckets privados)
const { data } = await supabase.storage
  .from('documentos')
  .createSignedUrl(path, 3600) // 1 hora
```

## Uso no Backend

Use o `StorageService`:

```typescript
import { StorageService } from '@/services/storage'

// Upload
await StorageService.uploadFile(
  'documentos',
  StorageService.getProjectPath(projetoId, 'documentos', filename),
  fileBuffer
)

// URL assinada
const url = await StorageService.getSignedUrl(
  'documentos',
  path,
  3600
)
```

## Organização de Arquivos

Estrutura recomendada:

```
documentos/
  {projeto_id}/
    documentos/
      arquivo1.pdf
      arquivo2.docx
    evidencias/
      evidencia1.pdf
    diagramas/
      processo1.png
      processo2.svg

questionarios/
  {questionario_id}/
    anexo1.pdf
    anexo2.jpg
```

## Referências

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Storage RLS](https://supabase.com/docs/guides/storage/security/access-control)

