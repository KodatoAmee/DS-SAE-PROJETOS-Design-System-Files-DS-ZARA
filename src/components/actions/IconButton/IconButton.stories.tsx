import type { Meta, StoryObj } from "@storybook/react-vite";
import { iconNames } from "../../icon";
import { IconButton } from "./IconButton";

const meta = {
  title: "Ações/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: { icon: "search", label: "Pesquisar" },
  argTypes: {
    icon: { control: "select", options: iconNames },
    variant: { control: "inline-radio", options: ["ghost", "outline"] },
    size: { control: "inline-radio", options: ["s", "m", "l"] },
    badge: { control: "number" },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Botão quadrado só com ícone de traço 1px. Raio 0. Opcionalmente mostra um contador de 11px ao lado do ícone.

**Quando usar.** Ações recorrentes e reconhecíveis por ícone: abrir menu, pesquisar, fechar, guardar, cesto. \`ghost\` (padrão) em barras de topo; \`outline\` quando o botão precisa de contorno (ex.: +/− de quantidade).

**Quando não usar.** Se o ícone não for óbvio sozinho, use \`Button\` com rótulo. Para navegar entre páginas, use \`Link\`.

**Anatomia.** Contêiner (32 / 40 / 44px, borda 1px em \`outline\`) · ícone 16 ou 20px · contador opcional (\`text-label-s\`, números tabulares).

**Acessibilidade.** \`label\` é obrigatório e vira \`aria-label\`; o ícone é decorativo. Com \`badge\` o nome acessível inclui o número ("Cesto, 2") e o contador visual fica \`aria-hidden\`. \`type="button"\` por padrão. Use \`size="l"\` (44px) em toque.
        `,
      },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ghost: Story = { name: "Sem contorno", args: { variant: "ghost" } };
export const Outline: Story = { name: "Contorno", args: { variant: "outline", icon: "plus", label: "Aumentar quantidade" } };

export const ComContador: Story = {
  name: "Com contador",
  args: { icon: "bag", label: "Cesto", badge: 0 },
};

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      <IconButton {...args} size="s" />
      <IconButton {...args} size="m" />
      <IconButton {...args} size="l" />
      <IconButton {...args} variant="outline" size="s" />
      <IconButton {...args} variant="outline" size="m" />
      <IconButton {...args} variant="outline" size="l" />
    </div>
  ),
};

export const Estados: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <IconButton icon="close" label="Fechar" disabled />
      <IconButton icon="minus" label="Diminuir quantidade" variant="outline" disabled />
      <IconButton icon="bag" label="Cesto" badge={3} />
      <IconButton icon="bag" label="Cesto" badge={150} />
    </div>
  ),
};

export const BarraDeTopo: Story = {
  name: "Barra de topo",
  render: () => (
    <div className="flex items-center gap-1">
      <IconButton icon="menu" label="Abrir menu" />
      <IconButton icon="search" label="Pesquisar" />
      <IconButton icon="user" label="Conta" />
      <IconButton icon="bag" label="Cesto" badge={0} />
    </div>
  ),
};

export const Playground: Story = { name: "Área de testes" };
