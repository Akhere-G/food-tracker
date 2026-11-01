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

export interface FoodImportData {
  food: Food;
  nutrients: FoodNutrient[];
  servings: Serving[];
}

export const searchQuery = z
  .string()
  .trim()
  .min(2, "Enter at least 2 characters");

export const externalFoodRef = z.object({
  externalId: z.string().min(1),
  externalSource: z.string().min(1),
});

export type ExternalFoodRef = z.infer<typeof externalFoodRef>;

export const newMealEntry = z
  .object({
    food: externalFoodRef,
    serving: z.object({ externalId: z.string().min(1) }).nullable(),
    servingQuantity: z.number().positive().nullable(),
    amountInGrams: z.number().positive().nullable(),
  })
  .refine(
    (e) =>
      e.serving
        ? e.servingQuantity !== null
        : e.amountInGrams !== null && e.servingQuantity === null,
    "Provide a serving and quantity, or an amount in grams",
  );

export type NewMealEntry = z.infer<typeof newMealEntry>;

export const saveMealRequest = z.object({
  eatenAt: z.iso.datetime().optional(),
  mealEntries: z.array(newMealEntry).min(1, "Add at least one food"),
});

export type SaveMealRequest = z.infer<typeof saveMealRequest>;
