"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export function SubNav({ items }: { items: { href: string; label: string }[] }) {
  const pathname = usePathname();

  return (
    <div className="mb-6 flex gap-5 border-b border-line">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "border-b-2 px-1 py-2 text-sm",
              active ? "border-charcoal text-charcoal" : "border-transparent text-charcoal/50 hover:text-charcoal"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
