import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MealEntryData } from "../types";
import MealDraftRow from "./MealDraftRow";

type MealLedgerProps = {
  entries: MealEntryData[];
  addFoodAction: () => void;
  removeEntryAction: (index: number) => void;
  updateAmountAction: (index: number, amount: number) => void;
};

export default function MealLedger({
  entries,
  addFoodAction,
  removeEntryAction,
  updateAmountAction,
}: MealLedgerProps) {
  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="section-heading">Meal ledger</h2>
          <p className="text-sm text-muted-foreground">
            {entries.length} {entries.length === 1 ? "food" : "foods"} in this
            meal
          </p>
        </div>
        <Button variant="outline" onClick={addFoodAction}>
          <Plus /> Add food
        </Button>
      </div>
      <div className="mt-4">
        {entries.map((entry, index) => (
          <MealDraftRow
            key={JSON.stringify([
              entry.foodImportData.food.externalSource,
              entry.foodImportData.food.externalId,
            ])}
            entry={entry}
            onRemove={() => removeEntryAction(index)}
            onAmountChange={(amount) => updateAmountAction(index, amount)}
          />
        ))}
      </div>
      {entries.length === 0 && (
        <button
          type="button"
          onClick={addFoodAction}
          className="mt-5 min-h-44 w-full rounded-xl border-2 border-dashed p-8 text-center text-muted-foreground hover:border-primary hover:text-foreground"
        >
          Add the first food to this meal
        </button>
      )}
    </section>
  );
}
