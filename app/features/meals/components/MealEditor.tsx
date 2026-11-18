"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { EnergyUnit } from "@/app/features/settings/units";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action";
import { createMealRequest } from "../meal-request";
import { mealEntryInput, type ReplaceMealRequest } from "../schemas";
import type { MealEntryData } from "../types";
import AddFoodDialog from "./AddFoodDialog";
import DeleteMealDialog from "./DeleteMealDialog";
import MealEditorHeader from "./MealEditorHeader";
import MealLedger from "./MealLedger";
import MealNutritionSummary from "./MealNutritionSummary";

type MealAction = (
  request: ReplaceMealRequest,
) => Promise<ActionResult<{ mealId: string }>>;

type MealEditorProps = {
  title: string;
  submitLabel: string;
  successMessage: string;
  summaryLabel: string;
  submitAction: MealAction;
  deleteAction?: () => Promise<ActionResult<{ mealId: string }>>;
  helperText?: string;
  initialEntries?: MealEntryData[];
  initialDate: string;
  initialTime: string;
  energyUnit?: EnergyUnit;
  timezone: string;
  resetEntriesAfterSubmit?: boolean;
};

export default function MealEditor({
  title,
  submitLabel,
  successMessage,
  summaryLabel,
  submitAction,
  deleteAction,
  helperText,
  initialEntries = [],
  initialDate,
  initialTime,
  energyUnit = "kcal",
  timezone,
  resetEntriesAfterSubmit = false,
}: MealEditorProps) {
  const [entries, setEntries] = useState(initialEntries);
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [foodDialogOpen, setFoodDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingOperation, setPendingOperation] = useState<
    "save" | "delete" | null
  >(null);
  const [error, setError] = useState("");
  const router = useRouter();

  function addEntry(entry: MealEntryData) {
    const duplicate = entries.some(
      (current) =>
        current.mealEntryInput.food.externalId ===
          entry.mealEntryInput.food.externalId &&
        current.mealEntryInput.food.externalSource ===
          entry.mealEntryInput.food.externalSource,
    );

    if (duplicate) {
      setError(
        `${entry.foodImportData.food.name} is already in this meal. Update its amount instead.`,
      );
      return false;
    }

    setError("");
    setEntries((current) => [...current, entry]);
    return true;
  }

  function removeEntry(index: number) {
    setEntries((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  function updateAmount(index: number, amount: number | null) {
    setEntries((current) =>
      current.map((entry, itemIndex) => {
        if (itemIndex !== index) return entry;

        const serving = entry.mealEntryInput.serving
          ? entry.foodImportData.servings.find(
              (item) =>
                item.externalId === entry.mealEntryInput.serving?.externalId,
            )
          : null;

        return {
          ...entry,
          mealEntryInput: {
            ...entry.mealEntryInput,
            servingQuantity: serving ? amount : null,
            amountInGrams:
              serving && amount !== null
                ? Number(serving.amountInGrams) * amount
                : amount,
          },
        };
      }),
    );
  }

  async function submit() {
    if (entries.length === 0) {
      setError("Add at least one food before saving the meal.");
      return;
    }

    if (
      entries.some((entry) => !mealEntryInput.safeParse(entry.mealEntryInput).success)
    ) {
      toast.error("Enter a serving amount greater than zero for every food.");
      return;
    }

    setPendingOperation("save");
    setError("");

    try {
      const request = createMealRequest({ date, time, timezone, entries });
      const result = await submitAction(request);

      if (!result.success) {
        setError(result.error);
        return;
      }

      if (resetEntriesAfterSubmit) setEntries([]);
      toast.success(successMessage);
      navigateToMeals();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "We could not save the meal.",
      );
    } finally {
      setPendingOperation(null);
    }
  }

  async function removeMeal() {
    if (!deleteAction) return;

    setPendingOperation("delete");
    setError("");
    try {
      const result = await deleteAction();

      if (!result.success) {
        setError(result.error);
        return;
      }

      toast.success("Meal deleted");
      setDeleteDialogOpen(false);
      navigateToMeals();
    } catch {
      setError("We could not delete the meal.");
    } finally {
      setPendingOperation(null);
    }
  }

  function navigateToMeals() {
    router.push(`/meals?date=${date}`);
    router.refresh();
  }

  const pending = pendingOperation !== null;

  return (
    <div className="page-shell">
      <MealEditorHeader
        title={title}
        date={date}
        time={time}
        onDateChange={setDate}
        onTimeChange={setTime}
      />
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <MealLedger
          entries={entries}
          addFoodAction={() => setFoodDialogOpen(true)}
          removeEntryAction={removeEntry}
          updateAmountAction={updateAmount}
        />
        <MealNutritionSummary
          entries={entries}
          energyUnit={energyUnit}
          label={summaryLabel}
        />
      </div>
      {helperText && (
        <p className="mt-6 text-sm text-muted-foreground">{helperText}</p>
      )}
      {error && (
        <p
          className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
      <div className="mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row">
        <Button size="lg" disabled={pending} onClick={submit}>
          <Save />
          {pendingOperation === "save" ? "Saving…" : submitLabel}
        </Button>
        <Button
          size="lg"
          variant="outline"
          disabled={pending}
          onClick={() => router.back()}
        >
          {deleteAction ? "Discard changes" : "Cancel"}
        </Button>
        {deleteAction && (
          <Button
            size="lg"
            variant="destructive"
            disabled={pending}
            onClick={() => setDeleteDialogOpen(true)}
            className="sm:ml-auto"
          >
            Delete meal
          </Button>
        )}
      </div>
      <AddFoodDialog
        open={foodDialogOpen}
        onOpenChange={setFoodDialogOpen}
        addEntryAction={addEntry}
      />
      {deleteAction && (
        <DeleteMealDialog
          open={deleteDialogOpen}
          pending={pendingOperation === "delete"}
          onOpenChange={setDeleteDialogOpen}
          deleteAction={removeMeal}
        />
      )}
    </div>
  );
}
