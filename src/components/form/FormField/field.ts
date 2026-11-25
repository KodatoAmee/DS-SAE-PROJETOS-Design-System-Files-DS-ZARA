/*
 * Utilitários internos da frente Formulário. Não exportados pelo barril da frente
 * (evita colisão de nomes com outras frentes em src/index.ts).
 */
import { useCallback, useState, type Ref, type RefCallback } from "react";

/** Junta ids para `aria-describedby`, ignorando vazios. */
export function joinIds(...ids: unknown[]): string | undefined {
  const out = ids.filter((id): id is string => typeof id === "string" && id !== "").join(" ");
  return out || undefined;
}

/** Atribui o mesmo nó a vários refs (React 19: ref como prop). */
export function useMergedRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return useCallback((node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else ref.current = node;
    }
  }, refs);
}

/** Estado controlado **e** não controlado no mesmo componente. */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): [T, (next: T) => void] {
  const [inner, setInner] = useState<T>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const set = useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [current, set];
}

/* ---------- Classes compartilhadas dos campos de linha inferior ---------- */

/** Contêiner de 40px com só a linha inferior. */
export const fieldLine =
  "relative flex w-full items-end border-b transition-[border-color] duration-200 ease-zr";

/**
 * Indicador de foco no estado de erro (WCAG 2.4.7). A linha já está vermelha, então
 * a troca de cor de `focus-within:border-line` não serve: em foco, uma segunda linha
 * de 1px colada por dentro da borda engrossa a linha inferior para 2px, sem mudar a
 * altura do campo nem deslocar o conteúdo. Depende do `relative` de `fieldLine`.
 */
const errorFocusLine = [
  "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-danger",
  "after:opacity-0 after:transition-opacity after:duration-200 after:ease-zr",
  "focus-within:after:opacity-100",
].join(" ");

export function fieldLineState({ error, disabled }: { error?: boolean; disabled?: boolean }) {
  if (disabled) return "border-content-disabled";
  if (error) return `border-danger ${errorFocusLine}`;
  return "border-line-field focus-within:border-line";
}

/** Controle nativo (input/textarea/select): rótulo dentro da área, padding 18px 0 2px. */
export const fieldControl = [
  "peer w-full min-w-0 flex-1 rounded-none border-0 bg-transparent",
  "pt-4.5 pb-0.5 text-body font-light text-content",
  "outline-none placeholder:text-content-low",
  "disabled:cursor-not-allowed disabled:text-content-disabled",
].join(" ");

/**
 * Esconde o placeholder enquanto o rótulo está em repouso (vazio e sem foco):
 * os dois ocupariam a mesma linha.
 */
export const fieldControlWithFloatingLabel =
  "placeholder:text-transparent focus:placeholder:text-content-low";

/** Rótulo flutuante: topo quando há valor ou foco; na linha do texto quando vazio. */
export const floatingLabel = [
  "pointer-events-none absolute left-0 top-0 truncate",
  "text-label font-light uppercase text-content-low",
  "transition-[top] duration-200 ease-zr",
].join(" ");

/** Classe que baixa o rótulo para a linha do texto quando o controle está vazio e sem foco. */
export const floatingLabelRest = "peer-[:placeholder-shown:not(:focus)]:top-5";

/** Rótulo estático (acima do controle): grupos, seletores. */
export const staticLabel = "block text-label font-light uppercase text-content-low";

export const helperTextClass = "text-label-s font-light text-content-mid";
export const errorTextClass = "text-label-s font-light text-danger-text";
