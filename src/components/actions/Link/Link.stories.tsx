import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "./Link";

const meta = {
  title: "Ações/Link",
  component: Link,
  tags: ["autodocs"],
  args: { href: "#", children: "Ver tudo" },
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "underline"] },
    size: { control: "inline-radio", options: ["label-s", "action", "body"] },
    caps: { control: "boolean" },
    external: { control: "boolean" },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Âncora (\`<a>\`) de texto para navegar. Peso 300, cor do texto, sem cor de destaque: o hover sublinha (ou reduz a opacidade, na variante \`underline\`).

**Quando usar.** Navegar para outra página ou âncora: "Ajuda", "Ver tudo", termos legais, links dentro de parágrafos. \`caps\` para links que funcionam como rótulo ou ação; caixa normal dentro de texto corrido. \`underline\` quando o link precisa ser identificável sem hover (texto corrido, WCAG 1.4.1).

**Quando não usar.** Para executar uma ação na mesma página (abrir gaveta, adicionar ao cesto), use \`Button\` (\`tertiary\` para o mesmo visual). Não use link sem \`href\`.

**Anatomia.** Texto · sublinhado 1px deslocado 4px · texto oculto "(abre em nova janela)" quando \`external\`.

**Acessibilidade.** Elemento \`<a href>\` nativo: Enter ativa, foco com anel de 1px. \`external\` adiciona \`target="_blank"\`, \`rel="noopener"\` e o aviso "(abre em nova janela)" só para leitores de tela. Em texto corrido prefira \`variant="underline"\`, pois cor sozinha não distingue o link.
        `,
      },
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Padrão" };
export const Underline: Story = { name: "Sublinhado", args: { variant: "underline" } };
export const Maiusculas: Story = { name: "Maiúsculas", args: { caps: true, size: "action", children: "Ajuda" } };
export const Externo: Story = {
  args: { external: true, href: "https://example.com", children: "Política de privacidade" },
};

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex items-baseline gap-6">
      <Link {...args} size="label-s">Label S · 11</Link>
      <Link {...args} size="action">Action · 13</Link>
      <Link {...args} size="body">Body · 13/20</Link>
    </div>
  ),
};

export const EmTextoCorrido: Story = {
  name: "Em texto corrido",
  render: () => (
    <p className="max-w-[480px] text-body font-light">
      Ao continuar, aceita os{" "}
      <Link href="#" variant="underline">
        termos e condições
      </Link>{" "}
      e a{" "}
      <Link href="https://example.com" variant="underline" external>
        política de privacidade
      </Link>
      .
    </p>
  ),
};

export const Playground: Story = { name: "Área de testes" };
