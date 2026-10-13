"use client";

import { Suspense } from "react";
import { notFound, useParams } from "next/navigation";
import { useStore } from "@/lib/store-context";
import { ShopView } from "@/components/storefront/shop-view";

function CollectionContent() {
  const { state } = useStore();
  const params = useParams<{ collection: string }>();
  const collection = state.collections.find((c) => c.slug === params.collection);

  if (!collection) return notFound();

  const products = collection.productIds
    .map((id) => state.products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <ShopView
      products={products}
      title={collection.name}
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: collection.name }]}
    />
  );
}

export default function CollectionPage() {
  return (
    <Suspense>
      <CollectionContent />
    </Suspense>
  );
}
