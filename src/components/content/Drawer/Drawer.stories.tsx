import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../actions/Button";
import { Divider } from "../Divider";
import { MediaPlaceholder } from "../MediaPlaceholder";
import { PriceLabel } from "../PriceLabel";
import { Drawer, type DrawerProps } from "./Drawer";

function Demo({ trigger = "Abrir gaveta", ...args }: DrawerProps & { trigger?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {trigger}
      </Button>
      <Drawer {...args} open={open} onOpenChange={setOpen} />
    </>
  );
}

const itensCesto = [
  { name: "Blazer de lã", amount: 89.95 },
  { name: "Camisa de linho", amount: 35.95 },
];

const meta = {
  title: "Conteúdo/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  args: { title: "Filtros", side: "right", children: "Conteúdo da gaveta." },
  argTypes: {
    side: { control: "inline-radio", options: ["left", "right", "bottom"] },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Painel lateral (ou inferior) que desliza sobre a página: branco, sem sombra, sem raio, backdrop \`rgba(0,0,0,.5)\`. 400px de largura no desktop, largura total no mobile. Transição de 500ms.

**Quando usar.** Cesto, filtros, ordenação, seleção de tamanho no mobile (\`side="bottom"\`): tarefas que pedem contexto da página por trás.

**Quando não usar.** Para confirmações curtas use \`Modal\`. Para a navegação principal use o menu da frente Navegação.

**Anatomia.** Backdrop (irmão do painel) · painel · cabeçalho (título, descrição opcional, Fechar) · corpo rolável · rodapé fixo opcional.

**Acessibilidade.** Mesmo comportamento do \`Modal\`: portal em \`document.body\`, \`role="dialog"\` + \`aria-modal\`, rotulado pelo título, foco preso, Esc fecha, foco devolvido ao gatilho, scroll da página bloqueado. Fica montado durante a animação de saída. \`prefers-reduced-motion\` anula a transição.
        `,
      },
    },
  },
  render: (args) => <Demo {...args} />,
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Direita: Story = {};
export const Esquerda: Story = { args: { side: "left", title: "Ordenar" } };
export const Inferior: Story = {
  args: { side: "bottom", title: "Selecione o tamanho", children: "XS · S · M · L · XL" },
};

export const Cesto: Story = {
  args: {
    title: "Cesto (2)",
    children: (
      <ul className="flex flex-col gap-6">
        {itensCesto.map((item) => (
          <li key={item.name} className="flex gap-4">
            <MediaPlaceholder aspect="2/3" className="w-24 shrink-0" />
            <div className="flex flex-col gap-1 text-label-s uppercase">
              <span>{item.name}</span>
              <PriceLabel amount={item.amount} />
            </div>
          </li>
        ))}
      </ul>
    ),
    footer: (
      <>
        <div className="flex items-center justify-between text-action uppercase">
          <span>Total</span>
          <PriceLabel size="m" amount={125.9} />
        </div>
        <Divider />
        <Button size="l" fullWidth>
          Continuar
        </Button>
      </>
    ),
  },
  render: (args) => <Demo {...args} trigger="Ver cesto" />,
};

export const Playground: Story = { name: "Área de testes" };
