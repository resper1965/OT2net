# 🚀 Próximos Passos - OT2net

**Data**: 2025-01-27  
**Status Atual**: Fase 3 completa ✅

## 📋 Checklist de Configuração

### 1. Configurar Connection Strings do Supabase (OBRIGATÓRIO)

**Objetivo**: Conectar o Prisma ao banco de dados Supabase

**Passos**:
1. Acesse: https://app.supabase.com/project/hyeifxvxifhrapfdvfry/settings/database
2. Copie as connection strings:
   - **DATABASE_URL** (Connection pooling) - para uso geral
   - **DIRECT_URL** (Direct connection) - para migrations
3. Crie/edite `backend/.env.local`:
   ```bash
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
   ```

**Comando para verificar**:
```bash
cd backend
cat .env.local | grep DATABASE_URL
```

---

### 2. Executar Migrations do Prisma (OBRIGATÓRIO)

**Objetivo**: Criar todas as tabelas no banco de dados

**Passos**:
```bash
cd backend
npm run prisma:migrate
```

**O que faz**: Cria todas as 30+ tabelas do schema Prisma no Supabase

**Verificar sucesso**:
- Verificar no Supabase Dashboard se as tabelas foram criadas
- Ou executar: `npx prisma db pull` para verificar

---

### 3. Executar Seeds (RECOMENDADO)

**Objetivo**: Popular o banco com dados iniciais (usuário admin, etc.)

**Passos**:
```bash
cd backend
npm run prisma:seed
```

**O que faz**: Cria dados iniciais necessários para o sistema funcionar

---

### 4. Importar Frameworks Regulatórios (OPCIONAL)

**Objetivo**: Importar frameworks (REN 964/21, ONS, CIS, ISA, NIST) para análise de conformidade

**Passos**:
```bash
cd backend
npm run scripts:import-frameworks
```

**Nota**: Pode ser feito depois, não é crítico para o funcionamento básico

---

### 5. Configurar Variáveis de Ambiente no Vercel (PARA DEPLOY)

**Objetivo**: Preparar para deploy em produção

**Variáveis necessárias**:
- `DATABASE_URL` - Connection string do Supabase
- `DIRECT_URL` - Direct connection do Supabase
- `SUPABASE_URL` - URL do projeto Supabase
- `SUPABASE_ANON_KEY` - Chave anônima do Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço do Supabase
- `ANTHROPIC_API_KEY` - Chave da API Claude
- `NEXT_PUBLIC_API_URL` - URL da API backend
- `NEXT_PUBLIC_SUPABASE_URL` - URL pública do Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave pública do Supabase

**Passos**:
1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto OT2net
3. Vá em Settings > Environment Variables
4. Adicione todas as variáveis acima

---

### 6. Testar o Sistema Localmente

**Objetivo**: Validar que tudo está funcionando

**Passos**:

1. **Iniciar Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Iniciar Frontend** (em outro terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Testar funcionalidades**:
   - ✅ Acessar http://localhost:3000
   - ✅ Fazer login
   - ✅ Criar um cliente
   - ✅ Criar uma empresa
   - ✅ Criar um projeto
   - ✅ Criar uma descrição raw
   - ✅ Processar descrição com IA
   - ✅ Visualizar processo normalizado
   - ✅ Ver diagrama Mermaid

---

### 7. Fazer Primeiro Deploy (OPCIONAL)

**Objetivo**: Colocar o sistema em produção

**Passos**:
1. Fazer commit e push do código
2. Conectar repositório ao Vercel
3. Configurar variáveis de ambiente (passo 5)
4. Fazer deploy

**Comandos**:
```bash
git add .
git commit -m "feat: Fase 3 completa - User Stories implementadas"
git push origin main
```

---

## 🎯 Ordem Recomendada de Execução

### Fase A: Setup Básico (OBRIGATÓRIO)
1. ✅ Configurar connection strings (Passo 1)
2. ✅ Executar migrations (Passo 2)
3. ✅ Executar seeds (Passo 3)
4. ✅ Testar localmente (Passo 6)

### Fase B: Melhorias (OPCIONAL)
5. ⏳ Importar frameworks (Passo 4)
6. ⏳ Configurar Vercel (Passo 5)
7. ⏳ Fazer deploy (Passo 7)

---

## 🔍 Verificações Rápidas

### Verificar se Prisma está configurado:
```bash
cd backend
npx prisma validate
```

### Verificar conexão com banco:
```bash
cd backend
npx prisma db pull --print
```

### Verificar se backend está funcionando:
```bash
cd backend
npm run dev
# Acessar http://localhost:3001/api/health
```

### Verificar se frontend está funcionando:
```bash
cd frontend
npm run dev
# Acessar http://localhost:3000
```

---

## 📝 Notas Importantes

1. **Connection Strings**: Sem elas, o Prisma não consegue se conectar ao banco
2. **Migrations**: Sem executar, as tabelas não existem no banco
3. **Seeds**: Sem executar, não há usuário admin para fazer login
4. **Teste Local**: Sempre teste localmente antes de fazer deploy

---

## 🆘 Troubleshooting

### Erro: "Can't reach database server"
- Verifique se as connection strings estão corretas
- Verifique se o Supabase está ativo
- Verifique se o IP está liberado no Supabase

### Erro: "Migration failed"
- Verifique se já existem tabelas no banco
- Tente resetar: `npx prisma migrate reset` (CUIDADO: apaga dados)
- Verifique logs do Supabase

### Erro: "Authentication failed"
- Verifique se o seed foi executado
- Verifique se o usuário foi criado no Supabase Auth
- Verifique as variáveis de ambiente

---

## ✅ Próximo Passo Imediato

**Execute agora**:
```bash
# 1. Verificar se .env.local existe
cd backend
ls -la .env.local

# 2. Se não existir, criar e adicionar connection strings
# 3. Executar migrations
npm run prisma:migrate

# 4. Executar seeds
npm run prisma:seed
```

---

**Última atualização**: 2025-01-27

