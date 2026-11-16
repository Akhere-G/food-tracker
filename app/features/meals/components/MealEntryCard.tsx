import { MealEntry } from "@/db/food-schema";
import { Dot } from "lucide-react";
import { MacroShortSymbol } from "../../food/nutrients";

export default function MealEntryCard({ mealEntry }: { mealEntry: MealEntry }) {
  return (
    <div className="border-b px-4 py-4 last:border-0" key={mealEntry.id}>
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex text-sm">
            <p>{mealEntry.food!.name}</p>
            <Dot />
            <div className="flex items-center">
              {!!mealEntry.serving && (
                <p className="text-xs text-secondary-foreground">
                  {mealEntry.servingQuantity} X
                  <span className="ml-2">{mealEntry.serving?.label}</span>
                </p>
              )}
              {!mealEntry.serving && <p>{mealEntry.amountInGrams} g</p>}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap text-xs gap-2">
          {mealEntry.food!.nutrients.map((nutrient) => {
            const symbol = nutrient.nutrient
              ? MacroShortSymbol[nutrient.nutrient.name]
              : null;
            if (!symbol) {
              return null;
            }

            return (
              <span
                className="flex bg-secondary rounded-full px-2 items-center"
                key={nutrient.nutrientId}
              >
                {symbol}{" "}
                {
                  +(
                    (Number(nutrient.amountPer100g) *
                      Number(mealEntry.amountInGrams)) /
                    100
                  ).toFixed(2)
                }
                  {nutrient.nutrient?.unit}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
