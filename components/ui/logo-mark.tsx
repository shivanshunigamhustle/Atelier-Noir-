import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("shrink-0", className)}
      fill="none"
      role="img"
      aria-label="Atelier Noir"
    >
      <circle cx="32" cy="32" r="29" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M 24 46 L 32 16 L 40 46 M 27.3 35.5 L 36.7 35.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
      <path
        d="M 20 46 L 20 18 M 44 18 L 44 46 M 20 18 L 44 46"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}
