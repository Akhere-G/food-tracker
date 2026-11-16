import { calculateDraftNutrients } from "../utils";
import type { MealEntryData } from "../types";

const orderedMacros = ["Calories", "Protein", "Total carbohydrates", "Total fat"];
const labels: Record<string, string> = {
  Calories: "Calories",
  Protein: "Protein",
  "Total carbohydrates": "Carbohydrate",
  "Total fat": "Fat",
};

export default function MealNutritionSummary({
  entries,
  label,
}: {
  entries: MealEntryData[];
  label: string;
}) {
  const totals = calculateDraftNutrients(entries);
  return (
    <aside className="rounded-xl bg-accent p-5 text-accent-foreground lg:sticky lg:top-8">
      <p className="text-sm font-semibold">{label}</p>
      <p className="data-number mt-4 text-5xl font-semibold">
        {Math.round(totals.Calories.amount).toLocaleString("en-GB")}
        <span className="ml-2 font-sans text-base font-normal">kcal</span>
      </p>
      <div className="mt-5 divide-y border-y">
        {orderedMacros.slice(1).map((name) => (
          <div key={name} className="flex items-center justify-between py-4">
            <span className="font-medium">{labels[name]}</span>
            <strong className="tabular-nums">
              {Math.round(totals[name].amount)} {totals[name].unit}
            </strong>
          </div>
        ))}
      </div>
    </aside>
  );
}
