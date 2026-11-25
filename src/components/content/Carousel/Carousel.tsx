import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { cn, focusRing } from "../../../lib/cn";
import { Icon, type IconName } from "../../icon";

/** Botão de ícone 32x32 do carrossel. Simples e local: a frente Ações tem o IconButton completo. */
function CarouselButton({
  icon,
  label,
  disabled,
  onClick,
}: {
  icon: IconName;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      // `aria-disabled` em vez de `disabled`: o foco não se perde ao chegar ao fim.
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-none text-content",
        "transition-opacity duration-200 ease-zr hover:opacity-60",
        "aria-disabled:cursor-default aria-disabled:text-content-disabled aria-disabled:hover:opacity-100",
        focusRing,
      )}
    >
      <Icon name={icon} size={20} />
    </button>
  );
}

const itemSizes = {
  /** 216px: medido na referência. */
  default: "w-[216px]",
  /** Um item por vez, largura total. */
  full: "w-full",
} as const;

export interface CarouselProps extends Omit<ComponentPropsWithoutRef<"section">, "children"> {
  ref?: Ref<HTMLElement>;
  /** Nome acessível do carrossel (obrigatório), ex.: "Novidades". */
  label: string;
  /** Título visível opcional, à esquerda dos controles. */
  heading?: ReactNode;
  /** Largura de cada item. Padrão 216px. */
  itemSize?: keyof typeof itemSizes;
  /** Classes extra em cada item. */
  itemClassName?: string;
  /** Mostra Anterior/Próximo e o indicador "1 / N". Padrão `true`. */
  showControls?: boolean;
  /** Rótulos dos botões. */
  previousLabel?: string;
  nextLabel?: string;
  /** Slides. Cada filho vira um item com `role="group"`. */
  children?: ReactNode;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Carousel({
  label,
  heading,
  itemSize = "default",
  itemClassName,
  showControls = true,
  previousLabel = "Anterior",
  nextLabel = "Próximo",
  className,
  children,
  onKeyDown,
  ...rest
}: CarouselProps) {
  const slides = Children.toArray(children);
  const total = slides.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [pos, setPos] = useState({ index: 0, atStart: true, atEnd: total <= 1 });

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const items = Array.from(track.children) as HTMLElement[];
    const left = track.scrollLeft;
    // Origem = 1º item (a faixa tem padding de respiro para o anel de foco).
    const origin = items[0]?.offsetLeft ?? 0;
    let index = 0;
    let best = Infinity;
    items.forEach((el, i) => {
      const distance = Math.abs(el.offsetLeft - origin - left);
      if (distance < best) {
        best = distance;
        index = i;
      }
    });
    const atStart = left <= 1;
    const atEnd = left + track.clientWidth >= track.scrollWidth - 1;
    setPos((prev) =>
      prev.index === index && prev.atStart === atStart && prev.atEnd === atEnd
        ? prev
        : { index, atStart, atEnd },
    );
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [measure, total]);

  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(measure);
  };

  const goTo = (target: number) => {
    const track = trackRef.current;
    if (!track || total === 0) return;
    const item = track.children[Math.max(0, Math.min(total - 1, target))] as HTMLElement | undefined;
    const first = track.children[0] as HTMLElement | undefined;
    if (!item || !first) return;
    track.scrollTo({
      left: item.offsetLeft - first.offsetLeft,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  const previous = () => {
    if (!pos.atStart) goTo(pos.index - 1);
  };
  const next = () => {
    if (!pos.atEnd) goTo(pos.index + 1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const target = event.target as HTMLElement;
    if (target.closest("input, textarea, select, [contenteditable='true']")) return;
    const keys: Record<string, () => void> = {
      ArrowLeft: previous,
      ArrowRight: next,
      Home: () => goTo(0),
      End: () => goTo(total - 1),
    };
    const action = keys[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  };

  // No fim da faixa vários itens ficam visíveis: o indicador mostra o último.
  const current = total === 0 ? 0 : pos.atEnd ? total : pos.index + 1;

  return (
    <section
      aria-roledescription="carrossel"
      aria-label={label}
      className={cn("flex flex-col gap-2 text-content", className)}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {(heading || showControls) && (
        <div className="flex min-h-8 items-center justify-between gap-4">
          <div className="min-w-0 text-action font-light uppercase">{heading}</div>
          {showControls && total > 1 && (
            <div className="flex items-center gap-1">
              <span aria-live="polite" aria-atomic="true" className="mr-2 text-label font-light tabular-nums">
                <span aria-hidden>
                  {current} / {total}
                </span>
                <span className="sr-only">
                  Item {current} de {total}
                </span>
              </span>
              <CarouselButton icon="chevron-left" label={previousLabel} disabled={pos.atStart} onClick={previous} />
              <CarouselButton icon="chevron-right" label={nextLabel} disabled={pos.atEnd} onClick={next} />
            </div>
          )}
        </div>
      )}
      <div
        ref={trackRef}
        tabIndex={0}
        onScroll={onScroll}
        className={cn(
          "relative flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain",
          // Respiro de 4px para o anel de foco dos slides (1px + offset 2px) não ser recortado
          // pelo overflow. `-m-1` compensa o `p-1`: os itens ficam onde estavam; `scroll-px-1`
          // faz o snap alinhar na borda do padding, não na da faixa.
          "-m-1 p-1 scroll-px-1",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          focusRing,
        )}
      >
        {slides.map((slide, i) => (
          <div
            key={isValidElement(slide) && slide.key !== null ? slide.key : i}
            role="group"
            aria-label={`${i + 1} de ${total}`}
            className={cn("shrink-0 snap-start", itemSizes[itemSize], itemClassName)}
          >
            {slide}
          </div>
        ))}
      </div>
    </section>
  );
}
