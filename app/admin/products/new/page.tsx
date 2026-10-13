"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store-context";
import { ProductForm, emptyProductForm } from "@/components/admin/product-form";
import type { Product } from "@/lib/types";
import { todayIso } from "@/lib/format";

export default function AddProductPage() {
  const router = useRouter();
  const { dispatch, toast } = useStore();
  const [value, setValue] = useState(emptyProductForm());

  function save() {
    const product: Product = {
      id: `p-${Math.random().toString(36).slice(2, 9)}`,
      name: value.name,
      category: value.category,
      price: value.price,
      compareAtPrice: value.compareAtPrice,
      colors: [...new Set(value.variants.map((v) => v.color))],
      sizes: [...new Set(value.variants.map((v) => v.size))],
      variants: value.variants,
      stock: value.variants.reduce((s, v) => s + v.stock, 0),
      status: value.status,
      images: value.images,
      description: value.description,
      fit: value.fit,
      care: value.care,
      createdAt: todayIso(),
    };
    dispatch({ type: "ADD_PRODUCT", product });
    toast("Product created");
    router.push("/admin/products");
  }

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl">Add Product</h1>
      <ProductForm
        value={value}
        onChange={setValue}
        onSave={save}
        onCancel={() => router.push("/admin/products")}
        saveLabel="Create Product"
      />
    </div>
  );
}
