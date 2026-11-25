import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Tabs, type TabsItem } from "./Tabs";

const panel = (text: string) => <p className="max-w-prose text-body font-light">{text}</p>;

const items: TabsItem[] = [
  { id: "mulher", label: "Mulher", content: panel("Novidades, vestidos, camisas e calças.") },
  { id: "homem", label: "Homem", content: panel("Casacos, malhas, calças e sapatos.") },
  { id: "criancas", label: "Crianças", content: panel("Bebê, menina e menino.") },
  { id: "casa", label: "Casa", content: panel("Quarto, banho e mesa.") },
];

const meta = {
  title: "Navegação/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  args: { items, label: "Categorias", orientation: "horizontal", activation: "automatic" },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    activation: { control: "inline-radio", options: ["automatic", "manual"] },
    items: { control: false },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Abas de texto em maiúsculas (13px, peso 300). A selecionada ganha \`font-medium\` e sublinhado de 1px. Sem caixas, sem fundo.

**Quando usar.** Alternar entre vistas irmãs do mesmo contexto: categorias no menu (vertical), Descrição/Composição/Cuidados no produto (horizontal).

**Quando não usar.** Para navegar entre páginas use links (\`Breadcrumbs\`, \`Header\`). Para filtrar uma lista com múltipla escolha, use filtros/checkbox.

**Anatomia.** \`tablist\` · \`tab\` (rótulo) · \`tabpanel\` (\`content\` opcional; sem ele as abas funcionam só como seletor).

**Acessibilidade.** Padrão WAI-ARIA *Tabs*: \`role="tablist"\` com \`aria-orientation\`, \`role="tab"\` com \`aria-selected\` e \`aria-controls\`, \`role="tabpanel"\` com \`aria-labelledby\`. Tabindex itinerante: só a aba selecionada entra na ordem de Tab. Setas ←/→ (horizontal) ou ↑/↓ (vertical), Home e End; abas desabilitadas são puladas. \`activation="manual"\` move só o foco e seleciona com Enter/Espaço. Controlado (\`value\` + \`onValueChange\`) ou não (\`defaultValue\`).
        `,
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};

export const Vertical: Story = {
  args: { orientation: "vertical" },
};

export const Estados: Story = {
  args: {
    defaultValue: "homem",
    items: [items[0], items[1], { ...items[2], disabled: true }, items[3]],
  },
};

export const ApenasSeletor: Story = {
  name: "Só seletor (sem painéis)",
  args: { items: items.map(({ id, label }) => ({ id, label })) },
};

export const AtivacaoManual: Story = {
  name: "Ativação manual",
  args: { activation: "manual" },
};

function Controlado() {
  const [value, setValue] = useState("criancas");
  return (
    <div className="flex flex-col gap-6">
      <Tabs items={items} label="Categorias" value={value} onValueChange={setValue} />
      <p className="text-label text-content-low uppercase">Selecionada: {value}</p>
    </div>
  );
}

export const Controlada: Story = {
  render: () => <Controlado />,
};

export const Playground: Story = { name: "Área de testes" };
