"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FunnelSimple, X } from "@phosphor-icons/react";
import type { Product, ProductCategory } from "@/lib/types";
import { ProductGrid } from "./product-grid";
import { FilterSidebar, EMPTY_FILTERS, applyFilters, type Filters } from "./filter-sidebar";
import { cn } from "@/lib/cn";

type SortKey = "newest" | "price-asc" | "price-desc" | "name-asc";

const SORT_LABELS: Record<SortKey, string> = {
  newest: "Newest",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "name-asc": "Name A to Z",
};

function sortProducts(products: Product[], sort: SortKey): Product[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "name-asc":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return copy.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  }
}

const PAGE_SIZE = 8;

export function ShopView({
  products,
  breadcrumb,
  title,
}: {
  products: Product[];
  breadcrumb: { label: string; href?: string }[];
  title?: string;
}) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as ProductCategory | null;
  const initialSort = (searchParams.get("sort") as SortKey) || "newest";

  const [filters, setFilters] = useState<Filters>({
    ...EMPTY_FILTERS,
    categories: initialCategory ? [initialCategory] : [],
  });
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const activeProducts = useMemo(
    () => products.filter((p) => p.status === "Active"),
    [products]
  );
  const filtered = useMemo(
    () => sortProducts(applyFilters(activeProducts, filters), sort),
    [activeProducts, filters, sort]
  );
  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="container-page py-10">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-charcoal/50">
        {breadcrumb.map((b, i) => (
          <span key={i}>
            {b.href ? (
              <Link href={b.href} className="hover:text-charcoal">
                {b.label}
              </Link>
            ) : (
              <span className="text-charcoal">{b.label}</span>
            )}
            {i < breadcrumb.length - 1 && <span className="mx-2">/</span>}
          </span>
        ))}
      </nav>

      {title && <h1 className="font-display mb-8 text-3xl sm:text-4xl">{title}</h1>}

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <div className="hidden lg:block">
          <FilterSidebar
            filters={filters}
            onChange={(f) => {
              setFilters(f);
              setVisibleCount(PAGE_SIZE);
            }}
          />
        </div>

        <div>
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 border border-line px-4 py-2 text-xs lg:hidden"
            >
              <FunnelSimple size={14} /> Filters
            </button>
            <span className="hidden text-sm text-charcoal/50 lg:block">
              {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
            </span>
            <label className="flex items-center gap-2 text-sm">
              <span className="sr-only">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="border border-line bg-ivory px-3 py-2 text-xs focus-visible:outline-charcoal"
              >
                {Object.entries(SORT_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <ProductGrid products={visible} />

          {visibleCount < filtered.length && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                className="border border-charcoal px-8 py-3 text-sm hover:bg-charcoal hover:text-ivory"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileFiltersOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-charcoal/40 transition-opacity",
            mobileFiltersOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileFiltersOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto bg-ivory p-6 transition-transform duration-300",
            mobileFiltersOpen ? "translate-y-0" : "translate-y-full"
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg">Filters</h2>
            <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
              <X size={20} />
            </button>
          </div>
          <FilterSidebar filters={filters} onChange={setFilters} />
          <button
            onClick={() => setMobileFiltersOpen(false)}
            className="mt-8 w-full bg-charcoal py-3 text-sm text-ivory"
          >
            Show {filtered.length} results
          </button>
        </div>
      </div>
    </div>
  );
}
