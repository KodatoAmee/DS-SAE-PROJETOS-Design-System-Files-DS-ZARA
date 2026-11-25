import type { ComponentPropsWithoutRef, MouseEvent, Ref } from "react";
import { cn, focusRing } from "../../../lib/cn";

export interface SkipLinkProps extends ComponentPropsWithoutRef<"a"> {
  ref?: Ref<HTMLAnchorElement>;
  /** Âncora do conteúdo principal. Padrão: "#conteudo-principal". */
  href?: string;
}

export function SkipLink({
  ref,
  href = "#conteudo-principal",
  className,
  children = "Pular para o conteúdo principal",
  onClick,
  ...rest
}: SkipLinkProps) {
  // Move o foco de fato para o destino (alguns navegadores só rolam a página).
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || !href.startsWith("#")) return;
    const target = document.getElementById(decodeURIComponent(href.slice(1)));
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus();
  }

  return (
    <a
      ref={ref}
      href={href}
      onClick={handleClick}
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-toast",
        "inline-flex items-center border border-line bg-base min-h-6 px-3 py-1 text-action font-light uppercase text-content",
        focusRing,
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
