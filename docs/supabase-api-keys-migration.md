# Migração para Novas API Keys do Supabase

**Referência**: [Supabase Discussion #29260](https://github.com/orgs/supabase/discussions/29260)

## Resumo das Mudanças

O Supabase está migrando para um novo formato de API keys para melhorar segurança e experiência do desenvolvedor.

### Novos Formatos de Chaves

| Tipo | Formato | Substitui | Uso |
|------|---------|-----------|-----|
| **Publishable Key** | `sb_publishable_...` | `anon` (JWT) | Frontend, mobile, apps públicos |
| **Secret Key** | `sb_secret_...` | `service_role` (JWT) | Backend, Edge Functions, admin |

### Chaves Legacy (ainda funcionam, mas serão descontinuadas)

| Tipo | Formato | Status |
|------|---------|--------|
| `anon` | JWT longo | ✅ Funciona até final 2026 |
| `service_role` | JWT longo | ✅ Funciona até final 2026 |

## Timeline de Migração

- **Junho 2025**: Early preview (já disponível)
- **Novembro 2025**: Novos projetos não terão mais `anon`/`service_role`
- **Final 2026**: Chaves legacy serão removidas

## Status do Projeto OT2net

✅ **Já estamos usando o novo formato!**

- ✅ **Publishable Key**: `sb_publishable_RMMpXpKBjUDFNQt9_X0aog_GzLv4jzd` (frontend)
- ✅ **Secret Key**: `sb_secret_Q8M0UN_iohXf16iB4j4H9A_-hY1vuEQ` (backend)

## Vantagens das Novas Chaves

1. **Segurança**: Formato mais claro sobre o nível de privilégio
2. **Múltiplas Secret Keys**: Pode criar várias secret keys com nomes descritivos
3. **Desabilitação**: Pode desabilitar/reativar chaves sem deletá-las
4. **Rastreamento**: Dashboard mostra quando cada chave foi usada

## Configuração Atual

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://hyeifxvxifhrapfdvfry.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_RMMpXpKBjUDFNQt9_X0aog_GzLv4jzd
```

✅ **Publishable Key** - Segura para frontend, pode ser commitada (é pública)

### Backend (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://hyeifxvxifhrapfdvfry.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_Q8M0UN_iohXf16iB4j4H9A_-hY1vuEQ
```

✅ **Secret Key** - ⚠️ **NUNCA** commitar! Apenas em `.env.local`

## Compatibilidade

As novas chaves são **100% compatíveis** com o código existente:

- `sb_publishable_...` funciona exatamente como `anon` key
- `sb_secret_...` funciona exatamente como `service_role` key

**Nenhuma mudança de código é necessária!**

## Próximos Passos

1. ✅ Já estamos usando o novo formato
2. ⏳ Monitorar atualizações do Supabase
3. ⏳ Considerar criar múltiplas secret keys para diferentes serviços (se necessário)

## Referências

- [Supabase Discussion #29260](https://github.com/orgs/supabase/discussions/29260)
- [Supabase API Keys Docs](https://supabase.com/docs/guides/api/api-keys)

