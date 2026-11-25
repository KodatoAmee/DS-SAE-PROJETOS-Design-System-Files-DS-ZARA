import { useId, useRef, useState, type ComponentPropsWithoutRef, type KeyboardEvent, type Ref } from "react";
import { cn, focusRing } from "../../../lib/cn";

export interface ViewSelectorProps
  extends Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange" | "role"> {
  ref?: Ref<HTMLDivElement>;
  /** Densidades disponíveis (colunas por linha). Padrão `[1, 2, 3]`. */
  options?: number[];
  /** Valor selecionado (controlado). */
  value?: number;
  /** Valor inicial (não controlado). Padrão: primeira opção. */
  defaultValue?: number;
  /** Chamado quando o usuário escolhe outra densidade. */
  onValueChange?: (value: number) => void;
  /** Rótulo visível do grupo. Padrão "Vista". */
  label?: string;
  /** Nome acessível de cada opção. Deve conter o número visível (WCAG 2.5.3). */
  getOptionLabel?: (option: number) => string;
  disabled?: boolean;
}

const defaultOptionLabel = (option: number) =>
  option === 1 ? "1 coluna" : `${option} colunas`;

export function ViewSelector({
  options = [1, 2, 3],
  value: valueProp,
  defaultValue,
  onValueChange,
  label = "Vista",
  getOptionLabel = defaultOptionLabel,
  disabled = false,
  className,
  ...rest
}: ViewSelectorProps) {
  const labelId = useId();
  const [internal, setInternal] = useState<number | undefined>(defaultValue ?? options[0]);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internal;
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectedIndex = options.indexOf(value as number);
  // Roving tabindex: só a opção selecionada (ou a primeira, se nenhuma) entra na ordem de Tab.
  const tabbableIndex = selectedIndex === -1 ? 0 : selectedIndex;

  const select = (option: number) => {
    if (disabled || option === value) return;
    if (!isControlled) setInternal(option);
    onValueChange?.(option);
  };

  const moveTo = (index: number) => {
    const count = options.length;
    const next = ((index % count) + count) % count;
    const option = options[next];
    if (option === undefined) return;
    select(option);
    optionRefs.current[next]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        moveTo(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        moveTo(index - 1);
        break;
      case "Home":
        event.preventDefault();
        moveTo(0);
        break;
      case "End":
        event.preventDefault();
        moveTo(options.length - 1);
        break;
    }
  };

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelId}
      aria-disabled={disabled || undefined}
      className={cn(
        "inline-flex items-center gap-2 text-label font-light uppercase text-content",
        disabled && "text-content-disabled",
        className,
      )}
      {...rest}
    >
      <span id={labelId}>{label}</span>
      <span className="flex items-center">
        {options.map((option, index) => {
          const checked = option === value;
          return (
            <button
              key={option}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={getOptionLabel(option)}
              tabIndex={index === tabbableIndex ? 0 : -1}
              disabled={disabled}
              onClick={() => select(option)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "inline-flex h-6 min-w-6 items-center justify-center rounded-none tabular-nums underline-offset-4 decoration-1",
                "transition-opacity duration-200 ease-zr disabled:pointer-events-none",
                checked ? "font-medium underline" : "font-light hover:opacity-60",
                focusRing,
              )}
            >
              {option}
            </button>
          );
        })}
      </span>
    </div>
  );
}
