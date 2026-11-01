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
