import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SizeSelector, type SizeOption } from "./SizeSelector";

const tamanhos: SizeOption[] = [
  { value: "XS" },
  { value: "S", availability: "low" },
  { value: "M" },
  { value: "L", availability: "soldOut" },
  { value: "XL" },
];

const meta = {
  title: "Formulário/SizeSelector",
  component: SizeSelector,
  tags: ["autodocs"],
  args: { options: tamanhos, name: "tamanho" },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Seletor de tamanho de produto (XS S M L XL ou numeração). Cada opção é um botão de texto de 13px. Selecionado: \`font-medium\` e borda de 1px. Esgotado: \`text-content-disabled\`, riscado e bloqueado. Poucas unidades: nota de 11px.

**Quando usar.** Página de produto e gaveta "Selecione o tamanho" antes de adicionar à sacola.

**Quando não usar.** Opções que não são tamanhos/variantes de produto (use \`RadioGroup\`). Mais de ~15 opções (use \`Select\`).

**Anatomia.** Rótulo opcional (12px maiúsculas) · lista em linha (\`horizontal\`) ou coluna (\`vertical\`, como na gaveta) · opção (texto + nota) · ajuda ou erro.

**Acessibilidade.** Padrão ARIA \`radiogroup\` com \`role="radio"\` + \`aria-checked\` e **tabindex móvel**: Tab entra no tamanho selecionado (ou no primeiro disponível); setas, Home e End movem e selecionam, **pulando esgotados**. Esgotados ficam visíveis com \`aria-disabled="true"\` e o texto oculto ", esgotado" no nome acessível. A nota de poucas unidades faz parte do nome. Alvo mínimo 40x44 (horizontal) ou 44 de altura (vertical).
        `,
      },
    },
  },
} satisfies Meta<typeof SizeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = { args: { label: "Tamanho" } };

export const Vertical: Story = {
  args: { orientation: "vertical", label: "Selecione o tamanho" },
  decorators: [
    (Story) => (
      <div className="max-w-[398px]">
        <Story />
      </div>
    ),
  ],
};

export const Numeracao: Story = {
  name: "Numeração",
  args: {
    label: "Número",
    options: [
      { value: "36" },
      { value: "37", availability: "soldOut" },
      { value: "38" },
      { value: "39", availability: "low" },
      { value: "40" },
      { value: "41", availability: "soldOut" },
    ],
  },
};

export const Controlado: Story = {
  render: (args) => {
    const [value, setValue] = useState("M");
    return (
      <div className="flex flex-col gap-4">
        <SizeSelector {...args} value={value} onValueChange={setValue} />
        <p className="text-label-s font-light text-content-mid">Selecionado: {value}</p>
      </div>
    );
  },
};

export const Estados: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      <SizeSelector label="Selecionado" options={tamanhos} defaultValue="M" />
      <SizeSelector label="Com erro" options={tamanhos} required error="Selecione um tamanho." />
      <SizeSelector
        label="Com nota própria"
        options={[
          { value: "S" },
          { value: "M", note: "Chega em 15 dias" },
          { value: "L", availability: "soldOut" },
        ]}
        orientation="vertical"
        helperText="O modelo veste M."
      />
    </div>
  ),
};

export const Playground: Story = { name: "Área de testes" };
