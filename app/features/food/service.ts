import { db } from "@/db";
import { externalApiTypes, ExternalApiTypes } from "@/integrations/types";
import { getSession } from "@/lib/auth-session";
import { AppError } from "@/lib/errors";
import { FoodApiProviderFactory } from "./providers";
import * as repo from "./repository";
import { FoodImportData, SaveMealRequest } from "./schemas";

const DEFAULT_SOURCE: ExternalApiTypes = externalApiTypes.allthenutrients;

function providerFor(source: string) {
  if (!(source in externalApiTypes)) {
    throw new AppError(`Unknown food source: ${source}`, "validation");
  }
  return FoodApiProviderFactory(source as ExternalApiTypes);
}

async function requireUserId() {
  const session = await getSession();
  if (!session) throw new AppError("You need to be signed in.", "unauthorized");
  return session.user.id;
}

export async function searchFoods(query: string) {
  await requireUserId();
  return await providerFor(DEFAULT_SOURCE).searchFoods(query);
}

export async function getFoodDetails(externalId: string) {
  await requireUserId();
  return await providerFor(DEFAULT_SOURCE).getFoodDetails(externalId);
}

export async function getFood(foodId: string) {
  return await db.query.food.findFirst({
    where: { id: foodId },
    with: { nutrients: { with: { nutrient: true } }, servings: true },
  });
}

export async function saveMeal(request: SaveMealRequest) {
  const userId = await requireUserId();

  const refs = new Map<string, { source: string; externalId: string }>();
  for (const e of request.mealEntries) {
    refs.set(`${e.food.externalSource}:${e.food.externalId}`, {
      source: e.food.externalSource,
      externalId: e.food.externalId,
    });
  }
  const details = new Map<string, FoodImportData>();
  try {
    await Promise.all(
      [...refs].map(async ([key, ref]) => {
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

  const resolved = request.mealEntries.map((e) => {
    const d = details.get(`${e.food.externalSource}:${e.food.externalId}`)!;
    if (!e.serving) {
      return {
        details: d,
        serving: null,
        quantity: null,
        grams: e.amountInGrams!,
      };
    }
    const s = d.servings.find((s) => s.externalId === e.serving!.externalId);
    if (!s) {
      throw new AppError(
        `Serving not available for ${d.food.name}.`,
        "validation",
      );
    }
    return {
      details: d,
      serving: s,
      quantity: e.servingQuantity!,
      grams: s.amountInGrams * e.servingQuantity!,
    };
  });

  const eatenAt = request.eatenAt ? new Date(request.eatenAt) : new Date();

  return await db.transaction(async (tx) => {
    const nutrientIds = await repo.getNutrientIds(
      tx,
      [...details.values()].flatMap((d) => d.nutrients.map((n) => n.nutrient)),
    );

    const foodIds = new Map<string, string>();
    for (const [key, d] of details) {
      foodIds.set(key, await repo.ensureFood(tx, d, nutrientIds));
    }

    const mealId = await repo.insertMeal(tx, userId, eatenAt);
    const entries = [];
    for (const r of resolved) {
      const foodId = foodIds.get(
        `${r.details.food.externalSource}:${r.details.food.externalId}`,
      )!;
      entries.push({
        mealId,
        foodId,
        servingId: r.serving
          ? await repo.ensureServing(tx, foodId, r.serving)
          : null,
        servingQuantity: r.quantity,
        amountInGrams: r.grams,
      });
    }
    await repo.insertMealEntries(tx, entries);

    return { mealId };
  });
}
