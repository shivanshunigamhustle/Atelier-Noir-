"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useStore } from "@/lib/store-context";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";

export default function AdminCustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useStore();
  const customer = state.customers.find((c) => c.id === id);
  const [note, setNote] = useState("");

  if (!customer) return notFound();

  const orders = state.orders
    .filter((o) => o.customerId === customer.id)
    .sort((a, b) => (b.date > a.date ? 1 : -1));

  return (
    <div>
      <div className="border border-line p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center border border-charcoal font-display text-xl">
            {customer.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-display text-2xl">{customer.name}</h1>
            <p className="text-sm text-charcoal/50">
              {customer.email} · {customer.phone}
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-charcoal/50">Joined</p>
            <p className="mt-1">{formatDate(customer.joinedDate)}</p>
          </div>
          <div>
            <p className="text-xs text-charcoal/50">Orders</p>
            <p className="mt-1">{customer.orderIds.length}</p>
          </div>
          <div>
            <p className="text-xs text-charcoal/50">Lifetime spend</p>
            <p className="mt-1">{formatCurrency(customer.lifetimeSpend)}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto border border-line">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-sand/40 text-xs text-charcoal/60">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3">{o.id}</td>
                <td className="px-4 py-3">{formatDate(o.date)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3">{formatCurrency(o.total)}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="text-xs underline underline-offset-4">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h3 className="text-xs tracking-[0.08em] text-charcoal/50">ADDRESSES ON FILE</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {customer.addresses.map((a) => (
            <div key={a.id} className="border border-line p-4 text-sm">
              <p className="font-medium">{a.label}</p>
              <p className="mt-1 text-charcoal/70">
                {a.fullName}
                <br />
                {a.line1}
                <br />
                {a.city}, {a.state} {a.zip}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 border border-line p-5">
        <h3 className="text-xs tracking-[0.08em] text-charcoal/50">NOTES</h3>
        <ul className="mt-3 flex flex-col gap-3">
          {customer.notes.map((n) => (
            <li key={n.id} className="text-sm">
              <p>{n.body}</p>
              <p className="text-xs text-charcoal/40">{formatDateTime(n.timestamp)}</p>
            </li>
          ))}
        </ul>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Add a note about this customer"
          className="mt-4 w-full border border-line bg-ivory p-3 text-sm"
        />
        <Button
          size="sm"
          className="mt-3"
          onClick={() => {
            if (!note.trim()) return;
            dispatch({ type: "ADD_CUSTOMER_NOTE", customerId: customer.id, body: note.trim() });
            setNote("");
          }}
        >
          Add Note
        </Button>
      </div>
    </div>
  );
}
