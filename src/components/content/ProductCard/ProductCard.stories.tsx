import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { MediaPlaceholder } from "../MediaPlaceholder";
import { ProductCard } from "./ProductCard";

const meta = {
  title: "Conteúdo/ProductCard",
  component: ProductCard,
  tags: ["autodocs"],
  args: {
    name: "Blazer de lã",
    href: "#",
    price: { amount: 89.95 },
    onQuickAdd: fn(),
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Cartão de produto da grelha: sem borda, mídia em largura total (2:3, retrato), abaixo o nome e o preço em 11/16, peso 300, maiúsculas. Botão "+" de 32x32 ao lado do nome para abrir o seletor de tamanhos.

**Quando usar.** Dentro de \`ProductGrid\` ou \`Carousel\`, para listar produtos de uma categoria, busca ou recomendação.

**Quando não usar.** Para itens do cesto (com quantidade e remoção) ou destaques editoriais com texto longo, monte um padrão próprio.

**Anatomia.** Mídia · linha do nome (nome + etiqueta opcional, botão "+") · preço · "+N cores" opcional.

**Acessibilidade.** \`<article>\` rotulado pelo nome. Um único link, só no nome, que se estende sobre a mídia com \`::after\` (área clicável = mídia + nome, um só ponto de tabulação). O botão "+" fica **fora** do link (botão dentro de link é HTML inválido) e tem nome "Adicionar <nome>". Use \`nameAs\` para acertar o nível de título na página. A imagem deve ter \`alt=""\` quando o nome já a descreve.
        `,
      },
    },
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const narrow: Story["decorators"] = [
  (Story) => (
    <div className="max-w-[280px]">
      <Story />
    </div>
  ),
];

export const Padrao: Story = { name: "Padrão", decorators: narrow };

export const ComEtiqueta: Story = {
  name: "Com etiqueta",
  decorators: narrow,
  args: { name: "Camisa de linho", tag: "New" },
};

export const ComCores: Story = {
  name: "Com cores",
  decorators: narrow,
  args: { name: "Calça reta de algodão", colors: 2 },
};

export const EmPromocao: Story = {
  name: "Em promoção",
  decorators: narrow,
  args: { name: "Casaco acolchoado", price: { amount: 59.99, compareAt: 99.95, discount: 40 } },
};

export const SemBotaoRapido: Story = { name: "Sem botão rápido", decorators: narrow, args: { onQuickAdd: undefined } };

export const MidiaPersonalizada: Story = {
  name: "Mídia personalizada",
  decorators: narrow,
  args: {
    name: "Vestido midi",
    media: <MediaPlaceholder aspect="3/4" label="Mídia 3:4" />,
  },
};

export const Estados: Story = {
  render: (args) => (
    <div className="grid max-w-[900px] grid-cols-2 gap-x-2 gap-y-8 md:grid-cols-4">
      <ProductCard {...args} name="Blazer de lã" tag="New" />
      <ProductCard {...args} name="Camisa de linho" colors={3} price={{ amount: 35.95 }} />
      <ProductCard
        {...args}
        name="Casaco acolchoado"
        price={{ amount: 59.99, compareAt: 99.95 }}
      />
      <ProductCard {...args} name="Sapato de couro" onQuickAdd={undefined} />
    </div>
  ),
};

export const Playground: Story = {
  name: "Área de testes",
  decorators: narrow,
  args: { tag: "New", colors: 2, media: { aspect: "2/3", label: "Mídia" } },
};
