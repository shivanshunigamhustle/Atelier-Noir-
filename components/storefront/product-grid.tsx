import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 border border-dashed border-line py-24 text-center">
        <p className="font-display text-xl text-charcoal">No results found.</p>
        <p className="text-sm text-charcoal/60">Try another term or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i % 4} />
      ))}
    </div>
  );
}
