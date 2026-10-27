"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useReducedMotion } from "motion/react";
import { MagnifyingGlass, Heart, ShoppingBag, User, List, X } from "@phosphor-icons/react";
import { useStore, useCurrentCustomer } from "@/lib/store-context";
import { cn } from "@/lib/cn";
import { LogoMark } from "@/components/ui/logo-mark";
import { SearchOverlay } from "./search-overlay";

const NAV_CATEGORIES = [
  { label: "New Arrivals", href: "/shop?sort=newest" },
  { label: "Bras", href: "/shop?category=Bras" },
  { label: "Underwear", href: "/shop?category=Underwear" },
  { label: "Loungewear", href: "/shop?category=Loungewear" },
  { label: "Sleepwear", href: "/shop?category=Sleepwear" },
  { label: "Shapewear", href: "/shop?category=Shapewear" },
  { label: "Accessories", href: "/shop?category=Accessories" },
  { label: "Journal", href: "/about" },
];

function UnderlineLink({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick} className={cn("group relative", className)}>
      {children}
      <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </Link>
  );
}

function Counter({ value }: { value: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      key={value}
      initial={reduce ? false : { scale: 1.4, opacity: 0.4 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
      className="inline-block tabular-nums"
    >
      {value}
    </motion.span>
  );
}

export function SiteHeader() {
  const { state, dispatch } = useStore();
  const customer = useCurrentCustomer();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 8);
  });

  const wishlistCount = state.wishlist.filter((w) => w.customerId === customer.id).length;
  const cartCount = state.cart.reduce((sum, l) => sum + l.qty, 0);
  const accountHref = customer.orderIds.length > 0 ? "/account/orders" : "/account/profile";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-ivory/95 backdrop-blur-sm transition-shadow duration-300",
          scrolled ? "border-line shadow-[0_2px_20px_rgba(32,31,28,0.08)]" : "border-transparent"
        )}
      >
        <div className="hidden items-center justify-center gap-3 border-b border-line-soft bg-olive py-2 text-center text-[11px] tracking-[0.18em] text-ivory sm:flex">
          <span aria-hidden>—</span>
          <span>THE NEW SEASON EDIT</span>
          <span aria-hidden>—</span>
          <span>Complimentary shipping on orders over $150</span>
          <span aria-hidden>—</span>
        </div>

        <div className="container-page flex h-16 items-center justify-between md:h-20">
          <div className="flex items-center gap-4 md:hidden">
            <button
              className="flex items-center justify-center transition-transform active:scale-90"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <List size={22} />
            </button>
            <button
              className="flex items-center justify-center transition-transform active:scale-90"
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <MagnifyingGlass size={20} />
            </button>
          </div>

          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="group relative hidden items-center gap-2 text-sm text-charcoal md:flex"
          >
            <MagnifyingGlass size={16} /> Search
            <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </button>

          <Link
            href="/"
            className="font-display absolute left-1/2 flex -translate-x-1/2 items-center gap-2.5 text-xl tracking-[0.12em] text-charcoal transition-opacity hover:opacity-70 md:gap-3 md:text-3xl"
          >
            <LogoMark className="h-6 w-6 md:h-8 md:w-8" />
            <span className="hidden sm:inline">ATELIER NOIR</span>
          </Link>

          <div className="flex items-center gap-5 md:gap-6">
            <UnderlineLink href={accountHref} className="hidden items-center gap-2 text-sm text-charcoal sm:flex">
              <User size={16} /> Account
            </UnderlineLink>
            <UnderlineLink href="/account/wishlist" className="hidden items-center gap-2 text-sm text-charcoal sm:flex">
              <Heart size={16} />
              Wishlist
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 420, damping: 18 }}
                    className="flex h-4 w-4 items-center justify-center bg-charcoal text-[10px] text-ivory"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </UnderlineLink>
            <button
              aria-label="Open bag"
              onClick={() => dispatch({ type: "OPEN_CART" })}
              className="group relative flex items-center gap-2 text-sm text-charcoal transition-transform active:scale-95"
            >
              <ShoppingBag size={16} /> Bag (<Counter value={cartCount} />)
              <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </button>
          </div>
        </div>

        <div className="hidden border-t border-line-soft md:block">
          <div className="container-page flex h-11 items-center gap-7 overflow-x-auto">
            {NAV_CATEGORIES.map((c) => (
              <UnderlineLink
                key={c.label}
                href={c.href}
                className="whitespace-nowrap text-xs uppercase tracking-[0.1em] text-charcoal/75 hover:text-charcoal"
              >
                {c.label}
              </UnderlineLink>
            ))}
          </div>
        </div>

        <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      </header>

      {/* Outside <header>: its backdrop-filter would make it the containing block for this fixed drawer. */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
          >
            <motion.div
              className="absolute inset-0 bg-charcoal/40"
              onClick={() => setMobileOpen(false)}
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="absolute inset-y-0 left-0 flex w-[82%] max-w-sm flex-col bg-ivory p-6"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-display flex items-center gap-2 text-lg tracking-[0.1em]">
                  <LogoMark className="h-5 w-5" />
                  ATELIER NOIR
                </span>
                <button aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              <motion.nav
                className="mt-10 flex flex-col gap-5"
                initial="closed"
                animate="open"
                variants={{
                  open: { transition: { staggerChildren: 0.045, delayChildren: 0.08 } },
                  closed: {},
                }}
              >
                {NAV_CATEGORIES.map((c) => (
                  <motion.div
                    key={c.label}
                    variants={{
                      open: { opacity: 1, x: 0 },
                      closed: { opacity: 0, x: -12 },
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    <Link href={c.href} onClick={() => setMobileOpen(false)} className="text-base text-charcoal">
                      {c.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="my-2 h-px bg-line" />
                <motion.div variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: -12 } }}>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setSearchOpen(true);
                    }}
                    className="text-base text-charcoal"
                  >
                    Search
                  </button>
                </motion.div>
                <motion.div variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: -12 } }}>
                  <Link
                    href="/account/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className="text-base text-charcoal"
                  >
                    Wishlist ({wishlistCount})
                  </Link>
                </motion.div>
                <motion.div variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: -12 } }}>
                  <Link href={accountHref} onClick={() => setMobileOpen(false)} className="text-base text-charcoal">
                    Account
                  </Link>
                </motion.div>
              </motion.nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
