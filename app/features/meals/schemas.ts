import * as z from "zod";
import { externalFoodRef } from "../food/schemas";

export const mealEntryInput = z
  .object({
    food: externalFoodRef,
    serving: z
      .object({ externalId: z.string().min(1), label: z.string().min(1) })
      .nullable(),
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
