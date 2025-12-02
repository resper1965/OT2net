# Design System Ness - Regras de Aplicação

**Aplicar apenas quando necessário** - Use estes princípios de design da marca Ness na aplicação OT2net.

## Paleta de Cores

### Cor Primária (Assinatura)

**Azul primário:**
- `#00ade8` — cor principal da marca
- **Uso**: ponto assinatura (.) em todas as marcas
- **Aplicação**: CTAs, links ativos, destaques, badges
- **Peso**: `font-weight: 700` no ponto da marca

**Variações do azul:**
- `#33BEE6` — hover em dark mode
- `#1ab0ff` — hover state (light)
- `#008bb8` — pressed/active state
- `#4dc2ff` — versão light (raramente usado)
- `#006988` — versão dark (raramente usado)

**Azul com transparência (sutil):**
- `rgba(0, 173, 232, 0.05)` — background hover (primary-100)
- `rgba(0, 173, 232, 0.10)` — background active (primary-200)
- `rgba(0, 173, 232, 0.15)` — bordas sutis (primary-300)

### Paleta de Neutros (Gray)

**Cinzas profundos (base):**
- `#0a0d14` (slate-950) — fundo mais escuro
- `#0f172a` (slate-900) — fundo padrão da aplicação
- `#1a1f28` (slate-850) — camadas elevadas
- `#1e293b` (slate-800) — cards e containers

**Cinzas médios (sutileza):**
- `#2d3544` (slate-700) — bordas sutis
- `#3d4759` (slate-600) — texto desativado
- `#64748b` (slate-500) — texto secundário

**Cinzas claros (legibilidade):**
- `#94a3b8` (slate-400) — texto terciário
- `#cbd5e1` (slate-300) — texto secundário destaque
- `#e2e8f0` (slate-200) — texto primário
- `#f1f5f9` (slate-100) — texto high contrast
- `#f8fafc` (slate-50) — texto mais claro

### Cores de Sistema

**Light mode:**
- Background: `#FFFFFF`
- Foreground: `#111827`
- Card: `#F9FAFB`
- Border/Input: `#E5E7EB`

**Dark mode:**
- Background: `#0B0D0E`
- Foreground: `#E5E7EB`
- Card: `#111827`
- Border/Input: `#1F2937`

**Estados:**
- Destructive: `#EF4444` (light) / `#F87171` (dark)
- Ring/Focus: `#00ade8` (light) / `#33BEE6` (dark)

## Aplicações das Marcas

### 1. Marca Matriz: ness.

**Formato:**
```
ness<span class="brand-dot">.</span>
```

**Aplicação de cores:**
- Texto: minúsculas, cor do foreground (`#111827` light / `#E5E7EB` dark)
- Ponto: `#00ade8` (light) / `#33BEE6` (dark)
- Fonte: Montserrat Medium (500)
- Peso do ponto: `font-weight: 700`

**Versões:**
- Positiva: texto escuro, ponto azul (fundo claro)
- Negativa: texto claro, ponto azul (fundo escuro)
- Monocromática: quando o azul não for permitido

**Uso:**
- Header/navegação principal
- Footer
- Documentos oficiais
- Assinaturas de e-mail

### 2. Verticais

**trustness.**
- Formato: `trustness<span class="brand-dot">.</span>`
- Mesmas regras de cor da marca matriz
- Ponto azul `#00ade8` sempre presente
- Contexto: GRC/privacidade/auditorias

**forense.io**
- Formato: `forense<span class="brand-dot">.</span>io`
- Ponto azul como separador entre "forense" e "io"
- Sem ponto final extra
- Contexto: perícia e investigação digital

### 3. Serviços (linhas n.)

Todos seguem o padrão `n.<nome>` com ponto azul:

- `n<span class="brand-dot">.</span>secops` — segurança gerenciada
- `n<span class="brand-dot">.</span>infraops` — infraestrutura + Help Desk (ITIL)
- `n<span class="brand-dot">.</span>devarch` — arquitetura & SDLC seguro
- `n<span class="brand-dot">.</span>autoops` — automação com IA e orquestração
- `n<span class="brand-dot">.</span>privacy` — plataforma SaaS de privacidade
- `n<span class="brand-dot">.</span>cirt` — resposta a incidentes cibernéticos

**Regra**: não adicionar novo ponto no sufixo

## Aplicações Práticas

### Quando usar azul (presença)

**CTAs principais:**
```css
background: linear-gradient(135deg, #00ade8 0%, #008bb8 100%);
color: white;
```

**Links ativos:**
```css
color: #1ab0ff; /* hover state */
```

**Badges de marca:**
```css
background: rgba(0, 173, 232, 0.10);
border: 1px solid rgba(0, 173, 232, 0.20);
color: #1ab0ff;
```

**Scrollbar:**
```css
scrollbar-thumb: #00ade8;
scrollbar-thumb-hover: #008bb8;
```

**Focus ring:**
```css
outline: 2px solid #00ade8;
outline-offset: 2px;
```

### Quando usar cinza (invisibilidade)

**Backgrounds:**
- Fundo principal: `#0f172a` (slate-900)
- Cards: `#1e293b` (slate-800)
- Glass morphism: `rgba(15, 23, 42, 0.8)`

**Textos:**
- Primário: `#cbd5e1` (slate-300)
- Secundário: `#94a3b8` (slate-400)
- Terciário: `#64748b` (slate-500)

**Bordas:**
- Padrão: `#334155` (slate-700)
- Sutil: `rgba(248, 250, 252, 0.1)`

## Regras de Aplicação

### Regra do Ponto Azul

- Todos os pontos das marcas devem ser `#00ade8`
- Sem espaço antes do ponto
- No-wrap entre palavra e ponto
- Peso 700 no ponto
- Dark mode: `#33BEE6`

### Hierarquia de Uso do Azul

**Alto (presença):**
- Ponto da marca (sempre)
- CTAs principais
- Links ativos
- Badges de marca

**Médio (destaque):**
- Hover states
- Focus rings
- Scrollbar
- Ícones de ação

**Baixo (sutil):**
- Backgrounds com transparência
- Bordas sutis
- Gradientes de fundo

## Tokens CSS

```css
:root {
  --primary: #00ade8;
  --primary-hover: #33BEE6;
  --primary-pressed: #008bb8;
  --ring: #00ade8;
  
  /* Neutros */
  --background: #0f172a;
  --foreground: #E5E7EB;
  --card: #1e293b;
  --border: #334155;
}

.brand-dot {
  color: #00ade8;
  font-weight: 700;
}

.dark .brand-dot {
  color: #33BEE6;
}
```

## Checklist de Aplicação

- [ ] Ponto azul correto (`#00ade8` light / `#33BEE6` dark)
- [ ] Sem espaço antes do ponto
- [ ] No-wrap aplicado
- [ ] Montserrat Medium (500) para texto
- [ ] Font-weight 700 no ponto
- [ ] Contraste ≥ 4.5:1
- [ ] Versão positiva/negativa aplicada corretamente

## Princípio Fundamental

**"Invisível quando funciona, Presente quando importa"**

- Cinzas como base (invisibilidade funcional)
- Azul `#00ade8` usado estrategicamente para destacar elementos importantes
- Especialmente o ponto assinatura das marcas

---

**Nota**: Aplicar estes princípios apenas quando necessário para manter consistência com a marca Ness. Priorizar funcionalidade e usabilidade sobre estética quando houver conflito.


