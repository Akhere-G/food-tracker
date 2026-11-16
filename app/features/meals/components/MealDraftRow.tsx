import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MealEntryData } from "../types";
import { calculateDraftNutrients } from "../utils";

export default function MealDraftRow({
  entry,
  onRemove,
}: {
  entry: MealEntryData;
  onRemove: () => void;
}) {
  const totals = calculateDraftNutrients([entry]);
  const serving = entry.mealEntryInput.serving
    ? `${entry.mealEntryInput.servingQuantity} × ${entry.mealEntryInput.serving.label.split(",")[0]}`
    : `${entry.mealEntryInput.amountInGrams} g`;
  return (
    <article className="grid gap-3 border-b py-5 sm:grid-cols-[1fr_auto_auto] sm:items-center">
      <div>
        <h3 className="font-heading text-xl font-semibold">
          {entry.foodImportData.food.name}
        </h3>
        <p className="text-sm text-muted-foreground">{serving}</p>
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
