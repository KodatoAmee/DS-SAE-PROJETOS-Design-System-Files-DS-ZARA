import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, Ref } from "react";
import { cn } from "../../../lib/cn";

export const dividerVariants = cva("shrink-0 border-0", {
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "w-px self-stretch",
    },
    tone: {
      /** Cinza claro: separa blocos de conteúdo. */
      subtle: "bg-line-subtle",
      /** Cor do texto: separação forte (cabeçalhos de tabela, totais). */
      strong: "bg-line",
    },
  },
  defaultVariants: { orientation: "horizontal", tone: "subtle" },
});

export interface DividerProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof dividerVariants> {
  ref?: Ref<HTMLDivElement>;
  /** Só visual: sai da árvore de acessibilidade. */
  decorative?: boolean;
}

export function Divider({ orientation, tone, decorative = false, className, ...rest }: DividerProps) {
  return (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation={!decorative && orientation === "vertical" ? "vertical" : undefined}
      aria-hidden={decorative || undefined}
      className={cn(dividerVariants({ orientation, tone }), className)}
      {...rest}
    />
  );
}
