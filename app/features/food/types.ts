import * as z from "zod";

export const food = z.object({
  name: z.string(),
  externalId: z.string(),
  externalSource: z.string(),
});

export type Food = z.infer<typeof food>;

export const nutrient = z.object({
  name: z.string(),
  unit: z.string(),
});

export type Nutrient = z.infer<typeof nutrient>;

export const foodNutrient = z.object({
  amountPer100g: z.number(),
  nutrient: nutrient,
});

export type FoodNutrient = z.infer<typeof foodNutrient>;

export const serving = z.object({
  label: z.string(),
  amountInGrams: z.number(),
  externalId: z.string(),
});

export type Serving = z.infer<typeof serving>;

export const meal = z.object({
  eatenAt: z.string(),
});

export type Meal = z.infer<typeof meal>;

export const mealEntry = z.object({
  amountInGrams: z.number(),
  serving: serving.nullable(),
  servingQuantity: z.number().nullable(),
});

export type MealEntry = z.infer<typeof mealEntry>;

export const newMealEntry = mealEntry.extend({
  food: food,
});

export type NewMealEntry = z.infer<typeof newMealEntry>;

export interface FoodImportData {
  food: Food;
  nutrients: FoodNutrient[];
  servings: Serving[];
}

export const saveMealRequest = z.object({
  mealEntries: z.array(newMealEntry),
});

export type SaveMealRequest = z.infer<typeof saveMealRequest>;
