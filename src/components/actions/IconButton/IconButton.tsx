import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, Ref } from "react";
import { cn, focusRing } from "../../../lib/cn";
import { Icon, type IconName } from "../../icon";

export const iconButtonVariants = cva(
  [
    "inline-flex shrink-0 select-none items-center justify-center rounded-none",
    "font-light text-content",
    "transition-[background-color,color,opacity] duration-200 ease-zr",
    "disabled:pointer-events-none disabled:text-content-disabled",
    focusRing,
  ],
  {
    variants: {
      variant: {
        /** Transparente, sem borda visível. Barras de topo e cabeçalhos. */
        ghost: "border border-transparent bg-transparent hover:opacity-60",
        /** Contorno 1px. Quantidade, fechar dentro de cartões. */
        outline:
          "border border-line bg-transparent hover:bg-muted disabled:border-content-disabled",
      },
      size: {
        /** 32px. */
        s: "h-8 min-w-8",
        /** 40px. */
        m: "h-10 min-w-10",
        /** 44px: alvo de toque. */
        l: "h-11 min-w-11",
      },
      /** Com contador o botão deixa de ser quadrado e ganha respiro lateral. */
      withBadge: { true: "gap-1 px-2", false: "" },
    },
    defaultVariants: { variant: "ghost", size: "m", withBadge: false },
  },
);

const iconSize = { s: 16, m: 20, l: 20 } as const;

export interface IconButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children" | "aria-label">,
    Omit<VariantProps<typeof iconButtonVariants>, "withBadge"> {
  ref?: Ref<HTMLButtonElement>;
  /** Ícone do sistema. */
  icon: IconName;
  /** Nome acessível (vira `aria-label`). Obrigatório: o botão não tem texto visível. */
  label: string;
  /** Contador 11px ao lado do ícone (ex.: "CESTO 0"). Acima de 99 mostra "99+". */
  badge?: number;
}

export function IconButton({
  icon,
  label,
  badge,
  variant,
  size,
  className,
  type = "button",
  ...rest
}: IconButtonProps) {
  const hasBadge = badge !== undefined;
  const badgeText = hasBadge ? (badge > 99 ? "99+" : String(badge)) : "";

  return (
    <button
      type={type}
      aria-label={hasBadge ? `${label}, ${badge}` : label}
      className={cn(iconButtonVariants({ variant, size, withBadge: hasBadge }), className)}
      {...rest}
    >
      <Icon name={icon} size={iconSize[size ?? "m"]} />
      {hasBadge && (
        <span aria-hidden className="text-label-s tabular-nums">
          {badgeText}
        </span>
      )}
    </button>
  );
}
