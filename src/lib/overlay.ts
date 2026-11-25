import { useEffect, useRef, type RefObject } from "react";

/**
 * Comportamento comum de Modal e Drawer: foco preso, Escape fecha, foco devolvido
 * ao gatilho e scroll do body bloqueado. Suporta sobreposições empilhadas: só a do
 * topo reage ao teclado. Compartilhado por todas as frentes (Modal, Drawer, MenuDrawer).
 *
 * API importável (`src/lib/overlay`) para todas as frentes
 * reaproveitarem a MESMA pilha e o MESMO contador de scroll (ex.: MenuDrawer). Use sempre
 * estas funções em vez de uma pilha própria; senão duas sobreposições abertas ao mesmo
 * tempo brigam pelo Escape e pelo `overflow` do body.
 *
 * - `useOverlay(options)`: o pacote completo (pilha + scroll + foco inicial + Tab preso +
 *   Escape + devolução do foco). Preferir este.
 * - `pushOverlay(): OverlayToken` / `popOverlay(token)`: entra/sai da pilha. Idempotente no pop.
 * - `isTopOverlay(token)`: `true` se `token` é a sobreposição do topo (só ela deve tratar teclado).
 * - `getOverlayDepth()`: quantas sobreposições estão abertas.
 * - `lockScroll()` / `unlockScroll()`: contador de referência do bloqueio de scroll do body
 *   (com compensação da barra de rolagem). Cada `lockScroll` precisa de exatamente um `unlockScroll`.
 * - `getFocusable(root)` / `FOCUSABLE_SELECTOR`: elementos focáveis e visíveis dentro de `root`.
 *
 * Escape: o listener fica no `document` em fase de BOLHA e ignora eventos com
 * `defaultPrevented`. Handlers React (delegados no contêiner da raiz ou do portal, abaixo do
 * `document`) e listeners nativos em elementos rodam antes; assim um campo (ex.: SearchField)
 * que faz `preventDefault()` no Escape para se limpar não fecha a sobreposição junto.
 */

export const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "audio[controls]",
  "video[controls]",
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.getAttribute("aria-hidden") !== "true" && el.getClientRects().length > 0,
  );
}

/* ---------------------------------------------------------------- Pilha de sobreposições */

/** Identidade opaca de uma sobreposição na pilha. */
export type OverlayToken = object;

const stack: OverlayToken[] = [];

/** Empilha uma sobreposição nova (fica no topo) e devolve o token dela. */
export function pushOverlay(): OverlayToken {
  const token: OverlayToken = {};
  stack.push(token);
  return token;
}

/** Remove a sobreposição da pilha (em qualquer posição). Chamar duas vezes não faz mal. */
export function popOverlay(token: OverlayToken) {
  const index = stack.indexOf(token);
  if (index >= 0) stack.splice(index, 1);
}

/** `true` se `token` é a sobreposição do topo: só ela deve reagir ao teclado. */
export function isTopOverlay(token: OverlayToken) {
  return stack[stack.length - 1] === token;
}

/** Quantas sobreposições estão abertas. */
export function getOverlayDepth() {
  return stack.length;
}

/* ---------------------------------------------------------------- Bloqueio de scroll */

let lockCount = 0;
let previousOverflow = "";
let previousPaddingRight = "";

/** Bloqueia o scroll do body (contador de referência: só o primeiro bloqueio aplica). */
export function lockScroll() {
  if (lockCount++ > 0) return;
  const { body, documentElement } = document;
  const scrollbar = window.innerWidth - documentElement.clientWidth;
  previousOverflow = body.style.overflow;
  previousPaddingRight = body.style.paddingRight;
  body.style.overflow = "hidden";
  // Compensa a barra de rolagem que some, para o layout não saltar.
  if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
}

/** Libera um bloqueio; o scroll só volta quando o último for liberado. */
export function unlockScroll() {
  if (--lockCount > 0) return;
  lockCount = 0;
  document.body.style.overflow = previousOverflow;
  document.body.style.paddingRight = previousPaddingRight;
}

export interface UseOverlayOptions {
  /** Sobreposição aberta e montada. */
  active: boolean;
  /** Painel com `role="dialog"`. Recebe o foco inicial se nada for indicado. */
  panelRef: RefObject<HTMLElement | null>;
  /** Pedido de fecho (Escape). */
  onDismiss: () => void;
  /** Elemento que recebe o foco ao abrir. Padrão: o próprio painel. */
  initialFocusRef?: RefObject<HTMLElement | null>;
}

export function useOverlay({ active, panelRef, onDismiss, initialFocusRef }: UseOverlayOptions) {
  const dismissRef = useRef(onDismiss);
  useEffect(() => {
    dismissRef.current = onDismiss;
  });

  useEffect(() => {
    if (!active) return;
    const panel = panelRef.current;
    if (!panel) return;

    const token = pushOverlay();
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    lockScroll();
    (initialFocusRef?.current ?? panel).focus({ preventScroll: true });

    function onKeyDown(event: KeyboardEvent) {
      if (!isTopOverlay(token) || !panel) return;
      // Um componente interno já tratou a tecla (ex.: SearchField limpa com Escape).
      if (event.defaultPrevented) return;

      if (event.key === "Escape") {
        event.preventDefault();
        dismissRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const items = getFocusable(panel);
      const current = document.activeElement;
      if (items.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const outside = !panel.contains(current);

      if (event.shiftKey && (current === first || current === panel || outside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || outside)) {
        event.preventDefault();
        first.focus();
      }
    }

    // Fase de bolha (sem `capture`), de propósito: ver o comentário do topo.
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      popOverlay(token);
      unlockScroll();
      if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
    };
  }, [active, panelRef, initialFocusRef]);
}
