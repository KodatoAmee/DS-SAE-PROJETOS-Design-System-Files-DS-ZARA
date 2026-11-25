import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";
import { cn, focusRing } from "../../../lib/cn";
import { Icon, type IconName } from "../../icon";

export const headerVariants = cva("inset-x-0 top-0 z-10 w-full text-content", {
  variants: {
    variant: {
      /** Sem fundo: sobre mídia/conteúdo editorial. */
      transparent: "bg-transparent",
      /** Fundo da página. */
      solid: "bg-base",
    },
    sticky: {
      true: "sticky",
      false: "relative",
    },
  },
  defaultVariants: { variant: "transparent", sticky: false },
});

export interface HeaderAction {
  /** Rótulo visível no desktop e nome acessível no mobile. */
  label: string;
  /** Com `href` vira link; sem ele, botão. */
  href?: string;
  onClick?: () => void;
  /** Ícone mostrado abaixo de `md`. Sem ícone, o rótulo aparece em texto também no mobile. */
  icon?: IconName;
  /** Contador (ex.: itens no cesto). */
  count?: number;
}

export interface HeaderSearch {
  /** Padrão: "Pesquisar". */
  label?: string;
  onClick: () => void;
}

export interface HeaderProps
  extends Omit<ComponentPropsWithoutRef<"header">, "children">,
    VariantProps<typeof headerVariants> {
  ref?: Ref<HTMLElement>;
  /** Marca. Passe um `<a>` se o logotipo for link para a home. */
  logo?: ReactNode;
  /** Sem ele, o botão de menu não é renderizado. */
  onMenuClick?: () => void;
  /** Estado do menu: anima o hambúrguer em X e define `aria-expanded`. */
  menuOpen?: boolean;
  /** `id` da gaveta controlada (vira `aria-controls` enquanto aberta). */
  menuId?: string;
  /** Padrão: "Abrir menu" / "Fechar menu". */
  menuLabel?: { open?: string; close?: string };
  actions?: HeaderAction[];
  search?: HeaderSearch;
}

const actionText =
  "inline-flex min-h-6 items-center gap-1 whitespace-nowrap text-action leading-5.5 font-light uppercase underline-offset-4 decoration-1 hover:underline";

const iconTarget =
  "relative inline-flex h-10 min-w-10 items-center justify-center gap-0.5 transition-opacity duration-200 ease-zr hover:opacity-60";

/** Hambúrguer de 2 linhas (20x7, traço 1px) que vira X quando aberto. */
function MenuGlyph({ open }: { open: boolean }) {
  const line =
    "absolute left-0 h-px w-full bg-current transition-[translate,rotate] duration-500 ease-zr";
  return (
    <span aria-hidden className="relative block h-1.75 w-5">
      <span className={cn(line, "top-0", open && "translate-y-0.75 rotate-45")} />
      <span className={cn(line, "bottom-0", open && "-translate-y-0.75 -rotate-45")} />
    </span>
  );
}

function ActionControl({
  action,
  className,
  children,
  ariaLabel,
}: {
  action: HeaderAction;
  className: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const classes = cn(className, focusRing);
  if (action.href) {
    return (
      <a href={action.href} onClick={action.onClick} aria-label={ariaLabel} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={action.onClick} aria-label={ariaLabel} className={classes}>
      {children}
    </button>
  );
}

export function Header({
  ref,
  logo,
  onMenuClick,
  menuOpen = false,
  menuId,
  menuLabel,
  actions = [],
  search,
  variant,
  sticky,
  className,
  ...rest
}: HeaderProps) {
  const searchLabel = search?.label ?? "Pesquisar";

  return (
    <header ref={ref} className={cn(headerVariants({ variant, sticky }), className)} {...rest}>
      <div className="flex h-12 items-center pl-5 pr-3 md:h-16 md:pl-0 md:pr-5">
        {/* Ombro esquerdo: 80px no desktop. */}
        {onMenuClick && (
          <div className="-ml-2.5 flex shrink-0 md:ml-0 md:w-20 md:justify-center">
            <button
              type="button"
              onClick={onMenuClick}
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? menuId : undefined}
              aria-label={
                menuOpen ? (menuLabel?.close ?? "Fechar menu") : (menuLabel?.open ?? "Abrir menu")
              }
              className={cn("inline-flex size-10 items-center justify-center", focusRing)}
            >
              <MenuGlyph open={menuOpen} />
            </button>
          </div>
        )}

        {logo && (
          <div className={cn("flex min-w-0 items-center", onMenuClick && "ml-2 md:ml-0")}>
            {logo}
          </div>
        )}

        {/* Direita, desktop: pesquisa com sublinhado + ações em texto. */}
        <div className="ml-auto hidden items-center gap-8 md:flex">
          {search && (
            <button
              type="button"
              onClick={search.onClick}
              className={cn(
                "w-[135px] border-b border-line pb-0.5 text-left text-action leading-5.5 font-light uppercase",
                "transition-opacity duration-200 ease-zr hover:opacity-60",
                focusRing,
              )}
            >
              {searchLabel}
            </button>
          )}
          {actions.length > 0 && (
            <ul className="flex items-center gap-2">
              {actions.map((action) => (
                <li key={action.label}>
                  <ActionControl action={action} className={actionText}>
                    {action.label}
                    {action.count !== undefined && <span>{action.count}</span>}
                  </ActionControl>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Direita, mobile: ícones 20px em alvos 40x40. */}
        <div className="ml-auto flex items-center md:hidden">
          {search && (
            <button
              type="button"
              onClick={search.onClick}
              aria-label={searchLabel}
              className={cn(iconTarget, focusRing)}
            >
              <Icon name="search" />
            </button>
          )}
          {actions.length > 0 && (
            <ul className="flex items-center">
              {actions.map((action) => {
                const name =
                  action.count !== undefined ? `${action.label}, ${action.count}` : action.label;
                return (
                  <li key={action.label}>
                    {action.icon ? (
                      <ActionControl action={action} className={iconTarget} ariaLabel={name}>
                        <Icon name={action.icon} />
                        {action.count !== undefined && (
                          <span aria-hidden className="text-caption">
                            {action.count}
                          </span>
                        )}
                      </ActionControl>
                    ) : (
                      <ActionControl action={action} className={cn(actionText, "min-h-10 px-2")}>
                        {action.label}
                        {action.count !== undefined && <span>{action.count}</span>}
                      </ActionControl>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
