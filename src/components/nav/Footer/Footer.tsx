import { useId, type ComponentPropsWithoutRef, type ReactNode, type Ref } from "react";
import { cn, focusRing } from "../../../lib/cn";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title?: string;
  links: FooterLink[];
}

export interface FooterRegion {
  /** Ex.: "Brasil". */
  country: string;
  /** Ex.: "Português". */
  language: string;
  /** Ação de troca. Com `href` vira link. */
  onClick?: () => void;
  href?: string;
  /** Complemento do nome acessível. Padrão: "alterar país e idioma". */
  actionLabel?: string;
}

export interface FooterProps extends Omit<ComponentPropsWithoutRef<"footer">, "children"> {
  ref?: Ref<HTMLElement>;
  columns?: FooterColumn[];
  /** Slot acima das colunas (ex.: formulário de newsletter). */
  newsletter?: ReactNode;
  /** Linha de seletor de país/idioma. */
  region?: FooterRegion;
  /** Texto legal 10px. */
  legal?: ReactNode;
  /** Nome acessível do `nav` das colunas. Padrão: "Rodapé". */
  navLabel?: string;
}

const linkClass = cn(
  "inline-flex min-h-6 items-center text-label-s font-light uppercase underline-offset-4 decoration-1 hover:underline",
  focusRing,
);

export function Footer({
  ref,
  columns = [],
  newsletter,
  region,
  legal,
  navLabel = "Rodapé",
  className,
  ...rest
}: FooterProps) {
  const baseId = useId();

  const regionContent = region && (
    <>
      {region.country} / {region.language}
      <span className="sr-only">, {region.actionLabel ?? "alterar país e idioma"}</span>
    </>
  );

  return (
    <footer
      ref={ref}
      className={cn("bg-base px-5 pb-8 pt-12 text-content md:px-20", className)}
      {...rest}
    >
      {newsletter && <div className="mb-12">{newsletter}</div>}

      {columns.length > 0 && (
        <nav aria-label={navLabel}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {columns.map((column, index) => {
              const titleId = `${baseId}-col-${index}`;
              return (
                <div key={column.title ?? index}>
                  {column.title && (
                    <p id={titleId} className="mb-3 text-label-s font-light uppercase text-content-low">
                      {column.title}
                    </p>
                  )}
                  <ul aria-labelledby={column.title ? titleId : undefined} className="flex flex-col">
                    {column.links.map((link) => (
                      <li key={`${link.label}-${link.href}`}>
                        <a href={link.href} className={linkClass}>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </nav>
      )}

      {(region || legal) && (
        <div
          className={cn(
            "flex flex-col gap-4",
            columns.length > 0 && "mt-12 border-t border-line-subtle pt-6",
          )}
        >
          {region &&
            (region.href ? (
              <a href={region.href} onClick={region.onClick} className={cn(linkClass, "self-start")}>
                {regionContent}
              </a>
            ) : (
              <button
                type="button"
                onClick={region.onClick}
                className={cn(linkClass, "self-start")}
              >
                {regionContent}
              </button>
            ))}
          {legal && <div className="text-caption font-light text-content-low">{legal}</div>}
        </div>
      )}
    </footer>
  );
}
