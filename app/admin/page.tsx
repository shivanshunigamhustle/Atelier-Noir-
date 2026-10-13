"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { StatTile } from "@/components/admin/stat-tile";
import { LineChart } from "@/components/admin/charts";
import { generateSalesTrend } from "@/lib/admin-data";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";

const RANGE_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
] as const;

const LOW_STOCK_THRESHOLD = 10;

export default function AdminDashboardPage() {
  const { state, dispatch, toast } = useStore();
  const [range, setRange] = useState<"7" | "30" | "90">("30");

  const trend = useMemo(() => generateSalesTrend(Number(range)), [range]);
  const recentOrders = [...state.orders].sort((a, b) => (b.date > a.date ? 1 : -1)).slice(0, 8);
  const lowStock = state.products
    .filter((p) => p.status === "Active" && p.stock < LOW_STOCK_THRESHOLD)
    .slice(0, 5);

  function customerName(customerId: string) {
    return state.customers.find((c) => c.id === customerId)?.name ?? "Unknown";
  }

  function restock(id: string) {
    dispatch({ type: "RESTOCK_PRODUCT", id, amount: 50 });
    toast("Stock updated");
  }

  return (
    <div>
      <h1 className="font-display text-2xl">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Today's Sales" value={formatCurrency(2840)} delta={12} />
        <StatTile label="Orders" value="18" delta={6} />
        <StatTile label="New Customers" value="4" delta={-3} />
        <StatTile label="Conversion Rate" value="3.2%" delta={2} />
      </div>

      <div className="mt-8 border border-line p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium">Sales trend</h2>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as "7" | "30" | "90")}
            className="border border-line bg-ivory px-3 py-1.5 text-xs"
          >
            {RANGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <LineChart data={trend} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="border border-line">
          <div className="border-b border-line p-5">
            <h2 className="text-sm font-medium">Recent Orders</h2>
          </div>
          <div className="divide-y divide-line-soft">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm">{order.id}</p>
                  <p className="truncate text-xs text-charcoal/50">{customerName(order.customerId)}</p>
                </div>
                <span className="hidden text-xs text-charcoal/50 sm:block">{formatDate(order.date)}</span>
                <StatusBadge status={order.status} />
                <span className="text-sm">{formatCurrency(order.total)}</span>
                <Link href={`/admin/orders/${order.id}`} className="text-xs underline underline-offset-4">
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-line">
          <div className="border-b border-line p-5">
            <h2 className="text-sm font-medium">Low Stock</h2>
          </div>
          <div className="divide-y divide-line-soft">
            {lowStock.length === 0 ? (
              <p className="p-5 text-sm text-charcoal/50">All products are well stocked.</p>
            ) : (
              lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm">{p.name}</p>
                    <p className="text-xs text-charcoal/50">{p.stock} units left</p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => restock(p.id)}>
                    Restock
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
