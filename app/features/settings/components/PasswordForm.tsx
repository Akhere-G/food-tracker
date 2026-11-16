"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (newPassword.length < 8) return toast.error("Use at least 8 characters.");
    setPending(true);
    const { error } = await authClient.changePassword({ currentPassword, newPassword, revokeOtherSessions: true });
    setPending(false);
    if (error) return toast.error(error.message ?? "We could not change your password.");
    setCurrentPassword("");
    setNewPassword("");
    toast.success("Password changed");
  }

  return (
    <form className="border-t pt-6" onSubmit={submit}>
      <h2 className="section-heading">Password</h2>
      <p className="mt-1 text-sm text-muted-foreground">Changing it signs out your other sessions.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">Current password<Input type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required /></label>
        <label className="grid gap-2 text-sm font-medium">New password<Input type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={8} required /></label>
      </div>
      <Button className="mt-4" variant="outline" disabled={pending} type="submit">{pending ? "Changing…" : "Change password"}</Button>
    </form>
  );
}
