import { cva } from "class-variance-authority";
import {
  useId,
  useRef,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { cn, focusRing } from "../../../lib/cn";
import { useControllableState } from "../_internal/useControllableState";

export const tabVariants = cva(
  [
    "inline-flex min-h-6 items-center text-left text-action font-light uppercase whitespace-nowrap",
    "underline-offset-4 decoration-1",
    "disabled:pointer-events-none disabled:text-content-disabled",
    focusRing,
  ],
  {
    variants: {
      selected: {
        /** Selecionado: peso 500 + sublinhado 1px. */
        true: "font-medium underline",
        false: "hover:underline",
      },
      orientation: {
        horizontal: "py-2",
        vertical: "py-1",
      },
    },
    defaultVariants: { selected: false, orientation: "horizontal" },
  },
);

export interface TabsItem {
  /** Identificador estável; é o `value` da aba. */
  id: string;
  label: ReactNode;
  /** Conteúdo do painel. Sem ele, as abas funcionam só como seletor. */
  content?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps
  extends Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "children" | "onChange"> {
  ref?: Ref<HTMLDivElement>;
  items: TabsItem[];
  /** Aba selecionada (controlado). */
  value?: string;
  /** Aba inicial (não controlado). Padrão: primeira habilitada. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  /** `automatic`: setas já selecionam. `manual`: setas só movem o foco; Enter/Espaço selecionam. */
  activation?: "automatic" | "manual";
  /** Nome acessível da lista de abas. */
  label?: string;
  listClassName?: string;
  panelClassName?: string;
}

export function Tabs({
  ref,
  items,
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  activation = "automatic",
  label,
  className,
  listClassName,
  panelClassName,
  ...rest
}: TabsProps) {
  const baseId = useId();
  const firstEnabled = items.find((item) => !item.disabled)?.id ?? "";
  const [selected, setSelected] = useControllableState({
    value,
    defaultValue: defaultValue ?? firstEnabled,
    onChange: onValueChange,
  });
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());

  const tabId = (index: number) => `${baseId}-tab-${index}`;
  const panelId = (index: number) => `${baseId}-panel-${index}`;
  const vertical = orientation === "vertical";

  // Roving tabindex: se o valor não existir, a primeira aba habilitada recebe o foco.
  const focusableId = items.some((item) => item.id === selected && !item.disabled)
    ? selected
    : firstEnabled;

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const enabled = items.filter((item) => !item.disabled);
    if (enabled.length === 0) return;
    const currentId = (event.target as HTMLElement).dataset.tabId;
    const index = enabled.findIndex((item) => item.id === currentId);
    if (index === -1) return;

    const prevKey = vertical ? "ArrowUp" : "ArrowLeft";
    const nextKey = vertical ? "ArrowDown" : "ArrowRight";
    let nextIndex: number | null = null;

    switch (event.key) {
      case prevKey:
        nextIndex = (index - 1 + enabled.length) % enabled.length;
        break;
      case nextKey:
        nextIndex = (index + 1) % enabled.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = enabled.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const next = enabled[nextIndex];
    tabRefs.current.get(next.id)?.focus();
    if (activation === "automatic") setSelected(next.id);
  }

  return (
    <div
      ref={ref}
      className={cn(vertical ? "flex items-start gap-8" : "flex flex-col gap-6", className)}
      {...rest}
    >
      <div
        role="tablist"
        aria-label={label}
        aria-orientation={orientation}
        onKeyDown={handleKeyDown}
        className={cn(
          // Horizontal: `-m-1 p-1` dá respiro ao anel de foco (outline 1 + offset 2)
          // que o `overflow-x-auto` recortaria, sem mudar o alinhamento visual.
          vertical ? "flex shrink-0 flex-col items-start gap-1" : "-m-1 flex gap-6 overflow-x-auto p-1",
          listClassName,
        )}
      >
        {items.map((item, index) => {
          const isSelected = item.id === selected;
          return (
            <button
              key={item.id}
              ref={(node) => {
                if (node) tabRefs.current.set(item.id, node);
                else tabRefs.current.delete(item.id);
              }}
              type="button"
              role="tab"
              id={tabId(index)}
              data-tab-id={item.id}
              aria-selected={isSelected}
              aria-controls={item.content !== undefined ? panelId(index) : undefined}
              tabIndex={item.id === focusableId ? 0 : -1}
              disabled={item.disabled}
              onClick={() => setSelected(item.id)}
              className={tabVariants({ selected: isSelected, orientation })}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item, index) =>
        item.content === undefined ? null : (
          <div
            key={item.id}
            role="tabpanel"
            id={panelId(index)}
            aria-labelledby={tabId(index)}
            tabIndex={0}
            hidden={item.id !== selected}
            className={cn("min-w-0 flex-1", focusRing, panelClassName)}
          >
            {item.content}
          </div>
        ),
      )}
    </div>
  );
}
