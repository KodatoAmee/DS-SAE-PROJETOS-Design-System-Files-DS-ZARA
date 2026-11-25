import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { errorTextClass, helperTextClass, joinIds, staticLabel } from "./field";

/** Props que o `FormField` entrega ao controle filho. */
export interface FormFieldControlProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
}

export interface FieldMessageProps {
  helperId?: string;
  errorId?: string;
  helperText?: ReactNode;
  error?: ReactNode;
  className?: string;
}

/**
 * Texto de ajuda (11px, `text-content-mid`) e mensagem de erro (11px, `text-danger-text`).
 * Com erro, a mensagem substitui a ajuda. O erro usa `role="alert"` para ser anunciado
 * quando aparece.
 */
export function FieldMessage({ helperId, errorId, helperText, error, className }: FieldMessageProps) {
  if (error) {
    return (
      <p id={errorId} role="alert" className={cn("mt-1", errorTextClass, className)}>
        {error}
      </p>
    );
  }
  if (helperText) {
    return (
      <p id={helperId} className={cn("mt-1", helperTextClass, className)}>
        {helperText}
      </p>
    );
  }
  return null;
}

/** Ids e atributos ARIA de um campo com ajuda/erro. */
export function useFieldIds(
  id: string | undefined,
  { helperText, error, describedBy }: { helperText?: ReactNode; error?: ReactNode; describedBy?: string },
) {
  const auto = useId();
  const controlId = id ?? auto;
  const helperId = `${controlId}-ajuda`;
  const errorId = `${controlId}-erro`;
  return {
    controlId,
    helperId,
    errorId,
    describedBy: joinIds(describedBy, error ? errorId : helperText ? helperId : undefined),
    invalid: error ? (true as const) : undefined,
  };
}

export interface FormFieldProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  /** Rótulo estático acima do controle (12px, maiúsculas). */
  label?: ReactNode;
  /** Texto de ajuda abaixo (11px). */
  helperText?: ReactNode;
  /** Mensagem de erro. Substitui a ajuda e marca o controle como inválido. */
  error?: string;
  /** Id do controle. Gerado com `useId` se ausente. */
  controlId?: string;
  /**
   * Controle. Como função, recebe `id`, `aria-describedby` e `aria-invalid` para espalhar
   * no elemento nativo.
   */
  children: ReactNode | ((control: FormFieldControlProps) => ReactNode);
}

/**
 * Invólucro de rótulo + ajuda + erro para compor controles que não trazem os seus
 * (ex.: um `input` nativo próprio, um `SizeSelector` com mensagem de validação).
 */
export function FormField({
  label,
  helperText,
  error,
  controlId,
  children,
  className,
  ...rest
}: FormFieldProps) {
  const ids = useFieldIds(controlId, { helperText, error });
  const control: FormFieldControlProps = {
    id: ids.controlId,
    "aria-describedby": ids.describedBy,
    "aria-invalid": ids.invalid,
  };
  return (
    <div className={cn("flex w-full flex-col", className)} {...rest}>
      {label && (
        <label htmlFor={ids.controlId} className={cn(staticLabel, "mb-2")}>
          {label}
        </label>
      )}
      {typeof children === "function" ? children(control) : children}
      <FieldMessage
        helperId={ids.helperId}
        errorId={ids.errorId}
        helperText={helperText}
        error={error}
      />
    </div>
  );
}
