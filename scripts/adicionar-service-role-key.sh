#!/bin/bash
# Script rápido para adicionar SUPABASE_SERVICE_ROLE_KEY ao Vercel

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}📝 Adicionar SUPABASE_SERVICE_ROLE_KEY ao Vercel${NC}"
echo ""
echo "Obter em: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt/settings/api"
echo "Seção: Project API keys > service_role (secret)"
echo ""
echo -n "Cole a SUPABASE_SERVICE_ROLE_KEY: "
read -s SERVICE_ROLE_KEY
echo ""

if [ -z "$SERVICE_ROLE_KEY" ]; then
    echo -e "${RED}❌ SUPABASE_SERVICE_ROLE_KEY não pode estar vazia${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🚀 Configurando...${NC}"

for env in preview development; do
    echo -e "  ${GREEN}→${NC} Adicionando para $env..."
    printf "$SERVICE_ROLE_KEY\n" | vercel env add SUPABASE_SERVICE_ROLE_KEY $env
done

echo ""
echo -e "${GREEN}✅ SUPABASE_SERVICE_ROLE_KEY configurada para Preview e Development!${NC}"
