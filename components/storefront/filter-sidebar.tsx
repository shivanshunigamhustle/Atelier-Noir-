"use client";

import { ALL_CATEGORIES, ALL_SIZES, ALL_COLORS, COLOR_SWATCH } from "@/lib/mock-data";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/types";

export interface Filters {
  categories: Product["category"][];
  sizes: string[];
  colors: string[];
  maxPrice: number;
}

const MIN_PRICE = 20;
const MAX_PRICE = 150;

export const EMPTY_FILTERS: Filters = { categories: [], sizes: [], colors: [], maxPrice: MAX_PRICE };

export function hasActiveFilters(f: Filters) {
  return f.categories.length > 0 || f.sizes.length > 0 || f.colors.length > 0 || f.maxPrice < MAX_PRICE;
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function FilterSidebar({
  filters,
  onChange,
  className,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium tracking-[0.04em]">Filters</h2>
        {hasActiveFilters(filters) && (
          <button
            onClick={() => onChange(EMPTY_FILTERS)}
            className="text-xs text-charcoal/60 underline underline-offset-4"
          >
            Clear all
          </button>
        )}
      </div>

      <fieldset>
        <legend className="text-xs tracking-[0.08em] text-charcoal/50">CATEGORY</legend>
        <div className="mt-3 flex flex-col gap-2">
          {ALL_CATEGORIES.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.categories.includes(c)}
                onChange={() => onChange({ ...filters, categories: toggle(filters.categories, c) })}
                className="h-4 w-4 accent-charcoal"
              />
              {c}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs tracking-[0.08em] text-charcoal/50">SIZE</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => onChange({ ...filters, sizes: toggle(filters.sizes, s) })}
              aria-pressed={filters.sizes.includes(s)}
              className={cn(
                "flex h-9 min-w-9 items-center justify-center border px-2 text-xs",
                filters.sizes.includes(s)
                  ? "border-charcoal bg-charcoal text-ivory"
                  : "border-line text-charcoal"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs tracking-[0.08em] text-charcoal/50">COLOR</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {ALL_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => onChange({ ...filters, colors: toggle(filters.colors, c) })}
              aria-pressed={filters.colors.includes(c)}
              aria-label={c}
              title={c}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-shadow",
                filters.colors.includes(c) ? "border-charcoal" : "border-transparent"
              )}
              style={{ backgroundColor: COLOR_SWATCH[c], boxShadow: "inset 0 0 0 1px rgba(36,36,32,0.25)" }}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="flex w-full items-center justify-between text-xs tracking-[0.08em] text-charcoal/50">
          <span>PRICE</span>
          <span className="text-charcoal/70">Up to ${filters.maxPrice}</span>
        </legend>
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={5}
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="mt-4 w-full accent-charcoal"
          aria-label="Maximum price"
        />
      </fieldset>
    </div>
  );
}

export function applyFilters(products: Product[], filters: Filters): Product[] {
  return products.filter((p) => {
    if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false;
    if (filters.sizes.length > 0 && !p.sizes.some((s) => filters.sizes.includes(s))) return false;
    if (filters.colors.length > 0 && !p.colors.some((c) => filters.colors.includes(c))) return false;
    if (p.price > filters.maxPrice) return false;
    return true;
  });
}
