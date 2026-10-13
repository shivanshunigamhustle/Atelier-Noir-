"use client";

import { useState } from "react";
import { useStore } from "@/lib/store-context";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { SubNav } from "@/components/admin/sub-nav";
import type { TeamMember } from "@/lib/types";

export default function TeamSettingsPage() {
  const { state, dispatch, toast } = useStore();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamMember["role"]>("Associate");
  const [removing, setRemoving] = useState<TeamMember | null>(null);

  function invite() {
    dispatch({
      type: "ADD_TEAM_MEMBER",
      member: {
        id: `t-${Math.random().toString(36).slice(2, 9)}`,
        name: email.split("@")[0],
        email,
        role,
        status: "Invited",
      },
    });
    toast("Invitation sent");
    setInviteOpen(false);
    setEmail("");
  }

  return (
    <div>
      <SubNav
        items={[
          { href: "/admin/settings/store", label: "Store Profile" },
          { href: "/admin/settings/team", label: "Team" },
        ]}
      />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl">Team</h1>
        <Button onClick={() => setInviteOpen(true)}>Invite Team Member</Button>
      </div>

      <div className="overflow-x-auto border border-line">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-sand/40 text-xs text-charcoal/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {state.team.map((member) => (
              <tr key={member.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center border border-line text-xs">
                      {member.name.charAt(0)}
                    </div>
                    {member.name}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={member.role}
                    onChange={(e) =>
                      dispatch({ type: "UPDATE_TEAM_ROLE", id: member.id, role: e.target.value as TeamMember["role"] })
                    }
                    className="h-9 border border-line bg-ivory px-2 text-sm"
                  >
                    <option value="Store Manager">Store Manager</option>
                    <option value="Associate">Associate</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </td>
                <td className="px-4 py-3">{member.status}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setRemoving(member)} className="text-xs text-oxblood underline underline-offset-4">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite team member">
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-xs text-charcoal/60">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 border border-line bg-ivory px-3 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-charcoal/60">
            Role
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as TeamMember["role"])}
              className="h-10 border border-line bg-ivory px-3 text-sm"
            >
              <option value="Store Manager">Store Manager</option>
              <option value="Associate">Associate</option>
              <option value="Viewer">Viewer</option>
            </select>
          </label>
        </div>
        <Button className="mt-6 w-full" disabled={!email.includes("@")} onClick={invite}>
          Send Invite
        </Button>
      </Modal>

      <Modal open={removing !== null} onClose={() => setRemoving(null)} title="Remove team member?">
        <p className="text-sm text-charcoal/70">{removing?.name} will lose access to the admin dashboard.</p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={() => setRemoving(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (removing) dispatch({ type: "REMOVE_TEAM_MEMBER", id: removing.id });
              setRemoving(null);
            }}
          >
            Remove
          </Button>
        </div>
      </Modal>
    </div>
  );
}
