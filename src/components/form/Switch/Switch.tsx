import { useId, type ComponentPropsWithoutRef, type MouseEvent, type ReactNode, type Ref } from "react";
import { cn, focusRing } from "../../../lib/cn";
import { helperTextClass, joinIds, useControllableState } from "../FormField/field";

export interface SwitchProps
  extends Omit<ComponentPropsWithoutRef<"button">, "value" | "defaultValue" | "onChange" | "children"> {
  ref?: Ref<HTMLButtonElement>;
  /** Estado controlado. */
  checked?: boolean;
  /** Estado inicial (não controlado). */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Rótulo visível (12px). Sem ele, passe `aria-label`. */
  label?: ReactNode;
  /** Texto auxiliar abaixo do rótulo (11px). */
  description?: ReactNode;
  /** Lado do rótulo em relação ao trilho. Padrão `end` (trilho à esquerda). */
  labelPosition?: "start" | "end";
  /** Com `name`, envia um `<input type="hidden">` quando ligado (como um checkbox). */
  name?: string;
  /** Valor enviado quando ligado. Padrão "on". */
  value?: string;
  /** Classe do contêiner externo. `className` vai para o mesmo contêiner. */
  className?: string;
}

/**
 * Liga/desliga com efeito imediato. Trilho retangular 32x16 e botão quadrado.
 */
export function Switch({
  ref,
  id,
  checked,
  defaultChecked = false,
  onCheckedChange,
  label,
  description,
  labelPosition = "end",
  name,
  value = "on",
  disabled,
  onClick,
  className,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: SwitchProps) {
  const autoId = useId();
  const switchId = id ?? autoId;
  const descId = `${switchId}-descricao`;
  const [on, setOn] = useControllableState(checked, defaultChecked, onCheckedChange);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) setOn(!on);
  };

  const track = (
    <button
      ref={ref}
      id={switchId}
      type="button"
      role="switch"
      aria-checked={on}
      aria-describedby={joinIds(ariaDescribedBy, description && descId)}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "relative mt-1 inline-block h-4 w-8 shrink-0 rounded-none border",
        "transition-colors duration-200 ease-zr",
        // Área de toque de 24px de altura sem mudar o desenho.
        "before:absolute before:-inset-x-px before:-inset-y-1.5",
        on ? "border-inverse bg-inverse" : "border-line bg-transparent",
        "disabled:cursor-not-allowed disabled:border-content-disabled",
        on && "disabled:bg-content-disabled",
        focusRing,
      )}
      {...rest}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-px left-px size-3 transition-transform duration-200 ease-zr",
          on ? "translate-x-4 bg-on-inverse" : "translate-x-0 bg-inverse",
          disabled && !on && "bg-content-disabled",
        )}
      />
    </button>
  );

  return (
    <div
      className={cn(
        "inline-flex min-h-6 items-start gap-3",
        labelPosition === "start" && "flex-row-reverse justify-end",
        className,
      )}
    >
      {track}
      {(label || description) && (
        <span className="flex flex-col pt-1">
          {label && (
            <label
              htmlFor={switchId}
              className={cn(
                "text-label font-light select-none",
                disabled ? "cursor-not-allowed text-content-disabled" : "cursor-pointer text-content",
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <span id={descId} className={cn("mt-0.5", helperTextClass)}>
              {description}
            </span>
          )}
        </span>
      )}
      {name && on && <input type="hidden" name={name} value={value} disabled={disabled} />}
    </div>
  );
}
