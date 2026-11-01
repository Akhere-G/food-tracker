import type { Tx } from "@/db";
import { meal, mealEntry } from "@/db/food-schema";
import type { NewMeal, NewMealEntry } from "@/db/food-schema";

export async function insertMeal(tx: Tx, values: NewMeal) {
  const [row] = await tx.insert(meal).values(values).returning({ id: meal.id });
  return row.id;
}

export async function insertMealEntries(tx: Tx, entries: NewMealEntry[]) {
  await tx.insert(mealEntry).values(entries);
}
