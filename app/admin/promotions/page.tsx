"use client";

import { useState } from "react";
import { useStore } from "@/lib/store-context";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { DiscountCode, DiscountType } from "@/lib/types";

const EMPTY: Omit<DiscountCode, "id" | "uses"> = {
  code: "",
  type: "Percentage",
  value: 10,
  expires: new Date().toISOString().slice(0, 10),
  active: true,
};

export default function PromotionsPage() {
  const { state, dispatch, toast } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DiscountCode | null>(null);
  const [draft, setDraft] = useState(EMPTY);
  const [deleting, setDeleting] = useState<DiscountCode | null>(null);

  function openCreate() {
    setEditing(null);
    setDraft(EMPTY);
    setModalOpen(true);
  }

  function openEdit(d: DiscountCode) {
    setEditing(d);
    setDraft(d);
    setModalOpen(true);
  }

  function save() {
    if (editing) {
      dispatch({ type: "UPDATE_DISCOUNT", discount: { ...editing, ...draft } });
      toast("Discount updated");
    } else {
      dispatch({
        type: "ADD_DISCOUNT",
        discount: { ...draft, id: `d-${Math.random().toString(36).slice(2, 9)}`, uses: 0 },
      });
      toast("Discount created");
    }
    setModalOpen(false);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl">Promotions</h1>
        <Button onClick={openCreate}>Create Discount</Button>
      </div>

      <div className="overflow-x-auto border border-line">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-sand/40 text-xs text-charcoal/60">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Uses</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {state.discounts.map((d) => (
              <tr key={d.id}>
                <td className="px-4 py-3 font-medium">{d.code}</td>
                <td className="px-4 py-3">{d.type}</td>
                <td className="px-4 py-3">
                  {d.type === "Percentage" ? `${d.value}%` : d.type === "Fixed amount" ? `$${d.value}` : "—"}
                </td>
                <td className="px-4 py-3">{d.uses}</td>
                <td className="px-4 py-3">{formatDate(d.expires)}</td>
                <td className="px-4 py-3">
                  <button
                    role="switch"
                    aria-checked={d.active}
                    onClick={() => dispatch({ type: "TOGGLE_DISCOUNT_ACTIVE", id: d.id })}
                    className={`h-6 w-11 rounded-full p-0.5 transition-colors ${d.active ? "bg-charcoal" : "bg-sand"}`}
                  >
                    <span
                      className={`block h-5 w-5 rounded-full bg-ivory transition-transform ${d.active ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3 text-xs">
                    <button onClick={() => openEdit(d)} className="underline underline-offset-4">
                      Edit
                    </button>
                    <button onClick={() => setDeleting(d)} className="text-oxblood underline underline-offset-4">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit discount" : "Create discount"}>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-xs text-charcoal/60">
            Code
            <input
              value={draft.code}
              onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase() })}
              className="h-10 border border-line bg-ivory px-3 text-sm text-charcoal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-charcoal/60">
            Type
            <select
              value={draft.type}
              onChange={(e) => setDraft({ ...draft, type: e.target.value as DiscountType })}
              className="h-10 border border-line bg-ivory px-3 text-sm text-charcoal"
            >
              <option value="Percentage">Percentage</option>
              <option value="Fixed amount">Fixed amount</option>
              <option value="Free shipping">Free shipping</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-charcoal/60">
            Value
            <input
              type="number"
              disabled={draft.type === "Free shipping"}
              value={draft.value}
              onChange={(e) => setDraft({ ...draft, value: Number(e.target.value) })}
              className="h-10 border border-line bg-ivory px-3 text-sm text-charcoal disabled:opacity-40"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-charcoal/60">
            Expiration date
            <input
              type="date"
              value={draft.expires.slice(0, 10)}
              onChange={(e) => setDraft({ ...draft, expires: e.target.value })}
              className="h-10 border border-line bg-ivory px-3 text-sm text-charcoal"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.active}
              onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
              className="h-4 w-4 accent-charcoal"
            />
            Active
          </label>
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={save}>{editing ? "Save" : "Create"}</Button>
        </div>
      </Modal>

      <Modal open={deleting !== null} onClose={() => setDeleting(null)} title="Delete this discount?">
        <p className="text-sm text-charcoal/70">{deleting?.code} will be permanently removed.</p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={() => setDeleting(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (deleting) {
                dispatch({ type: "DELETE_DISCOUNT", id: deleting.id });
                toast("Discount deleted");
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
