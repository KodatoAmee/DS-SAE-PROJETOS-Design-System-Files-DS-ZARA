import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TextArea } from "./TextArea";

const meta = {
  title: "Formulário/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  args: { label: "Mensagem", name: "mensagem" },
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
**O que é.** Campo de texto de várias linhas com o mesmo visual do \`TextField\`: só a linha inferior, rótulo flutuante, texto 13/20 peso 300.

**Quando usar.** Texto livre longo: mensagem ao apoio ao cliente, nota de presente, observações de entrega.

**Quando não usar.** Dados de uma linha (use \`TextField\`).

**Anatomia.** Linha inferior · rótulo flutuante · área de texto (mínimo 3 linhas, cresce com o conteúdo, sem alça de redimensionar) · ajuda ou erro · contador \`n/máx\` opcional à direita.

**Acessibilidade.** \`<label htmlFor>\` real e \`useId\`. Ajuda, erro e contador entram em \`aria-describedby\`; o contador é lido como "n de máx caracteres" (sem \`aria-live\`, para não anunciar a cada tecla). Erro: \`aria-invalid\` + \`role="alert"\`.
        `,
      },
    },
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

export const ComContador: Story = {
  name: "Com contador",
  args: { label: "Mensagem de presente", maxLength: 150, helperText: "Será impressa no cartão." },
};

export const MaisLinhas: Story = { name: "Mais linhas", args: { minRows: 6 } };

export const Controlado: Story = {
  render: (args) => {
    const [value, setValue] = useState("Deixar na portaria, por favor.");
    return (
      <TextArea
        {...args}
        label="Observações de entrega"
        maxLength={200}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const Estados: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <TextArea label="Vazio" />
      <TextArea label="Com erro" defaultValue="Oi" error="Escreva pelo menos 10 caracteres." />
      <TextArea label="Desabilitado" defaultValue="Não editável" disabled />
    </div>
  ),
};

export const Playground: Story = { name: "Área de testes" };
