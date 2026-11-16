import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MealEntryData } from "../types";
import { calculateDraftNutrients } from "../utils";

export default function MealDraftRow({
  entry,
  onRemove,
  onAmountChange,
}: {
  entry: MealEntryData;
  onRemove: () => void;
  onAmountChange: (amount: number) => void;
}) {
  const totals = calculateDraftNutrients([entry]);
  const usesServing = Boolean(entry.mealEntryInput.serving);
  const amount = usesServing
    ? entry.mealEntryInput.servingQuantity
    : entry.mealEntryInput.amountInGrams;
  return (
    <article className="grid gap-3 border-b py-5 sm:grid-cols-[1fr_auto_auto] sm:items-center">
      <div>
        <h3 className="font-heading text-xl font-semibold">
          {entry.foodImportData.food.name}
        </h3>
        <label className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <span>{usesServing ? "Servings" : "Grams"}</span>
          <input
            className="h-9 w-24 rounded-lg border bg-background px-2 text-foreground"
            type="number"
            min="0.01"
            step={usesServing ? "0.25" : "1"}
            value={amount ?? ""}
            onChange={(event) => onAmountChange(Number(event.target.value))}
          />
          {usesServing && <span>{entry.mealEntryInput.serving?.label.split(",")[0]}</span>}
        </label>
      </div>
      <p className="font-heading text-2xl font-semibold tabular-nums">
        {Math.round(totals.Calories.amount)} kcal
      </p>
      <Button variant="ghost" onClick={onRemove} aria-label={`Remove ${entry.foodImportData.food.name}`}>
        <Trash2 /> Remove
      </Button>
    </article>
  );
}
