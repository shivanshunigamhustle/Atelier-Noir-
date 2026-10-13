"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore, useCurrentCustomer } from "@/lib/store-context";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export default function ProfileSettingsPage() {
  const { dispatch, toast } = useStore();
  const customer = useCurrentCustomer();
  const router = useRouter();

  const [name, setName] = useState(customer.name);
  const [email, setEmail] = useState(customer.email);
  const [phone, setPhone] = useState(customer.phone);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  function save() {
    dispatch({ type: "UPDATE_PROFILE", customerId: customer.id, name, email, phone });
    toast("Profile updated");
  }

  function signOut() {
    dispatch({ type: "RESET_SESSION_UI" });
    dispatch({ type: "SET_ROLE", role: null });
    router.push("/");
  }

  return (
    <div className="max-w-lg">
      <div className="flex flex-col gap-4">
        <Field label="Name" value={name} onChange={setName} />
        <Field label="Email" value={email} onChange={setEmail} type="email" />
        <Field label="Phone" value={phone} onChange={setPhone} />
        <div>
          <label className="text-xs tracking-[0.06em] text-charcoal/60">Password</label>
          <div className="mt-2 flex items-center justify-between border border-line px-3 py-2.5">
            <span className="text-sm text-charcoal/50">••••••••••</span>
            <button onClick={() => setPasswordOpen(true)} className="text-xs underline underline-offset-4">
              Change password
            </button>
          </div>
        </div>
      </div>

      <Button className="mt-6" onClick={save}>
        Save Changes
      </Button>

      <div className="mt-12 border-t border-line pt-6">
        <Button variant="secondary" onClick={signOut}>
          Sign out
        </Button>
      </div>

      <Modal open={passwordOpen} onClose={() => setPasswordOpen(false)} title="Change password">
        <div className="flex flex-col gap-3">
          <Field label="Current password" value={current} onChange={setCurrent} type="password" />
          <Field label="New password" value={next} onChange={setNext} type="password" />
          <Field label="Confirm new password" value={confirm} onChange={setConfirm} type="password" />
        </div>
        <Button
          className="mt-6 w-full"
          onClick={() => {
            setPasswordOpen(false);
            setCurrent("");
            setNext("");
            setConfirm("");
            toast("Password updated");
          }}
        >
          Update Password
        </Button>
      </Modal>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-xs tracking-[0.06em] text-charcoal/60">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 border border-line bg-ivory px-3 text-sm text-charcoal focus-visible:outline-charcoal"
      />
    </label>
  );
}
