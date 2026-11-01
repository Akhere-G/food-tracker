import { db } from "@/db";
import type { Tx } from "@/db";
import type { NewMealEntry } from "@/db/food-schema";
import { requireUserId } from "@/lib/auth-session";
import { AppError } from "@/lib/errors";
import type { FoodImportData } from "../food/schemas";
import * as foodService from "../food/service";
import * as repo from "./repository";
import { MealEntryInput, SaveMealRequest } from "./schemas";

type FoodDetails = Map<string, FoodImportData>;

type ResolvedEntry = {
  foodKey: string;
  serving: FoodImportData["servings"][number] | null;
  servingQuantity: number | null;
  grams: number;
};

export async function saveMeal(request: SaveMealRequest) {
  const userId = await requireUserId();
  const details = await loadFoodDetails(request.mealEntries);
  const entries = request.mealEntries.map((e) => resolveEntry(e, details));
  const eatenAt = request.eatenAt ? new Date(request.eatenAt) : new Date();

  return await db.transaction(async (tx) => {
    const foodIds = await foodService.importFoods(tx, details);
    const mealId = await repo.insertMeal(tx, { userId, eatenAt });
    const rows = await buildMealEntryRows(tx, mealId, entries, foodIds);
    await repo.insertMealEntries(tx, rows);
    return { mealId };
  });
}

// Never trust client data: nutrition and servings come from the provider.
async function loadFoodDetails(entries: MealEntryInput[]) {
  return await foodService.getFoodDetailsList(
    entries.map((e) => ({
      source: e.food.externalSource,
      externalId: e.food.externalId,
    })),
  );
}

// Works out the amount in grams, checking the chosen serving really exists.
function resolveEntry(
  entry: MealEntryInput,
  details: FoodDetails,
): ResolvedEntry {
  const key = foodService.foodKey(
    entry.food.externalSource,
    entry.food.externalId,
  );

  if (!entry.serving) {
    return {
      foodKey: key,
      serving: null,
      servingQuantity: null,
      grams: entry.amountInGrams!,
    };
  }

  const food = details.get(key)!;
  const serving = food.servings.find(
    (s) => s.externalId === entry.serving!.externalId,
  );
  if (!serving) {
    throw new AppError(
      `Serving not available for ${food.food.name}.`,
      "validation",
    );
  }
  return {
    foodKey: key,
    serving,
    servingQuantity: entry.servingQuantity!,
    grams: Number(serving.amountInGrams) * entry.servingQuantity!,
  };
}

async function buildMealEntryRows(
  tx: Tx,
  mealId: string,
  entries: ResolvedEntry[],
  foodIds: Map<string, string>,
): Promise<NewMealEntry[]> {
  const rows: NewMealEntry[] = [];
  for (const entry of entries) {
    const foodId = foodIds.get(entry.foodKey)!;
    rows.push({
      mealId,
      foodId,
      servingId: entry.serving
        ? await foodService.importServing(tx, foodId, entry.serving)
        : null,
      servingQuantity:
        entry.servingQuantity === null ? null : String(entry.servingQuantity),
      amountInGrams: String(entry.grams),
    });
  }
  return rows;
}
