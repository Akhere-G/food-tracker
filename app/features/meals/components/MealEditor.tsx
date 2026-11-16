"use client";

import { useMemo, useState } from "react";
import { TZDate } from "@date-fns/tz";
import { useRouter } from "next/navigation";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddMealForm from "./AddMealForm";
import MealDraftRow from "./MealDraftRow";
import MealNutritionSummary from "./MealNutritionSummary";
import type { MealEntryData } from "../types";
import { saveMeal } from "../actions";
import type { EnergyUnit } from "@/app/features/settings/units";

type Props = {
  mode: "add" | "update";
  mealId?: string;
  initialEntries?: MealEntryData[];
  initialDate: string;
  initialTime: string;
  energyUnit?: EnergyUnit;
  timezone: string;
};

function draftKey(entry: MealEntryData) {
  return `${entry.foodImportData.food.externalSource}:${entry.foodImportData.food.externalId}`;
}

export default function MealEditor({ mode, mealId, initialEntries = [], initialDate, initialTime, energyUnit = "kcal", timezone }: Props) {
  const [entries, setEntries] = useState(() => new Map(initialEntries.map((entry) => [draftKey(entry), entry])));
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [foodDialogOpen, setFoodDialogOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const draftEntries = useMemo(() => [...entries.values()], [entries]);

  function addEntry(entry: MealEntryData) {
    setEntries((current) => new Map(current).set(draftKey(entry), entry));
  }

  function removeEntry(entry: MealEntryData) {
    setEntries((current) => {
      const next = new Map(current);
      next.delete(draftKey(entry));
      return next;
    });
  }

  async function submit() {
    if (draftEntries.length === 0) {
      setError("Add at least one food before saving the meal.");
      return;
    }
    setPending(true);
    setError("");
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    const request = {
      eatenAt: new TZDate(year, month - 1, day, hour, minute, timezone).toISOString(),
      mealEntries: draftEntries.map((entry) => entry.mealEntryInput),
    };
    try {
      if (mode === "add") {
        const result = await saveMeal(request);
        if (!result.success) throw new Error(result.error);
      } else {
        const response = await fetch(`/api/meals/${mealId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        });
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error ?? "We could not update the meal.");
        }
      }
      toast.success(mode === "add" ? "Meal added" : "Changes saved");
      router.push(`/meals?date=${date}`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We could not save the meal.");
    } finally {
      setPending(false);
    }
  }

  async function removeMeal() {
    if (!mealId) return;
    setPending(true);
    const response = await fetch(`/api/meals/${mealId}`, { method: "DELETE" });
    setPending(false);
    if (!response.ok) {
      setError("We could not delete the meal.");
      return;
    }
    toast.success("Meal deleted");
    setDeleteOpen(false);
    router.push(`/meals?date=${date}`);
    router.refresh();
  }

  return (
    <div className="page-shell">
      <header>
        <p className="text-sm font-medium text-primary">Meals</p>
        <h1 className="title mt-1">{mode === "add" ? "Add meal" : "Update meal"}</h1>
        <div className="mt-6 flex flex-wrap gap-4 border-b pb-6">
          <label className="grid gap-2 text-sm font-medium">Date<input className="h-11 rounded-lg border bg-background px-3 text-base" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
          <label className="grid gap-2 text-sm font-medium">Eaten at<input className="h-11 rounded-lg border bg-background px-3 text-base" type="time" value={time} onChange={(event) => setTime(event.target.value)} /></label>
        </div>
      </header>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section>
          <div className="flex items-end justify-between gap-4">
            <div><h2 className="section-heading">Meal ledger</h2><p className="text-sm text-muted-foreground">{draftEntries.length} {draftEntries.length === 1 ? "food" : "foods"} in this meal</p></div>
            <Button variant="outline" onClick={() => setFoodDialogOpen(true)}><Plus /> Add food</Button>
          </div>
          <div className="mt-4">{draftEntries.map((entry) => <MealDraftRow key={draftKey(entry)} entry={entry} onRemove={() => removeEntry(entry)} />)}</div>
          {draftEntries.length === 0 && <button type="button" onClick={() => setFoodDialogOpen(true)} className="mt-5 min-h-44 w-full rounded-xl border-2 border-dashed p-8 text-center text-muted-foreground hover:border-primary hover:text-foreground">Add the first food to this meal</button>}
        </section>
        <MealNutritionSummary entries={draftEntries} energyUnit={energyUnit} label={mode === "add" ? "This meal — not saved yet" : "Updated meal preview"} />
      </div>
      {mode === "update" && <p className="mt-6 text-sm text-muted-foreground">Saving replaces this meal with the foods and time shown here.</p>}
      {error && <p className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">{error}</p>}
      <div className="mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row">
        <Button size="lg" disabled={pending} onClick={submit}><Save /> {pending ? "Saving…" : mode === "add" ? "Save meal" : "Save changes"}</Button>
        <Button size="lg" variant="outline" disabled={pending} onClick={() => router.back()}>{mode === "add" ? "Cancel" : "Discard changes"}</Button>
        {mode === "update" && <Button size="lg" variant="destructive" disabled={pending} onClick={() => setDeleteOpen(true)} className="sm:ml-auto">Delete meal</Button>}
      </div>
      <AddMealForm isOpen={foodDialogOpen} setIsOpen={setFoodDialogOpen} addEntry={addEntry} />
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this meal?</DialogTitle>
            <DialogDescription>This removes the complete meal and every food entry in it. This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton>
            <Button variant="destructive" disabled={pending} onClick={removeMeal}>{pending ? "Deleting…" : "Delete meal"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
