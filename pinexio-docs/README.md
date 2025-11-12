<p align="center">
  <img src="../public/brand/ness-lockup.png" alt="ness logo" width="220px">
</p>

<h1 align="center">Secure-OT-Browser — Documentation Portal</h1>

Aplicação Pinexio adaptada para armazenar e publicar a documentação oficial do Secure-OT-Browser. Todo o conteúdo é escrito em MDX e indexado automaticamente via Contentlayer, mantendo pesquisa e navegação sincronizadas com os artefatos do repositório.

## Stack

- **Next.js 15** + **React 19**
- **Tailwind CSS 4**
- **MDX** com Contentlayer2 para indexação
- Hospedagem recomendada: **Vercel** ou **ness Platform** (via Portainer)

## Pastas principais

| Caminho | Descrição |
| :-- | :-- |
| `docs/` | Conteúdo em MDX (arquitetura, operações, segurança, ADRs). |
| `config/sidebar.tsx` | Estrutura de navegação e ícones da sidebar. |
| `public/` | Logos e assets estáticos. |
| `src/` | Componentes e layout base herdados do Pinexio. |

## Como rodar localmente

```bash
cd pinexio-docs
pnpm install
pnpm dev
```

Em seguida acesse `http://localhost:3000`.

## Atualizando conteúdo

1. Crie/edite arquivos `.mdx` em `docs/`.
2. Ajuste o `config/sidebar.tsx` se adicionar novas seções.
3. Rode `pnpm build:content` para validar a indexação.
4. Envie PR com os artefatos revisados (lembre-se de atualizar specs/ADRs quando necessário).

## Deploy

- Vercel: configure projeto apontando para `pinexio-docs/`.
- Docker/Portainer: `pnpm build` seguido de `pnpm start` com variáveis padrão (`PORT=3000`).

---

Template original: [Pinexio](https://github.com/sanjayc208/pinexio) (MIT). Ajustes realizados para atender ao design system da ness e ao fluxo Spec Kit do Secure-OT-Browser.
