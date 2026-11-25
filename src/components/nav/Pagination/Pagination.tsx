import type { ComponentPropsWithoutRef, MouseEvent, ReactNode, Ref } from "react";
import { cn, focusRing } from "../../../lib/cn";
import { Icon } from "../../icon";
import { useControllableState } from "../_internal/useControllableState";

type RangeItem = number | "ellipsis-start" | "ellipsis-end";

/** Páginas visíveis com reticências. Sempre mostra a primeira, a última e `siblings` em volta da atual. */
export function getPaginationRange(page: number, pageCount: number, siblings = 1): RangeItem[] {
  const span = (from: number, to: number) =>
    Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);
  const slots = siblings * 2 + 5;
  if (pageCount <= slots) return span(1, pageCount);

  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, pageCount);
  const showStart = left > 2;
  const showEnd = right < pageCount - 1;
  const edge = 3 + siblings * 2;

  if (!showStart) return [...span(1, edge), "ellipsis-end", pageCount];
  if (!showEnd) return [1, "ellipsis-start", ...span(pageCount - edge + 1, pageCount)];
  return [1, "ellipsis-start", ...span(left, right), "ellipsis-end", pageCount];
}

export interface PaginationProps extends Omit<ComponentPropsWithoutRef<"nav">, "children"> {
  ref?: Ref<HTMLElement>;
  /** `numbers`: Anterior · 1 2 3 … · Próximo. `dots`: indicador de pontos (carrossel). */
  variant?: "numbers" | "dots";
  /** Só em `numbers`: mostra "1 / 6" com setas. */
  compact?: boolean;
  /** Total de páginas (≥ 1). */
  pageCount: number;
  /** Página atual, base 1 (controlado). */
  page?: number;
  /** Página inicial (não controlado). Padrão: 1. */
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Páginas vizinhas à atual em `numbers`. Padrão: 1. */
  siblingCount?: number;
  /** Gera links reais (`<a href>`) em vez de botões. */
  getPageHref?: (page: number) => string;
  /** Nome acessível do `nav`. Padrão: "Paginação". */
  label?: string;
  previousLabel?: string;
  nextLabel?: string;
  /** Nome acessível de cada página/ponto. */
  getPageLabel?: (page: number, pageCount: number) => string;
}

interface ControlProps {
  page: number;
  disabled?: boolean;
  current?: "page" | "true";
  ariaLabel?: string;
  className: string;
  children: ReactNode;
  getPageHref?: (page: number) => string;
  onSelect: (page: number) => void;
}

function PageControl({
  page,
  disabled,
  current,
  ariaLabel,
  className,
  children,
  getPageHref,
  onSelect,
}: ControlProps) {
  const classes = cn(className, focusRing);
  if (getPageHref && !disabled) {
    return (
      <a
        href={getPageHref(page)}
        aria-label={ariaLabel}
        aria-current={current}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
          onSelect(page);
        }}
        className={classes}
      >
        {children}
      </a>
    );
  }
  // `aria-disabled` em vez de `disabled`: o botão segue focável, então ao chegar à
  // ponta pelo teclado o foco não cai no body.
  return (
    <button
      type="button"
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel}
      aria-current={current}
      onClick={() => {
        if (!disabled) onSelect(page);
      }}
      className={classes}
    >
      {children}
    </button>
  );
}

const textControl =
  "inline-flex h-8 items-center justify-center px-2 text-action font-light uppercase underline-offset-4 decoration-1 hover:underline aria-disabled:pointer-events-none aria-disabled:text-content-disabled";

const iconControl =
  "inline-flex size-10 items-center justify-center transition-opacity duration-200 ease-zr hover:opacity-60 aria-disabled:pointer-events-none aria-disabled:text-content-disabled";

export function Pagination({
  ref,
  variant = "numbers",
  compact = false,
  pageCount,
  page,
  defaultPage = 1,
  onPageChange,
  siblingCount = 1,
  getPageHref,
  label = "Paginação",
  previousLabel = "Anterior",
  nextLabel = "Próximo",
  getPageLabel = (n, total) => `Página ${n} de ${total}`,
  className,
  ...rest
}: PaginationProps) {
  const total = Math.max(1, Math.floor(pageCount));
  const [rawPage, setPage] = useControllableState({
    value: page,
    defaultValue: defaultPage,
    onChange: onPageChange,
  });
  const current = Math.min(Math.max(1, rawPage), total);
  const select = (next: number) => setPage(Math.min(Math.max(1, next), total));
  const shared = { getPageHref, onSelect: select };

  if (variant === "dots") {
    return (
      <nav ref={ref} aria-label={label} className={className} {...rest}>
        <ul className="flex items-center">
          {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
            const isCurrent = n === current;
            return (
              <li key={n}>
                {/* Alvo 24x24; ponto 6px (único uso de rounded-full no sistema). */}
                <PageControl
                  {...shared}
                  page={n}
                  current={isCurrent ? "true" : undefined}
                  ariaLabel={getPageLabel(n, total)}
                  className="group inline-flex size-6 items-center justify-center"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 rounded-full border border-content transition-colors duration-200 ease-zr",
                      isCurrent ? "bg-content" : "bg-transparent group-hover:bg-content-low",
                    )}
                  />
                </PageControl>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  const prev = (
    <PageControl
      {...shared}
      page={current - 1}
      disabled={current <= 1}
      ariaLabel={compact ? previousLabel : undefined}
      className={compact ? iconControl : textControl}
    >
      {compact ? <Icon name="chevron-left" /> : previousLabel}
    </PageControl>
  );
  const next = (
    <PageControl
      {...shared}
      page={current + 1}
      disabled={current >= total}
      ariaLabel={compact ? nextLabel : undefined}
      className={compact ? iconControl : textControl}
    >
      {compact ? <Icon name="chevron-right" /> : nextLabel}
    </PageControl>
  );

  if (compact) {
    return (
      <nav ref={ref} aria-label={label} className={className} {...rest}>
        <div className="flex items-center gap-2">
          {prev}
          <span aria-live="polite" aria-atomic="true" className="min-w-12 text-center text-action font-light">
            <span aria-hidden>
              {current} / {total}
            </span>
            <span className="sr-only">{getPageLabel(current, total)}</span>
          </span>
          {next}
        </div>
      </nav>
    );
  }

  return (
    <nav ref={ref} aria-label={label} className={className} {...rest}>
      <ul className="flex flex-wrap items-center gap-1">
        <li className="mr-2">{prev}</li>
        {getPaginationRange(current, total, siblingCount).map((item) =>
          typeof item === "number" ? (
            <li key={item}>
              <PageControl
                {...shared}
                page={item}
                current={item === current ? "page" : undefined}
                ariaLabel={getPageLabel(item, total)}
                className={cn(
                  "inline-flex h-8 min-w-8 items-center justify-center px-1 text-action underline-offset-4 decoration-1",
                  item === current ? "font-medium underline" : "font-light hover:underline",
                )}
              >
                {item}
              </PageControl>
            </li>
          ) : (
            <li key={item} aria-hidden className="inline-flex h-8 min-w-8 items-center justify-center text-action text-content-low">
              …
            </li>
          ),
        )}
        <li className="ml-2">{next}</li>
      </ul>
    </nav>
  );
}
