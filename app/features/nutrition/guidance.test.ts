import { describe, expect, it } from "vitest";
import type { NutritionProfile } from "@/db/profile-schema";
import { buildNutrientTargets } from "./guidance";

const profile = {
  dateOfBirth: "1994-01-01",
  sex: "female",
  dailyCalories: 2000,
  dailyProteinGrams: 120,
  dailyFatGrams: 60,
  dailyCarbohydrateGrams: 240,
} as NutritionProfile;

describe("nutrient guidance", () => {
  it("personalises energy-based fat and sugar guidance", () => {
    const targets = buildNutrientTargets(profile);

    expect(targets["Saturated fat"]).toEqual({
      amount: expect.closeTo(24.44, 2),
      type: "limit",
    });
    expect(targets["Added sugar"].amount).toBe(25);
    expect(targets["Unsaturated fat"].amount).toBeCloseTo(
      targets["Monounsaturated fat"].amount +
        targets["Polyunsaturated fat"].amount,
    );
  });

  it("uses sex and age reference values where guidance differs", () => {
    const femaleTargets = buildNutrientTargets(profile);
    const maleTargets = buildNutrientTargets({ ...profile, sex: "male" });

    expect(femaleTargets.Iron.amount).toBe(14.8);
    expect(maleTargets.Iron.amount).toBe(8.7);
    expect(femaleTargets.Magnesium.amount).toBe(270);
    expect(maleTargets.Magnesium.amount).toBe(300);
  });
});
