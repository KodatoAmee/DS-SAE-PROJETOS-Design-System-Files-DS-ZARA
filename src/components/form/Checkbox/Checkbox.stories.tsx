import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Formulário/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: { label: "Quero receber novidades por e-mail" },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Caixa de seleção quadrada de 16px com borda de 1px (\`border-line\`). Marcada: fundo \`bg-inverse\` com \`check\` em \`text-on-inverse\`. Indeterminada: mesmo fundo com traço (\`minus\`). Rótulo de 12px.

**Quando usar.** Opções independentes (zero, uma ou várias), aceite de termos, filtros de lista.

**Quando não usar.** Escolha única entre opções (use \`RadioGroup\`). Ligar/desligar com efeito imediato (use \`Switch\`).

**Anatomia.** Caixa · marca (check ou traço) · rótulo · descrição opcional (11px) · erro opcional.

**Acessibilidade.** \`<input type="checkbox">\` nativo, visualmente oculto (\`sr-only\`) mas focável e anunciado; o \`<label>\` envolve tudo, então clicar no texto marca. Foco visível desenhado na caixa (anel de 1px). \`indeterminate\` é aplicado na propriedade DOM, e leitores anunciam "misto". Descrição e erro entram em \`aria-describedby\`; erro com \`aria-invalid\` e \`role="alert"\`. A linha tem no mínimo 24px de altura.
        `,
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

export const Marcado: Story = { args: { defaultChecked: true } };

export const ComDescricao: Story = {
  name: "Com descrição",
  args: {
    label: "Embrulho para presente",
    description: "O preço não aparece na nota dentro da caixa.",
  },
};

export const Indeterminado: Story = {
  render: () => {
    const [items, setItems] = useState([true, false, true]);
    const all = items.every(Boolean);
    const some = items.some(Boolean) && !all;
    const nomes = ["Camisas", "Calças", "Sapatos"];
    return (
      <div className="flex flex-col gap-2">
        <Checkbox
          label="Todas as categorias"
          checked={all}
          indeterminate={some}
          onCheckedChange={(c) => setItems(items.map(() => c))}
        />
        <div className="flex flex-col gap-2 pl-7">
          {nomes.map((nome, i) => (
            <Checkbox
              key={nome}
              label={nome}
              checked={items[i]}
              onCheckedChange={(c) => setItems(items.map((v, j) => (j === i ? c : v)))}
            />
          ))}
        </div>
      </div>
    );
  },
};

export const Estados: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox label="Desmarcado" />
      <Checkbox label="Marcado" defaultChecked />
      <Checkbox label="Indeterminado" indeterminate />
      <Checkbox label="Desabilitado" disabled />
      <Checkbox label="Desabilitado e marcado" disabled defaultChecked />
      <Checkbox label="Li e aceito a política de privacidade" required error="Aceite para continuar." />
    </div>
  ),
};

export const Playground: Story = { name: "Área de testes" };
