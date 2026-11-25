import {
  createContext,
  useContext,
  useId,
  useRef,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { cn, focusRing } from "../../../lib/cn";
import { Icon } from "../../icon";
import { useControllableState } from "../_internal/useControllableState";

type HeadingLevel = 2 | 3 | 4 | 5 | 6;

const headingTags = { 2: "h2", 3: "h3", 4: "h4", 5: "h5", 6: "h6" } as const;

interface AccordionContextValue {
  value: string[];
  toggle: (item: string) => void;
  headingLevel: HeadingLevel;
  divided: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionItem precisa estar dentro de <Accordion>.");
  return ctx;
}

export interface AccordionProps
  extends Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange"> {
  ref?: Ref<HTMLDivElement>;
  /** `single`: abre um item de cada vez. `multiple`: vários abertos. Padrão `single`. */
  type?: "single" | "multiple";
  /** Itens abertos (controlado). Em `single`, no máximo um valor. */
  value?: string[];
  /** Itens abertos inicialmente (não controlado). */
  defaultValue?: string[];
  /** Mudança de itens abertos. */
  onValueChange?: (value: string[]) => void;
  /** Nível do título de cada cabeçalho. Padrão 3. */
  headingLevel?: HeadingLevel;
  /** Linha de 1px entre itens. Padrão `true`. */
  divided?: boolean;
}

export function Accordion({
  type = "single",
  value: valueProp,
  defaultValue = [],
  onValueChange,
  headingLevel = 3,
  divided = true,
  className,
  children,
  onKeyDown,
  ...rest
}: AccordionProps) {
  const [value, setValue] = useControllableState(valueProp, defaultValue, onValueChange);
  const rootRef = useRef<HTMLDivElement>(null);

  const toggle = (item: string) => {
    const isOpen = value.includes(item);
    if (type === "single") setValue(isOpen ? [] : [item]);
    else setValue(isOpen ? value.filter((v) => v !== item) : [...value, item]);
  };

  // Navegação opcional do padrão WAI-ARIA: ↑/↓ entre cabeçalhos, Home/End.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !rootRef.current) return;
    const triggers = Array.from(
      rootRef.current.querySelectorAll<HTMLButtonElement>("[data-accordion-trigger]:not([disabled])"),
    ).filter((el) => el.closest("[data-accordion-root]") === rootRef.current);
    const index = triggers.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    const targets: Record<string, number> = {
      ArrowDown: (index + 1) % triggers.length,
      ArrowUp: (index - 1 + triggers.length) % triggers.length,
      Home: 0,
      End: triggers.length - 1,
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    triggers[target].focus();
  };

  return (
    <AccordionContext.Provider value={{ value, toggle, headingLevel, divided }}>
      <div
        ref={rootRef}
        data-accordion-root=""
        className={cn("flex flex-col text-content", divided && "border-t border-line-subtle", className)}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  /** Identificador único dentro do Accordion. */
  value: string;
  /** Texto do cabeçalho (13px, maiúsculas). */
  title: ReactNode;
  /** Impede abrir/fechar. */
  disabled?: boolean;
  children?: ReactNode;
}

export function AccordionItem({
  value,
  title,
  disabled = false,
  className,
  children,
  ...rest
}: AccordionItemProps) {
  const { value: openValues, toggle, headingLevel, divided } = useAccordion();
  const open = openValues.includes(value);
  const id = useId();
  const triggerId = `${id}-trigger`;
  const panelId = `${id}-panel`;
  const Heading = headingTags[headingLevel];

  return (
    <div
      data-state={open ? "open" : "closed"}
      className={cn(divided && "border-b border-line-subtle", className)}
      {...rest}
    >
      <Heading className="m-0">
        <button
          type="button"
          id={triggerId}
          data-accordion-trigger=""
          aria-expanded={open}
          aria-controls={panelId}
          disabled={disabled}
          onClick={() => toggle(value)}
          className={cn(
            "flex min-h-11 w-full items-center justify-between gap-4 py-3 text-left",
            "text-action font-light uppercase",
            "transition-opacity duration-200 ease-zr hover:opacity-60",
            "disabled:text-content-disabled disabled:hover:opacity-100",
            focusRing,
          )}
        >
          <span className="min-w-0">{title}</span>
          <Icon name={open ? "minus" : "plus"} size={16} />
        </button>
      </Heading>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!open}
        className="pb-4 text-body font-light"
      >
        {children}
      </div>
    </div>
  );
}
