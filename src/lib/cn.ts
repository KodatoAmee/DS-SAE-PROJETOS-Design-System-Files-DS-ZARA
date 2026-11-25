import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// O DS reescreve a escala de `text-*`: sem isto o merge confunde tamanho com cor.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "caption",
            "label-s",
            "label",
            "action",
            "body",
            "title-s",
            "title",
            "heading",
            "display",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Anel de foco único do sistema: 1px, cor do texto, deslocado 2px. */
export const focusRing =
  "outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-content";
