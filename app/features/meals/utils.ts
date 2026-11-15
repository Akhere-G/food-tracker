import { MealEntry } from "@/db/food-schema";
import { MACROS, NUTRIENTS } from "../food/nutrients";

// TODO: might need to add an onboarding to calculate the daily max for specific user
export function calculateNutrients(
  mealEntries: MealEntry[],
  includedNutrients: Set<string> = new Set(Object.keys(MACROS)),
) {
  const nutrients: Record<
    string,
    { name: string; unit: string; amount: number; dailyMax: number }
  > = {};

  for (const entry of mealEntries) {
    for (const nutrient of entry.food.nutrients) {
      const amount =
        (Number(entry.amountInGrams) * Number(nutrient.amountPer100g)) / 100;
      const key = nutrient.nutrient.name;
      if (!includedNutrients.has(key)) continue;
      if (!nutrients[key]) {
        nutrients[key] = {
          name: key,
          unit: nutrient.nutrient.unit,
          amount: 0,
          dailyMax: NUTRIENTS[key as keyof typeof NUTRIENTS]?.dailyMax ?? 0,
        };
      }
      nutrients[key].amount += amount;
    }
  }

  return nutrients;
}
