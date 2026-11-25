import { cva } from "class-variance-authority";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../lib/cn";
import { Icon } from "../../icon";
import { getFocusable } from "../_internal/useOverlay";

export type ToastTone = "default" | "error";

/** Anel de foco sobre fundo invertido (mesma forma do `focusRing`, cor oposta). */
const inverseFocusRing =
  "outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-on-inverse";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

/* ---------------------------------------------------------------- Toast (apresentação) */

export interface ToastProps extends ComponentPropsWithoutRef<"div"> {
  ref?: Ref<HTMLDivElement>;
  /**
   * `error` usa ícone de informação e, no Toast avulso, `role="alert"` (anúncio imediato);
   * `default` usa `role="status"`.
   */
  tone?: ToastTone;
  /**
   * Põe `role`/`aria-atomic` no próprio Toast. Padrão `true` (uso avulso).
   * Passe `false` quando ele for renderizado dentro de uma região viva já montada
   * (o `ToastProvider` faz isso): uma região viva criada já com conteúdo não é anunciada
   * de forma confiável (WCAG 4.1.3).
   */
  announce?: boolean;
  /** Ação curta à direita (ex.: "Desfazer", "Ver cesto"). */
  action?: ToastAction;
  /** Mostra o botão Fechar. */
  onClose?: () => void;
  /** Rótulo do botão Fechar. */
  closeLabel?: string;
}

