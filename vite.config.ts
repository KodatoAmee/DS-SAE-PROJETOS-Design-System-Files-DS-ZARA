import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Build de biblioteca. O Storybook reaproveita só os plugins deste arquivo.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist/lib",
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
      cssFileName: "ds-zara",
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "clsx",
        "class-variance-authority",
        "tailwind-merge",
      ],
    },
  },
});
