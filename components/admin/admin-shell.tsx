"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SquaresFour,
  TShirt,
  ShoppingBagOpen,
  Users,
  Tag,
  Newspaper,
  ChartLine,
  GearSix,
} from "@phosphor-icons/react";
import { ADMIN_STAFF } from "@/lib/mock-data";
import { cn } from "@/lib/cn";
import { LogoMark } from "@/components/ui/logo-mark";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: SquaresFour },
  { href: "/admin/products", label: "Products", icon: TShirt },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBagOpen },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/promotions", label: "Promotions", icon: Tag },
  { href: "/admin/editorial", label: "Editorial", icon: Newspaper },
  { href: "/admin/reports/sales", label: "Reports", icon: ChartLine },
  { href: "/admin/settings/store", label: "Settings", icon: GearSix },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  function backToStore() {
    router.push("/");
  }

  return (
    <div className="flex min-h-screen bg-ivory text-charcoal">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-ivory lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-line px-6">
          <LogoMark className="h-6 w-6" />
          <span className="font-display text-lg tracking-[0.08em]">ATELIER NOIR</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-6">
          {NAV.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm",
                  active ? "bg-charcoal text-ivory" : "text-charcoal/70 hover:bg-sand/60"
                )}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center border border-charcoal font-display text-sm">
              {ADMIN_STAFF.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{ADMIN_STAFF.name}</p>
              <p className="truncate text-xs text-charcoal/50">{ADMIN_STAFF.title}</p>
            </div>
          </div>
          <button
            onClick={backToStore}
            className="mt-4 text-xs text-charcoal/60 underline underline-offset-4 hover:text-charcoal"
          >
            Back to Store
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-line px-4 lg:hidden">
          <span className="font-display flex items-center gap-2 text-base tracking-[0.08em]">
            <LogoMark className="h-5 w-5" />
            ATELIER NOIR
          </span>
          <button onClick={backToStore} className="text-xs underline underline-offset-4">
            Back to Store
          </button>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-line px-3 py-2 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap px-3 py-1.5 text-xs text-charcoal/70"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
