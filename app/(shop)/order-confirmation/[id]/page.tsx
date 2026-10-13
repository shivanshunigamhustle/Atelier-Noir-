"use client";

import { notFound, useParams } from "next/navigation";
import { CheckCircle } from "@phosphor-icons/react";
import { useStore } from "@/lib/store-context";
import { formatCurrency, formatDate, addDays } from "@/lib/format";
import { LinkButton } from "@/components/ui/button";

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useStore();
  const order = state.orders.find((o) => o.id === id);

  if (!order) return notFound();

  const customer = state.customers.find((c) => c.id === order.customerId);
  const estimatedDelivery = addDays(order.date, 5);

  return (
    <div className="container-page flex flex-col items-center py-20 text-center">
      <CheckCircle size={48} weight="fill" className="text-olive" />
      <h1 className="font-display mt-6 text-3xl">
        Thank you, {customer?.name.split(" ")[0]}, your order is on its way.
      </h1>
      <p className="mt-3 text-sm text-charcoal/60">
        Order {order.id} · Estimated delivery {formatDate(estimatedDelivery)}
      </p>

      <div className="mt-10 w-full max-w-md border border-line p-6 text-left">
        <h2 className="text-xs tracking-[0.08em] text-charcoal/50">ORDER SUMMARY</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span>
                {item.name} × {item.qty}
              </span>
              <span>{formatCurrency(item.price * item.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-line pt-3 text-base font-medium">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <LinkButton href={`/account/orders/${order.id}`} variant="secondary">
          View Order
        </LinkButton>
        <LinkButton href="/">Continue Shopping</LinkButton>
      </div>
    </div>
  );
}
