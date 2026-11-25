import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";

const estados = [
  { value: "SP", label: "São Paulo" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "MG", label: "Minas Gerais" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "BA", label: "Bahia", disabled: true },
];

const meta = {
  title: "Formulário/Select",
  component: Select,
  tags: ["autodocs"],
  args: { label: "Estado", name: "estado", options: estados, placeholder: "Selecione" },
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
**O que é.** \`<select>\` nativo com o visual dos campos: só a linha inferior, rótulo de 12px no topo e \`chevron-down\` à direita. A lista aberta é a do sistema operacional.

**Quando usar.** Escolha única numa lista média ou longa e conhecida (estado, país, prefixo).

**Quando não usar.** Até ~5 opções visíveis de uma vez (use \`RadioGroup\`). Tamanhos de produto (use \`SizeSelector\`). Busca em lista grande (combobox, fora deste DS).

**Anatomia.** Linha inferior · rótulo fixo no topo · valor (ou placeholder em \`text-content-low\`) · chevron · ajuda ou erro.

**Acessibilidade.** Elemento nativo: teclado e leitores de tela funcionam sem ARIA extra. \`<label htmlFor>\` real; ajuda/erro por \`aria-describedby\`; erro com \`aria-invalid\` e \`role="alert"\`. O \`placeholder\` vira uma primeira opção vazia desabilitada (use \`required\` para obrigar a escolha).
        `,
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

export const ComValor: Story = { name: "Com valor", args: { defaultValue: "RJ" } };

export const ComOptionsFilhos: Story = {
  name: "Com opções filhas",
  args: { options: undefined, label: "Prefixo", placeholder: undefined, defaultValue: "+55" },
  render: (args) => (
    <Select {...args}>
      <option value="+55">Brasil +55</option>
      <option value="+351">Portugal +351</option>
      <option value="+34">Espanha +34</option>
    </Select>
  ),
};

export const Estados: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <Select {...args} label="Com ajuda" helperText="Usado para calcular o frete." />
      <Select {...args} label="Com erro" required error="Selecione um estado." />
      <Select {...args} label="Desabilitado" defaultValue="SP" disabled />
    </div>
  ),
};

export const Playground: Story = { name: "Área de testes" };
