import {
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "../../../lib/cn";
import { FieldMessage, useFieldIds } from "../FormField/FormField";
import {
  fieldControl,
  fieldControlWithFloatingLabel,
  fieldLine,
  fieldLineState,
  floatingLabel,
  floatingLabelRest,
  helperTextClass,
  joinIds,
  useMergedRefs,
} from "../FormField/field";

export interface TextAreaProps extends ComponentPropsWithoutRef<"textarea"> {
  ref?: Ref<HTMLTextAreaElement>;
  /** Rótulo (12px, maiúsculas) que flutua para o topo com valor ou foco. */
  label?: ReactNode;
  /** Texto de ajuda abaixo da linha (11px). */
  helperText?: ReactNode;
  /** Mensagem de erro. Pinta a linha de vermelho e liga `aria-invalid`. */
  error?: string;
  /** Linhas mínimas visíveis. Padrão 3. A altura cresce com o conteúdo. */
  minRows?: number;
  /** Mostra o contador `n/maxLength`. Padrão: `true` quando há `maxLength`. */
  showCount?: boolean;
  /** Classe do `<textarea>`. `className` vai para o contêiner externo. */
  textareaClassName?: string;
}

/** Altura da linha de `text-body` e paddings verticais (18 + 2), em px. */
const LINE = 20;
const PAD_Y = 20;

export function TextArea({
  ref,
  id,
  label,
  helperText,
  error,
  minRows = 3,
  maxLength,
  showCount,
  placeholder,
  disabled,
  value,
  defaultValue,
  onChange,
  className,
  textareaClassName,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: TextAreaProps) {
  const innerRef = useRef<HTMLTextAreaElement>(null);
  const mergedRef = useMergedRefs(ref, innerRef);
  const [uncontrolledLength, setUncontrolledLength] = useState(() => String(defaultValue ?? "").length);
  const length = value !== undefined ? String(value).length : uncontrolledLength;
  const counting = maxLength !== undefined && (showCount ?? true);

  const ids = useFieldIds(id, { helperText, error, describedBy: ariaDescribedBy });
  const countId = `${ids.controlId}-contador`;
  const minHeight = minRows * LINE + PAD_Y;

  const resize = () => {
    const el = innerRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, minHeight)}px`;
  };

  // Recalcula quando o valor controlado muda por fora.
  useLayoutEffect(resize, [value, minHeight]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) setUncontrolledLength(event.target.value.length);
    resize();
    onChange?.(event);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className={cn(fieldLine, fieldLineState({ error: !!error, disabled }))}>
        <textarea
          ref={mergedRef}
          id={ids.controlId}
          rows={minRows}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          maxLength={maxLength}
          disabled={disabled}
          placeholder={label ? (placeholder ?? " ") : placeholder}
          aria-invalid={ids.invalid}
          aria-describedby={joinIds(ids.describedBy, counting && countId)}
          style={{ minHeight }}
          className={cn(
            fieldControl,
            "block resize-none overflow-hidden",
            label && fieldControlWithFloatingLabel,
            textareaClassName,
          )}
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
      </div>
      <div className="flex items-start gap-4">
        <FieldMessage
          className="flex-1"
          helperId={ids.helperId}
          errorId={ids.errorId}
          helperText={helperText}
          error={error}
        />
        {counting && (
          <p id={countId} className={cn("mt-1 ml-auto shrink-0 tabular-nums", helperTextClass)}>
            <span aria-hidden>
              {length}/{maxLength}
            </span>
            <span className="sr-only">
              {length} de {maxLength} caracteres
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
