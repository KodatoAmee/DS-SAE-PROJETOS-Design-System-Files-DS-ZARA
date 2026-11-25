import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "Ações/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Adicionar" },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary", "tertiary"] },
    size: { control: "inline-radio", options: ["s", "m", "l"] },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Gatilho de ação. Retangular, raio 0, texto em maiúsculas e peso 300.

**Quando usar.** \`primary\` para a ação principal da tela (uma só). \`secondary\` para alternativas. \`tertiary\` para ações de baixa ênfase em barras e listas (Filtros, Vista).

**Quando não usar.** Para navegar entre páginas, use \`Link\`. Para só um ícone, use \`IconButton\`.

**Anatomia.** Contêiner (1px de borda) · ícone opcional · rótulo.

**Acessibilidade.** \`type="button"\` por padrão. Em \`loading\` recebe \`aria-busy\` e \`aria-disabled\`, mantendo o foco. Use \`size="l"\` (44px) em telas de toque.
        `,
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { name: "Primário", args: { variant: "primary" } };
export const Secondary: Story = { name: "Secundário", args: { variant: "secondary" } };
export const Tertiary: Story = { name: "Terciário", args: { variant: "tertiary", children: "Filtros" } };

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      <Button {...args} size="s">S · 32</Button>
      <Button {...args} size="m">M · 40</Button>
      <Button {...args} size="l">L · 44</Button>
    </div>
  ),
};

export const Estados: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button disabled>Desabilitado</Button>
      <Button variant="secondary" disabled>Desabilitado</Button>
      <Button loading>A processar</Button>
      <Button variant="secondary" iconEnd="arrow-right">Continuar</Button>
      <Button variant="tertiary" iconStart="filter">Filtros</Button>
    </div>
  ),
};

export const LarguraTotal: Story = {
  name: "Largura total",
  args: { fullWidth: true, children: "Continuar" },
  render: (args) => (
    <div className="max-w-[398px]">
      <Button {...args} />
    </div>
  ),
};

export const Playground: Story = { name: "Área de testes" };
