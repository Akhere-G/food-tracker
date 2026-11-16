"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OnboardingInput } from "@/app/features/onboarding/schemas";
import OnboardingWizard from "@/app/features/onboarding/components/OnboardingWizard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function NutritionGoals({ value }: { value: OnboardingInput }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <section className="border-t pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="section-heading">Nutrition goals</h2><p className="mt-1 text-sm text-muted-foreground">Redo onboarding to recalculate calorie, macro, weight and completion-date estimates.</p></div>
        <Button variant="outline" onClick={() => setOpen(true)}>Review my plan</Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader><DialogTitle>Review nutrition goals</DialogTitle><DialogDescription>Every answer is editable. Saving replaces your current nutrition profile.</DialogDescription></DialogHeader>
          <OnboardingWizard authenticated initialValue={value} onSaved={() => { setOpen(false); router.refresh(); }} />
        </DialogContent>
      </Dialog>
    </section>
  );
}
