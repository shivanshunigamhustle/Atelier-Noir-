"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Heart, ShoppingBagOpen } from "@phosphor-icons/react";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { useStore, useCurrentCustomer } from "@/lib/store-context";
import { COLOR_SWATCH } from "@/lib/mock-data";
import { cn } from "@/lib/cn";

export function ProductCard({ product }: { product: Product; index?: number }) {
  const { dispatch, addToCart, toast, state } = useStore();
  const customer = useCurrentCustomer();
  const reduce = useReducedMotion();
  const isWishlisted = state.wishlist.some(
    (w) => w.productId === product.id && w.customerId === customer.id
  );

  const firstInStock = product.variants.find((v) => v.stock > 0);

  function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    dispatch({ type: "TOGGLE_WISHLIST", productId: product.id, customerId: customer.id });
    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  }

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (!firstInStock) return;
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      color: firstInStock.color,
      size: firstInStock.size,
      qty: 1,
      price: product.price,
    });
    toast(`Added ${product.name} to your bag`);
  }

  return (
    <div className="group relative transition-transform duration-300 ease-out will-change-transform hover:-translate-y-1.5">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-sand shadow-[0_0_0_rgba(32,31,28,0)] transition-shadow duration-300 group-hover:shadow-[0_20px_36px_-16px_rgba(32,31,28,0.4)]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="photo-grade will-change-transform object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
          {(product.isNew || product.isBestseller) && (
            <span className="absolute left-3 top-3 rounded-full bg-ivory px-3 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-charcoal">
              {product.isNew ? "New" : "Bestseller"}
            </span>
          )}

          <div className="absolute inset-x-3 bottom-3 translate-y-[150%] opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            {firstInStock ? (
              <button
                onClick={quickAdd}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-charcoal py-2.5 text-xs font-medium tracking-[0.08em] text-ivory shadow-lg transition-colors hover:bg-charcoal-soft"
              >
                <ShoppingBagOpen size={14} /> QUICK ADD
              </button>
            ) : (
              <span className="flex w-full items-center justify-center rounded-full bg-ivory/90 py-2.5 text-xs font-medium tracking-[0.08em] text-charcoal/50">
                OUT OF STOCK
              </span>
            )}
          </div>
        </div>
      </Link>
      <motion.button
        onClick={toggleWishlist}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={isWishlisted}
        whileTap={reduce ? undefined : { scale: 0.82 }}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 text-charcoal shadow-sm transition-colors hover:bg-ivory"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isWishlisted ? "filled" : "outline"}
            initial={reduce ? false : { scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="flex items-center justify-center"
          >
            <Heart size={17} weight={isWishlisted ? "fill" : "regular"} />
          </motion.span>
        </AnimatePresence>
      </motion.button>
      <Link href={`/product/${product.id}`} className="mt-3 block">
        <h3 className="font-sans text-sm text-charcoal">{product.name}</h3>
        <div className="mt-1 flex items-center justify-between">
          <p className={cn("text-sm text-charcoal/70")}>{formatCurrency(product.price)}</p>
          {product.colors.length > 1 && (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 4).map((c) => (
                <span
                  key={c}
                  className="h-2.5 w-2.5 rounded-full ring-1 ring-inset ring-charcoal/15"
                  style={{ backgroundColor: COLOR_SWATCH[c] }}
                  aria-hidden
                />
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
