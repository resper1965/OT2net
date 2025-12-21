-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PLATFORM_ADMIN', 'ADMIN', 'GERENTE_PROJETO', 'CONSULTOR', 'CLIENTE', 'AUDITOR');

-- CreateTable
CREATE TABLE "tenants" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizacoes" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID NOT NULL,
    "razao_social" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "endereco" JSONB,
    "contatos" JSONB,
    "classificacao" TEXT,
    "estrutura" JSONB,
    "agencias_reguladoras" TEXT[],
    "certificacoes" TEXT[],
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID NOT NULL,
    "organizacao_id" UUID,
    "identificacao" TEXT NOT NULL,
    "tipo" TEXT,
    "participacao_acionaria" TEXT,
    "ambito_operacional" TEXT,
    "contexto_operacional" TEXT,
    "status" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sites" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID NOT NULL,
    "empresa_id" UUID,
    "identificacao" TEXT NOT NULL,
    "classificacao" TEXT,
    "criticidade_operacional" TEXT,
    "localizacao_geografica" JSONB,
    "infraestrutura_comunicacao" JSONB,
    "sistemas_principais" TEXT[],
    "responsaveis" JSONB,
    "seguranca_fisica" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projetos" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID NOT NULL,
    "organizacao_id" UUID,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "fase_atual" TEXT DEFAULT 'fase-1',
    "progresso_geral" DOUBLE PRECISION DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projetos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fases" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "cor" TEXT NOT NULL,
    "icone" TEXT,

    CONSTRAINT "fases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fase_etapas" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "fase_id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "obrigatoria" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "fase_etapas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projeto_fases" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "projeto_id" UUID NOT NULL,
    "fase_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'nao_iniciada',
    "data_inicio" TIMESTAMPTZ(6),
    "data_conclusao" TIMESTAMPTZ(6),
    "progresso" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projeto_fases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projeto_etapas_completadas" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "projeto_id" UUID NOT NULL,
    "fase_etapa_id" UUID NOT NULL,
    "completada_em" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completada_por" UUID,
    "observacoes" TEXT,

    CONSTRAINT "projeto_etapas_completadas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membros_equipe" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID NOT NULL,
    "projeto_id" UUID,
    "organizacao_id" UUID,
    "usuario_id" UUID,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "cargo" TEXT,
    "departamento" TEXT,
    "telefone" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'EQUIPE_INTERNA',
    "papel" TEXT,
    "responsabilidade" TEXT,
    "autoridade" TEXT,
    "consultado" BOOLEAN DEFAULT false,
    "informado" BOOLEAN DEFAULT false,
    "poder_influencia" TEXT,
    "nivel_interesse" TEXT,
    "estrategia_engajamento" TEXT,
    "expertise" TEXT,
    "localizacao" TEXT,
    "ativo" BOOLEAN DEFAULT true,
    "observacoes" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "membros_equipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "descricoes_operacionais_raw" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID NOT NULL,
    "projeto_id" UUID,
    "titulo" TEXT NOT NULL,
    "descricao_completa" TEXT NOT NULL,
    "frequencia" TEXT,
    "impacto" TEXT,
    "dificuldades" TEXT,
    "pessoa_id" UUID,
    "site_id" UUID,
    "cargo" TEXT,
    "turno" TEXT,
    "data_coleta" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "metodo_coleta" TEXT,
    "status_processamento" TEXT DEFAULT 'pendente',
    "resultado_processamento" JSONB,
    "score_qualidade" DOUBLE PRECISION,
    "processado_por_ia" BOOLEAN DEFAULT false,
    "revisado_por_id" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "descricoes_operacionais_raw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processos_normalizados" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID NOT NULL,
    "descricao_raw_id" UUID,
    "nome" TEXT NOT NULL,
    "objetivo" TEXT,
    "gatilho" TEXT,
    "frequencia" TEXT,
    "duracao_estimada" TEXT,
    "criticidade" TEXT,
    "dependencias" TEXT[],
    "observacoes_gerais" TEXT,
    "nivel_confianca_normalizacao" DOUBLE PRECISION,
    "tipo_processo" TEXT,
    "status" TEXT DEFAULT 'pendente',
    "versao" INTEGER DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "processos_normalizados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processo_etapas" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "processo_normalizado_id" UUID,
    "ordem" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo_etapa" TEXT,
    "sistemas_envolvidos" TEXT[],
    "ativos_envolvidos" TEXT[],
    "tempo_estimado" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "processo_etapas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ativos" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID NOT NULL,
    "site_id" UUID,
    "processo_normalizado_id" UUID,
    "tipo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" TEXT,
    "localizacao" TEXT,
    "criticidade" TEXT,
    "caracteristicas_tecnicas" JSONB,
    "rede_conectividade" TEXT,
    "protocolos" TEXT[],
    "seguranca" JSONB,
    "lifecycle" JSONB,
    "documentacao" JSONB,
    "conformidade" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ativos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dificuldades_operacionais" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "processo_normalizado_id" UUID,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT,
    "impacto" TEXT,
    "frequencia" TEXT,
    "sistemas_afetados" TEXT[],
    "data_identificacao" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dificuldades_operacionais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workarounds" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "processo_normalizado_id" UUID,
    "descricao" TEXT NOT NULL,
    "razao" TEXT,
    "risco_percebido" TEXT,
    "categoria" TEXT,
    "data_identificacao" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workarounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionarios" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID NOT NULL,
    "projeto_id" UUID,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "status" TEXT DEFAULT 'rascunho',
    "data_criacao" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "data_publicacao" TIMESTAMPTZ(6),
    "data_fechamento" TIMESTAMPTZ(6),
    "anonimo" BOOLEAN DEFAULT false,
    "link_acesso" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questionarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questoes" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "questionario_id" UUID,
    "tipo_questao" TEXT NOT NULL,
    "texto_questao" TEXT NOT NULL,
    "opcoes_resposta" JSONB,
    "obrigatoria" BOOLEAN DEFAULT false,
    "ordem" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respostas_questionario" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "questionario_id" UUID,
    "respondente_id" UUID,
    "data_preenchimento" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "progresso" DOUBLE PRECISION DEFAULT 0,
    "status" TEXT DEFAULT 'em_progresso',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "respostas_questionario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respostas_questao" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "resposta_questionario_id" UUID,
    "questao_id" UUID,
    "resposta_texto" TEXT,
    "resposta_numero" DOUBLE PRECISION,
    "resposta_data" DATE,
    "resposta_multipla_escolha" TEXT[],
    "resposta_escala" INTEGER,
    "resposta_arquivo_url" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "respostas_questao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "iniciativas" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID NOT NULL,
    "projeto_id" UUID,
    "plano_diretor_id" UUID,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "dominio_governanca" TEXT,
    "status" TEXT DEFAULT 'planejada',
    "progresso_percentual" DOUBLE PRECISION DEFAULT 0,
    "saude" TEXT DEFAULT 'verde',
    "responsavel_id" UUID,
    "data_inicio" DATE,
    "data_fim_prevista" DATE,
    "data_fim_real" DATE,
    "prioridade" TEXT,
    "custo_estimado" DOUBLE PRECISION,
    "beneficio_estimado" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "iniciativas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID NOT NULL,
    "firebase_uid" TEXT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CONSULTOR',
    "organizacao" TEXT,
    "organizacao_id" UUID,
    "status" TEXT DEFAULT 'ativo',
    "ultimo_acesso" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissoes" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "usuario_id" UUID,
    "entidade_tipo" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chamadas_ia" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID,
    "funcionalidade" TEXT NOT NULL,
    "tokens_input" INTEGER,
    "tokens_output" INTEGER,
    "custo" DOUBLE PRECISION,
    "sucesso" BOOLEAN DEFAULT true,
    "erro" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chamadas_ia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requisitos_framework" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID,
    "framework" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT,
    "versao" TEXT,
    "embedding" vector(768) NOT NULL,
    "data_vetorizacao" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "requisitos_framework_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analises_conformidade" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID NOT NULL,
    "requisito_id" UUID,
    "entidade_tipo" TEXT NOT NULL,
    "entidade_id" UUID NOT NULL,
    "similaridade" DOUBLE PRECISION,
    "status" TEXT,
    "evidencias" UUID[],
    "gaps" TEXT[],
    "recomendacoes" TEXT[],
    "analisado_por_ia" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analises_conformidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riscos" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID NOT NULL,
    "projeto_id" UUID,
    "ativo_id" UUID,
    "processo_id" UUID,
    "site_id" UUID,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "classificacao" TEXT,
    "impacto" TEXT,
    "probabilidade" TEXT,
    "controles_existentes" TEXT,
    "data_identificacao" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "riscos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicadores" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID NOT NULL,
    "dominio_governanca" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "formula" TEXT,
    "fonte_dados" TEXT,
    "baseline" DOUBLE PRECISION,
    "target" DOUBLE PRECISION,
    "threshold_verde" DOUBLE PRECISION,
    "threshold_amarelo" DOUBLE PRECISION,
    "threshold_vermelho" DOUBLE PRECISION,
    "responsavel_id" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "indicadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_queue" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID,
    "tipo" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "prioridade" INTEGER NOT NULL DEFAULT 0,
    "tentativas" INTEGER NOT NULL DEFAULT 0,
    "max_tentativas" INTEGER NOT NULL DEFAULT 3,
    "erro" TEXT,
    "agendado_para" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "processado_em" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE INDEX "organizacoes_tenant_id_idx" ON "organizacoes"("tenant_id");

