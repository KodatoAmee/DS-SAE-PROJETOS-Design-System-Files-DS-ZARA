import type { Meta, StoryObj } from "@storybook/react-vite";
import { MediaPlaceholder } from "../MediaPlaceholder";
import { ProductCard } from "../ProductCard";
import { Carousel } from "./Carousel";

const nomes = [
  "Blazer de lã",
  "Camisa de linho",
  "Calça reta de algodão",
  "Casaco acolchoado",
  "Vestido midi",
  "Suéter de caxemira",
  "Sapato de couro",
  "Saia plissada",
];

const meta = {
  title: "Conteúdo/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  args: { label: "Novidades", heading: "Novidades" },
  argTypes: {
    itemSize: { control: "inline-radio", options: ["default", "full"] },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Faixa horizontal de mídia ou cartões com \`scroll-snap\`. Itens de 216px, espaço de 10px. Botões Anterior/Próximo e indicador "1 / N".

**Quando usar.** Recomendações ("Também pode gostar"), looks completos, galeria de imagens da ficha de produto (\`itemSize="full"\`).

**Quando não usar.** Para listar uma categoria inteira use \`ProductGrid\`: esconder itens fora da tela prejudica a comparação. Não use rotação automática.

**Anatomia.** Cabeçalho (título opcional · indicador · Anterior · Próximo) · faixa rolável · itens.

**Acessibilidade.** \`<section aria-roledescription="carrossel">\` com \`aria-label\` obrigatório. Cada item é \`role="group"\` com rótulo "x de N". Com o foco dentro do carrossel: ← / → movem um item, Home/End vão ao início/fim. A faixa é focável para rolar pelo teclado. Os botões usam \`aria-disabled\` nas pontas para não perder o foco. O indicador é região \`aria-live="polite"\` ("Item 2 de 8"). \`prefers-reduced-motion\` desliga a rolagem suave.
        `,
      },
    },
  },
  render: (args) => (
    <Carousel {...args}>
      {nomes.map((nome, i) => (
        <ProductCard
          key={nome}
          name={nome}
          href="#"
          tag={i === 0 ? "New" : undefined}
          price={{ amount: 29.95 + i * 10 }}
          onQuickAdd={() => {}}
        />
      ))}
    </Carousel>
  ),
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Produtos: Story = {};

export const SoMidia: Story = {
  name: "Só mídia",
  args: { label: "Galeria", heading: undefined },
  render: (args) => (
    <Carousel {...args}>
      {Array.from({ length: 10 }, (_, i) => (
        <MediaPlaceholder key={i} aspect="2/3" label={`Mídia ${i + 1}`} />
      ))}
    </Carousel>
  ),
};

export const LarguraTotal: Story = {
  name: "Largura total",
  args: { label: "Galeria do produto", heading: undefined, itemSize: "full" },
  render: (args) => (
    <div className="max-w-[420px]">
      <Carousel {...args}>
        {Array.from({ length: 5 }, (_, i) => (
          <MediaPlaceholder key={i} aspect="2/3" label={`Imagem ${i + 1}`} />
        ))}
      </Carousel>
    </div>
  ),
};

export const SemControles: Story = { name: "Sem controles", args: { showControls: false } };

export const Playground: Story = { name: "Área de testes" };
