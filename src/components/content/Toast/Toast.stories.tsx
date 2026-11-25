import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../actions/Button";
import { Toast, ToastProvider, useToast } from "./Toast";

function Disparadores() {
  const { toast, dismiss } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" onClick={() => toast("Artigo adicionado ao cesto")}>
        Simples
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            // Com ação: fica aberto até Desfazer, Fechar ou Escape (duration padrão Infinity).
            message: "Artigo removido do cesto",
            action: { label: "Desfazer", onClick: () => toast("Artigo restaurado") },
          })
        }
      >
        Com ação
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ tone: "error", message: "Não foi possível adicionar o artigo. Tente novamente." })}
      >
        Erro
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ message: "Fica aberto até fechar", duration: Infinity })}
      >
        Persistente
      </Button>
      <Button variant="tertiary" onClick={() => dismiss()}>
        Fechar todos
      </Button>
    </div>
  );
}

const meta = {
  title: "Conteúdo/Toast",
  component: Toast,
  subcomponents: { ToastProvider },
  tags: ["autodocs"],
  args: { children: "Artigo adicionado ao cesto" },
  argTypes: {
    tone: { control: "inline-radio", options: ["default", "error"] },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Mensagem curta e temporária numa barra preta (\`bg-inverse text-on-inverse\`), 12px, no canto inferior. Sem ação, fecha sozinha após 4s; **com ação** (ex.: "Desfazer") fica aberta até o usuário usar a ação, clicar em Fechar ou apertar Escape com o foco nela (padrão \`duration: Infinity\`, WCAG 2.2.1; passe \`duration\` para forçar um tempo). Três peças: \`Toast\` (apresentação), \`ToastProvider\` (pilha e portal, \`z-toast\`) e \`useToast()\` (\`toast()\` / \`dismiss()\`).

**Quando usar.** Confirmar uma ação concluída ("Adicionado ao cesto"), oferecer "Desfazer", avisar de uma falha recuperável.

**Quando não usar.** Para informação que precisa permanecer (avisos de envio, cookies) use \`Banner\`. Para erros de campo use a mensagem do próprio campo. Para decisões, \`Modal\`.

**Anatomia.** Ícone (só em erro) · mensagem · ação opcional (sublinhada) · Fechar.

**Acessibilidade.** O provider monta, desde o primeiro render no cliente e ainda vazias, duas regiões vivas fixas dentro da região rotulada "Notificações": \`role="status"\` (\`aria-live="polite"\`) para mensagens normais e \`role="alert"\` (\`aria-live="assertive"\`) para \`tone="error"\`. Cada mensagem entra nelas como item novo, sem role próprio (WCAG 4.1.3: região viva criada já com conteúdo não é anunciada de forma confiável). O \`Toast\` avulso, fora do provider, mantém \`role="status"\`/\`role="alert"\` no próprio elemento (\`announce={false}\` desliga). O tempo pausa com o mouse em cima ou com o foco dentro (WCAG 2.2.1); \`duration: Infinity\` mantém a mensagem até fechar. Ao fechar pela ação, por Fechar ou por Escape com o foco dentro, o foco vai para o próximo toast ou volta ao elemento que estava focado antes de entrar nas notificações. Não ponha a única via de uma tarefa num toast: ele desaparece.
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Estatico: Story = {
  name: "Estático",
  render: (args) => (
    <div className="max-w-[400px]">
      <Toast {...args} />
    </div>
  ),
};

export const ComAcao: Story = {
  name: "Com ação",
  render: () => (
    <div className="max-w-[400px]">
      <Toast action={{ label: "Desfazer", onClick: () => {} }} onClose={() => {}}>
        Artigo removido do cesto
      </Toast>
    </div>
  ),
};

export const Erro: Story = {
  render: () => (
    <div className="max-w-[400px]">
      <Toast tone="error" onClose={() => {}}>
        Não foi possível adicionar o artigo. Tente novamente.
      </Toast>
    </div>
  ),
};

export const ComProvider: Story = { name: "Com provider", render: () => <Disparadores /> };

export const Playground: Story = {
  name: "Área de testes",
  render: (args) => (
    <div className="max-w-[400px]">
      <Toast {...args} />
    </div>
  ),
};
