import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../actions/Button";
import { Modal, type ModalProps } from "./Modal";

function Demo(props: Partial<ModalProps> & { trigger?: string }) {
  const { trigger = "Abrir modal", ...rest } = props;
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {trigger}
      </Button>
      <Modal
        title="Guia de tamanhos"
        {...rest}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          rest.onOpenChange?.(next);
        }}
      />
    </>
  );
}

const meta = {
  title: "Conteúdo/Modal",
  component: Modal,
  tags: ["autodocs"],
  args: {
    title: "Guia de tamanhos",
    children:
      "As medidas correspondem ao corpo, não à peça. Em caso de dúvida entre dois tamanhos, escolha o maior.",
  },
  argTypes: {
    size: { control: "inline-radio", options: ["s", "m", "l"] },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Diálogo modal centrado: painel branco, sem sombra, sem raio, sobre backdrop \`rgba(0,0,0,.5)\`. Título de 15px em maiúsculas, botão Fechar e rodapé opcional para ações.

**Quando usar.** Decisões curtas que bloqueiam o fluxo: confirmar remoção, guia de tamanhos, aviso legal, escolha de país.

**Quando não usar.** Para listas longas, cesto ou filtros use \`Drawer\`. Para avisos que não exigem resposta use \`Toast\` ou \`Banner\`.

**Anatomia.** Backdrop (irmão do painel) · painel · cabeçalho (título, descrição opcional, Fechar) · corpo rolável · rodapé opcional.

**Acessibilidade.** Renderizado com \`createPortal\` em \`document.body\`. \`role="dialog"\`, \`aria-modal="true"\`, rotulado pelo título (\`aria-labelledby\`) e descrito por \`description\`. Ao abrir, o foco vai para o painel (ou \`initialFocusRef\`) e fica preso nele (Tab/Shift+Tab circulam); Esc fecha; ao fechar, o foco volta ao gatilho. Bloqueia o scroll da página. Controlado (\`open\`/\`onOpenChange\`) ou não controlado (\`defaultOpen\`).
        `,
      },
    },
  },
  render: (args) => <Demo {...args} />,
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

export const ComRodape: Story = {
  name: "Com rodapé",
  args: {
    title: "Remover artigo",
    description: "O artigo sai do cesto. Você pode adicioná-lo de novo depois.",
    children: undefined,
    size: "s",
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Remover
        </Button>
        <Modal
          {...args}
          open={open}
          onOpenChange={setOpen}
          footer={
            <>
              <Button variant="secondary" size="m" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button size="m" onClick={() => setOpen(false)}>
                Remover
              </Button>
            </>
          }
        />
      </>
    );
  },
};

export const ConteudoLongo: Story = {
  name: "Conteúdo longo",
  args: {
    title: "Política de devoluções",
    size: "l",
    children: (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i}>
            Parágrafo {i + 1}. Você tem 30 dias a partir da data de envio para devolver os artigos. As peças
            devem estar em perfeito estado, com as etiquetas originais.
          </p>
        ))}
      </div>
    ),
  },
};

export const SemBotaoFechar: Story = {
  name: "Sem botão fechar",
  args: { title: "Escolha o país", hideClose: true, size: "s", children: "Pressione Esc ou clique fora para fechar." },
};

export const Playground: Story = { name: "Área de testes" };
