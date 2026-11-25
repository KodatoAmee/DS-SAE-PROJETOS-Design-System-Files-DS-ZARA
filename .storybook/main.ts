import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  // ptbr-ui.js: tradução pt-BR da interface (carregado em manager-head/preview-head).
  staticDirs: ["./public"],
  framework: { name: "@storybook/react-vite", options: {} },
  viteFinal: (cfg) => {
    // O vite.config.ts é de biblioteca; o Storybook precisa do build de app.
    if (cfg.build) {
      delete cfg.build.lib;
      delete cfg.build.rollupOptions;
    }
    return cfg;
  },
};

export default config;
