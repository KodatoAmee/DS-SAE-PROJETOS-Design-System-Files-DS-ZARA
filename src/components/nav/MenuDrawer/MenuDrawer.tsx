/**
 * MenuDrawer — gaveta de navegação (frente Navegação).
 *
 * Usa a MESMA pilha de sobreposições e o MESMO contador de scroll de Modal e Drawer
 * (`src/lib/overlay`): só a sobreposição do topo reage a Escape/Tab, e o body só volta a
 * rolar quando a última fecha, em qualquer ordem de abertura. Escape com
 * `defaultPrevented` (ex.: SearchField limpando) é ignorado.
 */
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn, focusRing } from "../../../lib/cn";
import { Icon } from "../../icon";
import { useControllableState } from "../_internal/useControllableState";
import {
  isTopOverlay,
  lockScroll,
  popOverlay,
  pushOverlay,
  unlockScroll,
  type OverlayToken,
} from "../../../lib/overlay";
import { Tabs } from "../Tabs";

/** Mesma duração da classe `duration-500`. */
const TRANSITION_MS = 500;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface MenuDrawerLink {
  label: string;
  href: string;
}

export interface MenuDrawerSection {
  id: string;
  label: string;
  items: MenuDrawerLink[];
}

export interface MenuDrawerProps
  extends Omit<ComponentPropsWithoutRef<"div">, "title" | "children"> {
  /** Aberto (controlado). */
  open?: boolean;
  /** Aberto inicialmente (não controlado). */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  sections: MenuDrawerSection[];
  /** Seção inicial. Padrão: a primeira. */
  defaultSection?: string;
  /** Nome acessível do diálogo. Padrão: "Menu". */
  title?: string;
  /** Padrão: "Fechar". */
  closeLabel?: string;
  /** Rodapé da gaveta (ex.: links de conta, país). */
  footer?: ReactNode;
  /** Chamado ao clicar num link. */
  onNavigate?: (link: MenuDrawerLink, section: MenuDrawerSection) => void;
  /** Fecha a gaveta ao clicar num link. Padrão: `true`. */
  closeOnNavigate?: boolean;
}

export function MenuDrawer({
  open,
  defaultOpen = false,
  onOpenChange,
  sections,
  defaultSection,
  title = "Menu",
  closeLabel = "Fechar",
  footer,
  onNavigate,
  closeOnNavigate = true,
  className,
  ...rest
}: MenuDrawerProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  // Monta, anima a entrada (2 frames) e desmonta após a saída.
  useEffect(() => {
    if (isOpen) {
      const active = typeof document !== "undefined" ? document.activeElement : null;
      if (active instanceof HTMLElement && !panelRef.current?.contains(active)) {
        returnFocusRef.current = active;
      }
      setMounted(true);
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }
    setVisible(false);
    const previous = returnFocusRef.current;
    returnFocusRef.current = null;
    if (previous?.isConnected) previous.focus();
    const timer = window.setTimeout(() => setMounted(false), TRANSITION_MS);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  // Foco inicial no botão Fechar.
  useEffect(() => {
    if (mounted && isOpen) closeRef.current?.focus();
  }, [mounted, isOpen]);

  // Entra na pilha compartilhada e bloqueia o scroll do body enquanto aberto.
  const tokenRef = useRef<OverlayToken | null>(null);
  useEffect(() => {
    if (!isOpen) return;
    const token = pushOverlay();
    tokenRef.current = token;
    lockScroll();
    return () => {
      popOverlay(token);
      unlockScroll();
      tokenRef.current = null;
    };
  }, [isOpen]);

  // Esc fecha; Tab fica preso no painel. Só quando este painel é o do topo.
  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) return;
      if (!tokenRef.current || !isTopOverlay(tokenRef.current)) return;
      const panel = panelRef.current;
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      if (!panel) return;
      const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.closest("[hidden]"),
      );
      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (!panel.contains(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, setOpen]);

  if (!mounted || typeof document === "undefined") return null;

  const renderLinks = (section: MenuDrawerSection) => (
    <ul className="flex flex-col">
      {section.items.map((link) => (
        <li key={`${link.label}-${link.href}`}>
          <a
            href={link.href}
            onClick={() => {
              onNavigate?.(link, section);
              if (closeOnNavigate) setOpen(false);
            }}
            className={cn(
              "inline-flex min-h-8 items-center text-action font-light uppercase",
              "underline-offset-4 decoration-1 hover:underline",
              focusRing,
            )}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return createPortal(
    <>
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-overlay bg-overlay transition-opacity duration-500 ease-zr",
          visible ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "fixed inset-y-0 left-0 z-overlay flex w-full flex-col overflow-y-auto bg-base text-content",
          "transition-transform duration-500 ease-zr md:w-1/2 lg:w-1/3",
          visible ? "translate-x-0" : "-translate-x-full",
          className,
        )}
        {...rest}
      >
        {/* Mesma geometria do Header: o X cai onde estava o hambúrguer. */}
        <div className="flex h-12 shrink-0 items-center pl-5 pr-3 md:h-16 md:pl-0">
          <div className="-ml-2.5 flex md:ml-0 md:w-20 md:justify-center">
            <button
              ref={closeRef}
              type="button"
              aria-label={closeLabel}
              onClick={() => setOpen(false)}
              className={cn(
                "inline-flex size-10 items-center justify-center transition-opacity duration-200 ease-zr hover:opacity-60",
                focusRing,
              )}
            >
              <Icon name="close" />
            </button>
          </div>
          <h2 id={titleId} className="sr-only">
            {title}
          </h2>
        </div>

        <div className="flex-1 px-5 pb-10 pt-4 md:pl-20 md:pr-10">
          {sections.length === 1 ? (
            renderLinks(sections[0])
          ) : (
            <Tabs
              orientation="vertical"
              label={title}
              defaultValue={defaultSection}
              items={sections.map((section) => ({
                id: section.id,
                label: section.label,
                content: renderLinks(section),
              }))}
            />
          )}
        </div>

        {footer && (
          <div className="shrink-0 border-t border-line-subtle px-5 py-6 md:px-20">{footer}</div>
        )}
      </div>
    </>,
    document.body,
  );
}
