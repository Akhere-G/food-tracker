import * as z from "zod";
import type {
  NewFood,
  NewFoodNutrient,
  NewNutrient,
  NewServing,
} from "@/db/food-schema";

export interface FoodImportData {
  food: NewFood;
  nutrients: (Pick<NewFoodNutrient, "amountPer100g"> & {
    nutrient: NewNutrient;
  })[];
  servings: Omit<NewServing, "foodId">[];
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

export const mealEntryInput = z
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

export type MealEntryInput = z.infer<typeof mealEntryInput>;

export const saveMealRequest = z.object({
  eatenAt: z.iso.datetime().optional(),
  mealEntries: z.array(mealEntryInput).min(1, "Add at least one food"),
});

export type SaveMealRequest = z.infer<typeof saveMealRequest>;
