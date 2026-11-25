# Contrato de componentes — DS-Zara

Lido por todo agente antes de escrever componente. Fonte da verdade dos valores: `tokens/tokens.json` e `src/styles/theme.css`.

## Linguagem visual (medida em zara.com/pt, 2026-11-19)

- Monocromático. Preto, branco, cinzas. Nenhuma cor de marca. Vermelho só para erro.
- **Raio 0 em tudo.** Nenhuma sombra (exceto nenhuma; use linha ou overlay).
- Peso **300 (`font-light`)** em todo texto. `font-normal` (400) só onde houver ênfase; `font-medium` (500) para item selecionado.
- Ações, rótulos, títulos de seção: **MAIÚSCULAS** (`uppercase`). Texto corrido: caixa normal.
- Linhas de 1px. Botão secundário = contorno 1px `border-line`.
- Campo = só linha inferior 1px `border-line-field`, rótulo 12px maiúsculo `text-content-low`, altura 40.
- Movimento: `duration-200` para hover/opacidade, `duration-500` para painéis/gavetas, `ease-zr` (ease-in-out). Hover em links = sublinhado ou opacidade, nunca troca de cor colorida.

## Classes Tailwind disponíveis (só estas — o resto da paleta foi zerado)

- Cor: `base surface muted content content-mid content-low content-disabled line line-subtle line-field inverse on-inverse inverse-hover danger danger-text overlay transparent current` (em `bg-*`, `text-*`, `border-*`, `outline-*`, `fill-*`, `stroke-*`, `divide-*`).
- Texto: `text-caption`(10/16) `text-label-s`(11/16) `text-label`(12/16) `text-action`(13/16) `text-body`(13/20) `text-title-s`(15/24) `text-title`(16/24) `text-heading`(20/24) `text-display`(24/28). **Não usar `text-sm`, `text-xs`, `text-lg` etc. — não existem.**
- Raio: só `rounded-none` e `rounded-full` (este só para indicador de ponto).
- Espaço: escala numérica padrão do Tailwind (base 4px): `p-1`=4, `p-2`=8, `p-3`=12, `gap-10`=40 etc.
- Z: `z-overlay` (1200), `z-toast` (1300), `z-10`.
- Animações: `animate-zr-fade-in`, `animate-zr-slide-up`, `animate-zr-pulse`.
- Breakpoints: `md:` 768, `lg:` 1024, `xl:` 1280, `2xl:` 1920.
- **Nunca** hex, `rgb()` ou valor arbitrário de cor (`bg-[#...]`). Valores arbitrários de tamanho só se o token não existir (ex.: `aspect-[2/3]`).
- **Nunca** classes dinâmicas em template (`text-${x}`): use mapa de literais ou `cva`.

## Padrões de código

- React 19 + TypeScript estrito. Componentes função, `forwardRef` não é necessário (React 19 aceita `ref` como prop): declare `ref?: React.Ref<HTMLButtonElement>` quando fizer sentido.
- Variantes com `cva` de `class-variance-authority`. Junte classes com `cn` de `src/lib/cn.ts`. Foco: `focusRing` de `src/lib/cn.ts` (anel de 1px).
- Ícones: `Icon` de `src/components/icon` (`name`: menu, close, search, bag, user, help, bookmark, filter, plus, minus, check, chevron-down/up/left/right, arrow-right, info). Não crie outro sistema de ícones; se precisar de um ícone novo, desenhe SVG inline 20x20 traço 1px no próprio componente.
- Sem dependências novas. Sem Radix, sem Headless UI. Implementar foco, teclado e ARIA à mão.
- Props estendem os atributos HTML nativos do elemento raiz (`ComponentPropsWithoutRef<"button">` etc.) e repassam `...rest` e `className`.
- Textos padrão em **português** (rótulos ARIA incluídos): "Fechar", "Abrir menu", "Pesquisar", "Anterior", "Próximo".
- Componente controlado **e** não controlado quando houver estado (`value`/`defaultValue`/`onValueChange`, `open`/`defaultOpen`/`onOpenChange`).
- Acessibilidade WCAG 2.2 AA: contraste já garantido pelos tokens; alvo mínimo 24x24 (AA 2.5.8), preferir 44 em toque; roles e `aria-*` corretos; `Escape` fecha sobreposições; foco preso em Modal/Drawer e devolvido ao gatilho; `prefers-reduced-motion` já tratado no tema.
- Overlays (Modal, Drawer, MenuDrawer): `createPortal` para `document.body`, backdrop `bg-overlay` **irmão** do painel, `aria-modal="true"`, `role="dialog"`, rótulo via `aria-labelledby`. **Sempre** usar `src/lib/overlay.ts` (`useOverlay`, ou `pushOverlay`/`isTopOverlay`/`lockScroll`): nunca pilha ou trava de scroll própria.
- Estado desabilitado em controles de navegação (Anterior/Próximo, pontas de carrossel, limites de stepper): `aria-disabled` + ignorar clique, não `disabled` nativo, para o foco não cair no body.
- Contêiner com `overflow-*` em volta de itens focáveis: dar `p-1 -m-1` para o anel de foco (offset 2px) não ser recortado.

## Estrutura de arquivos por componente

```
src/components/<frente>/<Nome>/<Nome>.tsx
src/components/<frente>/<Nome>/<Nome>.stories.tsx
src/components/<frente>/<Nome>/index.ts        // export { Nome, type NomeProps } from "./Nome";
src/components/<frente>/index.ts                // barril da frente: export * from "./Nome";
```

## Stories (Storybook 10, CSF3)

- `import type { Meta, StoryObj } from "@storybook/react-vite";`
- `title: "<Frente>/<Nome>"` com Frente ∈ `Ações`, `Formulário`, `Navegação`, `Conteúdo`.
- `tags: ["autodocs"]`. `parameters.docs.description.component` com, em português: **O que é**, **Quando usar**, **Quando não usar**, **Anatomia**, **Acessibilidade**. Markdown simples.
- Uma story por variante + uma de estados (hover/foco não dá para forçar; mostre desabilitado, erro, carregando, selecionado) + `Playground` com `args`.
- Stories que só usam `render` sem args: tipar `type Story = StoryObj;` e meta `satisfies Meta`, senão o TS exige props obrigatórias.
- Imagens: **nunca** usar fotos ou marca da Zara. Use `<div className="bg-muted aspect-[2/3]" />` como placeholder de mídia, ou o componente `MediaPlaceholder` da frente Conteúdo.

## Referência pronta

`src/components/actions/Button/Button.tsx` é o exemplo canônico: siga a forma dele.
