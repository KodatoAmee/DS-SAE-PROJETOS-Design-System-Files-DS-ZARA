# DS-Zara

Design system editorial e monocromático em React 19 + Tailwind v4, documentado no Storybook 10. A linguagem visual (cor, tipo, espaço, botões, campos, grelha, cabeçalho, movimento) foi medida no DOM de zara.com/pt em 19/11/2026. O DS reproduz a linguagem, não a identidade: não inclui logotipo, fotos, textos nem a fonte proprietária da marca.

## Rodar

```powershell
npm install
npm run dev              # Storybook em http://localhost:6016
npm run build            # biblioteca em dist/lib (JS + CSS + .d.ts)
npm run build-storybook  # Storybook estático em storybook-static
npm run typecheck
```

## Estrutura

```
tokens/tokens.json         fonte canônica (W3C DTCG)
src/styles/theme.css       tema: primitivas -> semânticas [data-theme] -> @theme
src/lib/cn.ts              cn() e focusRing
src/lib/overlay.ts         pilha de sobreposições, trava de scroll, foco preso (Modal, Drawer, MenuDrawer)
src/components/icon        Icon (traço 1px, 20x20)
src/components/actions     Button, IconButton, Link, ViewSelector, ButtonGroup
src/components/form        TextField, TextArea, Select, SearchField, Checkbox, Radio, Switch, SizeSelector, QuantityStepper
src/components/nav         Header, MenuDrawer, Tabs, Breadcrumbs, Pagination, Footer, SkipLink
src/components/content     MediaPlaceholder, PriceLabel, Tag, ProductCard, ProductGrid, Carousel, Modal, Drawer, Accordion, Toast, Skeleton, Divider, Banner
src/stories                Introdução, Fundações, Padrões (telas compostas)
CONTRATO.md                regras para quem escreve componente
GOVERNANCA.md              contribuição, versionamento, métricas
```

## Fundações medidas

| | Valor |
|---|---|
| Cor | `#000` / `#fff` + cinzas `#f2f2f2 #e5e5e5 #ccc #999 #797979 #6b6b6b #666 #333`; erro `#ff0d0d` (borda) e `#d40000` (texto, derivado para AA) |
| Tipo | Helvetica, peso 300; 10 · 11 · 12 · 13 · 15 · 16 · 20 · 24 px; maiúsculas em ações |
| Raio | 0 |
| Espaço | base 4px; calha 40px; blocos 72px |
| Controles | botão 32px, campo 40px, toque 44px |
| Movimento | 200ms e 500ms ease-in-out |
| Breakpoints | 768 · 1024 · 1280 · 1920 |

## Consumir

```tsx
import "ds-zara/styles.css";
import { Button } from "ds-zara";
```

Com Tailwind v4 no app, importe `ds-zara/theme.css` e declare `@source "../node_modules/ds-zara/dist/lib";` para as classes dos componentes serem geradas.

## Fonte

A referência usa Helvetica Now Text (licenciada). O token `font.family.sans` usa `"Helvetica Neue", Helvetica, Arial, sans-serif`. Com licença, troque `--font-sans` em `theme.css` e carregue a fonte em `.storybook/preview-head.html`.
