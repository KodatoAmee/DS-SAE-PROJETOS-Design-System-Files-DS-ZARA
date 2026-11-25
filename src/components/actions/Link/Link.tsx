import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";
import { cn, focusRing } from "../../../lib/cn";

export const linkVariants = cva(
  [
    "inline font-light text-content underline-offset-4 decoration-1",
    "transition-opacity duration-200 ease-zr",
    focusRing,
  ],
  {
    variants: {
      variant: {
        /** Sem sublinhado em repouso; sublinha no hover. */
        default: "no-underline hover:underline",
        /** Sempre sublinhado; no hover perde opacidade. Use dentro de texto corrido. */
        underline: "underline hover:opacity-60",
      },
      size: {
        /** 11px: rodapé, metadados, barras finas. */
        "label-s": "text-label-s",
        /** 13/16: ações em linha (AJUDA, VER TUDO). */
        action: "text-action",
        /** 13/20: dentro de parágrafos. */
        body: "text-body",
      },
      /** Maiúsculas: ações e rótulos. Desligado para links em texto corrido. */
      caps: { true: "uppercase", false: "" },
    },
    defaultVariants: { variant: "default", size: "body", caps: false },
  },
);

export interface LinkProps
  extends ComponentPropsWithoutRef<"a">,
    VariantProps<typeof linkVariants> {
  ref?: Ref<HTMLAnchorElement>;
  /** Abre em nova janela (`target="_blank"`, `rel="noopener"`) e avisa leitores de tela. */
  external?: boolean;
  children?: ReactNode;
}

export function Link({
  variant,
  size,
  caps,
  external = false,
  target,
  rel,
  className,
  children,
  ...rest
}: LinkProps) {
  return (
    <a
      target={external ? "_blank" : target}
      rel={external ? (rel ?? "noopener") : rel}
      className={cn(linkVariants({ variant, size, caps }), className)}
      {...rest}
    >
      {children}
      {external && <span className="sr-only"> (abre em nova janela)</span>}
    </a>
  );
}
