import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ViewSelector } from "./ViewSelector";

const meta = {
  title: "Ações/ViewSelector",
  component: ViewSelector,
  tags: ["autodocs"],
  args: { options: [1, 2, 3], defaultValue: 2, label: "Vista" },
  argTypes: {
    value: { control: "number" },
    defaultValue: { control: "number" },
    disabled: { control: "boolean" },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Seletor da densidade da grelha de produtos, no formato "VISTA 1 2 3": rótulo em maiúsculas seguido de opções numéricas. A opção ativa fica em \`font-medium\` e sublinhada.

**Quando usar.** Barras de listagem para trocar quantas colunas a grelha mostra. Funciona controlado (\`value\` + \`onValueChange\`) ou não controlado (\`defaultValue\`).

**Quando não usar.** Para escolhas que não são números de colunas, use um grupo de rádio do formulário ou abas. Para filtrar ou ordenar, use os componentes de filtro.

**Anatomia.** Rótulo ("Vista") · lista de opções numéricas (alvo 24×24) · sublinhado 1px na opção selecionada.

**Acessibilidade.** \`role="radiogroup"\` rotulado pelo texto visível; cada número é \`role="radio"\` com \`aria-checked\` e nome acessível "2 colunas" (contém o número visível). Tab entra só na opção selecionada (roving tabindex); ←/→ (e ↑/↓) movem e selecionam, Home/End vão às pontas. Selecionado não depende só de peso: também é sublinhado.
        `,
      },
    },
  },
} satisfies Meta<typeof ViewSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NaoControlado: Story = { name: "Não controlado" };

const gridCols: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
};

function GrelhaControlada() {
  const [value, setValue] = useState(3);
  return (
    <div className="flex flex-col gap-4">
      <ViewSelector value={value} onValueChange={setValue} />
      <div className={`grid gap-1 ${gridCols[value] ?? "grid-cols-3"}`}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="aspect-[2/3] bg-muted" />
        ))}
      </div>
    </div>
  );
}

export const Controlado: Story = {
  render: () => <GrelhaControlada />,
};

export const MaisOpcoes: Story = { name: "Mais opções", args: { options: [2, 4, 6], defaultValue: 4 } };

export const Estados: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <ViewSelector defaultValue={1} />
      <ViewSelector defaultValue={3} />
      <ViewSelector defaultValue={2} disabled />
    </div>
  ),
};

export const Playground: Story = { name: "Área de testes" };
