import type { Preview } from "@storybook/react-vite";
import { useEffect } from "react";
import "../src/styles/theme.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Tema",
      toolbar: {
        title: "Tema",
        icon: "contrast",
        items: [
          { value: "light", title: "Claro" },
          { value: "dark", title: "Escuro" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  parameters: {
    layout: "fullscreen",
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: {
      storySort: {
        order: [
          "Introdução",
          "Fundações",
          "Ações",
          "Formulário",
          "Navegação",
          "Conteúdo",
          "Padrões",
        ],
      },
    },
  },
  decorators: [
    (Story, ctx) => {
      const theme = ctx.globals.theme as string;
      // Overlays vão por portal para <body>: o tema precisa estar no <html>, não só no wrapper.
      useEffect(() => {
        document.documentElement.dataset.theme = theme;
      }, [theme]);
      return (
        <div
          data-theme={theme}
          className="min-h-screen bg-base p-6 font-sans text-body font-light text-content"
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
