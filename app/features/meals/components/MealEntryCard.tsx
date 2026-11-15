import { Button } from "@/components/ui/button";
import { MealEntry } from "@/db/food-schema";
import { Dot, Pencil } from "lucide-react";
import { MacroShortSymbol } from "../../food/nutrients";

export default function MealmealEntryCard({
  mealEntry,
}: {
  mealEntry: MealEntry;
}) {
  return (
    <div className="p-4 flex flex-col gap-2 bg-card" key={mealEntry.id}>
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex text-sm">
            <p>{mealEntry.food.name}</p>
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
          <Button>
            <Pencil />
          </Button>
        </div>
        <div className="flex flex-wrap text-xs gap-2">
          {mealEntry.food.nutrients.map((nutrient) => {
            const symbol = MacroShortSymbol[nutrient.nutrient.name];
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
                {nutrient.nutrient.unit}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
