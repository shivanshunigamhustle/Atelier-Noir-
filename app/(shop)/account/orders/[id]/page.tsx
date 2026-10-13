"use client";

import { useState } from "react";
import Image from "next/image";
import { notFound, useParams, useRouter } from "next/navigation";
import { Check } from "@phosphor-icons/react";
import { useStore } from "@/lib/store-context";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/cn";
import type { OrderStatus } from "@/lib/types";

const TRACKER_STEPS: OrderStatus[] = ["Processing", "Shipped", "Delivered"];

export default function CustomerOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch, toast } = useStore();
  const router = useRouter();
  const [helpOpen, setHelpOpen] = useState(false);
  const [message, setMessage] = useState("");

  const order = state.orders.find((o) => o.id === id);
  if (!order) return notFound();

  const currentIndex = TRACKER_STEPS.indexOf(order.status);

  function reorder() {
    order!.items.forEach((item) => {
      dispatch({
        type: "ADD_TO_CART",
        line: {
          productId: item.productId,
          name: item.name,
          image: item.image,
          color: item.color,
          size: item.size,
          qty: item.qty,
          price: item.price,
        },
      });
    });
    dispatch({ type: "OPEN_CART" });
    toast("Items added to your bag");
  }

  return (
    <div>
      <button onClick={() => router.push("/account/orders")} className="mb-6 text-xs underline underline-offset-4">
        Back to orders
      </button>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">{order.id}</h2>
          <p className="text-sm text-charcoal/50">Placed {formatDate(order.date)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {order.status !== "Cancelled" && (
        <div className="mt-8 flex items-center">
          {TRACKER_STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-xs",
                    i <= currentIndex ? "border-charcoal bg-charcoal text-ivory" : "border-line text-charcoal/40"
                  )}
                >
                  {i < currentIndex ? <Check size={14} /> : i + 1}
                </div>
                <span className="text-xs text-charcoal/60">{s}</span>
              </div>
              {i < TRACKER_STEPS.length - 1 && (
                <div className={cn("mx-2 h-px flex-1", i < currentIndex ? "bg-charcoal" : "bg-line")} />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 divide-y divide-line-soft border-t border-b border-line">
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-4 py-4">
            <div className="relative h-20 w-16 shrink-0 bg-sand">
              <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover photo-grade" />
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

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button onClick={reorder}>Reorder</Button>
        <button onClick={() => setHelpOpen(true)} className="text-sm underline underline-offset-4">
          Need help?
        </button>
      </div>

      <Modal open={helpOpen} onClose={() => setHelpOpen(false)} title="Contact us about this order">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="How can we help?"
          className="w-full border border-line bg-ivory p-3 text-sm focus-visible:outline-charcoal"
        />
        <Button
          className="mt-4 w-full"
          onClick={() => {
            setHelpOpen(false);
            setMessage("");
            toast("Message sent. We'll follow up by email.");
          }}
        >
          Send
        </Button>
      </Modal>
    </div>
  );
}
