import Link from "next/link";
import { LogoMark } from "@/components/ui/logo-mark";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-center text-charcoal">
      <LogoMark className="h-12 w-12 text-charcoal/70" />
      <p className="mt-8 text-xs tracking-[0.3em] text-charcoal/50">ERROR 404</p>
      <h1 className="font-display mt-4 text-4xl sm:text-5xl">This page has been discontinued.</h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-charcoal/60">
        The page you&apos;re looking for doesn&apos;t exist, or has moved to a new address.
      </p>
      <Link
        href="/"
        className="mt-9 inline-flex h-12 items-center gap-3 bg-charcoal px-7 text-xs font-medium tracking-[0.12em] text-ivory transition-colors hover:bg-charcoal-soft"
      >
        RETURN HOME
      </Link>
    </div>
  );
}
