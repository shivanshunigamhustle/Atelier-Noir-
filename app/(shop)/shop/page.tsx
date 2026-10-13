"use client";

import { Suspense } from "react";
import { useStore } from "@/lib/store-context";
import { ShopView } from "@/components/storefront/shop-view";

function ShopContent() {
  const { state } = useStore();
  return <ShopView products={state.products} breadcrumb={[{ label: "Home", href: "/" }, { label: "Shop" }]} />;
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}
