import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { QuantityStepper } from "./QuantityStepper";

const meta = {
  title: "Formulário/QuantityStepper",
  component: QuantityStepper,
  tags: ["autodocs"],
  args: { min: 1, max: 10 },
  argTypes: {
    size: { control: "inline-radio", options: ["s", "m"] },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Contador \`−  1  +\` para a quantidade de um item na sacola. Botões só de ícone, sem borda, com o valor de 13px entre eles.

**Quando usar.** Quantidade pequena de um item (sacola, cesto, resumo do pedido).

**Quando não usar.** Números grandes ou livres (use \`TextField\` com \`inputMode="numeric"\`).

**Anatomia.** Grupo · botão diminuir (\`minus\`) · valor · botão aumentar (\`plus\`).

**Acessibilidade.** \`role="group"\` com nome (padrão "Quantidade"). Botões com nomes "Diminuir quantidade"/"Aumentar quantidade" e \`aria-controls\` no valor. O valor é um \`<output aria-live="polite">\`: cada mudança é anunciada. No limite (\`min\`/\`max\`), o botão recebe \`aria-disabled\` em vez de \`disabled\`, para não perder o foco do teclado. \`size="m"\` dá alvos de 44px para toque.
        `,
      },
    },
  },
} satisfies Meta<typeof QuantityStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

export const Toque: Story = { args: { size: "m" } };

export const Controlado: Story = {
  render: (args) => {
    const [qty, setQty] = useState(2);
    return (
      <div className="flex flex-col gap-4">
        <QuantityStepper {...args} value={qty} onValueChange={setQty} />
        <p className="text-label-s font-light text-content-mid">Total: {qty} un.</p>
      </div>
    );
  },
};

export const Estados: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <QuantityStepper defaultValue={1} min={1} max={5} aria-label="No mínimo" />
      <QuantityStepper defaultValue={5} min={1} max={5} label="No máximo" />
      <QuantityStepper defaultValue={2} disabled label="Desabilitado" />
    </div>
  ),
};

export const Playground: Story = { name: "Área de testes" };
