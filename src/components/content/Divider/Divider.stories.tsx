import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "./Divider";

const meta = {
  title: "Conteúdo/Divider",
  component: Divider,
  tags: ["autodocs"],
  args: { orientation: "horizontal", tone: "subtle" },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    tone: { control: "inline-radio", options: ["subtle", "strong"] },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Linha de 1px. \`subtle\` (\`line-subtle\`, cinza claro) por padrão; \`strong\` (\`line\`, cor do texto) para separações fortes. Horizontal ou vertical.

**Quando usar.** Separar grupos dentro de gavetas, resumos de compra, rodapés e barras de ferramentas (vertical).

**Quando não usar.** Entre cartões da grelha (o espaço já separa) ou como decoração de títulos. Se o espaço resolve, não use linha.

**Anatomia.** Um elemento de 1px de espessura.

**Acessibilidade.** \`role="separator"\` (com \`aria-orientation="vertical"\` quando vertical). Use \`decorative\` quando a linha for só visual: vira \`role="none"\` e \`aria-hidden\`.
        `,
      },
    },
  },
  render: (args) => (
    <div className="flex max-w-[400px] flex-col gap-4 text-body">
      <p>Composição</p>
      <Divider {...args} />
      <p>Cuidados</p>
    </div>
  ),
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Subtle: Story = { name: "Sutil" };
export const Strong: Story = { name: "Forte", args: { tone: "strong" } };

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div className="flex h-8 items-center gap-4 text-action uppercase">
      <span>Filtros</span>
      <Divider {...args} />
      <span>Vista</span>
    </div>
  ),
};

export const Decorativo: Story = { args: { decorative: true } };

export const Playground: Story = { name: "Área de testes" };
