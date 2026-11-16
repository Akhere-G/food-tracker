import { describe, expect, it } from "vitest";
import type { MealEntryData } from "./types";
import { calculateDraftNutrients, calculateNutrients } from "./utils";

const chicken: MealEntryData = {
  mealEntryInput: {
    food: { externalId: "chicken", externalSource: "test" },
    serving: null,
    servingQuantity: null,
    amountInGrams: 150,
  },
  foodImportData: {
    food: { name: "Chicken", externalId: "chicken", externalSource: "test" },
    servings: [],
    nutrients: [
      { amountPer100g: "200", nutrient: { name: "Calories", unit: "kcal" } },
      { amountPer100g: "30", nutrient: { name: "Protein", unit: "g" } },
      { amountPer100g: "8", nutrient: { name: "Total fat", unit: "g" } },
    ],
  },
};

describe("nutrition totals", () => {
  it("returns every macro with zero values when no meals exist", () => {
    const totals = calculateNutrients([]);
    expect(Object.keys(totals)).toEqual([
      "Calories",
      "Protein",
      "Total fat",
      "Total carbohydrates",
    ]);
    expect(totals.Calories.amount).toBe(0);
  });

  it("reflects unsaved meal quantities", () => {
    const totals = calculateDraftNutrients([chicken]);
    expect(totals.Calories.amount).toBe(300);
    expect(totals.Protein.amount).toBe(45);
    expect(totals["Total fat"].amount).toBe(12);
    expect(totals["Total carbohydrates"].amount).toBe(0);
  });
});
