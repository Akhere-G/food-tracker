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

  for (const key of includedNutrients) {
    const definition = NUTRIENTS[key as keyof typeof NUTRIENTS];
    if (!definition) continue;
    nutrients[key] = {
      name: key,
      unit: definition.unit,
      amount: 0,
      dailyMax: definition.dailyMax,
    };
  }

  for (const entry of mealEntries) {
    if (!entry.food) continue;
    for (const nutrient of entry.food.nutrients) {
      if (!nutrient.nutrient) continue;
      const amount =
        (Number(entry.amountInGrams) * Number(nutrient.amountPer100g)) / 100;
      const key = nutrient.nutrient.name;
      if (!includedNutrients.has(key)) continue;
      if (!nutrients[key]) continue;
      nutrients[key].amount += amount;
    }
  }

  return nutrients;
}

export function calculateDraftNutrients(
  entries: import("./types").MealEntryData[],
) {
  const totals = Object.fromEntries(
    Object.values(MACROS).map((macro) => [
      macro.name,
      { ...macro, amount: 0 },
    ]),
  ) as Record<
    string,
    { name: string; unit: string; amount: number; dailyMax: number }
  >;

  for (const entry of entries) {
    for (const nutrient of entry.foodImportData.nutrients) {
      const name = nutrient.nutrient.name;
      if (!totals[name]) continue;
      totals[name].amount +=
        (Number(entry.mealEntryInput.amountInGrams) *
          Number(nutrient.amountPer100g)) /
        100;
    }
  }
  return totals;
}
