"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore, useCurrentCustomer } from "@/lib/store-context";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/ui/status-badge";
import type { OrderStatus } from "@/lib/types";

const FILTERS: ("All" | OrderStatus)[] = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function OrderHistoryPage() {
  const { state } = useStore();
  const customer = useCurrentCustomer();
  const [filter, setFilter] = useState<"All" | OrderStatus>("All");

  const orders = state.orders
    .filter((o) => o.customerId === customer.id)
    .filter((o) => filter === "All" || o.status === filter)
    .sort((a, b) => (b.date > a.date ? 1 : -1));

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <label htmlFor="order-status-filter" className="sr-only">
          Filter by status
        </label>
        <select
          id="order-status-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as "All" | OrderStatus)}
          className="border border-line bg-ivory px-3 py-2 text-sm"
        >
          {FILTERS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {orders.length === 0 ? (
        <p className="py-16 text-center text-sm text-charcoal/60">No orders in this category yet.</p>
      ) : (
        <div className="divide-y divide-line border-t border-b border-line">
          {orders.map((order) => (
            <div key={order.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
              <div>
                <p className="text-sm font-medium">{order.id}</p>
                <p className="text-xs text-charcoal/50">{formatDate(order.date)}</p>
              </div>
              <StatusBadge status={order.status} />
              <p className="text-sm">{formatCurrency(order.total)}</p>
              <Link
                href={`/account/orders/${order.id}`}
                className="border border-charcoal px-4 py-2 text-xs hover:bg-charcoal hover:text-ivory"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
