import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";
import { cn } from "../../../lib/cn";

export const buttonGroupVariants = cva("flex", {
  variants: {
    orientation: {
      horizontal: "flex-row items-center",
      /** Empilhados: filhos esticam para a mesma largura. */
      vertical: "flex-col items-stretch",
    },
    /** Cola as bordas: sem vão e sem borda dupla (sobreposição de 1px). */
    attached: {
      true: "[&>*]:relative [&>*:hover]:z-10 [&>*:focus-visible]:z-10",
      false: "",
    },
    fullWidth: { true: "w-full", false: "" },
  },
  compoundVariants: [
    { attached: false, class: "gap-2" },
    { attached: true, orientation: "horizontal", class: "[&>*:not(:first-child)]:-ml-px" },
    { attached: true, orientation: "vertical", class: "[&>*:not(:first-child)]:-mt-px" },
    { fullWidth: true, orientation: "horizontal", class: "[&>*]:flex-1" },
  ],
  defaultVariants: { orientation: "horizontal", attached: false, fullWidth: false },
});

export interface ButtonGroupProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof buttonGroupVariants> {
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
}

export function ButtonGroup({
  orientation,
  attached,
  fullWidth,
  className,
  children,
  ...rest
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      className={cn(buttonGroupVariants({ orientation, attached, fullWidth }), className)}
      {...rest}
    >
      {children}
    </div>
  );
}
