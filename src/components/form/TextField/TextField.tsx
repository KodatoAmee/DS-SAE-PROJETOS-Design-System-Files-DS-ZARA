import { useState, type ComponentPropsWithoutRef, type ReactNode, type Ref } from "react";
import { cn, focusRing } from "../../../lib/cn";
import { FieldMessage, useFieldIds } from "../FormField/FormField";
import {
  fieldControl,
  fieldControlWithFloatingLabel,
  fieldLine,
  fieldLineState,
  floatingLabel,
  floatingLabelRest,
} from "../FormField/field";

export type TextFieldType = "text" | "email" | "password" | "tel";

export interface TextFieldProps extends Omit<ComponentPropsWithoutRef<"input">, "type" | "size"> {
  ref?: Ref<HTMLInputElement>;
  /** Rótulo (12px, maiúsculas) que flutua para o topo com valor ou foco. */
  label?: ReactNode;
  /** Texto de ajuda abaixo da linha (11px). */
  helperText?: ReactNode;
  /** Mensagem de erro. Pinta a linha de vermelho e liga `aria-invalid`. */
  error?: string;
  /** Elemento à direita do texto (ex.: botão de mostrar senha). */
  endAdornment?: ReactNode;
  /** Padrão `text`. Em `password` sem `endAdornment`, mostra o botão Mostrar/Ocultar. */
  type?: TextFieldType;
  /** Classe do contêiner externo. `className` vai para o mesmo contêiner. */
  className?: string;
  /** Classe do `<input>`. */
  inputClassName?: string;
}

/** Botão de texto para o adorno final (alvo mínimo 24px). */
function AdornmentButton(props: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "mb-0.5 inline-flex min-h-6 min-w-6 shrink-0 items-center justify-center",
        "text-label font-light uppercase text-content underline-offset-4 hover:underline",
        "disabled:pointer-events-none disabled:text-content-disabled",
        focusRing,
        props.className,
      )}
    />
  );
}

export function TextField({
  ref,
  id,
  label,
  helperText,
  error,
  endAdornment,
  type = "text",
  placeholder,
  disabled,
  className,
  inputClassName,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: TextFieldProps) {
  const ids = useFieldIds(id, { helperText, error, describedBy: ariaDescribedBy });
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && revealed ? "text" : type;

  const adornment =
    endAdornment ??
    (isPassword ? (
      <AdornmentButton
        onClick={() => setRevealed((v) => !v)}
        aria-label={revealed ? "Ocultar senha" : "Mostrar senha"}
        aria-controls={ids.controlId}
        disabled={disabled}
      >
        {revealed ? "Ocultar" : "Mostrar"}
      </AdornmentButton>
    ) : null);

  return (
    <div className={cn("w-full", className)}>
      <div className={cn(fieldLine, "h-10 gap-2", fieldLineState({ error: !!error, disabled }))}>
        <input
          ref={ref}
          id={ids.controlId}
          type={inputType}
          disabled={disabled}
          // Placeholder de um espaço: permite `:placeholder-shown` saber se o campo está vazio.
          placeholder={label ? (placeholder ?? " ") : placeholder}
          aria-invalid={ids.invalid}
          aria-describedby={ids.describedBy}
          className={cn(fieldControl, "h-full", label && fieldControlWithFloatingLabel, inputClassName)}
          {...rest}
        />
        {label && (
          <label
            htmlFor={ids.controlId}
            className={cn(floatingLabel, floatingLabelRest, disabled && "text-content-disabled")}
          >
            {label}
          </label>
        )}
        {adornment}
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

/** Botão de texto pronto para `endAdornment`. */
TextField.AdornmentButton = AdornmentButton;
