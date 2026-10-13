"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "@phosphor-icons/react";
import { useStore, useCurrentCustomer } from "@/lib/store-context";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { state, dispatch, toast } = useStore();
  const customer = useCurrentCustomer();

  const entries = state.wishlist.filter((w) => w.customerId === customer.id);
  const items = entries
    .map((entry) => state.products.find((p) => p.id === entry.productId))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  function remove(productId: string) {
    dispatch({ type: "REMOVE_WISHLIST", productId, customerId: customer.id });
  }

  function addToBag(productId: string) {
    const product = state.products.find((p) => p.id === productId);
    if (!product) return;
    dispatch({
      type: "ADD_TO_CART",
      line: {
        productId: product.id,
        name: product.name,
        image: product.images[0],
        color: product.colors[0],
        size: product.sizes.find((s) => product.variants.some((v) => v.size === s && v.stock > 0)) ?? product.sizes[0],
        qty: 1,
        price: product.price,
      },
    });
    dispatch({ type: "OPEN_CART" });
    toast("Added to your bag");
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="font-display text-xl">Save your favorites here.</p>
        <Link href="/shop" className="border border-charcoal px-6 py-3 text-sm hover:bg-charcoal hover:text-ivory">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
      {items.map((product) => (
        <div key={product.id} className="group relative">
          <button
            onClick={() => remove(product.id)}
            aria-label="Remove from wishlist"
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center bg-ivory/90"
          >
            <X size={15} />
          </button>
          <Link href={`/product/${product.id}`} className="block">
            <div className="relative aspect-[4/5] overflow-hidden bg-sand">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(min-width: 640px) 30vw, 50vw"
                className="object-cover photo-grade transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <h3 className="mt-3 text-sm">{product.name}</h3>
            <p className="mt-1 text-sm text-charcoal/70">{formatCurrency(product.price)}</p>
          </Link>
          <Button size="sm" className="mt-3 w-full" onClick={() => addToBag(product.id)}>
            Add to Bag
          </Button>
        </div>
      ))}
    </div>
  );
}
