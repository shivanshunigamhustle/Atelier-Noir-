"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Heart, Minus, Plus } from "@phosphor-icons/react";
import { useStore, useCurrentCustomer } from "@/lib/store-context";
import { formatCurrency } from "@/lib/format";
import { COLOR_SWATCH } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { ProductGrid } from "@/components/storefront/product-grid";
import { cn } from "@/lib/cn";
import type { ProductColor, ProductSize } from "@/lib/types";

export default function ProductDetailClient() {
  const { id } = useParams<{ id: string }>();
  const { state, addToCart, dispatch, toast } = useStore();
  const customer = useCurrentCustomer();
  const product = state.products.find((p) => p.id === id);

  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState<ProductColor | undefined>(product?.colors[0]);
  const [size, setSize] = useState<ProductSize | undefined>(undefined);
  const [qty, setQty] = useState(1);

  const related = useMemo(() => {
    if (!product) return [];
    return state.products
      .filter((p) => p.id !== product.id && p.category === product.category && p.status === "Active")
      .slice(0, 4);
  }, [state.products, product]);

  if (!product) return notFound();

  const isWishlisted = state.wishlist.some(
    (w) => w.productId === product.id && w.customerId === customer.id
  );

  function stockFor(c?: ProductColor, s?: ProductSize) {
    return product!.variants.find((v) => v.color === c && v.size === s)?.stock ?? 0;
  }

  function handleAddToBag() {
    if (!color || !size || !product) return;
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      color,
      size,
      qty,
      price: product.price,
    });
    toast("Added to your bag");
  }

  return (
    <div className="container-page py-10">
      <nav aria-label="Breadcrumb" className="mb-8 text-xs text-charcoal/50">
        <Link href="/" className="hover:text-charcoal">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-charcoal">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-[4/5] overflow-hidden bg-sand">
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              priority
              className="object-cover photo-grade"
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}`}
                className={cn(
                  "relative aspect-[4/5] overflow-hidden bg-sand",
                  activeImage === i ? "ring-2 ring-charcoal" : "ring-1 ring-line"
                )}
              >
                <Image src={src} alt="" fill sizes="120px" className="object-cover photo-grade" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="font-display text-3xl">{product.name}</h1>
          <p className="mt-2 text-lg">{formatCurrency(product.price)}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal/70">{product.description}</p>

          <div className="mt-8">
            <p className="text-xs tracking-[0.08em] text-charcoal/50">
              COLOR {color && <span className="text-charcoal">— {color}</span>}
            </p>
            <div className="mt-3 flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setColor(c);
                    setSize(undefined);
                  }}
                  aria-label={c}
                  aria-pressed={color === c}
                  className={cn(
                    "h-9 w-9 rounded-full border-2",
                    color === c ? "border-charcoal" : "border-transparent"
                  )}
                  style={{ backgroundColor: COLOR_SWATCH[c], boxShadow: "inset 0 0 0 1px rgba(36,36,32,0.25)" }}
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs tracking-[0.08em] text-charcoal/50">SIZE</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const stock = stockFor(color, s);
                const outOfStock = stock <= 0;
                return (
                  <button
                    key={s}
                    disabled={outOfStock}
                    onClick={() => setSize(s)}
                    title={outOfStock ? "Out of stock" : undefined}
                    aria-pressed={size === s}
                    className={cn(
                      "flex h-11 min-w-11 items-center justify-center border px-3 text-sm",
                      outOfStock && "cursor-not-allowed text-charcoal/30 line-through",
                      !outOfStock && size === s && "border-charcoal bg-charcoal text-ivory",
                      !outOfStock && size !== s && "border-line"
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-line">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className="flex h-11 w-11 items-center justify-center disabled:opacity-30"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(5, q + 1))}
                disabled={qty >= 5}
                className="flex h-11 w-11 items-center justify-center disabled:opacity-30"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Button size="lg" className="flex-1" disabled={!color || !size} onClick={handleAddToBag}>
              Add to Bag
            </Button>
            <button
              onClick={() => {
                dispatch({ type: "TOGGLE_WISHLIST", productId: product.id, customerId: customer.id });
                toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
              }}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={isWishlisted}
              className="flex h-12 w-12 items-center justify-center border border-charcoal"
            >
              <Heart size={18} weight={isWishlisted ? "fill" : "regular"} />
            </button>
          </div>
          {!color || !size ? (
            <p className="mt-2 text-xs text-charcoal/50">Select a color and size to continue.</p>
          ) : null}

          <div className="mt-10">
            <Accordion title="Details & Care" defaultOpen>
              <p>{product.fit}</p>
              <p className="mt-2">{product.care}</p>
            </Accordion>
            <Accordion title="Shipping & Returns">
              <p>
                Complimentary standard shipping on orders over $350. Orders ship within 1-2 business
                days and arrive in 3-5 business days.
              </p>
              <p className="mt-2">Returns accepted within 30 days in original condition with tags attached.</p>
            </Accordion>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display mb-8 text-2xl">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
