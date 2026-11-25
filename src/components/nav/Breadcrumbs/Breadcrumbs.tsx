import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";
import { cn, focusRing } from "../../../lib/cn";

export interface BreadcrumbsItem {
  label: ReactNode;
  /** Com `href` vira link; só com `onClick`, botão. */
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps extends Omit<ComponentPropsWithoutRef<"nav">, "children"> {
  ref?: Ref<HTMLElement>;
  /** Do mais geral ao atual. O último é a página atual. */
  items: BreadcrumbsItem[];
  /** Padrão: "/". */
  separator?: ReactNode;
  /** Nome acessível do `nav`. Padrão: "Caminho". */
  label?: string;
}

const crumb = "inline-flex min-h-6 items-center uppercase";
const crumbLink = cn(
  crumb,
  "text-content-mid underline-offset-4 decoration-1 transition-colors duration-200 ease-zr hover:text-content hover:underline",
  focusRing,
);

function Crumb({ item, current }: { item: BreadcrumbsItem; current: boolean }) {
  if (current) {
    return (
      <span aria-current="page" className={cn(crumb, "text-content")}>
        {item.label}
      </span>
    );
  }
  if (item.href) {
    return (
      <a href={item.href} onClick={item.onClick} className={crumbLink}>
        {item.label}
      </a>
    );
  }
  if (item.onClick) {
    return (
      <button type="button" onClick={item.onClick} className={crumbLink}>
        {item.label}
      </button>
    );
  }
  return <span className={cn(crumb, "text-content-mid")}>{item.label}</span>;
}

export function Breadcrumbs({
  ref,
  items,
  separator = "/",
  label = "Caminho",
  className,
  ...rest
}: BreadcrumbsProps) {
  return (
    <nav ref={ref} aria-label={label} className={className} {...rest}>
      <ol className="flex flex-wrap items-center gap-x-2 text-label-s font-light uppercase">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center gap-x-2">
            {index > 0 && (
              <span aria-hidden className="text-content-low">
                {separator}
              </span>
            )}
            <Crumb item={item} current={index === items.length - 1} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
