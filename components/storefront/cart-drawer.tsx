"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Minus, Plus } from "@phosphor-icons/react";
import { useStore, cartSubtotal } from "@/lib/store-context";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function CartDrawer() {
  const { state, dispatch, toast } = useStore();
  const router = useRouter();
  const subtotal = cartSubtotal(state.cart);
  const count = state.cart.reduce((sum, l) => sum + l.qty, 0);

  function removeLine(id: string) {
    const index = state.cart.findIndex((l) => l.id === id);
    const line = state.cart[index];
    dispatch({ type: "REMOVE_CART_LINE", id });
    toast("Removed from your bag", {
      actionLabel: "Undo",
      onAction: () => dispatch({ type: "RESTORE_CART_LINE", line, index }),
    });
  }

  function close() {
    dispatch({ type: "CLOSE_CART" });
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[80] transition-opacity duration-200",
        state.cartOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
      aria-hidden={!state.cartOpen}
    >
      <div className="absolute inset-0 bg-charcoal/40" onClick={close} />
      <div
        role="dialog"
        aria-label="Shopping bag"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivory transition-transform duration-300",
          state.cartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-lg">Your Bag ({count})</h2>
          <button aria-label="Close bag" onClick={close}>
            <X size={20} />
          </button>
        </div>

        {state.cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-display text-xl">Your bag is empty</p>
            <Button variant="secondary" onClick={close}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <ul className="divide-y divide-line-soft">
                {state.cart.map((line) => (
                  <li key={line.id} className="flex gap-4 py-5">
                    <div className="relative h-28 w-20 shrink-0 bg-sand">
                      <Image src={line.image} alt={line.name} fill sizes="80px" className="object-cover photo-grade" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="text-sm text-charcoal">{line.name}</h3>
                        <p className="mt-1 text-xs text-charcoal/60">
                          {line.color} / {line.size}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-line">
                          <button
                            aria-label="Decrease quantity"
                            className="flex h-7 w-7 items-center justify-center disabled:opacity-30"
                            disabled={line.qty <= 1}
                            onClick={() =>
                              dispatch({ type: "UPDATE_CART_QTY", id: line.id, qty: line.qty - 1 })
                            }
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-7 text-center text-xs">{line.qty}</span>
                          <button
                            aria-label="Increase quantity"
                            className="flex h-7 w-7 items-center justify-center disabled:opacity-30"
                            disabled={line.qty >= 5}
                            onClick={() =>
                              dispatch({ type: "UPDATE_CART_QTY", id: line.id, qty: line.qty + 1 })
                            }
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-sm">{formatCurrency(line.price * line.qty)}</span>
                      </div>
                      <button
                        onClick={() => removeLine(line.id)}
                        className="self-start text-xs text-charcoal/60 underline underline-offset-4"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-line px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-charcoal/50">Shipping and taxes calculated at checkout.</p>
              <Button
                className="mt-4 w-full"
                onClick={() => {
                  close();
                  router.push("/checkout");
                }}
              >
                Checkout
              </Button>
              <button onClick={close} className="mt-3 w-full text-center text-sm underline underline-offset-4">
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
