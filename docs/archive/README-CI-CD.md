# CI/CD e Qualidade de Código

Este documento descreve as configurações de CI/CD e ferramentas de qualidade de código implementadas no projeto.

## 🔍 ESLint com Regras Estritas

O ESLint está configurado com regras estritas para garantir qualidade de código:

- **TypeScript**: Proibido uso de `any`, variáveis não utilizadas são erros
- **React**: Hooks devem seguir as regras, chaves obrigatórias em listas
- **Qualidade**: `console.log` apenas warnings, `debugger` é erro
- **Boas práticas**: `prefer-const`, `no-var`, `eqeqeq` sempre

### Comandos:

```bash
cd frontend
npm run lint          # Verifica erros
npm run lint:fix      # Corrige automaticamente
npm run lint:strict   # Modo estrito (0 warnings)
```

## 📘 TypeScript Strict Mode

TypeScript está configurado com modo estrito completo:

- `strict: true` - Habilita todas as verificações estritas
- `noUnusedLocals: true` - Erro em variáveis locais não usadas
- `noUnusedParameters: true` - Erro em parâmetros não usados
- `noImplicitReturns: true` - Erro se função não retorna em todos os caminhos
- `strictNullChecks: true` - Verificação estrita de null/undefined

### Comando:

```bash
cd frontend
npm run type-check    # Verifica tipos sem compilar
```

## 🪝 Pre-commit Hooks (Husky)

Hooks de pre-commit garantem que código de baixa qualidade não seja commitado:

- **lint-staged**: Executa ESLint e Prettier apenas nos arquivos modificados
- **type-check**: Verifica tipos TypeScript antes do commit

### Instalação:

```bash
cd frontend
npm install
# Husky será instalado automaticamente via script "prepare"
```

### Configuração:

Os hooks estão em `.husky/pre-commit` e executam:
1. ESLint com auto-fix
2. Prettier
3. Type check

## 🚀 CI/CD com GitHub Actions

O workflow CI está configurado em `.github/workflows/ci.yml` e executa:

### Jobs:

1. **lint-and-type-check**: 
   - ESLint
   - Prettier check
   - TypeScript type check

2. **test**:
   - Executa testes com Vitest
   - Gera coverage
   - Upload para Codecov

3. **build**:
   - Build da aplicação Next.js
   - Só executa se lint e testes passarem

### Triggers:

- Push para `main` ou `develop`
- Pull requests para `main` ou `develop`

## 🧪 Testes Automatizados (Vitest)

Configurado com Vitest + Testing Library:

### Configuração:

- **Vitest**: Framework de testes rápido
- **Testing Library**: Utilitários para testar componentes React
- **jsdom**: Ambiente DOM para testes
- **Coverage**: Relatórios de cobertura com v8

### Comandos:

```bash
cd frontend
npm run test              # Executa testes
npm run test:watch        # Modo watch
npm run test:ui           # Interface gráfica
npm run test:coverage     # Com cobertura
```

### Estrutura:

```
frontend/
  src/
    test/
      setup.ts           # Configuração global dos testes
      example.test.tsx   # Exemplo de teste
```

### Exemplo de Teste:

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MyComponent } from "@/components/MyComponent";

describe("MyComponent", () => {
  it("should render correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

## 📋 Checklist de Qualidade

Antes de fazer commit, certifique-se de:

- [ ] `npm run lint` passa sem erros
- [ ] `npm run type-check` passa sem erros
- [ ] `npm run format:check` passa
- [ ] Testes passam: `npm run test`
- [ ] Build funciona: `npm run build`

## 🔧 Configurações

### Arquivos de Configuração:

- `frontend/eslint.config.mjs` - Regras ESLint
- `frontend/tsconfig.json` - Configuração TypeScript
- `frontend/.vitest.config.ts` - Configuração Vitest
- `.husky/pre-commit` - Hook de pre-commit
- `.github/workflows/ci.yml` - CI/CD pipeline
- `.lintstagedrc.json` - Configuração lint-staged

## 🎯 Próximos Passos

1. Adicionar mais testes unitários
2. Configurar testes E2E com Playwright
3. Adicionar análise de código com SonarQube
4. Configurar dependabot para atualizações automáticas


