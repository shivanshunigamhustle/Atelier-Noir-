"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { MagnifyingGlass, X, ArrowRight } from "@phosphor-icons/react";
import { useStore } from "@/lib/store-context";
import { formatCurrency } from "@/lib/format";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state } = useStore();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setQuery("");
      setDebounced("");
    }, 0);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(query.trim().toLowerCase()), 180);
    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = debounced
    ? state.products
        .filter(
          (p) =>
            p.status === "Active" &&
            (p.name.toLowerCase().includes(debounced) || p.category.toLowerCase().includes(debounced))
        )
        .slice(0, 4)
    : [];

  function goToResults() {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-30 bg-charcoal/30 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            className="absolute left-0 right-0 top-full z-40 overflow-hidden border-b border-line bg-ivory"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="container-page py-8">
              <div className="flex items-center gap-4 border-b-2 border-charcoal pb-3">
                <MagnifyingGlass size={22} className="shrink-0 text-charcoal/50" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && goToResults()}
                  placeholder="Search for coats, knitwear, accessories..."
                  aria-label="Search products"
                  className="font-display w-full bg-transparent text-2xl placeholder:text-charcoal/30 focus:outline-none sm:text-3xl"
                />
                <button
                  onClick={onClose}
                  aria-label="Close search"
                  className="shrink-0 rounded-full p-1 text-charcoal/60 transition-colors hover:bg-sand/60 hover:text-charcoal"
                >
                  <X size={20} />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {debounced && (
                  <motion.div
                    key={debounced}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pt-6"
                  >
                    {results.length === 0 ? (
                      <p className="py-6 text-sm text-charcoal/50">
                        No results for &ldquo;{debounced}&rdquo;. Try another term.
                      </p>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                          {results.map((p) => (
                            <Link
                              key={p.id}
                              href={`/product/${p.id}`}
                              onClick={onClose}
                              className="group block"
                            >
                              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
                                <Image
                                  src={p.images[0]}
                                  alt={p.name}
                                  fill
                                  sizes="200px"
                                  className="object-cover photo-grade transition-transform duration-500 group-hover:scale-[1.05]"
                                />
                              </div>
                              <p className="mt-2 truncate text-sm text-charcoal">{p.name}</p>
                              <p className="text-sm text-charcoal/60">{formatCurrency(p.price)}</p>
                            </Link>
                          ))}
                        </div>
                        <button
                          onClick={goToResults}
                          className="group mt-6 flex items-center gap-1.5 text-sm text-charcoal underline underline-offset-4"
                        >
                          View all results for &ldquo;{query}&rdquo;
                          <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {!debounced && (
                <div className="pt-6">
                  <p className="text-xs uppercase tracking-[0.1em] text-charcoal/40">Popular searches</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Coat", "Knitwear", "Boots", "Tailoring", "Accessories"].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="rounded-full border border-line px-4 py-1.5 text-xs text-charcoal/70 transition-colors hover:border-charcoal hover:text-charcoal"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
