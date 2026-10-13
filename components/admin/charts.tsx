"use client";

import type { SalesPoint } from "@/lib/admin-data";

export function LineChart({ data, height = 220 }: { data: SalesPoint[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const width = 100;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = max === min ? height / 2 : height - ((d.value - min) / (max - min)) * (height - 20) - 10;
    return `${x},${y}`;
  });

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-[220px] w-full"
        role="img"
        aria-label={`Sales trend from ${data[0]?.label} to ${data[data.length - 1]?.label}`}
      >
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="var(--color-charcoal)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-charcoal/50">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

export function BarChart({ data, height = 220 }: { data: SalesPoint[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div>
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((d) => (
          <div key={d.label} className="flex flex-1 flex-col items-center justify-end gap-2">
            <div
              className="w-full bg-charcoal/80"
              style={{ height: `${Math.max(4, (d.value / max) * (height - 24))}px` }}
              title={`${d.label}: ${d.value}`}
            />
            <span className="text-[10px] text-charcoal/50">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
