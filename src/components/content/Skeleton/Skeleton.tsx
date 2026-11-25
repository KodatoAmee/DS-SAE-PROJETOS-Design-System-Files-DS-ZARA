import type { ComponentPropsWithoutRef, Ref } from "react";
import { cn } from "../../../lib/cn";
import { mediaAspectClasses, type MediaAspect } from "../MediaPlaceholder";

export interface SkeletonProps extends ComponentPropsWithoutRef<"div"> {
  ref?: Ref<HTMLDivElement>;
  /** `text`: linhas de 12px; `media`: bloco com proporção; `block`: retângulo livre (tamanho via `className`). */
  variant?: "text" | "media" | "block";
  /** Linhas em `text`. A última fica mais curta. Padrão 1. */
  lines?: number;
  /** Proporção em `media`. Padrão `2/3`. */
  aspect?: MediaAspect;
}

const pulse = "rounded-none bg-muted animate-zr-pulse";

/** Bloco de carregamento. Decorativo: anuncie o carregamento no contêiner (`aria-busy`). */
export function Skeleton({
  variant = "block",
  lines = 1,
  aspect = "2/3",
  className,
  ...rest
}: SkeletonProps) {
  if (variant === "text") {
    return (
      <div aria-hidden className={cn("flex w-full flex-col", className)} {...rest}>
        {Array.from({ length: Math.max(1, lines) }, (_, i) => (
          // Linha de 12px dentro de 16px de altura de linha (text-label).
          <div key={i} className="flex h-4 items-center">
            <div className={cn(pulse, "h-3", lines > 1 && i === lines - 1 ? "w-3/5" : "w-full")} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div
      aria-hidden
      className={cn(pulse, variant === "media" && ["w-full", mediaAspectClasses[aspect]], className)}
      {...rest}
    />
  );
}

export interface ProductCardSkeletonProps extends ComponentPropsWithoutRef<"div"> {
  ref?: Ref<HTMLDivElement>;
  /** Proporção da mídia. Padrão `2/3`. */
  aspect?: MediaAspect;
}

/** Esqueleto com a mesma geometria do `ProductCard`: mídia + nome + preço. */
export function ProductCardSkeleton({ aspect = "2/3", className, ...rest }: ProductCardSkeletonProps) {
  return (
    <div aria-hidden className={cn("flex flex-col", className)} {...rest}>
      <Skeleton variant="media" aspect={aspect} />
      <div className="flex flex-col pt-2">
        <div className="flex h-4 items-center">
          <div className={cn(pulse, "h-3 w-4/5")} />
        </div>
        <div className="flex h-4 items-center pt-0.5">
          <div className={cn(pulse, "h-3 w-1/3")} />
        </div>
      </div>
    </div>
  );
}
