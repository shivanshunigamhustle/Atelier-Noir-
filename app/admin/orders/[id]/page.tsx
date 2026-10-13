"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useStore } from "@/lib/store-context";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { OrderStatus } from "@/lib/types";

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch, toast } = useStore();
  const order = state.orders.find((o) => o.id === id);
  const [note, setNote] = useState("");
  const [refundOpen, setRefundOpen] = useState(false);

  if (!order) return notFound();

  const customer = state.customers.find((c) => c.id === order.customerId);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl">{order.id}</h1>
          <p className="mt-1 text-sm text-charcoal/50">
            {formatDateTime(order.date)} ·{" "}
            {customer && (
              <Link href={`/admin/customers/${customer.id}`} className="underline underline-offset-4">
                {customer.name}
              </Link>
            )}
          </p>
        </div>
        <select
          value={order.status}
          onChange={(e) => {
            dispatch({ type: "UPDATE_ORDER_STATUS", orderId: order.id, status: e.target.value as OrderStatus });
            toast(`Order ${order.id} marked ${e.target.value}`);
          }}
          className="h-10 border border-line bg-ivory px-3 text-sm"
        >
          {(["Processing", "Shipped", "Delivered", "Cancelled"] as OrderStatus[]).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 divide-y divide-line-soft border-t border-b border-line">
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-4 py-4">
            <div className="relative h-20 w-16 shrink-0 bg-sand">
              <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
            </div>
            <div className="flex flex-1 items-center justify-between">
              <div>
                <p className="text-sm">{item.name}</p>
                <p className="text-xs text-charcoal/50">
                  {item.color} / {item.size} × {item.qty}
                </p>
              </div>
              <span className="text-sm">{formatCurrency(item.price * item.qty)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="border border-line p-5">
          <h3 className="text-xs tracking-[0.08em] text-charcoal/50">SHIPPING ADDRESS</h3>
          <p className="mt-2 text-sm">
            {order.shippingAddress.fullName}
            <br />
            {order.shippingAddress.line1}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
          </p>
        </div>
        <div className="border border-line p-5">
          <h3 className="text-xs tracking-[0.08em] text-charcoal/50">PAYMENT METHOD</h3>
          <p className="mt-2 text-sm">{order.paymentMethodMasked}</p>
        </div>
      </div>

      <div className="mt-8 border border-line p-5">
        <h3 className="text-xs tracking-[0.08em] text-charcoal/50">STATUS HISTORY</h3>
        <ul className="mt-3 flex flex-col gap-2">
          {order.statusHistory.map((h, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span>{h.status}</span>
              <span className="text-charcoal/50">{formatDateTime(h.timestamp)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 border border-line p-5">
        <h3 className="text-xs tracking-[0.08em] text-charcoal/50">INTERNAL NOTES</h3>
        <ul className="mt-3 flex flex-col gap-3">
          {order.notes.map((n) => (
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
          placeholder="Add an internal note"
          className="mt-4 w-full border border-line bg-ivory p-3 text-sm"
        />
        <Button
          size="sm"
          className="mt-3"
          onClick={() => {
            if (!note.trim()) return;
            dispatch({ type: "ADD_ORDER_NOTE", orderId: order.id, body: note.trim() });
            setNote("");
          }}
        >
          Add Note
        </Button>
      </div>

      {order.status !== "Cancelled" && (
        <div className="mt-8">
          <Button variant="destructive" onClick={() => setRefundOpen(true)}>
            Refund Order
          </Button>
        </div>
      )}

      <Modal open={refundOpen} onClose={() => setRefundOpen(false)} title="Refund this order?">
        <p className="text-sm text-charcoal/70">
          Refund {formatCurrency(order.total)} to {customer?.name}?
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={() => setRefundOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              dispatch({ type: "REFUND_ORDER", orderId: order.id });
              toast("Order refunded");
              setRefundOpen(false);
            }}
          >
            Refund
          </Button>
        </div>
      </Modal>
    </div>
  );
}
