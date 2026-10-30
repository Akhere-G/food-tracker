import { externalApiTypes } from "../types";
import { FoodDetailResponse } from "./schema";
import { FoodImportData } from "@/app/features/food/types";

export function MapApiToFoodDetail(data: FoodDetailResponse): FoodImportData {
  const food = {
    name: data.food.name,
    externalId: data.food.id,
    externalSource: externalApiTypes.allthenutrients,
  };
  const nutrients = data.nutrients.map((nutrient) => ({
    amountPer100g: nutrient.amount * (100 / nutrient.perAmount),
    nutrient: {
      name: nutrient.name,
      unit: nutrient.unit,
    },
  }));
  const servings = data.servingSizes.map((serving) => ({
    label: serving.description,
    amountInGrams: serving.amountGrams,
    externalId: String(serving.id),
  }));

  return { food, nutrients, servings };
}
