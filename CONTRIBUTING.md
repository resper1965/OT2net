# Guia de Contribuição

Obrigado por considerar contribuir com o projeto OT2net!

## Como Contribuir

### 1. Setup do Ambiente

Siga o guia em `docs/quick-start.md` para configurar seu ambiente de desenvolvimento.

### 2. Convenções de Código

- **TypeScript**: Use TypeScript estrito, evite `any`
- **Formatação**: Use Prettier (executar `npm run format`)
- **Linting**: Use ESLint (executar `npm run lint`)
- **Commits**: Use mensagens descritivas em português

### 3. Estrutura de Branches

- `main` - Branch principal (produção)
- `develop` - Branch de desenvolvimento
- `feature/*` - Novas features
- `fix/*` - Correções de bugs
- `docs/*` - Documentação

### 4. Processo de Pull Request

1. Crie uma branch a partir de `main`
2. Faça suas alterações
3. Teste localmente
4. Commit com mensagem descritiva
5. Push e abra um Pull Request
6. Aguarde revisão

### 5. Padrões de Código

#### Frontend (Next.js)
- Use componentes funcionais com hooks
- Prefira Server Components quando possível
- Use TypeScript para tipagem forte
- Siga o Design System Ness (ver `docs/ness-design-system.md`)

#### Backend (Express)
- Use async/await
- Trate erros adequadamente
- Use middleware para lógica compartilhada
- Valide inputs com Zod

#### Database (Prisma)
- Use migrations para mudanças de schema
- Documente mudanças significativas
- Mantenha seeds atualizados

### 6. Testes

- Escreva testes para novas features
- Mantenha cobertura de testes alta
- Teste casos de erro e edge cases

### 7. Documentação

- Atualize documentação quando necessário
- Adicione comentários em código complexo
- Documente APIs e funções públicas

## Perguntas?

Abra uma issue no GitHub ou entre em contato com a equipe.

