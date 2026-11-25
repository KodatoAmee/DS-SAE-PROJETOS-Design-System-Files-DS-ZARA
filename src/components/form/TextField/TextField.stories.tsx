import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "./TextField";

const meta = {
  title: "Formulário/TextField",
  component: TextField,
  tags: ["autodocs"],
  args: { label: "E-mail", type: "email", name: "email" },
  argTypes: {
    type: { control: "inline-radio", options: ["text", "email", "password", "tel"] },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[398px]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Campo de texto de uma linha. Sem fundo e sem caixa: só a linha inferior de 1px (\`border-line-field\`), altura 40. O rótulo (12px, maiúsculas, \`text-content-low\`) fica na linha do texto quando o campo está vazio e flutua para o topo com foco ou valor.

**Quando usar.** Dados curtos digitados: nome, e-mail, senha, telefone, CEP.

**Quando não usar.** Texto longo (use \`TextArea\`), escolha entre opções fixas (use \`Select\`, \`RadioGroup\` ou \`SizeSelector\`), pesquisa (use \`SearchField\`).

**Anatomia.** Linha inferior · rótulo flutuante · texto (13/20, peso 300, padding \`18px 0 2px\`) · adorno final opcional (ex.: Mostrar/Ocultar senha) · ajuda ou erro (11px).

**Acessibilidade.** \`<label htmlFor>\` real, id via \`useId\`. Ajuda e erro ligados por \`aria-describedby\`; com erro, \`aria-invalid="true"\` e mensagem em \`role="alert"\` (a mensagem substitui a ajuda). Foco: a linha passa de cinza a preta (\`border-line\`). Em \`type="password"\`, o botão Mostrar/Ocultar já vem embutido, com nome "Mostrar senha"/"Ocultar senha".
        `,
      },
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Texto: Story = { args: { label: "Nome", type: "text", name: "nome" } };

export const Email: Story = {
  name: "E-mail",
  args: { helperText: "Enviaremos a confirmação do pedido para este endereço.", autoComplete: "email" },
};

export const Senha: Story = {
  args: { label: "Senha", type: "password", name: "senha", autoComplete: "current-password" },
};

export const Telefone: Story = {
  args: { label: "Telefone", type: "tel", name: "telefone", placeholder: "+55 11 90000-0000" },
};

export const ComAdorno: Story = {
  name: "Com adorno",
  args: { label: "CEP", type: "text", name: "cep" },
  render: (args) => (
    <TextField
      {...args}
      endAdornment={<TextField.AdornmentButton>Buscar</TextField.AdornmentButton>}
    />
  ),
};

export const Estados: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <TextField label="Vazio" />
      <TextField label="Preenchido" defaultValue="maria@exemplo.com" type="email" />
      <TextField label="Com ajuda" helperText="Mínimo de 8 caracteres." type="password" />
      <TextField label="E-mail" type="email" defaultValue="maria@" error="Digite um e-mail válido." />
      <TextField label="Desabilitado" defaultValue="Não editável" disabled />
      <TextField placeholder="Sem rótulo, só placeholder" aria-label="Campo sem rótulo" />
    </div>
  ),
};

export const Playground: Story = { name: "Área de testes" };
