import {
  useEffect,
  useId,
  useRef,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "../../../lib/cn";
import { Icon } from "../../icon";
import { errorTextClass, helperTextClass, joinIds, useMergedRefs } from "../FormField/field";

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<"input">, "type" | "size"> {
  ref?: Ref<HTMLInputElement>;
  /** Rótulo à direita da caixa (12px). */
  label?: ReactNode;
  /** Texto auxiliar abaixo do rótulo (11px). */
  description?: ReactNode;
  /** Mensagem de erro (11px, vermelho). Liga `aria-invalid`. */
  error?: string;
  /** Estado misto ("alguns marcados"). Visual de traço; o clique resolve para marcado. */
  indeterminate?: boolean;
  /** Atalho para `onChange` que entrega só o booleano. */
  onCheckedChange?: (checked: boolean) => void;
  /** Classe do `<input>` (visualmente oculto). `className` vai para o contêiner externo (`<label>`, descrição e erro). */
  inputClassName?: string;
}

/** Foco visível na caixa, a partir do input oculto. */
const boxFocus =
  "group-has-focus-visible/choice:outline group-has-focus-visible/choice:outline-1 group-has-focus-visible/choice:outline-offset-2 group-has-focus-visible/choice:outline-content";

export function Checkbox({
  ref,
  id,
  label,
  description,
  error,
  indeterminate = false,
  onCheckedChange,
  onChange,
  disabled,
  className,
  inputClassName,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const descId = `${inputId}-descricao`;
  const errorId = `${inputId}-erro`;
  const innerRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRefs(ref, innerRef);

  // `indeterminate` só existe como propriedade DOM, não como atributo.
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    onCheckedChange?.(event.target.checked);
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
          ref={mergedRef}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          onChange={handleChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={joinIds(ariaDescribedBy, description && descId, error && errorId)}
          className={cn("peer sr-only", inputClassName)}
          {...rest}
        />
        <span
          aria-hidden
          className={cn(
            "relative mt-1 flex size-4 shrink-0 items-center justify-center rounded-none border",
            "transition-colors duration-200 ease-zr",
            error ? "border-danger" : "border-line",
            "group-has-checked/choice:border-inverse group-has-checked/choice:bg-inverse",
            "group-has-indeterminate/choice:border-inverse group-has-indeterminate/choice:bg-inverse",
            "group-has-disabled/choice:border-content-disabled group-has-disabled/choice:group-has-checked/choice:bg-content-disabled",
            "group-has-disabled/choice:group-has-indeterminate/choice:bg-content-disabled",
            boxFocus,
          )}
        >
          <Icon
            name="check"
            size={14}
            className="hidden text-on-inverse group-has-checked/choice:block group-has-indeterminate/choice:hidden"
          />
          <Icon name="minus" size={14} className="hidden text-on-inverse group-has-indeterminate/choice:block" />
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
      {error && (
        <p id={errorId} role="alert" className={cn("mt-1 pl-7", errorTextClass)}>
          {error}
        </p>
      )}
    </div>
  );
}