export function Toast({
  tone = "default",
  announce = true,
  action,
  onClose,
  closeLabel = "Fechar",
  className,
  children,
  ...rest
}: ToastProps) {
  return (
    <div
      role={announce ? (tone === "error" ? "alert" : "status") : undefined}
      aria-atomic={announce ? "true" : undefined}
      className={cn(
        "pointer-events-auto flex min-h-11 w-full items-center gap-4 rounded-none bg-inverse px-4 py-3",
        "text-label font-light text-on-inverse animate-zr-slide-up",
        className,
      )}
      {...rest}
    >
      {tone === "error" && <Icon name="info" size={16} />}
      <div className="min-w-0 flex-1">{children}</div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={cn(
            "shrink-0 text-label font-light uppercase underline underline-offset-4",
            "transition-opacity duration-200 ease-zr hover:opacity-70",
            inverseFocusRing,
          )}
        >
          {action.label}
        </button>
      )}
      {onClose && (
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className={cn(
            "-mr-2 inline-flex size-8 shrink-0 items-center justify-center",
            "transition-opacity duration-200 ease-zr hover:opacity-70",
            inverseFocusRing,
            "focus-visible:outline-offset-0",
          )}
        >
          <Icon name="close" size={16} />
        </button>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Provider + hook */

export interface ToastOptions {
  /** Texto curto da mensagem. */
  message: ReactNode;
  tone?: ToastTone;
  action?: ToastAction;
  /**
   * Milissegundos até fechar. Sem `action`, padrão = `duration` do provider (4000).
   * Com `action`, padrão `Infinity` (WCAG 2.2.1): só fecha pela ação, por Fechar ou por
   * Escape com o foco nele. `Infinity` mantém aberto.
   */
  duration?: number;
}

interface ToastRecord extends ToastOptions {
  id: number;
}

export interface ToastApi {
  /** Mostra uma mensagem. Devolve o id para fechar antes do tempo. */
  toast: (options: ToastOptions | string) => number;
  /** Fecha uma mensagem (ou todas, sem id). */
  dismiss: (id?: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast precisa estar dentro de <ToastProvider>.");
  return ctx;
}

export const toastViewportVariants = cva(
  "pointer-events-none fixed bottom-4 z-toast flex w-[calc(100%-32px)] flex-col gap-2 md:w-[400px]",
  {
    variants: {
      position: {
        "bottom-left": "left-4",
        "bottom-center": "left-1/2 -translate-x-1/2",
        "bottom-right": "right-4",
      },
    },
    defaultVariants: { position: "bottom-left" },
  },
);

export interface ToastProviderProps {
  children?: ReactNode;
  /** Canto da tela. Padrão `bottom-left`. */
  position?: "bottom-left" | "bottom-center" | "bottom-right";
  /** Duração padrão em ms das mensagens sem ação. Padrão 4000. */
  duration?: number;
  /** Máximo de mensagens visíveis; as mais antigas saem. Padrão 3. */
  max?: number;
  /** Rótulo da região de notificações. */
  label?: string;
  /** Destino do portal. Padrão `document.body`. */
  container?: Element | null;
}

function ToastItem({
  record,
  defaultDuration,
  onDismiss,
  onDismissFromInside,
}: {
  record: ToastRecord;
  defaultDuration: number;
  /** Fecho automático (tempo esgotado): não mexe no foco. */
  onDismiss: (id: number) => void;
  /** Fecho pelo usuário (ação, Fechar, Escape): devolve o foco antes de remover. */
  onDismissFromInside: (id: number, item: HTMLElement | null) => void;
}) {
  // Com ação, não fecha sozinho: o usuário precisa de tempo para "Desfazer" (WCAG 2.2.1).
  const duration = record.duration ?? (record.action ? Infinity : defaultDuration);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const itemRef = useRef<HTMLLIElement>(null);

  const start = useCallback(() => {
    clearTimeout(timer.current);
    if (Number.isFinite(duration)) timer.current = setTimeout(() => onDismiss(record.id), duration);
  }, [duration, onDismiss, record.id]);
  const pause = () => clearTimeout(timer.current);

  useEffect(() => {
    start();
    return () => clearTimeout(timer.current);
  }, [start]);

  const close = () => onDismissFromInside(record.id, itemRef.current);

  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
    if (event.key !== "Escape" || event.defaultPrevented) return;
    // preventDefault: um overlay aberto (useOverlay) ignora este Escape.
    event.preventDefault();
    close();
  };

  return (
    <li
      ref={itemRef}
      data-toast-item=""
      // Pausa enquanto o usuário lê ou interage (WCAG 2.2.1).
      onMouseEnter={pause}
      onMouseLeave={start}
      onFocus={pause}
      onBlur={start}
      onKeyDown={handleKeyDown}
    >
      <Toast
        tone={record.tone}
        // A região viva fixa do provider faz o anúncio.
        announce={false}
        action={
          record.action && {
            label: record.action.label,
            onClick: () => {
              record.action?.onClick();
              close();
            },
          }
        }
        onClose={close}
      >
        {record.message}
      </Toast>
    </li>
  );
}

export function ToastProvider({
  children,
  position,
  duration = 4000,
  max = 3,
  label = "Notificações",
  container,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextId = useRef(1);
  // `mounted`: o portal só existe no cliente. `ready`: as regiões vivas já estão no DOM,
  // vazias, há pelo menos um commit; só então recebem mensagens. Assim um `toast()` disparado
  // no primeiro efeito de um filho não cria a região já com conteúdo (que não seria anunciado).
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted) setReady(true);
  }, [mounted]);

  const regionRef = useRef<HTMLElement>(null);
  /** Elemento focado antes de o foco entrar na região (para onde ele volta). */
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const dismiss = useCallback((id?: number) => {
    setToasts((list) => (id === undefined ? [] : list.filter((t) => t.id !== id)));
  }, []);

  const dismissFromInside = useCallback(
    (id: number, item: HTMLElement | null) => {
      // Se o foco está dentro do toast que vai sair, move-o antes: senão cai no <body>.
      if (item && item.contains(document.activeElement)) {
        const items = Array.from(regionRef.current?.querySelectorAll<HTMLElement>("[data-toast-item]") ?? []);
        const index = items.indexOf(item);
        const sibling = items[index + 1] ?? items[index - 1];
        const back = returnFocusRef.current;
        const target =
          (sibling && getFocusable(sibling)[0]) || (back?.isConnected ? back : null) || document.body;
        target.focus({ preventScroll: true });
      }
      dismiss(id);
    },
    [dismiss],
  );

  const handleRegionFocus = (event: FocusEvent<HTMLElement>) => {
    const from = event.relatedTarget;
    if (from instanceof Node && event.currentTarget.contains(from)) return; // foco movendo-se lá dentro
    returnFocusRef.current = from instanceof HTMLElement ? from : null;
  };

  const toast = useCallback(
    (options: ToastOptions | string) => {
      const id = nextId.current++;
      const record: ToastRecord = typeof options === "string" ? { id, message: options } : { id, ...options };
      setToasts((list) => [...list, record].slice(-max));
      return id;
    },
    [max],
  );

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  const visible = ready ? toasts : [];
  const errors = visible.filter((t) => t.tone === "error");
  const normals = visible.filter((t) => t.tone !== "error");
  const renderItem = (t: ToastRecord) => (
    <ToastItem
      key={t.id}
      record={t}
      defaultDuration={duration}
      onDismiss={dismiss}
      onDismissFromInside={dismissFromInside}
    />
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {mounted &&
        createPortal(
          <section
            ref={regionRef}
            aria-label={label}
            className={cn(toastViewportVariants({ position }))}
            onFocus={handleRegionFocus}
          >
            {/* Regiões vivas fixas: sempre montadas (nunca `hidden`/`display:none`), mesmo vazias. */}
            <div role="alert" aria-live="assertive" aria-atomic="false">
              <ol className="flex list-none flex-col gap-2 p-0">{errors.map(renderItem)}</ol>
            </div>
            <div
              role="status"
              aria-live="polite"
              aria-atomic="false"
              className={cn(errors.length > 0 && normals.length > 0 && "mt-2")}
            >
              <ol className="flex list-none flex-col gap-2 p-0">{normals.map(renderItem)}</ol>
            </div>
          </section>,
          container ?? document.body,
        )}
    </ToastContext.Provider>
  );
}
