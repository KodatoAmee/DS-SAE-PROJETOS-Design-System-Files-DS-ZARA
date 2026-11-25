import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../actions/Button";
import { Footer, type FooterColumn } from "./Footer";

const columns: FooterColumn[] = [
  {
    title: "Ajuda",
    links: [
      { label: "Comprar", href: "#" },
      { label: "Pagamento", href: "#" },
      { label: "Envio", href: "#" },
      { label: "Trocas e devoluções", href: "#" },
    ],
  },
  {
    title: "Siga-nos",
    links: [
      { label: "Newsletter", href: "#" },
      { label: "Instagram", href: "#" },
      { label: "Pinterest", href: "#" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre nós", href: "#" },
      { label: "Lojas", href: "#" },
      { label: "Trabalhe conosco", href: "#" },
    ],
  },
  {
    title: "Políticas",
    links: [
      { label: "Privacidade", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "Termos de uso", href: "#" },
    ],
  },
];

const legal = "© 2026 Maison. Todos os direitos reservados. Texto legal de exemplo.";

const meta = {
  title: "Navegação/Footer",
  component: Footer,
  tags: ["autodocs"],
  args: {
    columns,
    region: { country: "Brasil", language: "Português", onClick: () => {} },
    legal,
  },
  argTypes: { newsletter: { control: false }, legal: { control: "text" } },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
**O que é.** Rodapé global: colunas de links em 11px maiúsculas, linha de seletor de país/idioma e texto legal em 10px. Slot \`newsletter\` opcional acima das colunas.

**Quando usar.** No fim de todas as páginas, para links institucionais, ajuda e políticas.

**Quando não usar.** Para navegação principal de compra (use \`Header\`/\`MenuDrawer\`). Não repita aqui ações de checkout.

**Anatomia.** \`newsletter\` (slot) · \`nav\` com grade de colunas (1 coluna no mobile, 2 em \`md\`, 4 em \`lg\`) · título da coluna (\`content-low\`) · links · linha 1px \`line-subtle\` · país / idioma · texto legal.

**Acessibilidade.** Raiz \`<footer>\` (landmark *contentinfo*). As colunas ficam num \`<nav aria-label="Rodapé">\`; cada lista é rotulada pelo título da coluna (\`aria-labelledby\`). O seletor de país tem nome "Brasil / Português, alterar país e idioma" (texto oculto complementa o visível). Links com altura mínima de 24px.
        `,
      },
    },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

export const ComNewsletter: Story = {
  name: "Com newsletter",
  args: {
    newsletter: (
      <div className="flex max-w-md flex-col gap-4">
        <p className="text-title-s font-light uppercase">Inscreva-se na newsletter</p>
        <p className="text-body font-light text-content-mid">
          Receba novidades e lançamentos por e-mail.
        </p>
        <div>
          <Button variant="secondary">Inscrever-se</Button>
        </div>
      </div>
    ),
  },
};

export const SoLegal: Story = {
  name: "Só país e texto legal",
  args: { columns: [] },
};

export const Playground: Story = { name: "Área de testes" };
