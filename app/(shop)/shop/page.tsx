"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store-context";
import { ShopView } from "@/components/storefront/shop-view";

function ShopContent() {
  const { state } = useStore();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  return (
    // Remount when the navbar changes the query so filters reset to the new category.
    <ShopView
      key={searchParams.toString()}
      products={state.products}
      title={category ?? undefined}
      breadcrumb={
        category
          ? [{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: category }]
          : [{ label: "Home", href: "/" }, { label: "Shop" }]
      }
    />
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}
