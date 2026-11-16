import type { MealEntry } from "@/db/food-schema";
import type { MealEntryData } from "./types";

export function mealEntryToDraft(entry: MealEntry): MealEntryData | null {
  if (!entry.food) return null;
  return {
    mealEntryInput: {
      food: {
        externalId: entry.food.externalId,
        externalSource: entry.food.externalSource,
      },
      amountInGrams: Number(entry.amountInGrams),
      serving: entry.serving
        ? {
            externalId: entry.serving.externalId,
            label: entry.serving.label,
          }
        : null,
      servingQuantity: entry.servingQuantity
        ? Number(entry.servingQuantity)
        : null,
    },
    foodImportData: {
      food: entry.food,
      nutrients: entry.food.nutrients
        .filter((item) => item.nutrient)
        .map((item) => ({
          amountPer100g: item.amountPer100g,
          nutrient: item.nutrient!,
        })),
      servings: entry.serving
        ? [
            {
              id: entry.serving.id,
              externalId: entry.serving.externalId,
              label: entry.serving.label,
              amountInGrams: entry.serving.amountInGrams,
            },
          ]
        : [],
    },
  };
}
