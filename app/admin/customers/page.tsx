"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { formatCurrency, formatDate } from "@/lib/format";

type SortKey = "newest" | "most-orders" | "highest-spend";

export default function AdminCustomersPage() {
  const { state } = useStore();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  const customers = useMemo(() => {
    const filtered = state.customers.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );
    const copy = [...filtered];
    switch (sort) {
      case "most-orders":
        return copy.sort((a, b) => b.orderIds.length - a.orderIds.length);
      case "highest-spend":
        return copy.sort((a, b) => b.lifetimeSpend - a.lifetimeSpend);
      default:
        return copy.sort((a, b) => (b.joinedDate > a.joinedDate ? 1 : -1));
    }
  }, [state.customers, search, sort]);

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl">Customers</h1>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="h-10 w-64 border border-line bg-ivory px-3 text-sm"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="h-10 border border-line bg-ivory px-3 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="most-orders">Most orders</option>
          <option value="highest-spend">Highest spend</option>
        </select>
      </div>

      <div className="overflow-x-auto border border-line">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-sand/40 text-xs text-charcoal/60">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Lifetime Spend</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {customers.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center border border-line text-xs">
                      {c.name.charAt(0)}
                    </div>
                    {c.name}
                  </div>
                </td>
                <td className="px-4 py-3">{c.email}</td>
                <td className="px-4 py-3">{c.orderIds.length}</td>
                <td className="px-4 py-3">{formatCurrency(c.lifetimeSpend)}</td>
                <td className="px-4 py-3">{formatDate(c.joinedDate)}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/customers/${c.id}`} className="text-xs underline underline-offset-4">
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
