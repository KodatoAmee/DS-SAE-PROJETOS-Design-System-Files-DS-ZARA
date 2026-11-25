import { cva } from "class-variance-authority";
import {
  useId,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../lib/cn";
import { CloseButton } from "../_internal/CloseButton";
import { useControllableState } from "../_internal/useControllableState";
import { useOverlay } from "../_internal/useOverlay";

export const modalPanelVariants = cva(
  [
    "relative flex max-h-[calc(100dvh-32px)] w-full flex-col rounded-none bg-surface text-content",
    "outline-none animate-zr-fade-in",
  ],
  {
    variants: {
      size: {
        s: "max-w-[400px]",
        m: "max-w-[560px]",
        l: "max-w-[800px]",
      },
    },
    defaultVariants: { size: "m" },
  },
);

export interface ModalProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  /** Aberto (controlado). */
  open?: boolean;
  /** Aberto inicial (não controlado). */
  defaultOpen?: boolean;
  /** Pedido de abrir/fechar (Esc, backdrop, botão Fechar). */
  onOpenChange?: (open: boolean) => void;
  /** Título (15px, maiúsculas). Rotula o diálogo. */
  title: ReactNode;
  /** Texto de apoio abaixo do título. Descreve o diálogo. */
  description?: ReactNode;
  /** Ações no rodapé (ex.: Buttons). */
  footer?: ReactNode;
  /** Largura máxima: 400, 560 (padrão) ou 800px. */
  size?: "s" | "m" | "l";
  /** Fecha ao clicar no backdrop. Padrão `true`. */
  closeOnBackdrop?: boolean;
  /** Esconde o botão Fechar (o diálogo continua a fechar com Esc). */
  hideClose?: boolean;
  /** Rótulo do botão Fechar. */
  closeLabel?: string;
  /** Elemento que recebe o foco ao abrir. Padrão: o painel. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Destino do portal. Padrão `document.body`. */
  container?: Element | null;
}

export function Modal({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
  footer,
  size,
  closeOnBackdrop = true,
  hideClose = false,
  closeLabel = "Fechar",
  initialFocusRef,
  container,
  className,
  children,
  ...rest
}: ModalProps) {
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const close = () => setOpen(false);

  useOverlay({ active: open, panelRef, onDismiss: close, initialFocusRef });

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-overlay flex items-center justify-center p-4">
      <div
        aria-hidden
        className="absolute inset-0 bg-overlay animate-zr-fade-in"
        onClick={closeOnBackdrop ? close : undefined}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(modalPanelVariants({ size }), className)}
        {...rest}
      >
        <header className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
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
          {!hideClose && <CloseButton label={closeLabel} onClick={close} className="-mt-1" />}
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 text-body font-light">
          {children}
        </div>
        {footer && (
          <footer className="flex flex-col-reverse gap-2 px-6 pb-6 md:flex-row md:justify-end">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    container ?? document.body,
  );
}
