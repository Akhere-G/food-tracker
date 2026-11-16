import { Button } from "@/components/ui/button";
import { Dot, Trash2 } from "lucide-react";
import { MacroShortSymbol } from "../../food/nutrients";
import { FoodImportData } from "../../food/schemas";
import { MealEntryInput } from "../schemas";

export default function NewMealEntryCard({
  mealEntry,
  foodImportData,
  onDelete,
}: {
  mealEntry: MealEntryInput;
  foodImportData: FoodImportData;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className="p-4 flex flex-col gap-2 bg-card"
      key={mealEntry.food.externalId}
    >
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex text-sm">
            <p>{foodImportData.food.name}</p>
            <Dot />
            <div className="flex items-center">
              {!!mealEntry.serving && (
                <p className="text-xs text-secondary-foreground">
                  {mealEntry.servingQuantity} X
                  <span className="ml-2">
                    {mealEntry.serving.label.split(",")[0]}
                  </span>
                </p>
              )}
              {!mealEntry.serving && <p>{mealEntry.amountInGrams} g</p>}
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={() => onDelete(mealEntry.food.externalId)}
          >
            <Trash2 />
          </Button>
        </div>
        <div className="flex flex-wrap text-xs gap-2">
          {foodImportData.nutrients.map((nutrient) => {
            const symbol = MacroShortSymbol[nutrient.nutrient.name];
            if (!symbol) {
              return null;
            }

            return (
              <span
                className="flex bg-secondary rounded-full px-2 items-center"
                key={nutrient.nutrient.id}
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
