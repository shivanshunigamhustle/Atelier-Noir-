"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "@phosphor-icons/react";
import { useStore, useCurrentCustomer, cartSubtotal } from "@/lib/store-context";
import { formatCurrency, todayIso } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { Address, Order } from "@/lib/types";

type Step = "shipping" | "payment" | "review";

const STEPS: { key: Step; label: string }[] = [
  { key: "shipping", label: "Shipping" },
  { key: "payment", label: "Payment" },
  { key: "review", label: "Review" },
];

interface ShippingForm {
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  saveAddress: boolean;
}

interface PaymentForm {
  cardNumber: string;
  expiry: string;
  cvc: string;
  sameAsShipping: boolean;
  billing: Omit<ShippingForm, "saveAddress">;
}

const SHIPPING_FLAT = 12;
const TAX_RATE = 0.08;

function nextOrderId(orders: Order[]): string {
  const max = orders.reduce((m, o) => {
    const n = parseInt(o.id.replace("AN-", ""), 10);
    return Number.isNaN(n) ? m : Math.max(m, n);
  }, 10000);
  return `AN-${max + 1}`;
}

export function CheckoutWizard() {
  const { state, dispatch, toast } = useStore();
  const customer = useCurrentCustomer();
  const router = useRouter();
  const defaultAddress = customer.addresses.find((a) => a.isDefault) ?? customer.addresses[0];

  const [step, setStep] = useState<Step>("shipping");
  const [submittedShipping, setSubmittedShipping] = useState(false);
  const [submittedPayment, setSubmittedPayment] = useState(false);

  const [shipping, setShipping] = useState<ShippingForm>({
    fullName: defaultAddress?.fullName ?? customer.name,
    line1: defaultAddress?.line1 ?? "",
    line2: defaultAddress?.line2 ?? "",
    city: defaultAddress?.city ?? "",
    state: defaultAddress?.state ?? "",
    zip: defaultAddress?.zip ?? "",
    country: defaultAddress?.country ?? "United States",
    phone: defaultAddress?.phone ?? customer.phone,
    saveAddress: false,
  });

  const [payment, setPayment] = useState<PaymentForm>({
    cardNumber: "",
    expiry: "",
    cvc: "",
    sameAsShipping: true,
    billing: {
      fullName: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
      phone: "",
    },
  });

  const subtotal = cartSubtotal(state.cart);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + SHIPPING_FLAT + tax;

  const shippingRequired: (keyof ShippingForm)[] = ["fullName", "line1", "city", "state", "zip", "country", "phone"];
  const shippingErrors = shippingRequired.filter((k) => !shipping[k]?.toString().trim());

  const paymentRequired: (keyof Pick<PaymentForm, "cardNumber" | "expiry" | "cvc">)[] = [
    "cardNumber",
    "expiry",
    "cvc",
  ];
  const paymentErrors = paymentRequired.filter((k) => !payment[k]?.trim());

  function goToStep(target: Step) {
    const order = STEPS.findIndex((s) => s.key === target);
    const current = STEPS.findIndex((s) => s.key === step);
    if (order < current) setStep(target);
  }

  function submitShipping() {
    setSubmittedShipping(true);
    if (shippingErrors.length === 0) setStep("payment");
  }

  function submitPayment() {
    setSubmittedPayment(true);
    if (paymentErrors.length === 0) setStep("review");
  }

  function placeOrder() {
    if (state.cart.length === 0) return;
    const shippingAddress: Address = {
      id: `addr-checkout-${Math.random().toString(36).slice(2, 9)}`,
      label: "Shipping",
      fullName: shipping.fullName,
      line1: shipping.line1,
      line2: shipping.line2 || undefined,
      city: shipping.city,
      state: shipping.state,
      zip: shipping.zip,
      country: shipping.country,
      phone: shipping.phone,
      isDefault: false,
    };

    if (shipping.saveAddress) {
      dispatch({ type: "ADD_ADDRESS", customerId: customer.id, address: shippingAddress });
    }

    const orderId = nextOrderId(state.orders);
    const order: Order = {
      id: orderId,
      customerId: customer.id,
      date: todayIso(),
      items: state.cart.map((l) => ({
        productId: l.productId,
        name: l.name,
        image: l.image,
        color: l.color,
        size: l.size,
        qty: l.qty,
        price: l.price,
      })),
      status: "Processing",
      total,
      shippingAddress,
      paymentMethodMasked: `Card •••• ${payment.cardNumber.slice(-4).padStart(4, "0")}`,
      notes: [],
      statusHistory: [{ status: "Processing", timestamp: todayIso() }],
    };

    dispatch({ type: "PLACE_ORDER", order });
    toast("Order placed");
    router.push(`/order-confirmation/${orderId}`);
  }

  if (state.cart.length === 0) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
        <p className="font-display text-2xl">Your bag is empty</p>
        <p className="text-sm text-charcoal/60">Add something to your bag before checking out.</p>
        <Button onClick={() => router.push("/shop")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <ol className="mb-10 flex items-center justify-center gap-3 text-sm">
        {STEPS.map((s, i) => {
          const isCurrent = s.key === step;
          const isDone = STEPS.findIndex((x) => x.key === step) > i;
          return (
            <li key={s.key} className="flex items-center gap-3">
              <button
                onClick={() => goToStep(s.key)}
                disabled={!isDone}
                className={cn(
                  "flex items-center gap-2",
                  isCurrent ? "text-charcoal" : isDone ? "text-charcoal/60 underline underline-offset-4" : "text-charcoal/30"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border text-xs",
                    isCurrent || isDone ? "border-charcoal bg-charcoal text-ivory" : "border-line"
                  )}
                >
                  {isDone ? <Check size={12} /> : i + 1}
                </span>
                {s.label}
              </button>
              {i < STEPS.length - 1 && <span className="h-px w-8 bg-line" />}
            </li>
          );
        })}
      </ol>

      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          {step === "shipping" && (
            <div className="max-w-lg">
              <h1 className="font-display mb-6 text-2xl">Shipping address</h1>
              <div className="flex flex-col gap-4">
                <Field
                  label="Full name"
                  value={shipping.fullName}
                  onChange={(v) => setShipping({ ...shipping, fullName: v })}
                  error={submittedShipping && !shipping.fullName ? "Full name is required." : undefined}
                />
                <Field
                  label="Address line 1"
                  value={shipping.line1}
                  onChange={(v) => setShipping({ ...shipping, line1: v })}
                  error={submittedShipping && !shipping.line1 ? "Address is required." : undefined}
                />
                <Field
                  label="Address line 2 (optional)"
                  value={shipping.line2}
                  onChange={(v) => setShipping({ ...shipping, line2: v })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="City"
                    value={shipping.city}
                    onChange={(v) => setShipping({ ...shipping, city: v })}
                    error={submittedShipping && !shipping.city ? "Required." : undefined}
                  />
                  <Field
                    label="State"
                    value={shipping.state}
                    onChange={(v) => setShipping({ ...shipping, state: v })}
                    error={submittedShipping && !shipping.state ? "Required." : undefined}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="ZIP code"
                    value={shipping.zip}
                    onChange={(v) => setShipping({ ...shipping, zip: v })}
                    error={submittedShipping && !shipping.zip ? "Required." : undefined}
                  />
                  <div className="flex flex-col gap-2">
                    <label className="text-xs tracking-[0.06em] text-charcoal/60">Country</label>
                    <select
                      value={shipping.country}
                      onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                      className="h-11 border border-line bg-ivory px-3 text-sm"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>France</option>
                    </select>
                  </div>
                </div>
                <Field
                  label="Phone"
                  value={shipping.phone}
                  onChange={(v) => setShipping({ ...shipping, phone: v })}
                  error={submittedShipping && !shipping.phone ? "Required." : undefined}
                />
                <label className="mt-2 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={shipping.saveAddress}
                    onChange={(e) => setShipping({ ...shipping, saveAddress: e.target.checked })}
                    className="h-4 w-4 accent-charcoal"
                  />
                  Save this address to my account
                </label>
              </div>
              <Button className="mt-8" onClick={submitShipping}>
                Continue to Payment
              </Button>
            </div>
          )}

          {step === "payment" && (
            <div className="max-w-lg">
              <h1 className="font-display mb-6 text-2xl">Payment</h1>
              <p className="mb-4 text-xs text-charcoal/50">
                Demo checkout. No real payment is processed and no card details are stored.
              </p>
              <div className="flex flex-col gap-4">
                <Field
                  label="Card number"
                  value={payment.cardNumber}
                  onChange={(v) => setPayment({ ...payment, cardNumber: v })}
                  placeholder="4242 4242 4242 4242"
                  error={submittedPayment && !payment.cardNumber ? "Card number is required." : undefined}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Expiry"
                    value={payment.expiry}
                    onChange={(v) => setPayment({ ...payment, expiry: v })}
                    placeholder="MM/YY"
                    error={submittedPayment && !payment.expiry ? "Required." : undefined}
                  />
                  <Field
                    label="CVC"
                    value={payment.cvc}
                    onChange={(v) => setPayment({ ...payment, cvc: v })}
                    placeholder="123"
                    error={submittedPayment && !payment.cvc ? "Required." : undefined}
                  />
                </div>
              </div>

              <label className="mt-6 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={payment.sameAsShipping}
                  onChange={(e) => setPayment({ ...payment, sameAsShipping: e.target.checked })}
                  className="h-4 w-4 accent-charcoal"
                />
                Billing address same as shipping
              </label>

              {!payment.sameAsShipping && (
                <div className="mt-4 flex flex-col gap-4">
                  <Field
                    label="Full name"
                    value={payment.billing.fullName}
                    onChange={(v) => setPayment({ ...payment, billing: { ...payment.billing, fullName: v } })}
                  />
                  <Field
                    label="Address line 1"
                    value={payment.billing.line1}
                    onChange={(v) => setPayment({ ...payment, billing: { ...payment.billing, line1: v } })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label="City"
                      value={payment.billing.city}
                      onChange={(v) => setPayment({ ...payment, billing: { ...payment.billing, city: v } })}
                    />
                    <Field
                      label="ZIP code"
                      value={payment.billing.zip}
                      onChange={(v) => setPayment({ ...payment, billing: { ...payment.billing, zip: v } })}
                    />
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-3">
                <Button variant="secondary" onClick={() => setStep("shipping")}>
                  Back
                </Button>
                <Button onClick={submitPayment}>Continue to Review</Button>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="max-w-lg">
              <h1 className="font-display mb-6 text-2xl">Review your order</h1>

              <div className="border border-line p-5">
                <h2 className="text-xs tracking-[0.08em] text-charcoal/50">SHIPPING TO</h2>
                <p className="mt-2 text-sm">
                  {shipping.fullName}
                  <br />
                  {shipping.line1} {shipping.line2}
                  <br />
                  {shipping.city}, {shipping.state} {shipping.zip}
                  <br />
                  {shipping.country}
                </p>
              </div>

              <div className="mt-4 border border-line p-5">
                <h2 className="text-xs tracking-[0.08em] text-charcoal/50">PAYMENT</h2>
                <p className="mt-2 text-sm">Card ending in {payment.cardNumber.slice(-4).padStart(4, "•")}</p>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                {state.cart.map((l) => (
                  <div key={l.id} className="flex items-center justify-between text-sm">
                    <span>
                      {l.name} ({l.color}, {l.size}) × {l.qty}
                    </span>
                    <span>{formatCurrency(l.price * l.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-3">
                <Button variant="secondary" onClick={() => setStep("payment")}>
                  Back
                </Button>
                <Button onClick={placeOrder}>Place Order</Button>
              </div>
            </div>
          )}
        </div>

        <aside className="border border-line p-6">
          <h2 className="font-display mb-4 text-lg">Order Summary</h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatCurrency(SHIPPING_FLAT)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-line pt-3 text-base font-medium">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs tracking-[0.06em] text-charcoal/60">{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-11 border bg-ivory px-3 text-sm focus-visible:outline-charcoal",
          error ? "border-oxblood" : "border-line"
        )}
      />
      {error && <p className="text-xs text-oxblood">{error}</p>}
    </div>
  );
}
