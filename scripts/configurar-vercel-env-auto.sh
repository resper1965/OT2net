#!/bin/bash

# Script para configurar variáveis de ambiente no Vercel via CLI (modo automático)
# Requer que as variáveis sejam passadas como argumentos ou variáveis de ambiente

set -e

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 Configurando Variáveis de Ambiente no Vercel (Modo Automático)${NC}"
echo ""

# Valores conhecidos
SUPABASE_URL="${SUPABASE_URL:-https://qaekhnagfzpwprvaxqwt.supabase.co}"
NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-https://qaekhnagfzpwprvaxqwt.supabase.co}"
NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-sb_publishable_hbperspgh1KUnMYUn_RmOA_VNrEspo7}"

# Variáveis que devem ser fornecidas
DATABASE_URL="${DATABASE_URL:-$1}"
SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-$2}"

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI não encontrado. Instale com: npm i -g vercel${NC}"
    exit 1
fi

# Verificar se está logado
if ! vercel whoami &> /dev/null; then
    echo -e "${RED}❌ Não está logado no Vercel. Execute: vercel login${NC}"
    exit 1
fi

# Validar variáveis obrigatórias
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL é obrigatória${NC}"
    echo "   Uso: $0 <DATABASE_URL> <SUPABASE_SERVICE_ROLE_KEY>"
    echo "   Ou: export DATABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... && $0"
    exit 1
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo -e "${RED}❌ SUPABASE_SERVICE_ROLE_KEY é obrigatória${NC}"
    echo "   Uso: $0 <DATABASE_URL> <SUPABASE_SERVICE_ROLE_KEY>"
    echo "   Ou: export DATABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... && $0"
    exit 1
fi

echo -e "${GREEN}✅ Logado no Vercel como: $(vercel whoami)${NC}"
echo ""

# Função para adicionar variável em todos os ambientes
add_env_var() {
    local var_name=$1
    local var_value=$2
    
    echo -e "  ${GREEN}✓${NC} Adicionando $var_name (Production, Preview, Development)..."
    echo "$var_value" | vercel env add "$var_name" production --yes 2>/dev/null || true
    echo "$var_value" | vercel env add "$var_name" preview --yes 2>/dev/null || true
    echo "$var_value" | vercel env add "$var_name" development --yes 2>/dev/null || true
}

# Variáveis públicas (Plain Text)
echo -e "${GREEN}📋 Configurando variáveis públicas (NEXT_PUBLIC_*)...${NC}"
add_env_var "NEXT_PUBLIC_SUPABASE_URL" "$NEXT_PUBLIC_SUPABASE_URL"
add_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$NEXT_PUBLIC_SUPABASE_ANON_KEY"

# Variáveis privadas (Secret)
echo ""
echo -e "${GREEN}🔐 Configurando variáveis privadas (Secret)...${NC}"
add_env_var "SUPABASE_URL" "$SUPABASE_URL"
add_env_var "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY"
add_env_var "DATABASE_URL" "$DATABASE_URL"

echo ""
echo -e "${GREEN}✅ Variáveis configuradas com sucesso!${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE: Faça um redeploy para aplicar as mudanças!${NC}"
echo ""

