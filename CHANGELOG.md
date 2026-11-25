# Changelog

Formato [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), versão [SemVer](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Alterado
- Storybook em pt-BR: interface traduzida por `.storybook/public/ptbr-ui.js` (carregado em `manager-head.html` e `preview-head.html`; o Storybook não tem i18n oficial) e 111 stories com `name` em pt-BR acentuado (ex.: Primário, Área de testes, Cartão de produto).

## [0.1.0] — 2026-11-19

### Adicionado
- Tokens DTCG (`tokens/tokens.json`) medidos em zara.com/pt: cor (claro e escuro), tipografia, espaço, tamanho, raio, movimento, breakpoints, z-index.
- Tema Tailwind v4 (`src/styles/theme.css`) com troca por `data-theme`.
- Ícones de traço 1px (`Icon`).
- Frentes Ações, Formulário, Navegação e Conteúdo, cada componente com stories e documentação de uso.
- Storybook 10 com Introdução, Fundações e Padrões; seletor de tema na barra; addon de acessibilidade.
- `CONTRATO.md`, `GOVERNANCA.md`.

### Corrigido (revisão adversarial antes do release)
- Campo com erro sem indicador de foco: linha vermelha ganha 2px no foco (WCAG 2.4.7).
- Toast: regiões vivas fixas no provider (status/alert); com ação não fecha sozinho (WCAG 2.2.1); foco não cai no body ao dispensar.
- Pilha de sobreposições única em `src/lib/overlay.ts` para Modal, Drawer e MenuDrawer: só a do topo reage ao Escape; scroll do body destrava só quando a última fecha.
- Escape com `defaultPrevented` não fecha sobreposições (SearchField dentro de Modal).
- Pagination: Anterior/Próximo com `aria-disabled` (foco não se perde nas pontas).
- SkipLink com alvo ≥ 24px; anel de foco não é mais recortado em Tabs e Carousel.
- Checkbox/Radio: descrição fora do `<label>` (não duplica no nome acessível).
- Button em `loading` não dispara `onClick` por Enter/Espaço.

### Decisões
- `#ff0d0d` medido tem 3,9:1 sobre branco: fica só em borda e ícone; texto de erro usa `#d40000` (5,5:1).
- Tema escuro derivado das variáveis de chat escuro da referência (`#000`, `#141414`, `#262626`, `#929292`).
- Radio e checkbox quadrados para manter o raio 0.
