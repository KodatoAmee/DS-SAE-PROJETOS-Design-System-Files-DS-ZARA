import type { Meta, StoryObj } from "@storybook/react-vite";
import { SizeSelector } from "../SizeSelector";
import { FormField } from "./FormField";

const meta = {
  title: "Formulário/FormField",
  component: FormField,
  tags: ["autodocs"],
  args: {
    label: "Número do cartão-presente",
    helperText: "16 dígitos no verso do cartão.",
    children: null,
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Invólucro que dá a um controle qualquer o rótulo estático (12px maiúsculas, \`text-content-low\`), a ajuda (11px, \`text-content-mid\`) e o erro (11px, \`text-danger-text\`) do sistema. É a mesma peça usada por dentro de \`TextField\`, \`TextArea\`, \`Select\` e \`RadioGroup\`.

**Quando usar.** Compor um controle que não traz rótulo/ajuda/erro próprios (um \`<input>\` nativo específico, um controle de terceiros).

**Quando não usar.** Com \`TextField\`, \`TextArea\`, \`Select\`, \`RadioGroup\`, \`SizeSelector\`: eles já incluem tudo.

**Anatomia.** Rótulo · controle (filho) · ajuda **ou** erro (o erro substitui a ajuda).

**Acessibilidade.** Passe \`children\` como função para receber \`id\`, \`aria-describedby\` e \`aria-invalid\` e espalhá-los no elemento nativo. O \`<label htmlFor>\` aponta para esse \`id\` (gerado com \`useId\` ou via \`controlId\`). Erro em \`role="alert"\`.
        `,
      },
    },
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

const nativeInput =
  "h-10 w-full border-0 border-b border-line-field bg-transparent text-body font-light text-content outline-none focus:border-line aria-invalid:border-danger";

export const ComInputNativo: Story = {
  name: "Com input nativo",
  render: (args) => (
    <div className="max-w-[398px]">
      <FormField {...args}>
        {(control) => <input {...control} inputMode="numeric" className={nativeInput} />}
      </FormField>
    </div>
  ),
};

export const ComErro: Story = {
  name: "Com erro",
  args: { error: "Cartão inválido ou expirado." },
  render: (args) => (
    <div className="max-w-[398px]">
      <FormField {...args}>
        {(control) => (
          <input {...control} inputMode="numeric" defaultValue="1234" className={nativeInput} />
        )}
      </FormField>
    </div>
  ),
};

export const ComControleDoDS: Story = {
  name: "Com controle do DS",
  args: { label: undefined, helperText: "O modelo mede 1,78 m e veste M." },
  render: (args) => (
    <div className="max-w-[398px]">
      <FormField {...args}>
        <SizeSelector label="Tamanho" options={[{ value: "S" }, { value: "M" }, { value: "L" }]} />
      </FormField>
    </div>
  ),
};

export const Playground: Story = {
  name: "Área de testes",
  render: (args) => (
    <div className="max-w-[398px]">
      <FormField {...args}>
        {(control) => <input {...control} className={nativeInput} />}
      </FormField>
    </div>
  ),
};
