import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { SearchField } from "./SearchField";

const meta = {
  title: "Formulário/SearchField",
  component: SearchField,
  tags: ["autodocs"],
  args: { onSearch: fn(), onValueChange: fn(), onClear: fn() },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**O que é.** Campo de pesquisa grande, no estilo do cabeçalho da página de busca: lupa à esquerda, texto de 20px peso 300 sobre uma linha inferior de 1px, botão limpar (\`close\`) quando há texto.

**Quando usar.** Pesquisa de produtos no topo da página ou dentro de uma gaveta de busca.

**Quando não usar.** Filtrar uma lista curta já visível (use \`TextField\`). Campo de formulário com rótulo visível (use \`TextField\`).

**Anatomia.** \`<form role="search">\` · ícone \`search\` · \`<input type="search">\` · botão limpar · linha inferior.

**Acessibilidade.** Marco \`search\` no \`<form>\`. Rótulo visualmente oculto (padrão "Pesquisar"). Enter envia (\`onSearch\` recebe o texto sem espaços nas pontas); Escape limpa. O botão limpar tem nome "Limpar pesquisa", alvo de 24px e devolve o foco ao campo. O botão limpar nativo do WebKit é escondido para não duplicar.
        `,
      },
    },
  },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };

export const ComValor: Story = { name: "Com valor", args: { defaultValue: "vestido de linho" } };

export const Controlado: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    const [term, setTerm] = useState<string | null>(null);
    return (
      <div className="flex flex-col gap-4">
        <SearchField
          {...args}
          value={value}
          onValueChange={setValue}
          onSearch={(v) => {
            setTerm(v);
            args.onSearch?.(v);
          }}
        />
        <p className="text-label-s font-light text-content-mid" aria-live="polite">
          {term === null ? "Pressione Enter para pesquisar." : `Pesquisou por: "${term}"`}
        </p>
      </div>
    );
  },
};

export const Desabilitado: Story = { args: { disabled: true, defaultValue: "camisa" } };

export const Playground: Story = { name: "Área de testes" };
