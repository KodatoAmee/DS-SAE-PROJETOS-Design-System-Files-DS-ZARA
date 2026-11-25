import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumbs } from "./Breadcrumbs";

const meta = {
  title: "Navegação/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
  args: {
    items: [
      { label: "Mulher", href: "#" },
      { label: "Vestidos", href: "#" },
      { label: "Vestido longo de linho" },
    ],
  },
  argTypes: { separator: { control: "text" } },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Trilha de localização em 11px/16, maiúsculas, peso 300, separada por "/".

**Quando usar.** Em páginas de produto e listagens com mais de um nível, para voltar a níveis superiores.

**Quando não usar.** Na home ou em páginas de primeiro nível. Não substitui o menu principal nem passos de um fluxo (checkout).

**Anatomia.** \`nav\` · \`ol\` · itens (link, botão ou texto) · separador decorativo · item atual (último).

**Acessibilidade.** \`<nav aria-label="Caminho">\` com lista ordenada. O último item recebe \`aria-current="page"\` e não é link. O separador é \`aria-hidden\`. Cada link tem altura mínima de 24px (WCAG 2.5.8).
        `,
      },
    },
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

export const Profundo: Story = {
  args: {
    items: [
      { label: "Início", href: "#" },
      { label: "Mulher", href: "#" },
      { label: "Roupa", href: "#" },
      { label: "Casacos", href: "#" },
      { label: "Trench coat cintado" },
    ],
  },
};

export const DoisNiveis: Story = {
  name: "Dois níveis",
  args: { items: [{ label: "Homem", href: "#" }, { label: "Malhas" }] },
};

export const Playground: Story = { name: "Área de testes" };
