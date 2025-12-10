# Ingestão de Documentos ONS

Este documento descreve como ingerir documentos da ONS (Operador Nacional do Sistema Elétrico) no sistema RAG.

## Visão Geral

O sistema permite ingerir documentos ONS de duas formas:

1. **Apenas Metadados**: Importa informações sobre os documentos (título, descrição, URL, etc.) sem fazer download dos PDFs
2. **Com Download e Extração**: Faz download dos PDFs, extrai o texto e inclui no conteúdo vetorizado

## Arquivo de Metadados

O arquivo `backend/data/ons-documentos-metadados.json` contém os metadados dos documentos ONS fornecidos:

- **PR-INDICE**: Página índice dos Procedimentos de Rede
- **PR-23.3**: Submódulo 23.3 - Diretrizes e critérios para estudos elétricos (versão atual)
- **PR-23.3-REV0**: Submódulo 23.3 (versão histórica)
- **PR-10.1**: Submódulo 10.1 - Manual de Procedimentos da Operação
- **PR-10.14**: Submódulo 10.14 - Requisitos operacionais
- **RO-CB.BR.01**: Norma de cibersegurança (ARCiber)
- **PR-MAPEAMENTO**: Mapeamento de submódulos reestruturados

## Uso

### Opção 1: Importar Apenas Metadados (Recomendado para início)

```bash
cd backend
tsx scripts/ingestir-documentos-ons.ts data/ons-documentos-metadados.json
```

Esta opção:
- ✅ Rápida e simples
- ✅ Não requer bibliotecas adicionais
- ✅ Usa as descrições fornecidas no JSON
- ⚠️ Não inclui o conteúdo completo dos PDFs

### Opção 2: Importar com Download e Extração de PDFs

```bash
# Primeiro, instalar biblioteca para extração de PDFs
npm install pdf-parse

# Depois, executar com flag --download
cd backend
tsx scripts/ingestir-documentos-ons.ts data/ons-documentos-metadados.json --download
```

Esta opção:
- ✅ Inclui conteúdo completo dos PDFs
- ✅ Mais informações para o RAG
- ⚠️ Requer download dos PDFs (mais lento)
- ⚠️ Requer biblioteca adicional (pdf-parse)

## Estrutura do Arquivo JSON

```json
{
  "framework": "ONS",
  "codigo": "PR-23.3",
  "titulo": "Submódulo 23.3 – Diretrizes e critérios para estudos elétricos",
  "descricao": "Descrição completa do documento...",
  "categoria": "Estudos Elétricos",
  "versao": "2018.08",
  "url": "https://www.ons.org.br/...",
  "tipo": "PDF",
  "observacao": "Versão 2018.08 (atual)",
  "modulo": "23",
  "submodulo": "23.3"
}
```

### Campos Obrigatórios

- `framework`: Deve ser "ONS"
- `codigo`: Código único do documento
- `titulo`: Título do documento
- `descricao`: Descrição completa (será vetorizada)

### Campos Opcionais

- `categoria`: Categoria do documento
- `versao`: Versão do documento
- `url`: URL do documento (necessária para download)
- `tipo`: Tipo do documento ("PDF", "Página Web", etc.)
- `observacao`: Observações adicionais
- `modulo`: Número do módulo (se aplicável)
- `submodulo`: Número do submódulo (se aplicável)
- `historico`: Se é uma versão histórica

## Processo de Ingestão

1. **Validação**: Verifica se todos os campos obrigatórios estão presentes
2. **Download (opcional)**: Se `--download` for usado, faz download dos PDFs
3. **Extração (opcional)**: Extrai texto dos PDFs usando pdf-parse
4. **Vetorização**: Gera embeddings usando Gemini/OpenAI
5. **Armazenamento**: Salva no banco de dados com embeddings

## Adicionar Novos Documentos

Para adicionar novos documentos ONS:

1. Edite o arquivo `backend/data/ons-documentos-metadados.json`
2. Adicione um novo objeto com os metadados do documento
3. Execute o script de ingestão novamente

Exemplo:

```json
{
  "framework": "ONS",
  "codigo": "PR-10.15",
  "titulo": "Submódulo 10.15 – Novo Procedimento",
  "descricao": "Descrição do novo procedimento...",
  "categoria": "Operação",
  "versao": "2024.01",
  "url": "https://www.ons.org.br/...",
  "tipo": "PDF",
  "modulo": "10",
  "submodulo": "10.15"
}
```

## Verificar Documentos Ingeridos

Após a ingestão, você pode verificar os documentos no banco:

```bash
# Via API
GET /api/rag/regras?framework=ONS

# Ou consultar diretamente
POST /api/rag/consultar
{
  "pergunta": "Quais são os requisitos do Submódulo 10.14?",
  "framework": "ONS"
}
```

## Troubleshooting

### Erro: "Biblioteca pdf-parse não encontrada"

Se você tentar usar `--download` sem ter instalado a biblioteca:

```bash
npm install pdf-parse
```

### Erro: "Falha ao baixar: 404"

Algumas URLs podem estar quebradas ou ter mudado. Verifique:
- Se a URL está correta
- Se o documento ainda está disponível no site da ONS
- Se há redirecionamentos (o script tenta seguir redirects)

### Erro: "Erro ao extrair texto do PDF"

Alguns PDFs podem estar protegidos ou corrompidos. O script continuará usando apenas os metadados.

### Documentos duplicados

Se um documento com o mesmo código já existe, o script retornará erro 409. Para atualizar:
1. Remova o documento antigo do banco
2. Execute a ingestão novamente
3. Ou use a rota de re-vetorização: `POST /api/rag/regras/:id/re-vetorizar`

## Próximos Passos

1. **Automatização**: Criar job agendado para verificar novos documentos
2. **Web Scraping**: Automatizar descoberta de novos documentos no site da ONS
3. **Versionamento**: Rastrear mudanças em documentos existentes
4. **Notificações**: Alertar quando novos documentos são publicados

## Referências

- [Site ONS - Procedimentos de Rede](https://www.ons.org.br/paginas/sobre-o-ons/procedimentos-de-rede/vigentes)
- [Documentação RAG](./rag-gemini-aneel-ons.md)

