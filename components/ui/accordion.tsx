"use client";

import { useState, type ReactNode } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

export function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-line">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium"
      >
        {title}
        <CaretDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      <div className={cn("overflow-hidden transition-[max-height]", open ? "max-h-[600px]" : "max-h-0")}>
        <div className="pb-5 text-sm leading-relaxed text-charcoal/70">{children}</div>
      </div>
    </div>
  );
}
