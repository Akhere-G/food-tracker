import { db, type Tx } from "@/db";
import { meal, mealEntry } from "@/db/food-schema";
import type { Meal, NewMeal, NewMealEntry } from "@/db/food-schema";
import { and, eq } from "drizzle-orm";

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

export async function getMeal({
  mealId,
  userId,
}: {
  mealId: string;
  userId: string;
}) {
  return db.query.meal.findFirst({
    where: { id: mealId, userId },
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

type ReplaceMealEntriesInput = {
  mealId: string;
  userId: string;
  eatenAt: Date;
  createEntries: (tx: Tx) => Promise<NewMealEntry[]>;
};

export async function replaceMealEntries({
  mealId,
  userId,
  eatenAt,
  createEntries,
}: ReplaceMealEntriesInput) {
  return db.transaction(async (tx) => {
    const [updated] = await tx
      .update(meal)
      .set({ eatenAt })
      .where(and(eq(meal.id, mealId), eq(meal.userId, userId)))
      .returning({ id: meal.id });

    if (!updated) return false;

    const entries = await createEntries(tx);
    await tx.delete(mealEntry).where(eq(mealEntry.mealId, mealId));
    await tx.insert(mealEntry).values(entries);
    return true;
  });
}

export async function deleteMeal(mealId: string, userId: string) {
  const [deleted] = await db
    .delete(meal)
    .where(and(eq(meal.id, mealId), eq(meal.userId, userId)))
    .returning({ id: meal.id });
  return Boolean(deleted);
}
