# Sistema de Traduções (i18n)

Sistema de traduções em português brasileiro (pt-BR) para a aplicação OT2net.

## Uso

### Em componentes Server Components (Next.js 13+)

```typescript
import { t } from "@/lib/i18n";

export default function MyComponent() {
  return (
    <div>
      <h1>{t("nfaturasons.hero.title")}</h1>
      <p>{t("nfaturasons.hero.headline")}</p>
    </div>
  );
}
```

### Em componentes Client Components

```typescript
"use client";

import { useTranslation } from "@/lib/i18n";

export default function MyComponent() {
  const { t } = useTranslation("pt-BR");
  
  return (
    <div>
      <h1>{t("nflow.hero.title")}</h1>
      <p>{t("nflow.hero.headline")}</p>
    </div>
  );
}
```

## Chaves disponíveis

- `nfaturasons.hero.title` - "NFaturasons"
- `nfaturasons.hero.headline` - "Sistema de gestão de faturas e documentos fiscais"
- `nflow.hero.title` - "NFlow"
- `nflow.hero.headline` - "Automação de processos e fluxos de trabalho"

## Adicionar novas traduções

Edite o arquivo `src/lib/i18n/pt-BR.json` e adicione as novas chaves:

```json
{
  "minhaNovaChave": {
    "subChave": "Valor traduzido"
  }
}
```

Depois use: `t("minhaNovaChave.subChave")`



