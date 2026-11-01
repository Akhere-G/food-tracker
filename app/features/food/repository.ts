import { db } from "@/db";
import {
  food,
  foodNutrient,
  meal,
  mealEntry,
  nutrient,
  serving,
} from "@/db/food-schema";
import { inArray } from "drizzle-orm";
import { AppError } from "@/lib/errors";
import { FoodImportData } from "./schemas";

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

export async function getNutrientIds(
  tx: Tx,
  items: { name: string; unit: string }[],
) {
  const names = [...new Set(items.map((n) => n.name))];
  if (names.length === 0) return new Map<string, string>();

  const rows = await tx
    .select({ id: nutrient.id, name: nutrient.name })
    .from(nutrient)
    .where(inArray(nutrient.name, names));
  const ids = new Map(rows.map((r) => [r.name, r.id]));

  const missing = names.filter((n) => !ids.has(n));
  if (missing.length > 0) {
    console.error(
      `Nutrients missing from db (run db:seed): ${missing.join(", ")}`,
    );
    throw new AppError("Nutrition data isn't set up correctly.", "unknown");
  }
  return ids;
}

export async function ensureFood(
  tx: Tx,
  details: FoodImportData,
  nutrientIds: Map<string, string>,
) {
  const [inserted] = await tx
    .insert(food)
    .values({
      name: details.food.name,
      externalId: details.food.externalId,
      externalSource: details.food.externalSource,
    })
    .onConflictDoNothing({ target: [food.externalId, food.externalSource] })
    .returning({ id: food.id });

  if (!inserted) {
    const existing = await tx.query.food.findFirst({
      columns: { id: true },
      where: {
        externalId: details.food.externalId,
        externalSource: details.food.externalSource,
      },
    });
    if (!existing) throw new Error("Food could not be found");
    return existing.id;
  }

  const rows = new Map<string, { nutrientId: string; amountPer100g: string }>();
  for (const n of details.nutrients) {
    const nutrientId = nutrientIds.get(n.nutrient.name);
    if (nutrientId) {
      rows.set(nutrientId, {
        nutrientId,
        amountPer100g: String(n.amountPer100g),
      });
    }
  }
  if (rows.size > 0) {
    await tx
      .insert(foodNutrient)
      .values([...rows.values()].map((r) => ({ foodId: inserted.id, ...r })));
  }
  return inserted.id;
}

export async function ensureServing(
  tx: Tx,
  foodId: string,
  s: { externalId: string; label: string; amountInGrams: number },
) {
  const [inserted] = await tx
    .insert(serving)
    .values({
      foodId,
      externalId: s.externalId,
      label: s.label,
      amountInGrams: String(s.amountInGrams),
    })
    .onConflictDoNothing({ target: [serving.externalId, serving.foodId] })
    .returning({ id: serving.id });
  if (inserted) return inserted.id;

  const existing = await tx.query.serving.findFirst({
    columns: { id: true },
    where: { foodId, externalId: s.externalId },
  });
  if (!existing) throw new Error("Serving not found");
  return existing.id;
}

export async function insertMeal(tx: Tx, userId: string, eatenAt: Date) {
  const [row] = await tx
    .insert(meal)
    .values({ userId, eatenAt })
    .returning({ id: meal.id });
  return row.id;
}

export async function insertMealEntries(
  tx: Tx,
  entries: {
    mealId: string;
    foodId: string;
    servingId: string | null;
    servingQuantity: number | null;
    amountInGrams: number;
  }[],
) {
  await tx.insert(mealEntry).values(
    entries.map((e) => ({
      mealId: e.mealId,
      foodId: e.foodId,
      servingId: e.servingId,
      servingQuantity:
        e.servingQuantity === null ? null : String(e.servingQuantity),
      amountInGrams: String(e.amountInGrams),
    })),
  );
}
