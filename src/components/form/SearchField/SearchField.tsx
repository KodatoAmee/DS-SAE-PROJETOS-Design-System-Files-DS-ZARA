import {
  useId,
  useRef,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type FormEvent,
  type KeyboardEvent,
  type Ref,
} from "react";
import { cn, focusRing } from "../../../lib/cn";
import { Icon } from "../../icon";
import { useControllableState, useMergedRefs } from "../FormField/field";

export interface SearchFieldProps
  extends Omit<ComponentPropsWithoutRef<"input">, "type" | "size" | "value" | "defaultValue"> {
  ref?: Ref<HTMLInputElement>;
  /** Nome acessível do campo (rótulo visualmente oculto). Padrão "Pesquisar". */
  label?: string;
  /** Valor controlado. */
  value?: string;
  /** Valor inicial (não controlado). */
  defaultValue?: string;
  /** Chamado a cada alteração do texto (inclui limpar). */
  onValueChange?: (value: string) => void;
  /** Chamado no Enter (envio do formulário de pesquisa). */
  onSearch?: (value: string) => void;
  /** Chamado ao limpar pelo botão ou pela tecla Escape. */
  onClear?: () => void;
  /** Rótulo do botão limpar. Padrão "Limpar pesquisa". */
  clearLabel?: string;
  /** Classe do `<form role="search">`. */
  className?: string;
  /** Classe do `<input>`. */
  inputClassName?: string;
}

/**
 * Campo de pesquisa grande, estilo cabeçalho: linha inferior, ícone de lupa,
 * botão limpar quando há texto e `onSearch` no Enter.
 */
export function SearchField({
  ref,
  id,
  label = "Pesquisar",
  placeholder = "Pesquisar",
  value,
  defaultValue = "",
  onValueChange,
  onSearch,
  onClear,
  clearLabel = "Limpar pesquisa",
  disabled,
  onChange,
  onKeyDown,
  className,
  inputClassName,
  ...rest
}: SearchFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const innerRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRefs(ref, innerRef);
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange);

  const clear = () => {
    setCurrent("");
    onClear?.();
    innerRef.current?.focus();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.(current.trim());
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrent(event.target.value);
    onChange?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "Escape" && current) {
      event.preventDefault();
      clear();
    }
  };

  return (
    <form role="search" onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div
        className={cn(
          "flex h-12 w-full items-center gap-3 border-b transition-[border-color] duration-200 ease-zr",
          disabled ? "border-content-disabled" : "border-line-field focus-within:border-line",
        )}
      >
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
        <Icon
          name="search"
          className={disabled ? "text-content-disabled" : "text-content"}
        />
        <input
          ref={mergedRef}
          id={inputId}
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          value={current}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "h-full w-full min-w-0 flex-1 rounded-none border-0 bg-transparent",
            "text-heading font-light text-content outline-none placeholder:text-content-low",
            "disabled:cursor-not-allowed disabled:text-content-disabled",
            // Esconde o botão limpar nativo (WebKit): o DS tem o seu.
            "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
            inputClassName,
          )}
          {...rest}
        />
        {current && !disabled && (
          <button
            type="button"
            onClick={clear}
            aria-label={clearLabel}
            aria-controls={inputId}
            className={cn(
              "inline-flex size-6 shrink-0 items-center justify-center text-content",
              "transition-opacity duration-200 ease-zr hover:opacity-60",
              focusRing,
            )}
          >
            <Icon name="close" size={16} />
          </button>
        )}
      </div>
    </form>
  );
}