-- CreateIndex
CREATE INDEX "organizacoes_cnpj_idx" ON "organizacoes"("cnpj");

-- CreateIndex
CREATE INDEX "empresas_tenant_id_idx" ON "empresas"("tenant_id");

-- CreateIndex
CREATE INDEX "empresas_organizacao_id_idx" ON "empresas"("organizacao_id");

-- CreateIndex
CREATE INDEX "sites_tenant_id_idx" ON "sites"("tenant_id");

-- CreateIndex
CREATE INDEX "sites_empresa_id_idx" ON "sites"("empresa_id");

-- CreateIndex
CREATE INDEX "projetos_tenant_id_idx" ON "projetos"("tenant_id");

-- CreateIndex
CREATE INDEX "projetos_organizacao_id_idx" ON "projetos"("organizacao_id");

-- CreateIndex
CREATE UNIQUE INDEX "fases_codigo_key" ON "fases"("codigo");

-- CreateIndex
CREATE INDEX "fase_etapas_fase_id_idx" ON "fase_etapas"("fase_id");

-- CreateIndex
CREATE INDEX "projeto_fases_projeto_id_idx" ON "projeto_fases"("projeto_id");

-- CreateIndex
CREATE INDEX "projeto_fases_fase_id_idx" ON "projeto_fases"("fase_id");

