import { externalApiTypes } from "../types";
import { FoodDetailResponse } from "./schema";
import { FoodImportData } from "@/app/features/food/schemas";
import { NUTRIENTS, NutrientKey } from "@/app/features/food/nutrients";

const NUTRIENT_IDS: Record<Exclude<NutrientKey, "unsaturatedFat">, number[]> = {
  Calories: [1008], // 1062 is the same energy in kJ
  Protein: [1003],
  "Total fat": [1004],
  "Saturated fat": [1258],
  "Unsaturated fat": [1258],
  "Monounsaturated fat": [1292],
  "Polyunsaturated fat": [1293],
  "Trans fat": [1257],
  "Total carbohydrates": [1005, 1050], // by difference, then by summation
  Fibre: [1079],
  "Total sugars": [2000, 1063],
  "Added sugar": [1235],
  Iron: [1089],
  Calcium: [1087],
  Sodium: [1093],
  Magnesium: [1090],
  Potassium: [1092],
  "Vitamin A": [1106], // RAE; 1104 is IU
  "Vitamin C": [1162],
  "Vitamin D": [1114], // µg; 1110 is IU
  "Vitamin B12": [1178], // 1246 is "added"
};

function mapNutrients(data: FoodDetailResponse): FoodImportData["nutrients"] {
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

  const mono = amounts.get("Monounsaturated fat");
  const poly = amounts.get("Polyunsaturated fat");
  if (mono !== undefined || poly !== undefined) {
    amounts.set("Unsaturated fat", (mono ?? 0) + (poly ?? 0));
  }

  return [...amounts].map(([key, amountPer100g]) => ({
    amountPer100g: String(amountPer100g),
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
    amountInGrams: String(serving.amountGrams),
    externalId: String(serving.id),
  }));

  return { food, nutrients: mapNutrients(data), servings };
}
