"use client";

import { useState } from "react";
import Image from "next/image";
import { useStore } from "@/lib/store-context";
import { Button } from "@/components/ui/button";
import { SubNav } from "@/components/admin/sub-nav";
import { editorialImage } from "@/lib/image-library";
import type { Collection } from "@/lib/types";

export default function AdminCollectionsPage() {
  const { state, dispatch, toast } = useStore();
  const [editing, setEditing] = useState<Collection | null>(null);
  const [creating, setCreating] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftProductIds, setDraftProductIds] = useState<string[]>([]);

  function openEdit(collection: Collection) {
    setEditing(collection);
    setDraftName(collection.name);
    setDraftProductIds(collection.productIds);
  }

  function openCreate() {
    setCreating(true);
    setDraftName("");
    setDraftProductIds([]);
  }

  function toggleProduct(id: string) {
    setDraftProductIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }

  function save() {
    if (editing) {
      dispatch({
        type: "UPDATE_COLLECTION",
        collection: { ...editing, name: draftName, productIds: draftProductIds },
      });
      toast("Collection updated");
      setEditing(null);
    } else {
      dispatch({
        type: "ADD_COLLECTION",
        collection: {
          id: `c-${Math.random().toString(36).slice(2, 9)}`,
          slug: draftName.toLowerCase().replace(/\s+/g, "-"),
          name: draftName,
          coverImage: editorialImage(Math.floor(Math.random() * 4), 1600, 900),
          productIds: draftProductIds,
        },
      });
      toast("Collection created");
      setCreating(false);
    }
  }

  const sheetOpen = editing !== null || creating;

  return (
    <div>
      <SubNav
        items={[
          { href: "/admin/products", label: "All Products" },
          { href: "/admin/products/collections", label: "Collections" },
        ]}
      />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl">Collections</h1>
        <Button onClick={openCreate}>New Collection</Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {state.collections.map((c) => (
          <div key={c.id} className="border border-line">
            <div className="relative aspect-[16/9] bg-sand">
              <Image src={c.coverImage} alt={c.name} fill sizes="400px" className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg">{c.name}</h3>
              <p className="mt-1 text-xs text-charcoal/50">{c.productIds.length} products</p>
              <button onClick={() => openEdit(c)} className="mt-3 text-xs underline underline-offset-4">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`fixed inset-0 z-[70] transition-opacity ${sheetOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <div
          className="absolute inset-0 bg-charcoal/40"
          onClick={() => {
            setEditing(null);
            setCreating(false);
          }}
        />
        <div
          className={`absolute inset-y-0 right-0 w-full max-w-md overflow-y-auto bg-ivory p-6 transition-transform duration-300 ${sheetOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <h2 className="font-display text-xl">{editing ? "Edit collection" : "New collection"}</h2>
          <label className="mt-6 block text-xs tracking-[0.06em] text-charcoal/60">
            Name
            <input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="mt-2 h-11 w-full border border-line bg-ivory px-3 text-sm"
            />
          </label>

          {editing && (
            <div className="mt-4">
              <span className="text-xs tracking-[0.06em] text-charcoal/60">Cover image</span>
              <div className="relative mt-2 aspect-[16/9] bg-sand">
                <Image src={editing.coverImage} alt="" fill sizes="400px" className="object-cover" />
              </div>
              <button
                onClick={() =>
                  setEditing({
                    ...editing,
                    coverImage: editorialImage(Math.floor(Math.random() * 4), 1600, 900),
                  })
                }
                className="mt-2 text-xs underline underline-offset-4"
              >
                Change image
              </button>
            </div>
          )}

          <p className="mt-6 text-xs tracking-[0.06em] text-charcoal/60">Products</p>
          <div className="mt-2 max-h-64 overflow-y-auto border border-line">
            {state.products.map((p) => (
              <label key={p.id} className="flex items-center gap-2 border-b border-line-soft px-3 py-2 text-sm last:border-b-0">
                <input
                  type="checkbox"
                  checked={draftProductIds.includes(p.id)}
                  onChange={() => toggleProduct(p.id)}
                  className="h-4 w-4 accent-charcoal"
                />
                {p.name}
              </label>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setEditing(null);
                setCreating(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={save}>{editing ? "Save" : "Create"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