-- CreateIndex
CREATE UNIQUE INDEX "projeto_fases_projeto_id_fase_id_key" ON "projeto_fases"("projeto_id", "fase_id");

-- CreateIndex
CREATE INDEX "projeto_etapas_completadas_projeto_id_idx" ON "projeto_etapas_completadas"("projeto_id");

-- CreateIndex
CREATE INDEX "projeto_etapas_completadas_fase_etapa_id_idx" ON "projeto_etapas_completadas"("fase_etapa_id");

-- CreateIndex
CREATE UNIQUE INDEX "projeto_etapas_completadas_projeto_id_fase_etapa_id_key" ON "projeto_etapas_completadas"("projeto_id", "fase_etapa_id");

-- CreateIndex
CREATE INDEX "membros_equipe_tenant_id_idx" ON "membros_equipe"("tenant_id");

-- CreateIndex
CREATE INDEX "membros_equipe_projeto_id_idx" ON "membros_equipe"("projeto_id");

-- CreateIndex
CREATE INDEX "membros_equipe_organizacao_id_idx" ON "membros_equipe"("organizacao_id");

-- CreateIndex
CREATE INDEX "membros_equipe_usuario_id_idx" ON "membros_equipe"("usuario_id");

-- CreateIndex
CREATE INDEX "membros_equipe_tipo_idx" ON "membros_equipe"("tipo");

-- CreateIndex
CREATE INDEX "descricoes_operacionais_raw_tenant_id_idx" ON "descricoes_operacionais_raw"("tenant_id");

-- CreateIndex
CREATE INDEX "descricoes_operacionais_raw_projeto_id_idx" ON "descricoes_operacionais_raw"("projeto_id");

-- CreateIndex
CREATE INDEX "descricoes_operacionais_raw_site_id_idx" ON "descricoes_operacionais_raw"("site_id");

-- CreateIndex
CREATE UNIQUE INDEX "processos_normalizados_descricao_raw_id_key" ON "processos_normalizados"("descricao_raw_id");

-- CreateIndex
CREATE INDEX "processos_normalizados_tenant_id_idx" ON "processos_normalizados"("tenant_id");

-- CreateIndex
CREATE INDEX "processos_normalizados_descricao_raw_id_idx" ON "processos_normalizados"("descricao_raw_id");

-- CreateIndex
CREATE INDEX "processo_etapas_processo_normalizado_id_ordem_idx" ON "processo_etapas"("processo_normalizado_id", "ordem");

-- CreateIndex
CREATE INDEX "ativos_tenant_id_idx" ON "ativos"("tenant_id");

-- CreateIndex
CREATE INDEX "ativos_site_id_idx" ON "ativos"("site_id");

-- CreateIndex
CREATE INDEX "ativos_processo_normalizado_id_idx" ON "ativos"("processo_normalizado_id");

-- CreateIndex
CREATE INDEX "dificuldades_operacionais_processo_normalizado_id_idx" ON "dificuldades_operacionais"("processo_normalizado_id");

