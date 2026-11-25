import { cva } from "class-variance-authority";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../lib/cn";
import { CloseButton } from "../_internal/CloseButton";
import { useControllableState } from "../_internal/useControllableState";
import { useOverlay } from "../_internal/useOverlay";

/** Duração da transição dos painéis (CONTRATO: `duration-500`). */
const TRANSITION_MS = 500;

export type DrawerSide = "left" | "right" | "bottom";

export const drawerPanelVariants = cva(
  [
    "absolute flex flex-col rounded-none bg-surface text-content outline-none",
    "transition-transform duration-500 ease-zr",
  ],
  {
    variants: {
      side: {
        left: "inset-y-0 left-0 h-full w-full md:w-[400px]",
        right: "inset-y-0 right-0 h-full w-full md:w-[400px]",
        bottom: "inset-x-0 bottom-0 max-h-[85dvh] w-full",
      },
      shown: { true: "translate-x-0 translate-y-0", false: "" },
    },
    compoundVariants: [
      { side: "left", shown: false, class: "-translate-x-full" },
      { side: "right", shown: false, class: "translate-x-full" },
      { side: "bottom", shown: false, class: "translate-y-full" },
    ],
    defaultVariants: { side: "right", shown: false },
  },
);

export interface DrawerProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  /** Aberto (controlado). */
  open?: boolean;
  /** Aberto inicial (não controlado). */
  defaultOpen?: boolean;
  /** Pedido de abrir/fechar (Esc, backdrop, botão Fechar). */
  onOpenChange?: (open: boolean) => void;
  /** Lado de entrada. Padrão `right`. */
  side?: DrawerSide;
  /** Título (15px, maiúsculas). Rotula o diálogo. */
  title: ReactNode;
  /** Texto de apoio abaixo do título. */
  description?: ReactNode;
  /** Rodapé fixo (ex.: total + "Continuar"). */
  footer?: ReactNode;
  /** Fecha ao clicar no backdrop. Padrão `true`. */
  closeOnBackdrop?: boolean;
  /** Rótulo do botão Fechar. */
  closeLabel?: string;
  /** Elemento que recebe o foco ao abrir. Padrão: o painel. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Destino do portal. Padrão `document.body`. */
  container?: Element | null;
}

export function Drawer({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side = "right",
  title,
  description,
  footer,
  closeOnBackdrop = true,
  closeLabel = "Fechar",
  initialFocusRef,
  container,
  className,
  children,
  ...rest
}: DrawerProps) {
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  // `present` mantém o painel montado durante a saída; `shown` dispara a transição.
  const [present, setPresent] = useState(open);
  const [shown, setShown] = useState(false);
  if (open && !present) setPresent(true);

  useEffect(() => {
    if (open) {
      // Dois frames: garante que o estado inicial (fora da tela) foi pintado antes de transitar,
      // mesmo quando o React descarrega efeitos antes da pintura (eventos discretos).
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setShown(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }
    setShown(false);
    const timer = setTimeout(() => setPresent(false), TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [open]);

  const close = () => {
    if (open) setOpen(false);
  };

  useOverlay({ active: open && present, panelRef, onDismiss: close, initialFocusRef });

  if (!present || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-overlay" data-state={open ? "open" : "closed"}>
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 bg-overlay transition-opacity duration-500 ease-zr",
          shown ? "opacity-100" : "opacity-0",
        )}
        onClick={closeOnBackdrop ? close : undefined}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(drawerPanelVariants({ side, shown }), className)}
        {...rest}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 px-6 pt-6 pb-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-title-s font-light uppercase">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="pt-1 text-body font-light text-content-mid">
                {description}
              </p>
            )}
          </div>
          <CloseButton label={closeLabel} onClick={close} className="-mt-1" />
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 text-body font-light">
          {children}
        </div>
        {footer && (
          <footer className="flex shrink-0 flex-col gap-2 border-t border-line-subtle px-6 py-4">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    container ?? document.body,
  );
}
