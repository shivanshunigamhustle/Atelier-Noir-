"use client";

import { useState } from "react";
import { Star } from "@phosphor-icons/react";
import { useStore, useCurrentCustomer } from "@/lib/store-context";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/cn";
import type { Address } from "@/lib/types";

type AddressDraft = Omit<Address, "id" | "isDefault">;

const EMPTY_DRAFT: AddressDraft = {
  label: "Home",
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
  phone: "",
};

export default function AddressesPage() {
  const { dispatch, toast } = useStore();
  const customer = useCurrentCustomer();
  const [editing, setEditing] = useState<Address | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<AddressDraft>(EMPTY_DRAFT);
  const [deleting, setDeleting] = useState<Address | null>(null);

  function openEdit(address: Address) {
    setEditing(address);
    setDraft(address);
  }

  function openAdd() {
    setAdding(true);
    setDraft(EMPTY_DRAFT);
  }

  function save() {
    if (editing) {
      dispatch({ type: "UPDATE_ADDRESS", customerId: customer.id, address: { ...editing, ...draft } });
      toast("Address updated");
      setEditing(null);
    } else {
      dispatch({
        type: "ADD_ADDRESS",
        customerId: customer.id,
        address: { ...draft, id: `addr-${Math.random().toString(36).slice(2, 9)}`, isDefault: customer.addresses.length === 0 },
      });
      toast("Address added");
      setAdding(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Button size="sm" onClick={openAdd}>
          Add New Address
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {customer.addresses.map((address) => (
          <div key={address.id} className="border border-line p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{address.label}</span>
              <button
                onClick={() => dispatch({ type: "SET_DEFAULT_ADDRESS", customerId: customer.id, addressId: address.id })}
                aria-label={address.isDefault ? "Default address" : "Set as default"}
                aria-pressed={address.isDefault}
              >
                <Star size={16} weight={address.isDefault ? "fill" : "regular"} className="text-gold" />
              </button>
            </div>
            <p className="mt-2 text-sm text-charcoal/70">
              {address.fullName}
              <br />
              {address.line1} {address.line2}
              <br />
              {address.city}, {address.state} {address.zip}
              <br />
              {address.country}
            </p>
            <div className="mt-4 flex gap-3 text-xs">
              <button onClick={() => openEdit(address)} className="underline underline-offset-4">
                Edit
              </button>
              <button onClick={() => setDeleting(address)} className="text-oxblood underline underline-offset-4">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={adding || editing !== null}
        onClose={() => {
          setAdding(false);
          setEditing(null);
        }}
        title={editing ? "Edit address" : "Add address"}
      >
        <div className="flex flex-col gap-3">
          <ModalField label="Label" value={draft.label} onChange={(v) => setDraft({ ...draft, label: v })} />
          <ModalField label="Full name" value={draft.fullName} onChange={(v) => setDraft({ ...draft, fullName: v })} />
          <ModalField label="Address line 1" value={draft.line1} onChange={(v) => setDraft({ ...draft, line1: v })} />
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="City" value={draft.city} onChange={(v) => setDraft({ ...draft, city: v })} />
            <ModalField label="State" value={draft.state} onChange={(v) => setDraft({ ...draft, state: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="ZIP code" value={draft.zip} onChange={(v) => setDraft({ ...draft, zip: v })} />
            <ModalField label="Phone" value={draft.phone} onChange={(v) => setDraft({ ...draft, phone: v })} />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              setAdding(false);
              setEditing(null);
            }}
          >
            Cancel
          </Button>
          <Button onClick={save}>Save</Button>
        </div>
      </Modal>

      <Modal open={deleting !== null} onClose={() => setDeleting(null)} title="Remove this address?">
        <p className="text-sm text-charcoal/70">This cannot be undone.</p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={() => setDeleting(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (deleting) {
                dispatch({ type: "DELETE_ADDRESS", customerId: customer.id, addressId: deleting.id });
                toast("Address removed");
              }
              setDeleting(null);
            }}
          >
            Remove
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function ModalField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-xs text-charcoal/60">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("h-10 border border-line bg-ivory px-3 text-sm text-charcoal focus-visible:outline-charcoal")}
      />
    </label>
  );
}
