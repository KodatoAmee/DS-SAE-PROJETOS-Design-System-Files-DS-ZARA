import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { ButtonGroup } from "./ButtonGroup";

const meta = {
  title: "Ações/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  args: { "aria-label": "Ações do produto" },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    attached: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="secondary">Cancelar</Button>
      <Button variant="secondary">Guardar</Button>
      <Button>Adicionar</Button>
    </ButtonGroup>
  ),
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Contêiner que alinha botões relacionados lado a lado ou empilhados. Com \`attached\` as bordas se colam (sobreposição de 1px, sem borda dupla) formando um bloco único.

**Quando usar.** Pares de ação (Cancelar / Confirmar), seletores de quantidade (− 1 +) e conjuntos de opções equivalentes. \`vertical\` em gavetas e telas estreitas; \`fullWidth\` para ocupar a largura do contêiner.

**Quando não usar.** Para escolher uma opção entre várias com estado, use \`ViewSelector\` ou um grupo de rádio. Para navegação, use links. Não agrupe ações sem relação entre si.

**Anatomia.** Contêiner \`role="group"\` · filhos \`Button\` / \`IconButton\` (vão de 8px, ou bordas coladas em \`attached\`).

**Acessibilidade.** \`role="group"\`; passe \`aria-label\` (ou \`aria-labelledby\`) para nomear o conjunto. A ordem de Tab segue a ordem visual. Em \`attached\` o botão em hover/foco sobe de camada para o anel de foco não ficar coberto.
        `,
      },
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};
export const Vertical: Story = { args: { orientation: "vertical" } };
export const Colado: Story = { args: { attached: true } };
export const ColadoVertical: Story = { name: "Colado vertical", args: { attached: true, orientation: "vertical" } };

export const Quantidade: Story = {
  args: { attached: true, "aria-label": "Quantidade" },
  render: (args) => (
    <ButtonGroup {...args}>
      <IconButton variant="outline" size="s" icon="minus" label="Diminuir quantidade" />
      <span className="inline-flex h-8 min-w-8 items-center justify-center border border-line px-2 text-action font-light tabular-nums">
        1
      </span>
      <IconButton variant="outline" size="s" icon="plus" label="Aumentar quantidade" />
    </ButtonGroup>
  ),
};

export const LarguraTotal: Story = {
  name: "Largura total",
  args: { fullWidth: true },
  render: (args) => (
    <div className="max-w-[398px]">
      <ButtonGroup {...args}>
        <Button variant="secondary">Cancelar</Button>
        <Button>Confirmar</Button>
      </ButtonGroup>
    </div>
  ),
};

export const Playground: Story = { name: "Área de testes" };
