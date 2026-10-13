"use client";

import { useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store-context";
import { ProductForm, fromProduct, type ProductFormValue } from "@/components/admin/product-form";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { state, dispatch, toast } = useStore();
  const product = state.products.find((p) => p.id === id);
  const [value, setValue] = useState<ProductFormValue | null>(product ? fromProduct(product) : null);
  const [deleting, setDeleting] = useState(false);

  if (!product || !value) return notFound();

  function save() {
    if (!product || !value) return;
    dispatch({
      type: "UPDATE_PRODUCT",
      product: {
        ...product,
        name: value!.name,
        description: value!.description,
        category: value!.category,
        status: value!.status,
        price: value!.price,
        compareAtPrice: value!.compareAtPrice,
        fit: value!.fit,
        care: value!.care,
        variants: value!.variants,
        colors: [...new Set(value!.variants.map((v) => v.color))],
        sizes: [...new Set(value!.variants.map((v) => v.size))],
        images: value!.images,
      },
    });
    toast("Product saved");
    router.push("/admin/products");
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl">Edit Product</h1>
        <button onClick={() => setDeleting(true)} className="text-sm text-oxblood underline underline-offset-4">
          Delete Product
        </button>
      </div>
      <ProductForm
        value={value}
        onChange={setValue}
        onSave={save}
        onCancel={() => router.push("/admin/products")}
        saveLabel="Save Changes"
      />

      <Modal open={deleting} onClose={() => setDeleting(false)} title="Delete this product?">
        <p className="text-sm text-charcoal/70">{product.name} will be permanently removed.</p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={() => setDeleting(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              dispatch({ type: "DELETE_PRODUCT", id: product.id });
              toast("Product deleted");
              router.push("/admin/products");
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
