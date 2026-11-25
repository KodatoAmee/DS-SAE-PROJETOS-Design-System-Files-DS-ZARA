import { useId, useRef, type ComponentPropsWithoutRef, type KeyboardEvent, type ReactNode, type Ref } from "react";
import { cn, focusRing } from "../../../lib/cn";
import { FieldMessage, useFieldIds } from "../FormField/FormField";
import { staticLabel, useControllableState } from "../FormField/field";

export type SizeAvailability = "available" | "low" | "soldOut";

export interface SizeOption {
  value: string;
  /** Texto do tamanho. Padrão: o próprio `value`. */
  label?: ReactNode;
  /** `low` mostra a nota "Poucas unidades"; `soldOut` risca e bloqueia. Padrão `available`. */
  availability?: SizeAvailability;
  /** Nota própria (11px), substitui a de poucas unidades. */
  note?: ReactNode;
}

export interface SizeSelectorProps
  extends Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange" | "children"> {
  ref?: Ref<HTMLDivElement>;
  options: SizeOption[];
  /** Valor controlado. */
  value?: string;
  /** Valor inicial (não controlado). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** `horizontal` (linha que quebra) ou `vertical` (lista, como na gaveta de tamanhos). */
  orientation?: "horizontal" | "vertical";
  /** Rótulo visível acima (12px maiúsculas). Sem ele, o grupo usa `aria-label` (padrão "Tamanho"). */
  label?: ReactNode;
  /** Texto de ajuda (11px). */
  helperText?: ReactNode;
  /** Mensagem de erro (ex.: "Selecione um tamanho"). */
  error?: string;
  /** Nota para `availability: "low"`. Padrão "Poucas unidades". */
  lowStockText?: ReactNode;
  /** Texto oculto lido em tamanhos esgotados. Padrão "esgotado". */
  soldOutText?: string;
  /** Com `name`, envia o valor num `<input type="hidden">`. */
  name?: string;
  required?: boolean;
}

/**
 * Seletor de tamanho de produto. Padrão ARIA `radiogroup` com tabindex móvel:
 * Tab entra no tamanho selecionado (ou no primeiro disponível), setas movem e selecionam,
 * esgotados são pulados.
 */
export function SizeSelector({
  ref,
  id,
  options,
  value,
  defaultValue = "",
  onValueChange,
  orientation = "horizontal",
  label,
  helperText,
  error,
  lowStockText = "Poucas unidades",
  soldOutText = "esgotado",
  name,
  required,
  className,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: SizeSelectorProps) {
  const ids = useFieldIds(id, { helperText, error, describedBy: ariaDescribedBy });
  const labelId = useId();
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isAvailable = (option: SizeOption) => option.availability !== "soldOut";
  const selectedIndex = options.findIndex((o) => o.value === current && isAvailable(o));
  const tabStop = selectedIndex >= 0 ? selectedIndex : options.findIndex(isAvailable);

  const select = (index: number) => {
    const option = options[index];
    if (!option || !isAvailable(option)) return;
    setCurrent(option.value);
  };

  const moveTo = (from: number, step: 1 | -1) => {
    const total = options.length;
    for (let i = 1; i <= total; i++) {
      const next = (from + step * i + total) % total;
      if (isAvailable(options[next])) return next;
    }
    return from;
  };

  const focusAndSelect = (index: number) => {
    itemRefs.current[index]?.focus();
    select(index);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let target: number | null = null;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        target = moveTo(index, 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        target = moveTo(index, -1);
        break;
      case "Home":
        target = options.findIndex(isAvailable);
        break;
      case "End": {
        const last = [...options].reverse().findIndex(isAvailable);
        target = last >= 0 ? options.length - 1 - last : null;
        break;
      }
    }
    if (target !== null && target >= 0) {
      event.preventDefault();
      focusAndSelect(target);
    }
  };

  const vertical = orientation === "vertical";

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <span id={labelId} className={cn(staticLabel, "mb-3")}>
          {label}
        </span>
      )}
      <div
        ref={ref}
        id={ids.controlId}
        role="radiogroup"
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : (ariaLabel ?? "Tamanho")}
        aria-orientation={orientation}
        aria-describedby={ids.describedBy}
        aria-invalid={ids.invalid}
        aria-required={required || undefined}
        className={cn("flex", vertical ? "flex-col" : "flex-row flex-wrap gap-2")}
        {...rest}
      >
        {options.map((option, index) => {
          const soldOut = option.availability === "soldOut";
          const selected = !soldOut && option.value === current;
          const note = option.note ?? (option.availability === "low" ? lowStockText : null);
          return (
            <button
              key={option.value}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-disabled={soldOut || undefined}
              tabIndex={index === tabStop ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "inline-flex rounded-none border text-action",
                "transition-[border-color,opacity] duration-200 ease-zr",
                vertical
                  ? "min-h-11 w-full items-center justify-between gap-4 px-4 text-left"
                  : "min-h-10 min-w-11 flex-col items-center justify-center px-3 py-2",
                selected ? "border-line font-medium text-content" : "border-transparent font-light",
                soldOut
                  ? "cursor-not-allowed text-content-disabled"
                  : !selected && "text-content hover:border-line-subtle",
                focusRing,
              )}
            >
              <span className={cn(soldOut && "line-through")}>{option.label ?? option.value}</span>
              {soldOut && <span className="sr-only">, {soldOutText}</span>}
              {note && !soldOut && (
                <span className={cn("text-label-s font-light text-content-mid", !vertical && "mt-0.5")}>
                  {note}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <FieldMessage
        helperId={ids.helperId}
        errorId={ids.errorId}
        helperText={helperText}
        error={error}
        className="mt-2"
      />
      {name && <input type="hidden" name={name} value={current} />}
    </div>
  );
}
