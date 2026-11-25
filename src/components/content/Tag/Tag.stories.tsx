import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tag } from "./Tag";

const meta = {
  title: "Conteúdo/Tag",
  component: Tag,
  tags: ["autodocs"],
  args: { children: "New" },
  argTypes: {
    variant: { control: "inline-radio", options: ["plain", "outline", "solid"] },
    size: { control: "inline-radio", options: ["s", "m"] },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Etiqueta de texto curta, 10 ou 11px, maiúsculas, peso 300. Três variantes: \`plain\` (só texto), \`outline\` (contorno 1px) e \`solid\` (fundo invertido).

**Quando usar.** Sinalizar novidade ("New"), edição ("Edição limitada"), estoque baixo ("Últimas unidades") ou atributo de produto. \`plain\` junto ao nome no cartão; \`outline\`/\`solid\` sobre mídia ou em listas.

**Quando não usar.** Não é botão nem filtro: para seleção use os chips da frente Formulário. Para mensagens de sistema use \`Banner\` ou \`Toast\`.

**Anatomia.** Contêiner (borda/fundo opcionais) · rótulo.

**Acessibilidade.** É texto estático: o conteúdo é lido em sequência com o que estiver ao lado. Se a etiqueta for só visual (redundante), aplique \`aria-hidden\`. Mantenha o texto curto; maiúsculas vêm do CSS, então escreva em caixa normal no código para leitores de tela soletrarem menos.
        `,
      },
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = { name: "Simples", args: { variant: "plain" } };
export const Outline: Story = { name: "Contorno", args: { variant: "outline", children: "Edição limitada" } };
export const Solid: Story = { name: "Sólido", args: { variant: "solid", children: "Últimas unidades" } };

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Tag {...args} variant="outline" size="s">S · 10px</Tag>
      <Tag {...args} variant="outline" size="m">M · 11px</Tag>
    </div>
  ),
};

export const Todas: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Tag>New</Tag>
      <Tag variant="outline">Edição limitada</Tag>
      <Tag variant="solid">Últimas unidades</Tag>
      <Tag variant="solid" size="s">-30%</Tag>
    </div>
  ),
};

export const Playground: Story = { name: "Área de testes" };
