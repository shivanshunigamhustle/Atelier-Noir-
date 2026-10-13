import { cn } from "@/lib/cn";
import type { OrderStatus } from "@/lib/types";

export const STATUS_BADGE_STYLES: Record<OrderStatus, string> = {
  Processing: "bg-sand text-charcoal",
  Shipped: "bg-camel/30 text-charcoal",
  Delivered: "bg-olive/20 text-olive",
  Cancelled: "bg-oxblood/10 text-oxblood",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 text-xs font-medium", STATUS_BADGE_STYLES[status])}>
      {status}
    </span>
  );
}
