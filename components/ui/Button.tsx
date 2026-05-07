import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-medium tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-ember text-white border-2 border-ember-deep shadow-[0_4px_0_rgba(185,70,19,0.6),0_12px_24px_-12px_rgba(242,104,44,0.5)] hover:bg-ember-soft hover:translate-y-[-1px] active:translate-y-0 active:shadow-[0_2px_0_rgba(185,70,19,0.5)]",
  secondary:
    "bg-bg-elev text-ink border-2 border-line shadow-[0_3px_0_rgba(42,31,74,0.06)] hover:border-ember/50 hover:bg-bg-soft",
  ghost: "text-ink-mute hover:text-ink hover:bg-bg-soft",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

type Props = {
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  onClick,
  disabled,
  type = "button",
}: Props) {
  const cls = cn(base, variants[variant], sizes[size], className);
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
