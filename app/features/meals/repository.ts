import { db, type Tx } from "@/db";
import { meal, mealEntry } from "@/db/food-schema";
import type { Meal, NewMeal, NewMealEntry } from "@/db/food-schema";

export async function insertMeal(tx: Tx, values: NewMeal) {
  const [row] = await tx.insert(meal).values(values).returning({ id: meal.id });
  return row.id;
}

export async function insertMealEntries(tx: Tx, entries: NewMealEntry[]) {
  await tx.insert(mealEntry).values(entries);
}

export async function getMeals({
  userId,
  startDate,
  endDate,
}: {
  userId: string;
  startDate: Date;
  endDate: Date;
}): Promise<Meal[]> {
  return await db.query.meal.findMany({
    where: {
      userId,
      eatenAt: {
        gte: startDate,
        lt: endDate,
      },
    },
    with: {
      entries: {
        with: {
          serving: true,
          food: {
            with: { nutrients: { with: { nutrient: true } } },
          },
        },
      },
    },
  });
}
