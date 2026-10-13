"use client";

import { type ReactNode } from "react";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

export function Modal({
  open,
  onClose,
  title,
  children,
  widthClass = "max-w-md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  widthClass?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/50" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal
        aria-label={title}
        className={cn("relative w-full bg-ivory p-6", widthClass)}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg">{title}</h2>
          <button onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
