"use client";

import Link from "next/link";
import { useState } from "react";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="mt-24 border-t border-line bg-ivory">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <h3 className="font-display text-lg">Join the list</h3>
          <p className="mt-2 max-w-xs text-sm text-charcoal/70">
            New arrivals, early access to collections, and notes from the atelier.
          </p>
          {subscribed ? (
            <p className="mt-4 text-sm text-olive">Thank you, you&apos;re on the list.</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!email.includes("@")) return;
                setSubscribed(true);
              }}
              className="mt-4 flex max-w-sm border border-charcoal"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-transparent px-4 py-3 text-sm placeholder:text-charcoal/40 focus:outline-none"
              />
              <button type="submit" className="whitespace-nowrap bg-charcoal px-5 text-sm text-ivory">
                Subscribe
              </button>
            </form>
          )}
        </div>

        <div>
          <h4 className="text-xs tracking-[0.1em] text-charcoal/50">Shop</h4>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            <li><Link href="/shop">All Products</Link></li>
            <li><Link href="/shop/the-essentials-edit">The Essentials Edit</Link></li>
            <li><Link href="/shop/silk-sleep-collection">Silk Sleep Collection</Link></li>
            <li><Link href="/shop/the-lounge-edit">The Lounge Edit</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-[0.1em] text-charcoal/50">Company</h4>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/account/profile">Account</Link></li>
            <li><Link href="/account/orders">Order History</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-[0.1em] text-charcoal/50">Help</h4>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            <li><Link href="/account/addresses">Shipping &amp; Returns</Link></li>
            <li><Link href="/account/orders">Order Status</Link></li>
            <li>
              <a href="mailto:care@ateliernoir.com">Contact Us</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-page flex flex-col items-center justify-between gap-4 border-t border-line-soft py-6 text-xs text-charcoal/50 sm:flex-row">
        <span>© 2026 Atelier Noir. All rights reserved.</span>
        <Link href="/admin" className="underline underline-offset-4 hover:text-charcoal">
          Store Admin
        </Link>
      </div>
    </footer>
  );
}
