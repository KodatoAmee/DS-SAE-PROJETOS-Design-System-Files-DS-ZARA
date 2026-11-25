import { cva, type VariantProps } from "class-variance-authority";
import { useMemo, type ComponentPropsWithoutRef, type Ref } from "react";
import { cn } from "../../../lib/cn";

export const priceLabelVariants = cva(
  "inline-flex flex-wrap items-baseline gap-x-2 font-light uppercase text-content",
  {
    variants: {
      size: {
        /** 11/16: medido no cartão de produto da referência. */
        s: "text-label-s",
        /** 13/16: ficha de produto, cesto. */
        m: "text-action",
      },
    },
    defaultVariants: { size: "s" },
  },
);

export interface PriceLabelProps
  extends Omit<ComponentPropsWithoutRef<"span">, "children">,
    VariantProps<typeof priceLabelVariants> {
  ref?: Ref<HTMLSpanElement>;
  /** Preço atual. */
  amount: number;
  /** Código ISO 4217. Padrão `EUR`. */
  currency?: string;
  /** Localidade do `Intl.NumberFormat`. Padrão `pt-PT`. */
  locale?: string;
  /** Preço anterior (riscado). Só aparece se for maior que `amount`. */
  compareAt?: number;
  /** Desconto em porcentagem (ex.: `30` mostra "-30%"). */
  discount?: number;
}

export function PriceLabel({
  amount,
  currency = "EUR",
  locale = "pt-PT",
  compareAt,
  discount,
  size,
  className,
  ...rest
}: PriceLabelProps) {
  const format = useMemo(
    () => new Intl.NumberFormat(locale, { style: "currency", currency }).format,
    [locale, currency],
  );
  const reduced = compareAt !== undefined && compareAt > amount;

  return (
    <span className={cn(priceLabelVariants({ size }), className)} {...rest}>
      {reduced && (
        <s className="text-content-low">
          <span className="sr-only">Preço anterior: </span>
          {format(compareAt)}
        </s>
      )}
      {discount !== undefined && discount > 0 && (
        <span>
          <span className="sr-only">Desconto de </span>
          <span aria-hidden>-</span>
          {Math.round(discount)}%
        </span>
      )}
      <span>
        {reduced && <span className="sr-only">Preço atual: </span>}
        {format(amount)}
      </span>
    </span>
  );
}
