# Ingestão de Documentos ONS - Resumo Rápido

## ✅ Sistema Pronto para Ingestão

O sistema está configurado e pronto para ingerir os documentos ONS fornecidos.

## 📁 Arquivos Criados

1. **`backend/data/ons-documentos-metadados.json`**
   - Contém metadados de 7 documentos ONS
   - Inclui URLs, descrições, categorias e versões
   - Pronto para uso imediato

2. **`backend/scripts/ingestir-documentos-ons.ts`**
   - Script especializado para ingestão de documentos ONS
   - Suporta importação apenas de metadados ou com download de PDFs
   - Tratamento de erros e logging completo

3. **`docs/INGESTAO-ONS.md`**
   - Documentação completa do processo de ingestão

## 🚀 Como Usar

### Opção 1: Importação Rápida (Apenas Metadados)

```bash
cd backend
tsx scripts/ingestir-documentos-ons.ts data/ons-documentos-metadados.json
```

✅ **Vantagens:**
- Rápido e simples
- Não requer bibliotecas adicionais
- Usa descrições fornecidas no JSON

### Opção 2: Importação Completa (Com PDFs)

```bash
# Instalar biblioteca para extração de PDFs
npm install pdf-parse

# Executar com download
cd backend
tsx scripts/ingestir-documentos-ons.ts data/ons-documentos-metadados.json --download
```

✅ **Vantagens:**
- Inclui conteúdo completo dos PDFs
- Mais informações para o RAG
- Melhor precisão nas consultas

## 📋 Documentos Incluídos

O arquivo `ons-documentos-metadados.json` contém:

1. **PR-INDICE**: Página índice dos Procedimentos de Rede
2. **PR-23.3**: Submódulo 23.3 - Diretrizes e critérios para estudos elétricos (2018.08)
3. **PR-23.3-REV0**: Versão histórica do Submódulo 23.3
4. **PR-10.1**: Submódulo 10.1 - Manual de Procedimentos da Operação
5. **PR-10.14**: Submódulo 10.14 - Requisitos operacionais (2020.06)
6. **RO-CB.BR.01**: Norma de cibersegurança (ARCiber)
7. **PR-MAPEAMENTO**: Mapeamento de submódulos reestruturados

## 🔍 Verificar Documentos Ingeridos

Após a ingestão, consulte via API:

```bash
# Listar documentos ONS
GET /api/rag/regras?framework=ONS

# Consultar sobre um documento específico
POST /api/rag/consultar
{
  "pergunta": "Quais são os requisitos do Submódulo 10.14?",
  "framework": "ONS"
}
```

## 📝 Adicionar Mais Documentos

Para adicionar novos documentos ONS:

1. Edite `backend/data/ons-documentos-metadados.json`
2. Adicione um novo objeto com os metadados
3. Execute o script novamente

## ⚠️ Observações

- O script tenta seguir redirects HTTP automaticamente
- PDFs são baixados em diretório temporário e removidos após processamento
- Se o download falhar, o script continua usando apenas metadados
- Documentos duplicados (mesmo código) retornam erro 409

## 📚 Documentação Completa

Veja [docs/INGESTAO-ONS.md](./INGESTAO-ONS.md) para documentação detalhada.

