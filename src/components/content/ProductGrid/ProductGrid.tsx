import { cva } from "class-variance-authority";
import {
  Children,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "../../../lib/cn";

export type ProductGridView = 1 | 2 | 3;

/**
 * Densidades "Vista 1/2/3" da referência.
 * Mobile: 1, 2 ou 3 colunas. Desktop (`lg`): 2 colunas grandes, 4 ou 6. Calha horizontal 40px em `lg`.
 */
export const productGridVariants = cva("grid list-none p-0 lg:gap-x-10", {
  variants: {
    view: {
      1: "grid-cols-1 gap-y-10 lg:grid-cols-2 lg:gap-y-16",
      2: "grid-cols-2 gap-x-1 gap-y-8 lg:grid-cols-4 lg:gap-y-12",
      3: "grid-cols-3 gap-x-0.5 gap-y-6 lg:grid-cols-6 lg:gap-y-10",
    },
    inset: {
      /** Margens laterais: 0 no mobile (mídia sangra), 40px no desktop. */
      true: "lg:px-10",
      false: "",
    },
  },
  defaultVariants: { view: 2, inset: true },
});

export interface ProductGridProps extends ComponentPropsWithoutRef<"ul"> {
  ref?: Ref<HTMLUListElement>;
  /** Densidade: 1 (grande), 2 (padrão), 3 (compacta). */
  view?: ProductGridView;
  /** Aplica as margens laterais do desktop. Padrão `true`. */
  inset?: boolean;
  /** `ProductCard`s. Cada filho é embrulhado em `<li>` (exceto se já for `<li>`). */
  children?: ReactNode;
}

export function ProductGrid({
  view = 2,
  inset = true,
  className,
  children,
  ...rest
}: ProductGridProps) {
  return (
    <ul className={cn(productGridVariants({ view, inset }), className)} {...rest}>
      {Children.map(children, (child) => {
        if (child === null || child === undefined || typeof child === "boolean") return null;
        if (isValidElement(child) && child.type === "li") return child;
        return <li className="min-w-0">{child}</li>;
      })}
    </ul>
  );
}
