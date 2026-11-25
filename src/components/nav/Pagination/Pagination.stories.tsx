import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./Pagination";

const meta = {
  title: "Navegação/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  args: { pageCount: 6, defaultPage: 1, variant: "numbers", compact: false },
  argTypes: {
    variant: { control: "inline-radio", options: ["numbers", "dots"] },
    compact: { control: "boolean" },
    pageCount: { control: { type: "number", min: 1 } },
    siblingCount: { control: { type: "number", min: 0, max: 3 } },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Navegação entre páginas ou slides. Duas variantes: \`numbers\` (Anterior · 1 2 3 … · Próximo, ou compacta "1 / 6") e \`dots\` (pontos de 6px).

**Quando usar.** \`numbers\` em resultados e listagens longas. \`compact\` onde falta espaço (mobile, galeria de produto). \`dots\` em carrosséis de imagens com poucos itens (até ~8).

**Quando não usar.** Em listagens com rolagem infinita ou "Ver mais". \`dots\` com muitas páginas: use \`compact\`.

**Anatomia.** \`nav\` · Anterior · páginas (atual em \`font-medium\` + sublinhado) · reticências · Próximo. Em \`dots\`: alvo de 24x24 com ponto de 6px (único uso de \`rounded-full\` no sistema); atual preenchido, demais só contorno.

**Acessibilidade.** \`<nav aria-label="Paginação">\`. A página atual tem \`aria-current="page"\` (em \`dots\`, \`aria-current="true"\`, semântica de carrossel). Cada número/ponto tem nome "Página N de T" (\`getPageLabel\` personaliza). Anterior/Próximo ficam \`aria-disabled="true"\` nas pontas (seguem focáveis, então o foco não cai no body ao chegar à ponta pelo teclado; o clique é ignorado). Na versão compacta o texto "1 / 6" é anunciado como "Página 1 de 6" via \`aria-live\`. Com \`getPageHref\` os controles viram links reais. Controlado (\`page\` + \`onPageChange\`) ou não (\`defaultPage\`).
        `,
      },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Numeros: Story = { name: "Números" };

export const MuitasPaginas: Story = {
  name: "Números com reticências",
  args: { pageCount: 24, defaultPage: 12 },
};

export const Compacta: Story = {
  args: { compact: true },
};

export const Pontos: Story = {
  args: { variant: "dots", defaultPage: 2, getPageLabel: (n, t) => `Slide ${n} de ${t}` },
};

export const Estados: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Pagination pageCount={6} defaultPage={1} aria-label="Primeira página" />
      <Pagination pageCount={6} defaultPage={6} aria-label="Última página" />
      <Pagination pageCount={6} defaultPage={6} compact aria-label="Compacta na última" />
      <Pagination pageCount={1} aria-label="Página única" />
    </div>
  ),
};

export const ComLinks: Story = {
  name: "Com links (getPageHref)",
  args: { pageCount: 10, defaultPage: 3, getPageHref: (n) => `#pagina-${n}` },
};

export const Playground: Story = { name: "Área de testes" };
