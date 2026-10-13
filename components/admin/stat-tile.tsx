import { ArrowDown, ArrowUp } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

export function StatTile({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: number;
}) {
  return (
    <div className="border border-line p-5">
      <p className="text-xs tracking-[0.06em] text-charcoal/50">{label}</p>
      <p className="font-display mt-2 text-2xl">{value}</p>
      {delta !== undefined && (
        <p
          className={cn(
            "mt-2 flex items-center gap-1 text-xs",
            delta >= 0 ? "text-olive" : "text-oxblood"
          )}
        >
          {delta >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {Math.abs(delta)}% vs yesterday
        </p>
      )}
    </div>
  );
}
