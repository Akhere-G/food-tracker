"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteAccount } from "@/app/features/onboarding/actions";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function DangerZone() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function confirm() {
    setPending(true);
    const result = await deleteAccount();
    if (!result.success) {
      setPending(false);
      return toast.error(result.error);
    }
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <section className="border-t border-destructive/30 pt-6">
      <h2 className="section-heading text-destructive">Delete account</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Your account is soft-deleted first and scheduled for permanent deletion after 30 days. Contact support during that window if you need recovery.</p>
      <Button className="mt-4" variant="destructive" onClick={() => setOpen(true)}>Delete my account</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Schedule account deletion?</DialogTitle><DialogDescription>You will be signed out. Permanent deletion is scheduled for 30 days from today.</DialogDescription></DialogHeader>
          <DialogFooter showCloseButton><Button variant="destructive" disabled={pending} onClick={confirm}>{pending ? "Scheduling…" : "Yes, delete my account"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
