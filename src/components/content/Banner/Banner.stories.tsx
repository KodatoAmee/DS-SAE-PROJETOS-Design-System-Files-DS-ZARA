import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../actions/Button";
import { Banner } from "./Banner";

const meta = {
  title: "Conteúdo/Banner",
  component: Banner,
  tags: ["autodocs"],
  args: {
    position: "inline",
    children: "Envio gratuito em compras acima de 50 € para entrega em loja.",
  },
  argTypes: {
    position: { control: "inline-radio", options: ["inline", "bottom"] },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Barra de aviso com texto de 12px e um espaço para ações. \`inline\` fica no fluxo da página (fundo \`muted\`); \`bottom\` fica fixa no rodapé da janela (fundo \`surface\`, linha superior de 1px), como o aviso de cookies com dois botões (secundário e primário).

**Quando usar.** Informação persistente que não bloqueia a navegação: condições de envio, aviso de cookies, mudança de política, falha parcial de serviço.

**Quando não usar.** Confirmação passageira de ação: \`Toast\`. Decisão obrigatória antes de continuar: \`Modal\`. Erro de campo: mensagem do campo.

**Anatomia.** Título opcional (12px, maiúsculas) · texto · Fechar opcional · ações (Buttons).

**Acessibilidade.** \`bottom\` é \`role="region"\` com nome (\`label\`, padrão "Aviso"), alcançável por navegação de regiões; \`inline\` é \`role="note"\`. Não rouba o foco. Garanta que o conteúdo da página não fica escondido atrás da barra fixa (reserve espaço no rodapé). Links no texto ficam sublinhados. Ordem do DOM: ação secundária antes da primária.
        `,
      },
    },
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmLinha: Story = { name: "Em linha" };

export const ComTituloEFechar: Story = {
  name: "Com título e fechar",
  args: {
    title: "Envio",
    children: "Os pedidos feitos hoje são entregues em 2 a 4 dias úteis.",
    onClose: () => {},
  },
};

export const Cookies: Story = {
  args: {
    position: "bottom",
    label: "Aviso de cookies",
    children: (
      <>
        Usamos cookies próprios e de terceiros para melhorar a navegação e mostrar conteúdo
        relevante. Saiba mais na <a href="#">política de cookies</a>.
      </>
    ),
    actions: (
      <>
        <Button variant="secondary" size="m">
          Configurar
        </Button>
        <Button size="m">Aceitar todos</Button>
      </>
    ),
  },
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, height: "260px" } },
  },
};

export const Playground: Story = { name: "Área de testes" };
