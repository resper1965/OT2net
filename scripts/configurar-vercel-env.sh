#!/bin/bash

# Script para configurar variáveis de ambiente no Vercel via CLI
# Projeto: ot-2net

set -e

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 Configurando Variáveis de Ambiente no Vercel${NC}"
echo ""

# Valores conhecidos
SUPABASE_URL="https://qaekhnagfzpwprvaxqwt.supabase.co"
NEXT_PUBLIC_SUPABASE_URL="https://qaekhnagfzpwprvaxqwt.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_hbperspgh1KUnMYUn_RmOA_VNrEspo7"

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI não encontrado. Instale com: npm i -g vercel${NC}"
    exit 1
fi

# Verificar se está logado
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Não está logado no Vercel. Fazendo login...${NC}"
    vercel login
fi

echo -e "${GREEN}✅ Logado no Vercel como: $(vercel whoami)${NC}"
echo ""

# Solicitar variáveis sensíveis
echo -e "${YELLOW}📝 Variáveis que precisam ser fornecidas:${NC}"
echo ""

# DATABASE_URL
echo -e "${YELLOW}1. DATABASE_URL${NC}"
echo "   Obter em: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt/settings/database"
echo "   Modo: Transaction (porta 6543)"
echo -n "   Digite a DATABASE_URL: "
read -s DATABASE_URL
echo ""

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL é obrigatória${NC}"
    exit 1
fi

# SUPABASE_SERVICE_ROLE_KEY
echo ""
echo -e "${YELLOW}2. SUPABASE_SERVICE_ROLE_KEY${NC}"
echo "   Obter em: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt/settings/api"
echo "   Seção: Project API keys > service_role (secret)"
echo -n "   Digite a SUPABASE_SERVICE_ROLE_KEY: "
read -s SUPABASE_SERVICE_ROLE_KEY
echo ""

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo -e "${RED}❌ SUPABASE_SERVICE_ROLE_KEY é obrigatória${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🚀 Configurando variáveis...${NC}"
echo ""

# Função para adicionar variável em todos os ambientes
add_env_var() {
    local var_name=$1
    local var_value=$2
    local env_type=$3  # "production", "preview", "development", ou "all"
    
    if [ "$env_type" = "all" ]; then
        echo -e "  ${GREEN}✓${NC} Adicionando $var_name (Production, Preview, Development)..."
        echo "$var_value" | vercel env add "$var_name" production --yes
        echo "$var_value" | vercel env add "$var_name" preview --yes
        echo "$var_value" | vercel env add "$var_name" development --yes
    else
        echo -e "  ${GREEN}✓${NC} Adicionando $var_name ($env_type)..."
        echo "$var_value" | vercel env add "$var_name" "$env_type" --yes
    fi
}

# Variáveis públicas (Plain Text)
echo -e "${GREEN}📋 Configurando variáveis públicas (NEXT_PUBLIC_*)...${NC}"
add_env_var "NEXT_PUBLIC_SUPABASE_URL" "$NEXT_PUBLIC_SUPABASE_URL" "all"
add_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$NEXT_PUBLIC_SUPABASE_ANON_KEY" "all"

# Variáveis privadas (Secret)
echo ""
echo -e "${GREEN}🔐 Configurando variáveis privadas (Secret)...${NC}"
add_env_var "SUPABASE_URL" "$SUPABASE_URL" "all"
add_env_var "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY" "all"
add_env_var "DATABASE_URL" "$DATABASE_URL" "all"

echo ""
echo -e "${GREEN}✅ Variáveis configuradas com sucesso!${NC}"
echo ""
echo -e "${YELLOW}📋 Resumo das variáveis configuradas:${NC}"
echo ""
echo "  Variáveis Públicas (Plain Text):"
echo "    - NEXT_PUBLIC_SUPABASE_URL"
echo "    - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "  Variáveis Privadas (Secret):"
echo "    - SUPABASE_URL"
echo "    - SUPABASE_SERVICE_ROLE_KEY"
echo "    - DATABASE_URL"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE: Faça um redeploy para aplicar as mudanças!${NC}"
echo ""
echo "Opções para redeploy:"
echo "  1. Via Dashboard: Deployments > ... > Redeploy"
echo "  2. Via CLI: vercel --prod"
echo "  3. Via Git: git commit --allow-empty -m 'Trigger redeploy' && git push"
echo ""

