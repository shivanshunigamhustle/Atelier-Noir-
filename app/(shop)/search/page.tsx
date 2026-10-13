"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useStore } from "@/lib/store-context";
import { ProductGrid } from "@/components/storefront/product-grid";

function SearchContent() {
  const { state } = useStore();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [debounced, setDebounced] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(query.trim().toLowerCase()), 220);
    return () => clearTimeout(handle);
  }, [query]);

  const results = debounced
    ? state.products.filter(
        (p) =>
          p.status === "Active" &&
          (p.name.toLowerCase().includes(debounced) || p.category.toLowerCase().includes(debounced))
      )
    : [];

  return (
    <div className="container-page py-10">
      <div className="relative mx-auto max-w-xl">
        <MagnifyingGlass size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-charcoal/40" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products"
          aria-label="Search products"
          className="w-full border-b border-charcoal bg-transparent py-3 pl-7 text-lg font-display placeholder:text-charcoal/30 focus:outline-none"
        />
      </div>

      {debounced && (
        <p className="mt-8 text-sm text-charcoal/60">
          {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{debounced}&rdquo;
        </p>
      )}

      <div className="mt-8">
        {!debounced ? (
          <p className="py-16 text-center text-sm text-charcoal/50">
            Start typing to search the collection.
          </p>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="font-display text-xl">No results found. Try another term.</p>
            <Link href="/shop" className="border border-charcoal px-6 py-3 text-sm hover:bg-charcoal hover:text-ivory">
              Browse all products
            </Link>
          </div>
        ) : (
          <ProductGrid products={results} />
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
