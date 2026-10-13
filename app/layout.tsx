import type { Metadata } from "next";
import { Playfair_Display, Work_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store-context";
import { ToastStack } from "@/components/ui/toast-stack";
import { CartDrawer } from "@/components/storefront/cart-drawer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-worksans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Atelier Noir — Contemporary Fashion, Considered",
    template: "%s — Atelier Noir",
  },
  description:
    "Atelier Noir is a contemporary fashion house for considered outerwear, knitwear, tailoring and accessories, built from materials that hold their shape season after season.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${workSans.variable} h-full`}>
      <body className="min-h-full bg-ivory text-charcoal antialiased">
        <StoreProvider>
          {children}
          <CartDrawer />
          <ToastStack />
        </StoreProvider>
      </body>
    </html>
  );
}
