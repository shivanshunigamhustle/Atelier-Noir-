import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "destructive" | "invert";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-sm tracking-wide transition-colors duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "bg-charcoal text-ivory hover:bg-charcoal-soft border border-charcoal",
  secondary: "bg-transparent text-charcoal border border-charcoal hover:bg-charcoal hover:text-ivory",
  ghost: "bg-transparent text-charcoal border border-transparent hover:bg-sand/60",
  destructive: "bg-transparent text-oxblood border border-oxblood hover:bg-oxblood hover:text-ivory",
  invert: "bg-ivory text-charcoal border border-ivory hover:bg-ivory/85",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6",
  lg: "h-12 px-8 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}

export function TextLink({
  className,
  children,
  ...rest
}: { className?: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        "text-sm text-charcoal underline decoration-charcoal/30 underline-offset-4 transition-colors hover:decoration-charcoal",
        className
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
