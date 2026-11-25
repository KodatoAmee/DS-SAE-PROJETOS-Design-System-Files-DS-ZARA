import { useCallback, useRef, useState } from "react";

/**
 * Estado controlado (`value` definido) ou não controlado (`defaultValue`).
 * Interno da frente Conteúdo: não exportado no barril.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
) {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? (value as T) : inner;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const set = useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChangeRef.current?.(next);
    },
    [controlled],
  );

  return [current, set] as const;
}
