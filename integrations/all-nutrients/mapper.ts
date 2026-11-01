import { externalApiTypes } from "../types";
import { FoodDetailResponse } from "./schema";
import { FoodImportData, FoodNutrient } from "@/app/features/food/schemas";
import { NUTRIENTS, NutrientKey } from "@/app/features/food/nutrients";

const NUTRIENT_IDS: Record<Exclude<NutrientKey, "unsaturatedFat">, number[]> = {
  calories: [1008], // 1062 is the same energy in kJ
  protein: [1003],
  totalFat: [1004],
  saturatedFat: [1258],
  monounsaturatedFat: [1292],
  polyunsaturatedFat: [1293],
  transFat: [1257],
  totalCarbs: [1005, 1050], // by difference, then by summation
  fibre: [1079],
  totalSugars: [2000, 1063],
  addedSugar: [1235],
  iron: [1089],
  calcium: [1087],
  sodium: [1093],
  magnesium: [1090],
  potassium: [1092],
  vitaminA: [1106], // RAE; 1104 is IU
  vitaminC: [1162],
  vitaminD: [1114], // µg; 1110 is IU
  vitaminB12: [1178], // 1246 is "added"
};

function mapNutrients(data: FoodDetailResponse): FoodNutrient[] {
  const byId = new Map(data.nutrients.map((n) => [n.nutrientId, n]));
  const amounts = new Map<NutrientKey, number>();

  for (const [key, ids] of Object.entries(NUTRIENT_IDS) as [
    keyof typeof NUTRIENT_IDS,
    number[],
  ][]) {
    for (const id of ids) {
      const n = byId.get(id);
      if (!n) continue;
      amounts.set(key, n.amount * (100 / n.perAmount));
      break;
    }
  }

  const mono = amounts.get("monounsaturatedFat");
  const poly = amounts.get("polyunsaturatedFat");
  if (mono !== undefined || poly !== undefined) {
    amounts.set("unsaturatedFat", (mono ?? 0) + (poly ?? 0));
  }

  return [...amounts].map(([key, amountPer100g]) => ({
    amountPer100g,
    nutrient: { ...NUTRIENTS[key] },
  }));
}

export function MapApiToFoodDetail(data: FoodDetailResponse): FoodImportData {
  const food = {
    name: data.food.name,
    // the details endpoint is keyed by slug, not id
    externalId: data.food.slug,
    externalSource: externalApiTypes.allthenutrients,
  };
  const servings = data.servingSizes.map((serving) => ({
    label: serving.description,
    amountInGrams: serving.amountGrams,
    externalId: String(serving.id),
  }));

  return { food, nutrients: mapNutrients(data), servings };
}
