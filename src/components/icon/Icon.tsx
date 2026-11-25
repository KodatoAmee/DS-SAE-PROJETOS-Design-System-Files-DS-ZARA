import type { SVGProps } from "react";
import { cn } from "../../lib/cn";

/** Ícones de traço fino (1px), desenhados para o DS. Grade 20x20. */
const paths = {
  menu: <path d="M2 7h16M2 13h16" />,
  close: <path d="M4 4l12 12M16 4L4 16" />,
  search: (
    <>
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="M12.5 12.5L17 17" />
    </>
  ),
  bag: (
    <>
      <path d="M4 6.5h12V17H4z" />
      <path d="M7.5 6.5V5a2.5 2.5 0 015 0v1.5" />
    </>
  ),
  user: (
    <>
      <circle cx="10" cy="6.5" r="3" />
      <path d="M3.5 17c.6-3.2 3.2-5 6.5-5s5.9 1.8 6.5 5" />
    </>
  ),
  help: (
    <>
      <circle cx="10" cy="10" r="7" />
      <path d="M8 8a2 2 0 113 1.7c-.6.4-1 .8-1 1.6M10 13.6v.4" />
    </>
  ),
  bookmark: <path d="M5.5 3h9v14L10 13.5 5.5 17z" />,
  filter: <path d="M3 6h14M6 10h8M8.5 14h3" />,
  plus: <path d="M10 4v12M4 10h12" />,
  minus: <path d="M4 10h12" />,
  check: <path d="M4 10.5l4 4 8-9" />,
  "chevron-down": <path d="M5 7.5l5 5 5-5" />,
  "chevron-up": <path d="M5 12.5l5-5 5 5" />,
  "chevron-left": <path d="M12.5 5l-5 5 5 5" />,
  "chevron-right": <path d="M7.5 5l5 5-5 5" />,
  "arrow-right": <path d="M3 10h14M12 5l5 5-5 5" />,
  info: (
    <>
      <circle cx="10" cy="10" r="7" />
      <path d="M10 9v5M10 6v.5" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;
export const iconNames = Object.keys(paths) as IconName[];

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  /** Lado em px. Padrão 20. */
  size?: number;
  /** Nome acessível. Sem ele o ícone é decorativo (aria-hidden). */
  label?: string;
}

export function Icon({ name, size = 20, label, className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="square"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      className={cn("shrink-0", className)}
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
