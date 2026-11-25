import type { Meta, StoryObj } from "@storybook/react-vite";
import { PriceLabel } from "./PriceLabel";

const meta = {
  title: "Conteúdo/PriceLabel",
  component: PriceLabel,
  tags: ["autodocs"],
  args: { amount: 49.95 },
  argTypes: {
    size: { control: "inline-radio", options: ["s", "m"] },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Preço formatado com \`Intl.NumberFormat\` (padrão \`EUR\` em \`pt-PT\`: "49,95 €"). 11px, peso 300, maiúsculas.

**Quando usar.** Em cartões de produto, ficha, cesto e resumo de compra. Com \`compareAt\` mostra o preço anterior riscado antes do atual; \`discount\` acrescenta a porcentagem.

**Quando não usar.** Para totais com rótulo ("Total", "Envio") monte uma linha de resumo com texto e este componente, não concatene strings.

**Anatomia.** Preço anterior riscado (opcional, \`content-low\`) · desconto (opcional) · preço atual.

**Acessibilidade.** Texto só para leitor de tela ("Preço anterior:", "Preço atual:", "Desconto de") desfaz a ambiguidade do riscado, que não é anunciado. O sinal "-" do desconto é \`aria-hidden\`. Não há cor de destaque: o sistema é monocromático e vermelho só indica erro.
        `,
      },
    },
  },
} satisfies Meta<typeof PriceLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simples: Story = {};
export const ComPrecoAnterior: Story = { name: "Com preço anterior", args: { amount: 29.99, compareAt: 49.95 } };
export const ComDesconto: Story = { name: "Com desconto", args: { amount: 29.99, compareAt: 49.95, discount: 40 } };
export const Medio: Story = { name: "Médio", args: { size: "m", amount: 129 } };

export const Moedas: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <PriceLabel amount={49.95} />
      <PriceLabel amount={249.9} currency="BRL" locale="pt-BR" />
      <PriceLabel amount={59} currency="USD" locale="en-US" />
      <PriceLabel amount={4990} currency="JPY" locale="ja-JP" />
    </div>
  ),
};

export const Playground: Story = { name: "Área de testes", args: { amount: 39.95, compareAt: 59.95, discount: 33 } };
