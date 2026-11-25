import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkipLink } from "./SkipLink";

const meta = {
  title: "Navegação/SkipLink",
  component: SkipLink,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Link "Pular para o conteúdo principal", invisível até receber foco. Estilo de botão secundário: contorno 1px, 13px maiúsculas, padding 2px 12px.

**Quando usar.** Como **primeiro elemento focável** de toda página, antes do \`Header\`, apontando para o \`<main id="conteudo-principal">\`.

**Quando não usar.** Para âncoras de conteúdo visíveis (índice de página): use um link comum.

**Anatomia.** Link único, fixo no canto superior esquerdo (\`z-toast\`) enquanto focado.

**Acessibilidade.** Atende WCAG 2.4.1 (*Bypass Blocks*). Ao ativar, move o foco de fato para o destino (aplica \`tabindex="-1"\` se necessário), já que alguns navegadores só rolam a página. Pressione **Tab** dentro do canvas para vê-lo.
        `,
      },
    },
  },
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Padrão (pressione Tab)",
  render: (args) => (
    <div>
      <SkipLink {...args} />
      <p className="mb-4 text-label uppercase text-content-low">
        Clique aqui e pressione Tab para revelar o link.
      </p>
      <nav aria-label="Exemplo" className="mb-8 flex gap-4 text-action uppercase">
        <a href="#">Mulher</a>
        <a href="#">Homem</a>
        <a href="#">Crianças</a>
      </nav>
      <main id="conteudo-principal" className="outline-none">
        <p className="text-body">Conteúdo principal.</p>
      </main>
    </div>
  ),
};

export const Visivel: Story = {
  name: "Estado: visível (focado)",
  args: { className: "not-sr-only" },
};

export const Playground: Story = { name: "Área de testes" };
