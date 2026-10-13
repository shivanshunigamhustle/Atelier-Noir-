"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash, X } from "@phosphor-icons/react";
import { ALL_CATEGORIES, ALL_COLORS, ALL_SIZES } from "@/lib/mock-data";
import type { Product, ProductCategory, ProductColor, ProductSize, ProductStatus, ProductVariant } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { categoryImage } from "@/lib/image-library";

export interface ProductFormValue {
  name: string;
  description: string;
  category: ProductCategory;
  status: ProductStatus;
  price: number;
  compareAtPrice: number | undefined;
  fit: string;
  care: string;
  variants: ProductVariant[];
  images: string[];
}

export function emptyProductForm(): ProductFormValue {
  return {
    name: "",
    description: "",
    category: "Outerwear",
    status: "Draft",
    price: 0,
    compareAtPrice: undefined,
    fit: "",
    care: "",
    variants: [{ color: "Black", size: "M", stock: 0 }],
    images: [categoryImage("Outerwear", 0)],
  };
}

export function fromProduct(p: Product): ProductFormValue {
  return {
    name: p.name,
    description: p.description,
    category: p.category,
    status: p.status,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    fit: p.fit,
    care: p.care,
    variants: p.variants,
    images: p.images,
  };
}

export function ProductForm({
  value,
  onChange,
  onSave,
  onCancel,
  saveLabel,
}: {
  value: ProductFormValue;
  onChange: (v: ProductFormValue) => void;
  onSave: () => void;
  onCancel: () => void;
  saveLabel: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const nameError = submitted && !value.name.trim();

  function updateVariant(index: number, patch: Partial<ProductVariant>) {
    const variants = value.variants.map((v, i) => (i === index ? { ...v, ...patch } : v));
    onChange({ ...value, variants });
  }

  function removeVariant(index: number) {
    onChange({ ...value, variants: value.variants.filter((_, i) => i !== index) });
  }

  function addVariant() {
    onChange({ ...value, variants: [...value.variants, { color: "Black", size: "M", stock: 0 }] });
  }

  function removeImage(index: number) {
    onChange({ ...value, images: value.images.filter((_, i) => i !== index) });
  }

  function addImage() {
    onChange({ ...value, images: [...value.images, categoryImage(value.category, value.images.length)] });
  }

  function handleSave() {
    setSubmitted(true);
    if (!value.name.trim()) return;
    onSave();
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="border border-line p-6">
        <h2 className="mb-5 text-sm font-medium">Basic info</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs tracking-[0.06em] text-charcoal/60">Name</label>
            <input
              value={value.name}
              onChange={(e) => onChange({ ...value, name: e.target.value })}
              className="mt-2 h-11 w-full border border-line bg-ivory px-3 text-sm focus-visible:outline-charcoal"
            />
            {nameError && <p className="mt-1 text-xs text-oxblood">Name is required.</p>}
          </div>
          <div>
            <label className="text-xs tracking-[0.06em] text-charcoal/60">Description</label>
            <textarea
              value={value.description}
              onChange={(e) => onChange({ ...value, description: e.target.value })}
              rows={3}
              className="mt-2 w-full border border-line bg-ivory px-3 py-2 text-sm focus-visible:outline-charcoal"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs tracking-[0.06em] text-charcoal/60">Category</label>
              <select
                value={value.category}
                onChange={(e) => onChange({ ...value, category: e.target.value as ProductCategory })}
                className="mt-2 h-11 w-full border border-line bg-ivory px-3 text-sm"
              >
                {ALL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs tracking-[0.06em] text-charcoal/60">Status</label>
              <select
                value={value.status}
                onChange={(e) => onChange({ ...value, status: e.target.value as ProductStatus })}
                className="mt-2 h-11 w-full border border-line bg-ivory px-3 text-sm"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs tracking-[0.06em] text-charcoal/60">Fit notes</label>
              <input
                value={value.fit}
                onChange={(e) => onChange({ ...value, fit: e.target.value })}
                className="mt-2 h-11 w-full border border-line bg-ivory px-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs tracking-[0.06em] text-charcoal/60">Care instructions</label>
              <input
                value={value.care}
                onChange={(e) => onChange({ ...value, care: e.target.value })}
                className="mt-2 h-11 w-full border border-line bg-ivory px-3 text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border border-line p-6">
        <h2 className="mb-5 text-sm font-medium">Pricing</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs tracking-[0.06em] text-charcoal/60">Price (USD)</label>
            <input
              type="number"
              value={value.price}
              onChange={(e) => onChange({ ...value, price: Number(e.target.value) })}
              className="mt-2 h-11 w-full border border-line bg-ivory px-3 text-sm"
            />
          </div>
          <div>
            <label className="text-xs tracking-[0.06em] text-charcoal/60">Compare-at price (optional)</label>
            <input
              type="number"
              value={value.compareAtPrice ?? ""}
              onChange={(e) =>
                onChange({ ...value, compareAtPrice: e.target.value ? Number(e.target.value) : undefined })
              }
              className="mt-2 h-11 w-full border border-line bg-ivory px-3 text-sm"
            />
          </div>
        </div>
      </section>

      <section className="border border-line p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-medium">Variants</h2>
          <button onClick={addVariant} className="flex items-center gap-1 text-xs underline underline-offset-4">
            <Plus size={12} /> Add Variant
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {value.variants.map((v, i) => (
            <div key={i} className="flex items-center gap-3">
              <select
                value={v.color}
                onChange={(e) => updateVariant(i, { color: e.target.value as ProductColor })}
                className="h-10 flex-1 border border-line bg-ivory px-2 text-sm"
              >
                {ALL_COLORS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={v.size}
                onChange={(e) => updateVariant(i, { size: e.target.value as ProductSize })}
                className="h-10 flex-1 border border-line bg-ivory px-2 text-sm"
              >
                {ALL_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={v.stock}
                onChange={(e) => updateVariant(i, { stock: Number(e.target.value) })}
                className="h-10 w-24 border border-line bg-ivory px-2 text-sm"
                aria-label="Stock"
              />
              <button onClick={() => removeVariant(i)} aria-label="Remove variant">
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-line p-6">
        <h2 className="mb-5 text-sm font-medium">Images</h2>
        <div className="grid grid-cols-4 gap-3">
          {value.images.map((src, i) => (
            <div key={i} className="group relative aspect-[4/5] bg-sand">
              <Image src={src} alt="" fill sizes="150px" className="object-cover" />
              <button
                onClick={() => removeImage(i)}
                aria-label="Remove image"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-ivory opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={addImage}
            className="flex aspect-[4/5] items-center justify-center border border-dashed border-line text-charcoal/40"
            aria-label="Add image"
          >
            <Plus size={20} />
          </button>
        </div>
      </section>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>{saveLabel}</Button>
      </div>
    </div>
  );
}
