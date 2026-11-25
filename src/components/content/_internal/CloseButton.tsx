import type { ComponentPropsWithoutRef } from "react";
import { cn, focusRing } from "../../../lib/cn";
import { Icon } from "../../icon";

/** Botão "Fechar" 32x32 dos painéis (Modal, Drawer). Interno da frente Conteúdo. */
export function CloseButton({
  label = "Fechar",
  className,
  type = "button",
  ...rest
}: ComponentPropsWithoutRef<"button"> & { label?: string }) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        "-mr-1.5 inline-flex size-8 shrink-0 items-center justify-center rounded-none text-content",
        "transition-opacity duration-200 ease-zr hover:opacity-60",
        focusRing,
        className,
      )}
      {...rest}
    >
      <Icon name="close" size={20} />
    </button>
  );
}
