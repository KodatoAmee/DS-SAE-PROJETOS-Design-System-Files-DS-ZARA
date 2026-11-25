import type { Meta, StoryObj } from "@storybook/react-vite";
import { MediaPlaceholder } from "./MediaPlaceholder";

const meta = {
  title: "Conteúdo/MediaPlaceholder",
  component: MediaPlaceholder,
  tags: ["autodocs"],
  args: { aspect: "2/3", label: "Mídia 2:3" },
  argTypes: {
    aspect: { control: "inline-radio", options: ["2/3", "3/4", "1/1", "16/9"] },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Bloco de mídia com proporção fixa. Sem \`src\` é um retângulo \`bg-muted\`; com \`src\` mostra a imagem com \`object-cover\` e \`loading="lazy"\`.

**Quando usar.** Reservar o espaço de fotos de produto, campanhas e carrosséis, evitando salto de layout. Em protótipos e stories, sempre no lugar de fotos reais.

**Quando não usar.** Para estado de carregamento animado, use \`Skeleton\`. Para ícones, use \`Icon\`.

**Anatomia.** Contêiner com \`aspect-ratio\` · imagem opcional · rótulo opcional centrado (10px, maiúsculas).

**Acessibilidade.** Sem \`src\` e sem \`label\` é decorativo. Com \`label\` recebe \`role="img"\` e nome acessível. Com \`src\`, informe \`alt\` quando a imagem transmitir informação; deixe vazio quando o texto ao lado já a descreve (caso do cartão de produto).
        `,
      },
    },
  },
} satisfies Meta<typeof MediaPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

const narrow: Story["decorators"] = [
  (Story) => (
    <div className="max-w-[280px]">
      <Story />
    </div>
  ),
];

export const Retrato: Story = { decorators: narrow };
export const TresQuartos: Story = { name: "Três quartos", decorators: narrow, args: { aspect: "3/4", label: "Mídia 3:4" } };
export const Quadrado: Story = { decorators: narrow, args: { aspect: "1/1", label: "Mídia 1:1" } };
export const Paisagem: Story = { decorators: narrow, args: { aspect: "16/9", label: "Mídia 16:9" } };

export const Proporcoes: Story = {
  name: "Proporções",
  render: () => (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <MediaPlaceholder aspect="2/3" label="2:3" />
      <MediaPlaceholder aspect="3/4" label="3:4" />
      <MediaPlaceholder aspect="1/1" label="1:1" />
      <MediaPlaceholder aspect="16/9" label="16:9" />
    </div>
  ),
};

export const SemRotulo: Story = { name: "Sem rótulo", decorators: narrow, args: { label: undefined } };

export const Playground: Story = { name: "Área de testes", decorators: narrow };
