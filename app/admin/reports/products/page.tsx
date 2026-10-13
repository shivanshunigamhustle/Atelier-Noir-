"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store-context";
import { formatCurrency } from "@/lib/format";
import { SubNav } from "@/components/admin/sub-nav";

const RANGE_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
] as const;

function seeded(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function TopProductsPage() {
  const { state } = useStore();
  const router = useRouter();
  const [range, setRange] = useState<(typeof RANGE_OPTIONS)[number]["value"]>("30");

  const rows = useMemo(() => {
    return state.products
      .filter((p) => p.status === "Active")
      .map((p, i) => {
        const factor = Number(range) / 30;
        const units = Math.max(3, Math.round(seeded(i + Number(range)) * 60 * factor));
        return { product: p, units, revenue: units * p.price };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  }, [state.products, range]);

  return (
    <div>
      <SubNav
        items={[
          { href: "/admin/reports/sales", label: "Sales Overview" },
          { href: "/admin/reports/products", label: "Top Products" },
        ]}
      />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl">Top Products</h1>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as typeof range)}
          className="h-10 border border-line bg-ivory px-3 text-sm"
        >
          {RANGE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto border border-line">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-sand/40 text-xs text-charcoal/60">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Units Sold</th>
              <th className="px-4 py-3">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {rows.map((row, i) => (
              <tr
                key={row.product.id}
                onClick={() => router.push(`/admin/products/${row.product.id}`)}
                className="cursor-pointer hover:bg-sand/30"
              >
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-10 shrink-0 bg-sand">
                      <Image src={row.product.images[0]} alt={row.product.name} fill sizes="40px" className="object-cover" />
                    </div>
                    {row.product.name}
                  </div>
                </td>
                <td className="px-4 py-3">{row.units}</td>
                <td className="px-4 py-3">{formatCurrency(row.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
