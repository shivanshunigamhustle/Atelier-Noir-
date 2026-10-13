"use client";

import { useState } from "react";
import { useStore } from "@/lib/store-context";
import { Button } from "@/components/ui/button";
import { SubNav } from "@/components/admin/sub-nav";

export default function StoreSettingsPage() {
  const { state, dispatch, toast } = useStore();
  const [profile, setProfile] = useState(state.storeProfile);

  return (
    <div>
      <SubNav
        items={[
          { href: "/admin/settings/store", label: "Store Profile" },
          { href: "/admin/settings/team", label: "Team" },
        ]}
      />
      <h1 className="font-display mb-6 text-2xl">Store Profile</h1>

      <div className="max-w-md border border-line p-6">
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-xs text-charcoal/60">
            Store name
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="h-11 border border-line bg-ivory px-3 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-charcoal/60">
            Support email
            <input
              value={profile.supportEmail}
              onChange={(e) => setProfile({ ...profile, supportEmail: e.target.value })}
              className="h-11 border border-line bg-ivory px-3 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-charcoal/60">
            Store address
            <input
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="h-11 border border-line bg-ivory px-3 text-sm"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5 text-xs text-charcoal/60">
              Currency
              <select
                value={profile.currency}
                onChange={(e) => setProfile({ ...profile, currency: e.target.value as "USD" | "EUR" | "GBP" })}
                className="h-11 border border-line bg-ivory px-3 text-sm"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-xs text-charcoal/60">
              Timezone
              <select
                value={profile.timezone}
                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                className="h-11 border border-line bg-ivory px-3 text-sm"
              >
                <option value="America/New_York">America/New_York</option>
                <option value="America/Chicago">America/Chicago</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </label>
          </div>
        </div>
        <Button
          className="mt-6"
          onClick={() => {
            dispatch({ type: "UPDATE_STORE_PROFILE", profile });
            toast("Settings saved");
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
