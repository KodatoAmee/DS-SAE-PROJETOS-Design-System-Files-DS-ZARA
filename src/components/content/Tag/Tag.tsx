import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, Ref } from "react";
import { cn } from "../../../lib/cn";

export const tagVariants = cva(
  "inline-flex shrink-0 items-center whitespace-nowrap rounded-none font-light uppercase",
  {
    variants: {
      variant: {
        /** Só texto, como "NEW" ao lado do nome do produto. */
        plain: "text-content",
        /** Contorno 1px. */
        outline: "border border-line px-1.5 text-content",
        /** Fundo invertido (preto no tema claro). */
        solid: "border border-inverse bg-inverse px-1.5 text-on-inverse",
      },
      size: {
        /** 10/16. */
        s: "text-caption",
        /** 11/16. */
        m: "text-label-s",
      },
    },
    defaultVariants: { variant: "plain", size: "m" },
  },
);

export interface TagProps
  extends ComponentPropsWithoutRef<"span">,
    VariantProps<typeof tagVariants> {
  ref?: Ref<HTMLSpanElement>;
}

export function Tag({ variant, size, className, ...rest }: TagProps) {
  return <span className={cn(tagVariants({ variant, size }), className)} {...rest} />;
}
