import { db } from "@/db";
import type { Tx } from "@/db";
import type { NewServing } from "@/db/food-schema";
import { externalApiTypes, ExternalApiTypes } from "@/integrations/types";
import { requireUserId } from "@/lib/auth-session";
import { AppError } from "@/lib/errors";
import { FoodApiProviderFactory } from "./providers";
import * as repo from "./repository";
import { FoodImportData } from "./schemas";
import { FoodSearchItem } from "@/integrations/all-nutrients/schema";

const DEFAULT_SOURCE: ExternalApiTypes = externalApiTypes.allthenutrients;

function providerFor(source: string) {
  if (!(source in externalApiTypes)) {
    throw new AppError(`Unknown food source: ${source}`, "validation");
  }
  return FoodApiProviderFactory(source as ExternalApiTypes);
}

export function foodKey(source: string, externalId: string) {
  return `${source}:${externalId}`;
}

export async function searchFoods(query: string): Promise<FoodSearchItem[]> {
  await requireUserId();
  return await providerFor(DEFAULT_SOURCE).searchFoods(query);
}

export async function getFoodDetails(externalId: string) {
  await requireUserId();
  return await providerFor(DEFAULT_SOURCE).getFoodDetails(externalId);
}

export async function getFoodDetailsList(
  refs: { source: string; externalId: string }[],
) {
  const unique = new Map(
    refs.map((ref) => [foodKey(ref.source, ref.externalId), ref]),
  );
  const details = new Map<string, FoodImportData>();
  try {
    await Promise.all(
      [...unique].map(async ([key, ref]) => {
        details.set(
          key,
          await providerFor(ref.source).getFoodDetails(ref.externalId),
        );
      }),
    );
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(
      "Could not load details for one of the foods.",
      "external_api",
      { cause: err },
    );
  }
  return details;
}

export async function importFoods(
  tx: Tx,
  details: Map<string, FoodImportData>,
) {
  const nutrientIds = await repo.getNutrientIds(
    tx,
    [...details.values()].flatMap((d) => d.nutrients.map((n) => n.nutrient)),
  );
  const foodIds = new Map<string, string>();
  for (const [key, d] of details) {
    foodIds.set(key, await repo.ensureFood(tx, d, nutrientIds));
  }
  return foodIds;
}

export async function importServing(
  tx: Tx,
  foodId: string,
  serving: Omit<NewServing, "foodId">,
) {
  return await repo.ensureServing(tx, foodId, serving);
}

export async function getFood(foodId: string) {
  return await db.query.food.findFirst({
    where: { id: foodId },
    with: { nutrients: { with: { nutrient: true } }, servings: true },
  });
}
