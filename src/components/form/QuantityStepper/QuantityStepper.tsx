import { useId, type ComponentPropsWithoutRef, type Ref } from "react";
import { cva } from "class-variance-authority";
import { cn, focusRing } from "../../../lib/cn";
import { Icon, type IconName } from "../../icon";
import { useControllableState } from "../FormField/field";

const stepButton = cva(
  [
    "inline-flex shrink-0 items-center justify-center rounded-none text-content",
    "transition-opacity duration-200 ease-zr hover:opacity-60",
    "aria-disabled:cursor-not-allowed aria-disabled:text-content-disabled aria-disabled:hover:opacity-100",
    focusRing,
  ],
  {
    variants: {
      size: {
        /** 32px. */
        s: "size-8",
        /** 44px: alvo de toque. */
        m: "size-11",
      },
    },
    defaultVariants: { size: "s" },
  },
);

interface StepButtonProps extends ComponentPropsWithoutRef<"button"> {
  icon: IconName;
  size: "s" | "m";
  inactive: boolean;
}

/**
 * Botão de ícone local. Usa `aria-disabled` (e não `disabled`) para não perder o foco
 * quando o limite é atingido com o teclado.
 */
function StepButton({ icon, size, inactive, onClick, className, ...rest }: StepButtonProps) {
  return (
    <button
      type="button"
      aria-disabled={inactive || undefined}
      onClick={(event) => {
        if (inactive) return;
        onClick?.(event);
      }}
      className={cn(stepButton({ size }), className)}
      {...rest}
    >
      <Icon name={icon} size={16} />
    </button>
  );
}

export interface QuantityStepperProps
  extends Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange" | "children"> {
  ref?: Ref<HTMLDivElement>;
  /** Valor controlado. */
  value?: number;
  /** Valor inicial (não controlado). Padrão: `min`. */
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Padrão 1. */
  min?: number;
  /** Sem limite se ausente. */
  max?: number;
  /** Padrão 1. */
  step?: number;
  /** `s` = botões de 32px; `m` = 44px (toque). Padrão `s`. */
  size?: "s" | "m";
  disabled?: boolean;
  /** Nome acessível do grupo. Padrão "Quantidade". */
  label?: string;
  /** Rótulos dos botões. */
  decrementLabel?: string;
  incrementLabel?: string;
  /** Com `name`, envia o valor num `<input type="hidden">`. */
  name?: string;
}

/** Contador `−  1  +` para quantidade de itens (sacola, cesto). */
export function QuantityStepper({
  ref,
  value,
  min = 1,
  max,
  step = 1,
  defaultValue,
  onValueChange,
  size = "s",
  disabled = false,
  label = "Quantidade",
  decrementLabel = "Diminuir quantidade",
  incrementLabel = "Aumentar quantidade",
  name,
  className,
  ...rest
}: QuantityStepperProps) {
  const valueId = useId();
  const [current, setCurrent] = useControllableState(value, defaultValue ?? min, onValueChange);
  const clamp = (n: number) => Math.min(max ?? Number.POSITIVE_INFINITY, Math.max(min, n));
  const atMin = disabled || current <= min;
  const atMax = disabled || (max !== undefined && current >= max);

  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={cn("inline-flex items-center", className)}
      {...rest}
    >
      <StepButton
        icon="minus"
        size={size}
        inactive={atMin}
        aria-label={decrementLabel}
        aria-controls={valueId}
        onClick={() => setCurrent(clamp(current - step))}
      />
      <output
        id={valueId}
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          "min-w-8 px-1 text-center text-action font-light tabular-nums",
          disabled ? "text-content-disabled" : "text-content",
        )}
      >
        {current}
      </output>
      <StepButton
        icon="plus"
        size={size}
        inactive={atMax}
        aria-label={incrementLabel}
        aria-controls={valueId}
        onClick={() => setCurrent(clamp(current + step))}
      />
      {name && <input type="hidden" name={name} value={current} disabled={disabled} />}
    </div>
  );
}
