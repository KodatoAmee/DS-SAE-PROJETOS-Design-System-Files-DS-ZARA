import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Switch } from "./Switch";

const meta = {
  title: "Formulário/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: { label: "Notificações de reposição de estoque" },
  argTypes: {
    labelPosition: { control: "inline-radio", options: ["start", "end"] },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Interruptor liga/desliga. Trilho **retangular** de 32x16 com borda de 1px e botão **quadrado** de 12px. Ligado: trilho \`bg-inverse\` e botão \`bg-on-inverse\` à direita.

**Quando usar.** Preferências com efeito imediato, sem botão de salvar (notificações, modo escuro).

**Quando não usar.** Escolha que só vale ao enviar um formulário (use \`Checkbox\`). Mais de dois estados (use \`RadioGroup\`).

**Anatomia.** Trilho · botão · rótulo (12px) · descrição opcional (11px).

**Acessibilidade.** \`<button role="switch" aria-checked>\`: Espaço e Enter alternam. O rótulo é um \`<label htmlFor>\` real (clicar no texto também alterna). Área de toque estendida a 24px de altura sem mudar o desenho. Com \`name\`, envia um \`<input type="hidden">\` quando ligado.
        `,
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desligado: Story = {};

export const Ligado: Story = { args: { defaultChecked: true } };

export const ComDescricao: Story = {
  name: "Com descrição",
  args: {
    label: "Modo escuro",
    description: "Aplica o tema escuro em toda a loja.",
  },
};

export const RotuloAntes: Story = { name: "Rótulo antes", args: { labelPosition: "start" } };

export const Controlado: Story = {
  render: (args) => {
    const [on, setOn] = useState(false);
    return (
      <div className="flex flex-col gap-4">
        <Switch {...args} checked={on} onCheckedChange={setOn} />
        <p className="text-label-s font-light text-content-mid">{on ? "Ligado" : "Desligado"}</p>
      </div>
    );
  },
};

export const Estados: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch label="Desligado" />
      <Switch label="Ligado" defaultChecked />
      <Switch label="Desabilitado" disabled />
      <Switch label="Desabilitado e ligado" disabled defaultChecked />
      <Switch aria-label="Sem rótulo visível" />
    </div>
  ),
};

export const Playground: Story = { name: "Área de testes" };
