#!/bin/bash
# Script rápido para adicionar DATABASE_URL ao Vercel

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}📝 Adicionar DATABASE_URL ao Vercel${NC}"
echo ""
echo "Obter em: https://app.supabase.com/project/qaekhnagfzpwprvaxqwt/settings/database"
echo "Modo: Transaction (porta 6543)"
echo ""
echo -n "Cole a DATABASE_URL: "
read -s DATABASE_URL
echo ""

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL não pode estar vazia${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🚀 Configurando...${NC}"

for env in production preview development; do
    echo -e "  ${GREEN}→${NC} Adicionando para $env..."
    printf "$DATABASE_URL\n" | vercel env add DATABASE_URL $env
done

echo ""
echo -e "${GREEN}✅ DATABASE_URL configurada para todos os ambientes!${NC}"
echo -e "${YELLOW}⚠️  Não esqueça de fazer um redeploy: vercel --prod${NC}"
