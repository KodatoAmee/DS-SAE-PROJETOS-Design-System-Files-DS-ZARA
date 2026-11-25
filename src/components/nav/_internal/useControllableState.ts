import { useCallback, useRef, useState } from "react";

interface ControllableStateOptions<T> {
  /** Valor controlado. `undefined` = componente não controlado. */
  value?: T;
  /** Valor inicial quando não controlado. */
  defaultValue: T;
  /** Chamado a cada mudança, controlado ou não. */
  onChange?: (value: T) => void;
}

/**
 * Estado controlado/não controlado no mesmo componente.
 * Só dispara `onChange` quando o valor muda de fato.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: ControllableStateOptions<T>) {
  const [inner, setInner] = useState<T>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? (value as T) : inner;

  const currentRef = useRef(current);
  currentRef.current = current;

  const setValue = useCallback(
    (next: T) => {
      if (Object.is(next, currentRef.current)) return;
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );

  return [current, setValue] as const;
}