-- CreateIndex
CREATE INDEX "workarounds_processo_normalizado_id_idx" ON "workarounds"("processo_normalizado_id");

-- CreateIndex
CREATE UNIQUE INDEX "questionarios_link_acesso_key" ON "questionarios"("link_acesso");

-- CreateIndex
CREATE INDEX "questionarios_tenant_id_idx" ON "questionarios"("tenant_id");

-- CreateIndex
CREATE INDEX "questionarios_projeto_id_idx" ON "questionarios"("projeto_id");

-- CreateIndex
CREATE INDEX "questionarios_link_acesso_idx" ON "questionarios"("link_acesso");

-- CreateIndex
CREATE INDEX "questoes_questionario_id_ordem_idx" ON "questoes"("questionario_id", "ordem");

-- CreateIndex
CREATE INDEX "respostas_questionario_questionario_id_idx" ON "respostas_questionario"("questionario_id");

-- CreateIndex
CREATE INDEX "respostas_questao_resposta_questionario_id_idx" ON "respostas_questao"("resposta_questionario_id");

-- CreateIndex
CREATE INDEX "iniciativas_tenant_id_idx" ON "iniciativas"("tenant_id");

-- CreateIndex
CREATE INDEX "iniciativas_projeto_id_idx" ON "iniciativas"("projeto_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_firebase_uid_key" ON "usuarios"("firebase_uid");

-- CreateIndex
CREATE INDEX "usuarios_tenant_id_idx" ON "usuarios"("tenant_id");

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_firebase_uid_idx" ON "usuarios"("firebase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_tenant_id_email_key" ON "usuarios"("tenant_id", "email");

-- CreateIndex
CREATE INDEX "permissoes_usuario_id_idx" ON "permissoes"("usuario_id");

-- CreateIndex
CREATE INDEX "chamadas_ia_tenant_id_idx" ON "chamadas_ia"("tenant_id");

-- CreateIndex
CREATE INDEX "chamadas_ia_funcionalidade_idx" ON "chamadas_ia"("funcionalidade");

-- CreateIndex
CREATE INDEX "chamadas_ia_created_at_idx" ON "chamadas_ia"("created_at");

-- CreateIndex
CREATE INDEX "requisitos_framework_tenant_id_idx" ON "requisitos_framework"("tenant_id");

-- CreateIndex
CREATE INDEX "requisitos_framework_framework_idx" ON "requisitos_framework"("framework");

-- CreateIndex
CREATE INDEX "requisitos_framework_codigo_idx" ON "requisitos_framework"("codigo");

-- CreateIndex
CREATE INDEX "analises_conformidade_tenant_id_idx" ON "analises_conformidade"("tenant_id");

-- CreateIndex
CREATE INDEX "analises_conformidade_requisito_id_idx" ON "analises_conformidade"("requisito_id");

-- CreateIndex
CREATE INDEX "analises_conformidade_entidade_tipo_entidade_id_idx" ON "analises_conformidade"("entidade_tipo", "entidade_id");

-- CreateIndex
CREATE INDEX "riscos_tenant_id_idx" ON "riscos"("tenant_id");

-- CreateIndex
CREATE INDEX "riscos_projeto_id_idx" ON "riscos"("projeto_id");

-- CreateIndex
CREATE INDEX "indicadores_dominio_governanca_idx" ON "indicadores"("dominio_governanca");

-- CreateIndex
CREATE INDEX "job_queue_status_idx" ON "job_queue"("status");

-- CreateIndex
CREATE INDEX "job_queue_tipo_idx" ON "job_queue"("tipo");

-- CreateIndex
CREATE INDEX "job_queue_agendado_para_idx" ON "job_queue"("agendado_para");

-- AddForeignKey
ALTER TABLE "organizacoes" ADD CONSTRAINT "organizacoes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_organizacao_id_fkey" FOREIGN KEY ("organizacao_id") REFERENCES "organizacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sites" ADD CONSTRAINT "sites_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sites" ADD CONSTRAINT "sites_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projetos" ADD CONSTRAINT "projetos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projetos" ADD CONSTRAINT "projetos_organizacao_id_fkey" FOREIGN KEY ("organizacao_id") REFERENCES "organizacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fase_etapas" ADD CONSTRAINT "fase_etapas_fase_id_fkey" FOREIGN KEY ("fase_id") REFERENCES "fases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto_fases" ADD CONSTRAINT "projeto_fases_projeto_id_fkey" FOREIGN KEY ("projeto_id") REFERENCES "projetos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto_fases" ADD CONSTRAINT "projeto_fases_fase_id_fkey" FOREIGN KEY ("fase_id") REFERENCES "fases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto_etapas_completadas" ADD CONSTRAINT "projeto_etapas_completadas_projeto_id_fkey" FOREIGN KEY ("projeto_id") REFERENCES "projetos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto_etapas_completadas" ADD CONSTRAINT "projeto_etapas_completadas_fase_etapa_id_fkey" FOREIGN KEY ("fase_etapa_id") REFERENCES "fase_etapas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membros_equipe" ADD CONSTRAINT "membros_equipe_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membros_equipe" ADD CONSTRAINT "membros_equipe_projeto_id_fkey" FOREIGN KEY ("projeto_id") REFERENCES "projetos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membros_equipe" ADD CONSTRAINT "membros_equipe_organizacao_id_fkey" FOREIGN KEY ("organizacao_id") REFERENCES "organizacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "descricoes_operacionais_raw" ADD CONSTRAINT "descricoes_operacionais_raw_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "descricoes_operacionais_raw" ADD CONSTRAINT "descricoes_operacionais_raw_projeto_id_fkey" FOREIGN KEY ("projeto_id") REFERENCES "projetos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "descricoes_operacionais_raw" ADD CONSTRAINT "descricoes_operacionais_raw_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processos_normalizados" ADD CONSTRAINT "processos_normalizados_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processos_normalizados" ADD CONSTRAINT "processos_normalizados_descricao_raw_id_fkey" FOREIGN KEY ("descricao_raw_id") REFERENCES "descricoes_operacionais_raw"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processo_etapas" ADD CONSTRAINT "processo_etapas_processo_normalizado_id_fkey" FOREIGN KEY ("processo_normalizado_id") REFERENCES "processos_normalizados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ativos" ADD CONSTRAINT "ativos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ativos" ADD CONSTRAINT "ativos_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ativos" ADD CONSTRAINT "ativos_processo_normalizado_id_fkey" FOREIGN KEY ("processo_normalizado_id") REFERENCES "processos_normalizados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dificuldades_operacionais" ADD CONSTRAINT "dificuldades_operacionais_processo_normalizado_id_fkey" FOREIGN KEY ("processo_normalizado_id") REFERENCES "processos_normalizados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workarounds" ADD CONSTRAINT "workarounds_processo_normalizado_id_fkey" FOREIGN KEY ("processo_normalizado_id") REFERENCES "processos_normalizados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionarios" ADD CONSTRAINT "questionarios_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionarios" ADD CONSTRAINT "questionarios_projeto_id_fkey" FOREIGN KEY ("projeto_id") REFERENCES "projetos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questoes" ADD CONSTRAINT "questoes_questionario_id_fkey" FOREIGN KEY ("questionario_id") REFERENCES "questionarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas_questionario" ADD CONSTRAINT "respostas_questionario_questionario_id_fkey" FOREIGN KEY ("questionario_id") REFERENCES "questionarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas_questao" ADD CONSTRAINT "respostas_questao_resposta_questionario_id_fkey" FOREIGN KEY ("resposta_questionario_id") REFERENCES "respostas_questionario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas_questao" ADD CONSTRAINT "respostas_questao_questao_id_fkey" FOREIGN KEY ("questao_id") REFERENCES "questoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "iniciativas" ADD CONSTRAINT "iniciativas_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "iniciativas" ADD CONSTRAINT "iniciativas_projeto_id_fkey" FOREIGN KEY ("projeto_id") REFERENCES "projetos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_organizacao_id_fkey" FOREIGN KEY ("organizacao_id") REFERENCES "organizacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissoes" ADD CONSTRAINT "permissoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamadas_ia" ADD CONSTRAINT "chamadas_ia_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisitos_framework" ADD CONSTRAINT "requisitos_framework_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analises_conformidade" ADD CONSTRAINT "analises_conformidade_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analises_conformidade" ADD CONSTRAINT "analises_conformidade_requisito_id_fkey" FOREIGN KEY ("requisito_id") REFERENCES "requisitos_framework"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riscos" ADD CONSTRAINT "riscos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riscos" ADD CONSTRAINT "riscos_projeto_id_fkey" FOREIGN KEY ("projeto_id") REFERENCES "projetos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riscos" ADD CONSTRAINT "riscos_ativo_id_fkey" FOREIGN KEY ("ativo_id") REFERENCES "ativos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riscos" ADD CONSTRAINT "riscos_processo_id_fkey" FOREIGN KEY ("processo_id") REFERENCES "processos_normalizados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riscos" ADD CONSTRAINT "riscos_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicadores" ADD CONSTRAINT "indicadores_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_queue" ADD CONSTRAINT "job_queue_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
