/**
 * Tipos compartilhados para a aplicação
 */

export interface Endereco {
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

export interface Contatos {
  telefone?: string;
  email?: string;
  responsavel?: string;
}

export interface Estrutura {
  [key: string]: unknown;
}

export interface ProcessoBase {
  id: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
  status_processamento?: string;
}

export interface DescricaoRaw extends ProcessoBase {
  titulo?: string;
  conteudo?: string;
  projeto_id?: string;
  site_id?: string;
}

export interface ProcessoNormalizado extends ProcessoBase {
  nome?: string;
  titulo?: string;
  resultado_processamento?: {
    [key: string]: unknown;
  };
  dependencias?: string[];
}


