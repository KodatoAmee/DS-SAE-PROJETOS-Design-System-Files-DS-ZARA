import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { cn, focusRing } from "../../../lib/cn";
import { ProductCard } from "../ProductCard";
import { ProductCardSkeleton } from "../Skeleton";
import { ProductGrid, type ProductGridView } from "./ProductGrid";

const produtos = [
  { name: "Blazer de lã", amount: 89.95, tag: "New" },
  { name: "Camisa de linho", amount: 35.95, colors: 2 },
  { name: "Calça reta de algodão", amount: 39.95 },
  { name: "Casaco acolchoado", amount: 59.99, compareAt: 99.95 },
  { name: "Vestido midi", amount: 49.95, tag: "New" },
  { name: "Suéter de caxemira", amount: 119 },
  { name: "Sapato de couro", amount: 69.95, colors: 1 },
  { name: "Saia plissada", amount: 45.95 },
  { name: "Camiseta básica", amount: 12.95, colors: 4 },
  { name: "Jaqueta jeans", amount: 49.95 },
  { name: "Bolsa de ombro", amount: 39.95 },
  { name: "Cinto de couro", amount: 22.95 },
];

function cards() {
  return produtos.map((p) => (
    <ProductCard
      key={p.name}
      name={p.name}
      href="#"
      tag={p.tag}
      colors={p.colors}
      price={{ amount: p.amount, compareAt: p.compareAt }}
      onQuickAdd={() => {}}
    />
  ));
}

const meta = {
  title: "Conteúdo/ProductGrid",
  component: ProductGrid,
  tags: ["autodocs"],
  args: { view: 2, inset: true, "aria-label": "Produtos" },
  argTypes: {
    view: { control: "inline-radio", options: [1, 2, 3] },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
**O que é.** Grelha de produtos com as três densidades da referência ("Vista 1/2/3"). Mobile: 1, 2 ou 3 colunas (calha pequena). Desktop (\`lg\`, 1024px): 2 colunas grandes, 4 ou 6, com calha horizontal de 40px e margens laterais de 40px.

**Quando usar.** Listagens de categoria, resultados de busca, favoritos. Combine com um controle de "Vista" (botões terciários) que troca \`view\`.

**Quando não usar.** Para uma fileira de destaques que rola na horizontal, use \`Carousel\`. Para conteúdo editorial heterogêneo (banners, textos), monte uma grade própria.

**Anatomia.** \`<ul>\` em CSS grid · \`<li>\` por cartão (criado automaticamente) · \`ProductCard\`.

**Acessibilidade.** Lista semântica: o leitor de tela anuncia o total de itens. Dê um nome com \`aria-label\` ou \`aria-labelledby\` quando houver mais de uma grelha na página. Ao trocar a vista, mantenha o foco no controle que a trocou; a ordem de leitura não muda.
        `,
      },
    },
  },
  render: (args) => (
    <ProductGrid {...args}>
      {cards()}
    </ProductGrid>
  ),
} satisfies Meta<typeof ProductGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vista1: Story = { args: { view: 1 } };
export const Vista2: Story = { args: { view: 2 } };
export const Vista3: Story = { args: { view: 3 } };

export const ComSeletorDeVista: Story = {
  name: "Com seletor de vista",
  render: function Render(args) {
    const [view, setView] = useState<ProductGridView>(2);
    return (
      <div className="flex flex-col gap-6">
        <div role="group" aria-label="Vista" className="flex justify-end gap-4 px-4 lg:px-10">
          {([1, 2, 3] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={cn(
                "h-8 text-action font-light uppercase underline-offset-4 aria-pressed:font-medium aria-pressed:underline",
                focusRing,
              )}
            >
              Vista {v}
            </button>
          ))}
        </div>
        <ProductGrid {...args} view={view}>
          {cards()}
        </ProductGrid>
      </div>
    );
  },
};

export const Carregando: Story = {
  render: (args) => (
    <ProductGrid {...args} aria-busy="true">
      {Array.from({ length: 8 }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </ProductGrid>
  ),
};

export const SemMargens: Story = { name: "Sem margens", args: { inset: false } };

export const Playground: Story = { name: "Área de testes" };
