import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";
import { cn } from "../../../lib/cn";
import { CloseButton } from "../_internal/CloseButton";

export const bannerVariants = cva(
  "flex flex-col gap-4 rounded-none text-content md:flex-row md:items-center md:justify-between md:gap-10",
  {
    variants: {
      position: {
        /** No fluxo da página: aviso de envio, informação de campanha. */
        inline: "w-full bg-muted px-4 py-3",
        /** Fixa no rodapé da janela: aviso de cookies. */
        bottom:
          "fixed inset-x-0 bottom-0 z-overlay border-t border-line-subtle bg-surface px-4 py-6 animate-zr-slide-up lg:px-10",
      },
    },
    defaultVariants: { position: "inline" },
  },
);

export interface BannerProps
  extends Omit<ComponentPropsWithoutRef<"div">, "title">,
    VariantProps<typeof bannerVariants> {
  ref?: Ref<HTMLDivElement>;
  /** Título curto (12px, maiúsculas) acima do texto. */
  title?: ReactNode;
  /** Ações (Buttons). Na barra de cookies: secundário + primário. */
  actions?: ReactNode;
  /** Mostra o botão Fechar. */
  onClose?: () => void;
  /** Rótulo do botão Fechar. */
  closeLabel?: string;
  /** Nome acessível da região (em `bottom`). Padrão: "Aviso". */
  label?: string;
}

export function Banner({
  position = "inline",
  title,
  actions,
  onClose,
  closeLabel = "Fechar",
  label = "Aviso",
  className,
  children,
  ...rest
}: BannerProps) {
  const fixed = position === "bottom";
  return (
    <div
      // Fixa no rodapé é uma região navegável; em linha é só uma nota no fluxo.
      role={fixed ? "region" : "note"}
      aria-label={fixed ? label : undefined}
      className={cn(bannerVariants({ position }), className)}
      {...rest}
    >
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1 text-label font-light">
          {title && <p className="uppercase">{title}</p>}
          <div className="[&_a]:underline [&_a]:underline-offset-2">{children}</div>
        </div>
        {onClose && <CloseButton label={closeLabel} onClick={onClose} className="-my-1.5" />}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-col-reverse gap-2 md:flex-row md:items-center">{actions}</div>
      )}
    </div>
  );
}
