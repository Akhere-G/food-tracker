import * as z from "zod";
import { externalFoodRef } from "../food/schemas";

const isoDateTime = z.iso.datetime({ offset: true });

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

const mealEntries = z
  .array(mealEntryInput)
  .min(1, "Add at least one food")
  .superRefine((entries, context) => {
    const foodReferences = new Set<string>();

    entries.forEach((entry, index) => {
      const reference = JSON.stringify([
        entry.food.externalSource,
        entry.food.externalId,
      ]);

      if (foodReferences.has(reference)) {
        context.addIssue({
          code: "custom",
          message: "Each food can only appear once in a meal",
          path: [index, "food"],
        });
      }

      foodReferences.add(reference);
    });
  });

export const saveMealRequest = z.object({
  eatenAt: isoDateTime.optional(),
  mealEntries,
});

export type SaveMealRequest = z.infer<typeof saveMealRequest>;

export const replaceMealRequest = saveMealRequest.extend({
  eatenAt: isoDateTime,
});

export type ReplaceMealRequest = z.infer<typeof replaceMealRequest>;
