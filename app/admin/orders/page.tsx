"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { formatCurrency, formatDate } from "@/lib/format";
import { STATUS_BADGE_STYLES } from "@/components/ui/status-badge";
import { cn } from "@/lib/cn";
import type { OrderStatus } from "@/lib/types";

const STATUSES: ("All" | OrderStatus)[] = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const { state, dispatch, toast } = useStore();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"All" | OrderStatus>("All");

  function customerName(customerId: string) {
    return state.customers.find((c) => c.id === customerId)?.name ?? "Unknown";
  }

  const orders = useMemo(() => {
    return state.orders
      .filter((o) => {
        if (status !== "All" && o.status !== status) return false;
        if (search) {
          const q = search.toLowerCase();
          return o.id.toLowerCase().includes(q) || customerName(o.customerId).toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => (b.date > a.date ? 1 : -1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.orders, status, search]);

  function updateStatus(orderId: string, next: OrderStatus) {
    dispatch({ type: "UPDATE_ORDER_STATUS", orderId, status: next });
    toast(`Order ${orderId} marked ${next}`);
  }

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl">Orders</h1>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order # or customer"
          className="h-10 w-64 border border-line bg-ivory px-3 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "All" | OrderStatus)}
          className="h-10 border border-line bg-ivory px-3 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto border border-line">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-sand/40 text-xs text-charcoal/60">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3">{o.id}</td>
                <td className="px-4 py-3">{customerName(o.customerId)}</td>
                <td className="px-4 py-3">{formatDate(o.date)}</td>
                <td className="px-4 py-3">{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                <td className="px-4 py-3">{formatCurrency(o.total)}</td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                    className={cn(
                      "border-0 px-2.5 py-1 text-xs font-medium focus-visible:outline-charcoal",
                      STATUS_BADGE_STYLES[o.status]
                    )}
                  >
                    {(["Processing", "Shipped", "Delivered", "Cancelled"] as OrderStatus[]).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
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
    </div>
  );
}
