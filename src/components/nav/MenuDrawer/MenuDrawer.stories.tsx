import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../actions/Button";
import { MenuDrawer, type MenuDrawerProps, type MenuDrawerSection } from "./MenuDrawer";

const sections: MenuDrawerSection[] = [
  {
    id: "mulher",
    label: "Mulher",
    items: [
      { label: "Novidades", href: "#" },
      { label: "Mais vendidos", href: "#" },
      { label: "Vestidos", href: "#" },
      { label: "Camisas", href: "#" },
      { label: "Calças", href: "#" },
      { label: "Casacos", href: "#" },
      { label: "Sapatos", href: "#" },
      { label: "Bolsas", href: "#" },
    ],
  },
  {
    id: "homem",
    label: "Homem",
    items: [
      { label: "Novidades", href: "#" },
      { label: "Casacos", href: "#" },
      { label: "Malhas", href: "#" },
      { label: "Calças", href: "#" },
      { label: "Sapatos", href: "#" },
    ],
  },
  {
    id: "criancas",
    label: "Crianças",
    items: [
      { label: "Bebê", href: "#" },
      { label: "Menina", href: "#" },
      { label: "Menino", href: "#" },
    ],
  },
  {
    id: "casa",
    label: "Casa",
    items: [
      { label: "Quarto", href: "#" },
      { label: "Banho", href: "#" },
      { label: "Mesa", href: "#" },
    ],
  },
];

const meta = {
  title: "Navegação/MenuDrawer",
  component: MenuDrawer,
  tags: ["autodocs"],
  args: { sections },
  argTypes: { footer: { control: false }, open: { control: false } },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Gaveta lateral esquerda com o menu principal: abas verticais de seção (Mulher, Homem, Crianças…) e a lista de links da seção selecionada, em 13px maiúsculas. Tela cheia no mobile, metade em \`md\` e 1/3 a partir de \`lg\`.

**Quando usar.** Como destino do botão de menu do \`Header\`, para a árvore de categorias da loja.

**Quando não usar.** Para filtros ou detalhes de produto use um painel genérico (Drawer/Modal). Para 2 ou 3 links, prefira ações diretas no \`Header\`.

**Anatomia.** Backdrop \`bg-overlay\` (irmão do painel) · painel \`bg-base\` · botão Fechar na mesma posição do hambúrguer · \`Tabs\` verticais · lista de links · \`footer\` opcional. Entra e sai com \`translate-x\` em 500ms \`ease-in-out\`.

**Acessibilidade.** \`role="dialog"\`, \`aria-modal="true"\`, rotulado pelo título (padrão "Menu", visualmente oculto). Renderizado com \`createPortal\` no \`body\`. Foco vai para "Fechar" ao abrir, fica preso no painel (Tab/Shift+Tab) e volta ao gatilho ao fechar. \`Esc\` e clique no backdrop fecham. Scroll do \`body\` bloqueado enquanto aberto. As abas seguem o padrão WAI-ARIA (setas ↑/↓, Home/End). Controlado (\`open\` + \`onOpenChange\`) ou não controlado (\`defaultOpen\`).
        `,
      },
    },
  },
} satisfies Meta<typeof MenuDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo(props: MenuDrawerProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)} aria-expanded={open}>
        Abrir menu
      </Button>
      <MenuDrawer {...props} open={open} onOpenChange={setOpen} />
    </>
  );
}

export const Padrao: Story = {
  name: "Padrão",
  render: (args) => <Demo {...args} />,
};

export const ComRodape: Story = {
  name: "Com rodapé",
  args: {
    footer: (
      <ul className="flex flex-col gap-2 text-action font-light uppercase">
        <li>
          <a href="#" className="hover:underline">
            Iniciar sessão
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            Ajuda
          </a>
        </li>
        <li className="text-label-s text-content-low">Brasil / Português</li>
      </ul>
    ),
  },
  render: (args) => <Demo {...args} />,
};

export const SecaoInicial: Story = {
  name: "Seção inicial (Homem)",
  args: { defaultSection: "homem" },
  render: (args) => <Demo {...args} />,
};

export const UmaSecao: Story = {
  name: "Uma seção (sem abas)",
  args: { sections: [sections[0]] },
  render: (args) => <Demo {...args} />,
};

export const Playground: Story = {
  name: "Área de testes",
  render: (args) => <Demo {...args} />,
};
