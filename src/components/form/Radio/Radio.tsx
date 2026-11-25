import {
  createContext,
  useContext,
  useId,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "../../../lib/cn";
import { FieldMessage, useFieldIds } from "../FormField/FormField";
import { helperTextClass, joinIds, staticLabel, useControllableState } from "../FormField/field";

/* ------------------------------------------------------------------ */
/* Contexto do grupo                                                   */
/* ------------------------------------------------------------------ */

interface RadioGroupContextValue {
  name: string;
  value: string;
  setValue: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/* ------------------------------------------------------------------ */
/* Radio                                                               */
/* ------------------------------------------------------------------ */

export interface RadioProps extends Omit<ComponentPropsWithoutRef<"input">, "type" | "size" | "value"> {
  ref?: Ref<HTMLInputElement>;
  /** Valor enviado e comparado com o do `RadioGroup`. */
  value: string;
  /** Rótulo à direita (12px). */
  label?: ReactNode;
  /** Texto auxiliar abaixo do rótulo (11px). */
  description?: ReactNode;
  /** Classe do `<input>` (visualmente oculto). `className` vai para o contêiner externo (`<label>` + descrição). */
  inputClassName?: string;
}

const boxFocus =
  "group-has-focus-visible/choice:outline group-has-focus-visible/choice:outline-1 group-has-focus-visible/choice:outline-offset-2 group-has-focus-visible/choice:outline-content";

/**
 * Opção única. Quadrado (raio 0 em tudo) com ponto quadrado interno quando marcado.
 * Dentro de `RadioGroup` herda `name`, valor e estado; fora dele funciona como `<input type="radio">`.
 */
export function Radio({
  ref,
  id,
  value,
  label,
  description,
  disabled: disabledProp,
  checked: checkedProp,
  name: nameProp,
  onChange,
  className,
  inputClassName,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: RadioProps) {
  const group = useContext(RadioGroupContext);
  const autoId = useId();
  const inputId = id ?? autoId;
  const descId = `${inputId}-descricao`;
  const disabled = disabledProp ?? group?.disabled;
  const checked = group ? group.value === value : checkedProp;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    if (group && event.target.checked) group.setValue(value);
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <label
        htmlFor={inputId}
        className={cn(
          "group/choice relative inline-flex min-h-6 items-start gap-3 select-none",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
        )}
      >
        <input
          ref={ref}
          id={inputId}
          type="radio"
          value={value}
          name={group?.name ?? nameProp}
          checked={checked}
          required={group?.required}
          disabled={disabled}
          onChange={handleChange}
          aria-describedby={joinIds(ariaDescribedBy, description && descId)}
          className={cn("peer sr-only", inputClassName)}
          {...rest}
        />
        <span
          aria-hidden
          className={cn(
            "relative mt-1 flex size-4 shrink-0 items-center justify-center rounded-none border",
            "transition-colors duration-200 ease-zr",
            group?.invalid ? "border-danger" : "border-line",
            "group-has-checked/choice:border-line",
            "group-has-disabled/choice:border-content-disabled",
            boxFocus,
          )}
        >
          <span
            className={cn(
              "size-2 bg-inverse opacity-0 transition-opacity duration-200 ease-zr",
              "group-has-checked/choice:opacity-100 group-has-disabled/choice:bg-content-disabled",
            )}
          />
        </span>
        {label && (
          <span
            className={cn(
              "pt-1 text-label font-light",
              disabled ? "text-content-disabled" : "text-content",
            )}
          >
            {label}
          </span>
        )}
      </label>
      {/* Fora do <label>: entra só via aria-describedby, não no nome acessível. pl-7 = caixa 16 + gap 12. */}
      {description && (
        <span id={descId} className={cn("pl-7", helperTextClass)}>
          {description}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RadioGroup                                                          */
/* ------------------------------------------------------------------ */

export interface RadioGroupProps
  extends Omit<ComponentPropsWithoutRef<"fieldset">, "onChange" | "defaultValue"> {
  ref?: Ref<HTMLFieldSetElement>;
  /** Título do grupo (`<legend>`, 12px maiúsculas). */
  legend: ReactNode;
  /** Esconde a legenda visualmente, mantendo-a para leitores de tela. */
  hideLegend?: boolean;
  /** `name` comum dos inputs. Gerado se ausente. */
  name?: string;
  /** Valor controlado. */
  value?: string;
  /** Valor inicial (não controlado). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Disposição das opções. Padrão `vertical`. */
  orientation?: "vertical" | "horizontal";
  /** Texto de ajuda abaixo das opções (11px). */
  helperText?: ReactNode;
  /** Mensagem de erro (11px, vermelho). */
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function RadioGroup({
  ref,
  id,
  legend,
  hideLegend = false,
  name,
  value,
  defaultValue = "",
  onValueChange,
  orientation = "vertical",
  helperText,
  error,
  required,
  disabled,
  className,
  children,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: RadioGroupProps) {
  const ids = useFieldIds(id, { helperText, error, describedBy: ariaDescribedBy });
  const legendId = `${ids.controlId}-legenda`;
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange);

  return (
    <RadioGroupContext.Provider
      value={{
        name: name ?? ids.controlId,
        value: current,
        setValue: setCurrent,
        disabled,
        invalid: !!error,
        required,
      }}
    >
      <fieldset
        ref={ref}
        id={ids.controlId}
        role="radiogroup"
        aria-labelledby={legendId}
        aria-describedby={ids.describedBy}
        aria-invalid={ids.invalid}
        aria-required={required || undefined}
        disabled={disabled}
        className={cn("m-0 min-w-0 border-0 p-0", className)}
        {...rest}
      >
        <legend id={legendId} className={cn(staticLabel, "mb-3 p-0", hideLegend && "sr-only")}>
          {legend}
        </legend>
        <div
          className={cn(
            "flex",
            orientation === "vertical" ? "flex-col gap-3" : "flex-row flex-wrap gap-x-6 gap-y-3",
          )}
        >
          {children}
        </div>
        <FieldMessage
          helperId={ids.helperId}
          errorId={ids.errorId}
          helperText={helperText}
          error={error}
          className="mt-2"
        />
      </fieldset>
    </RadioGroupContext.Provider>
  );
}
