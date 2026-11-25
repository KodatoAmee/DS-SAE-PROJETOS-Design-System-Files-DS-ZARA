import { useState, type ChangeEvent, type ComponentPropsWithoutRef, type ReactNode, type Ref } from "react";
import { cn } from "../../../lib/cn";
import { Icon } from "../../icon";
import { FieldMessage, useFieldIds } from "../FormField/FormField";
import { fieldControl, fieldLine, fieldLineState, floatingLabel } from "../FormField/field";

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps extends Omit<ComponentPropsWithoutRef<"select">, "size" | "multiple"> {
  ref?: Ref<HTMLSelectElement>;
  /** Rótulo (12px, maiúsculas), sempre no topo: o `<select>` sempre mostra um texto. */
  label?: ReactNode;
  /** Texto de ajuda abaixo da linha (11px). */
  helperText?: ReactNode;
  /** Mensagem de erro. Pinta a linha de vermelho e liga `aria-invalid`. */
  error?: string;
  /** Opções. Alternativa a passar `<option>` como `children`. */
  options?: SelectOption[];
  /** Primeira opção vazia (`value=""`), não selecionável de volta, em `text-content-low`. */
  placeholder?: string;
  /** Classe do `<select>`. `className` vai para o contêiner externo. */
  selectClassName?: string;
}

export function Select({
  ref,
  id,
  label,
  helperText,
  error,
  options,
  placeholder,
  disabled,
  value,
  defaultValue,
  onChange,
  className,
  selectClassName,
  children,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: SelectProps) {
  const ids = useFieldIds(id, { helperText, error, describedBy: ariaDescribedBy });
  const initial = defaultValue ?? (placeholder !== undefined ? "" : undefined);
  const [uncontrolled, setUncontrolled] = useState(String(initial ?? ""));
  const current = value !== undefined ? String(value) : uncontrolled;
  const empty = placeholder !== undefined && current === "";

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (value === undefined) setUncontrolled(event.target.value);
    onChange?.(event);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className={cn(fieldLine, "h-10", fieldLineState({ error: !!error, disabled }))}>
        <select
          ref={ref}
          id={ids.controlId}
          value={value}
          defaultValue={value === undefined ? initial : undefined}
          onChange={handleChange}
          disabled={disabled}
          aria-invalid={ids.invalid}
          aria-describedby={ids.describedBy}
          className={cn(
            fieldControl,
            "h-full cursor-pointer appearance-none pr-7",
            label ? "pt-4.5" : "pt-0",
            empty && "text-content-low",
            // Lista aberta herda a cor do select em alguns navegadores: mantém as opções legíveis.
            "[&>option]:bg-base [&>option]:text-content",
            selectClassName,
          )}
          {...rest}
        >
          {placeholder !== undefined && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options?.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
        {label && (
          <label
            htmlFor={ids.controlId}
            className={cn(floatingLabel, disabled && "text-content-disabled")}
          >
            {label}
          </label>
        )}
        <Icon
          name="chevron-down"
          size={16}
          className={cn(
            "pointer-events-none absolute right-0 bottom-1",
            disabled ? "text-content-disabled" : "text-content",
          )}
        />
      </div>
      <FieldMessage
        helperId={ids.helperId}
        errorId={ids.errorId}
        helperText={helperText}
        error={error}
      />
    </div>
  );
}
