import type { ComponentPropsWithoutRef, Ref } from "react";
import { cn } from "../../../lib/cn";

/** Proporções suportadas. `2/3` é o retrato da grelha de produtos. */
export const mediaAspectClasses = {
  "2/3": "aspect-[2/3]",
  "3/4": "aspect-[3/4]",
  "1/1": "aspect-square",
  "16/9": "aspect-video",
} as const;

export type MediaAspect = keyof typeof mediaAspectClasses;

export interface MediaPlaceholderProps extends ComponentPropsWithoutRef<"div"> {
  ref?: Ref<HTMLDivElement>;
  /** Proporção do bloco. Padrão `2/3` (retrato). */
  aspect?: MediaAspect;
  /** Texto curto no centro do bloco vazio. Também vira o nome acessível do placeholder. */
  label?: string;
  /** Imagem real. Sem `src`, o bloco fica vazio (`bg-muted`). */
  src?: string;
  /** Texto alternativo da imagem. Vazio = imagem decorativa. */
  alt?: string;
  srcSet?: string;
  sizes?: string;
}

export function MediaPlaceholder({
  aspect = "2/3",
  label,
  src,
  alt = "",
  srcSet,
  sizes,
  className,
  children,
  ...rest
}: MediaPlaceholderProps) {
  const empty = !src;
  return (
    <div
      role={empty && label ? "img" : undefined}
      aria-label={empty && label ? label : undefined}
      className={cn(
        "relative w-full overflow-hidden rounded-none bg-muted",
        mediaAspectClasses[aspect],
        className,
      )}
      {...rest}
    >
      {src ? (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        label && (
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center p-2 text-center text-caption font-light uppercase text-content-low"
          >
            {label}
          </span>
        )
      )}
      {children}
    </div>
  );
}
