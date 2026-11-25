import {
  isValidElement,
  useId,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from "react";
import { cn, focusRing } from "../../../lib/cn";
import { Icon } from "../../icon";
import { MediaPlaceholder, type MediaPlaceholderProps } from "../MediaPlaceholder";
import { PriceLabel, type PriceLabelProps } from "../PriceLabel";
import { Tag } from "../Tag";

type NameTag = "h2" | "h3" | "h4" | "p";

export interface ProductCardProps extends Omit<ComponentPropsWithoutRef<"article">, "children"> {
  ref?: Ref<HTMLElement>;
  /** Mídia: um nó React ou as props do `MediaPlaceholder`. Padrão: placeholder 2:3 vazio. */
  media?: ReactNode | MediaPlaceholderProps;
  /** Nome do produto (texto corrido; o CSS põe em maiúsculas). */
  name: string;
  /** Props do `PriceLabel`. */
  price: PriceLabelProps;
  /** Etiqueta junto ao nome, como "New". Texto vira `Tag` `plain`. */
  tag?: ReactNode;
  /** Destino do link (mídia + nome). */
  href: string;
  /** Atributos extra do link (ex.: `target`, `data-*`, handlers de router). */
  linkProps?: Omit<ComponentPropsWithoutRef<"a">, "href" | "children">;
  /** Ativa o botão "+" 32x32 ao lado do nome. */
  onQuickAdd?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Nome acessível do botão "+". Padrão: "Adicionar <nome>". */
  quickAddLabel?: string;
  /** Cores extra disponíveis: mostra "+2 cores". */
  colors?: number;
  /** Elemento do nome. Padrão `h3`. */
  nameAs?: NameTag;
}

/** Distingue props de placeholder de um nó React qualquer. */
function isPlaceholderProps(media: unknown): media is MediaPlaceholderProps {
  return (
    typeof media === "object" &&
    media !== null &&
    !isValidElement(media) &&
    Object.getPrototypeOf(media) === Object.prototype &&
    !("$$typeof" in media)
  );
}

export function ProductCard({
  media,
  name,
  price,
  tag,
  href,
  linkProps,
  onQuickAdd,
  quickAddLabel,
  colors,
  nameAs: NameEl = "h3",
  className,
  ...rest
}: ProductCardProps) {
  const nameId = useId();
  const mediaNode =
    media === undefined ? (
      <MediaPlaceholder aspect="2/3" />
    ) : isPlaceholderProps(media) ? (
      <MediaPlaceholder aspect="2/3" {...media} />
    ) : (
      media
    );

  return (
    <article
      aria-labelledby={nameId}
      className={cn("flex flex-col font-light text-content", className)}
      {...rest}
    >
      {/* Área clicável: mídia + nome. O link estica-se sobre ela via ::after; o botão "+" fica por cima (z-10), fora do link. */}
      <div className="relative">
        {mediaNode}
        <div className="flex items-start justify-between gap-2 pt-2">
          <NameEl id={nameId} className="min-w-0 text-label-s font-light uppercase">
            <a
              href={href}
              {...linkProps}
              className={cn(
                "outline-none after:absolute after:inset-0 after:content-['']",
                "focus-visible:after:outline focus-visible:after:outline-1 focus-visible:after:outline-offset-2 focus-visible:after:outline-content",
                "hover:underline hover:underline-offset-2",
                linkProps?.className,
              )}
            >
              {name}
              {tag !== undefined && tag !== null && tag !== false && (
                <>
                  {" "}
                  {typeof tag === "string" ? <Tag className="ml-1">{tag}</Tag> : tag}
                </>
              )}
            </a>
          </NameEl>
          {onQuickAdd && (
            <button
              type="button"
              aria-label={quickAddLabel ?? `Adicionar ${name}`}
              onClick={onQuickAdd}
              className={cn(
                "relative z-10 -mt-2 -mr-2 inline-flex size-8 shrink-0 items-center justify-center rounded-none",
                "transition-opacity duration-200 ease-zr hover:opacity-60",
                focusRing,
              )}
            >
              <Icon name="plus" size={16} />
            </button>
          )}
        </div>
      </div>
      <PriceLabel {...price} className={cn("pt-0.5", price.className)} />
      {colors !== undefined && colors > 0 && (
        <p className="pt-1 text-label-s font-light text-content-low">
          +{colors} {colors === 1 ? "cor" : "cores"}
        </p>
      )}
    </article>
  );
}
