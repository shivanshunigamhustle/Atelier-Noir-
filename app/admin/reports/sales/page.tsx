"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store-context";
import { generateWeeklyRevenue } from "@/lib/admin-data";
import { BarChart } from "@/components/admin/charts";
import { StatTile } from "@/components/admin/stat-tile";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { SubNav } from "@/components/admin/sub-nav";

const RANGE_OPTIONS = [
  { value: "7", label: "Last 7 days", weeks: 1 },
  { value: "30", label: "Last 30 days", weeks: 4 },
  { value: "90", label: "Last 90 days", weeks: 12 },
  { value: "ytd", label: "Year to date", weeks: 40 },
] as const;

export default function SalesOverviewPage() {
  const { toast } = useStore();
  const [range, setRange] = useState<(typeof RANGE_OPTIONS)[number]["value"]>("30");

  const selected = RANGE_OPTIONS.find((r) => r.value === range)!;
  const weekly = useMemo(() => generateWeeklyRevenue(selected.weeks), [selected.weeks]);
  const revenue = weekly.reduce((s, w) => s + w.value, 0);
  const orders = Math.round(revenue / 145);
  const aov = Math.round(revenue / orders);

  return (
    <div>
      <SubNav
        items={[
          { href: "/admin/reports/sales", label: "Sales Overview" },
          { href: "/admin/reports/products", label: "Top Products" },
        ]}
      />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl">Sales Overview</h1>
        <div className="flex items-center gap-3">
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
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast("Report exported")}
          >
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Revenue" value={formatCurrency(revenue)} />
        <StatTile label="Orders" value={orders.toString()} />
        <StatTile label="Average Order Value" value={formatCurrency(aov)} />
      </div>

      <div className="mt-8 border border-line p-5">
        <h2 className="mb-4 text-sm font-medium">Revenue by week</h2>
        <BarChart data={weekly} />
      </div>
    </div>
  );
}
