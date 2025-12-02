# Notas de Segurança - OT2net

## ⚠️ CRÍTICO: Service Role Key do Supabase

### Diferença entre Publishable Key e Service Role Key

**Publishable Key (Anon Key)** - ✅ SEGURA:
- `sb_publishable_RMMpXpKBjUDFNQt9_X0aog_GzLv4jzd`
- ✅ Pode ser commitada (é pública)
- ✅ Segura para usar no frontend
- ✅ Respeita políticas RLS (Row Level Security)
- ✅ Limitada pelas permissões configuradas

**Service Role Key** - ⚠️ EXTREMAMENTE SENSÍVEL:
- Começa com `sb_secret_` ou similar
- ❌ **NUNCA** commite no git
- ❌ **NUNCA** use no frontend
- ⚠️ **Bypassa todas as políticas RLS (Row Level Security)**
- ⚠️ **Permite acesso total ao banco de dados**
- ⚠️ **Pode ser usada para ler, modificar ou deletar qualquer dado**

### Regras Obrigatórias

1. ✅ **NUNCA** commite a Service Role Key no git
2. ✅ **NUNCA** compartilhe a chave publicamente
3. ✅ **NUNCA** adicione em arquivos que serão versionados
4. ✅ Mantenha apenas em `.env.local` (que está no `.gitignore`)
5. ✅ Use apenas no backend (Express), nunca no frontend

### Verificação de Segurança

Antes de fazer commit, verifique:

```bash
# Verificar se .env.local está no .gitignore
cat .gitignore | grep .env

# Verificar se há Service Role Key em arquivos rastreados
git grep -i "sb_secret" || echo "Nenhuma chave encontrada em arquivos rastreados"

# Verificar se .env.local não está sendo rastreado
git ls-files | grep .env.local || echo ".env.local não está sendo rastreado (correto!)"
```

### Se a Chave Foi Exposta

Se a Service Role Key foi commitada acidentalmente:

1. **IMEDIATAMENTE**: Revogue a chave no dashboard do Supabase
2. Gere uma nova Service Role Key
3. Atualize `.env.local` com a nova chave
4. Remova a chave do histórico do git (se necessário):
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env.local" \
     --prune-empty --tag-name-filter cat -- --all
   ```

### Arquivos Seguros

- ✅ `.env.example` - Contém apenas placeholders
- ✅ `README.md` - Não contém chaves reais
- ✅ `docs/` - Documentação sem chaves

### Arquivos que NUNCA devem ser commitados

- ❌ `.env.local`
- ❌ `.env`
- ❌ Qualquer arquivo com `sb_secret_` (Service Role Key)
- ❌ Qualquer arquivo com `SUPABASE_SERVICE_ROLE_KEY=` contendo valor real
- ❌ Qualquer arquivo com `ANTHROPIC_API_KEY=` contendo valor real

### Arquivos que PODEM ser commitados

- ✅ `.env.example` (com placeholders)
- ✅ Arquivos com `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Publishable Key é pública)
- ✅ Arquivos com `NEXT_PUBLIC_SUPABASE_URL` (URL é pública)

---

## Outras Credenciais Sensíveis

### Claude API Key
- Mantenha em `.env.local`
- Nunca commite no git
- Use apenas no backend

### Redis URL
- Se contiver senha, mantenha em `.env.local`
- Nunca commite no git

---

## Checklist de Segurança

Antes de cada commit:

- [ ] Verifique que `.env.local` não está sendo commitado
- [ ] Verifique que não há chaves secretas nos arquivos modificados
- [ ] Verifique que `.env.example` não contém valores reais
- [ ] Execute `git status` para verificar arquivos que serão commitados

