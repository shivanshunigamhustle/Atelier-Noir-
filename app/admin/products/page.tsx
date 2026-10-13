"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PencilSimple, Copy, Trash } from "@phosphor-icons/react";
import { useStore } from "@/lib/store-context";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ALL_CATEGORIES } from "@/lib/mock-data";
import type { Product, ProductCategory, ProductStatus } from "@/lib/types";
import { cn } from "@/lib/cn";
import { SubNav } from "@/components/admin/sub-nav";

const PAGE_SIZE = 10;

export default function AdminProductsPage() {
  const { state, dispatch, toast } = useStore();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"All" | ProductCategory>("All");
  const [status, setStatus] = useState<"All" | ProductStatus>("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return state.products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== "All" && p.category !== category) return false;
      if (status !== "All" && p.status !== status) return false;
      return true;
    });
  }, [state.products, search, category, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allPageSelected = pageItems.length > 0 && pageItems.every((p) => selected.includes(p.id));

  function toggleAll() {
    if (allPageSelected) {
      setSelected((s) => s.filter((id) => !pageItems.some((p) => p.id === id)));
    } else {
      setSelected((s) => [...new Set([...s, ...pageItems.map((p) => p.id)])]);
    }
  }

  function toggleOne(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function bulk(action: "activate" | "archive" | "delete") {
    if (action === "delete") {
      dispatch({ type: "BULK_DELETE", ids: selected });
      toast(`${selected.length} products deleted`);
    } else {
      dispatch({ type: "BULK_SET_STATUS", ids: selected, status: action === "activate" ? "Active" : "Archived" });
      toast(`${selected.length} products updated`);
    }
    setSelected([]);
  }

  return (
    <div>
      <SubNav
        items={[
          { href: "/admin/products", label: "All Products" },
          { href: "/admin/products/collections", label: "Collections" },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl">Products</h1>
        <Button onClick={() => router.push("/admin/products/new")}>Add Product</Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search products"
          className="h-10 w-56 border border-line bg-ivory px-3 text-sm focus-visible:outline-charcoal"
        />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as "All" | ProductCategory);
            setPage(1);
          }}
          className="h-10 border border-line bg-ivory px-3 text-sm"
        >
          <option value="All">All categories</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as "All" | ProductStatus);
            setPage(1);
          }}
          className="h-10 border border-line bg-ivory px-3 text-sm"
        >
          <option value="All">All statuses</option>
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      {selected.length > 0 && (
        <div className="mt-4 flex items-center gap-3 bg-charcoal px-4 py-3 text-sm text-ivory">
          <span>{selected.length} selected</span>
          <button onClick={() => bulk("activate")} className="underline underline-offset-4">
            Set Active
          </button>
          <button onClick={() => bulk("archive")} className="underline underline-offset-4">
            Archive
          </button>
          <button onClick={() => bulk("delete")} className="underline underline-offset-4">
            Delete selected
          </button>
        </div>
      )}

      <div className="mt-4 overflow-x-auto border border-line">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-sand/40 text-xs text-charcoal/60">
            <tr>
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={allPageSelected} onChange={toggleAll} className="h-4 w-4 accent-charcoal" />
              </th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {pageItems.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={() => toggleOne(p.id)}
                    className="h-4 w-4 accent-charcoal"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-10 shrink-0 bg-sand">
                      <Image src={p.images[0]} alt={p.name} fill sizes="40px" className="object-cover" />
                    </div>
                    <Link href={`/admin/products/${p.id}`} className="hover:underline">
                      {p.name}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">{formatCurrency(p.price)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">
                  <select
                    value={p.status}
                    onChange={(e) =>
                      dispatch({ type: "SET_PRODUCT_STATUS", id: p.id, status: e.target.value as ProductStatus })
                    }
                    className={cn(
                      "border-0 bg-transparent text-xs font-medium",
                      p.status === "Active" && "text-olive",
                      p.status === "Draft" && "text-charcoal/60",
                      p.status === "Archived" && "text-oxblood"
                    )}
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/products/${p.id}`} aria-label="Edit">
                      <PencilSimple size={16} />
                    </Link>
                    <button
                      aria-label="Duplicate"
                      onClick={() => {
                        dispatch({ type: "DUPLICATE_PRODUCT", id: p.id });
                        toast("Product duplicated");
                      }}
                    >
                      <Copy size={16} />
                    </button>
                    <button aria-label="Delete" onClick={() => setDeleting(p)}>
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-charcoal/60">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="border border-line px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="border border-line px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <Modal open={deleting !== null} onClose={() => setDeleting(null)} title="Delete this product?">
        <p className="text-sm text-charcoal/70">
          {deleting?.name} will be permanently removed from the catalog.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={() => setDeleting(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (deleting) {
                dispatch({ type: "DELETE_PRODUCT", id: deleting.id });
                toast("Product deleted");
              }
              setDeleting(null);
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
