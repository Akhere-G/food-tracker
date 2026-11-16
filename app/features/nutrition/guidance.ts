import { differenceInYears } from "date-fns";
import type { NutrientKey } from "@/app/features/food/nutrients";
import type { NutritionProfile } from "@/db/profile-schema";

export type TargetType = "goal" | "limit" | "reference";

export type NutrientTarget = {
  amount: number;
  type: TargetType;
};

export type NutrientTargets = Record<NutrientKey, NutrientTarget>;

const gramsFromEnergyShare = (calories: number, share: number, kcalPerGram: number) =>
  (calories * share) / kcalPerGram;

export function buildNutrientTargets(profile: NutritionProfile): NutrientTargets {
  const calories = profile.dailyCalories;
  const femaleEstimate = profile.sex === "female";
  const maleEstimate = profile.sex === "male";
  const age = differenceInYears(
    new Date(),
    new Date(`${profile.dateOfBirth}T12:00:00`),
  );

  return {
    Calories: { amount: calories, type: "goal" },
    Protein: { amount: profile.dailyProteinGrams, type: "goal" },
    "Total fat": { amount: profile.dailyFatGrams, type: "limit" },
    "Total carbohydrates": {
      amount: profile.dailyCarbohydrateGrams,
      type: "goal",
    },
    "Saturated fat": {
      amount: gramsFromEnergyShare(calories, 0.11, 9),
      type: "limit",
    },
    "Monounsaturated fat": {
      amount: gramsFromEnergyShare(calories, 0.13, 9),
      type: "goal",
    },
    "Polyunsaturated fat": {
      amount: gramsFromEnergyShare(calories, 0.065, 9),
      type: "goal",
    },
    "Unsaturated fat": {
      amount: gramsFromEnergyShare(calories, 0.195, 9),
      type: "goal",
    },
    "Trans fat": { amount: 2, type: "limit" },
    Fibre: { amount: 30, type: "goal" },
    "Total sugars": { amount: 90, type: "reference" },
    "Added sugar": {
      amount: gramsFromEnergyShare(calories, 0.05, 4),
      type: "limit",
    },
    Iron: {
      amount: ironTarget(age, femaleEstimate, maleEstimate),
      type: "goal",
    },
    Calcium: { amount: age < 19 ? 1000 : 700, type: "goal" },
    Sodium: { amount: 2400, type: "limit" },
    Magnesium: { amount: femaleEstimate ? 270 : 300, type: "goal" },
    Potassium: { amount: 3500, type: "goal" },
    "Vitamin A": { amount: femaleEstimate ? 600 : 700, type: "goal" },
    "Vitamin C": { amount: 40, type: "goal" },
    "Vitamin D": { amount: 10, type: "goal" },
    "Vitamin B12": { amount: 1.5, type: "goal" },
  };
}

function ironTarget(age: number, femaleEstimate: boolean, maleEstimate: boolean) {
  if (femaleEstimate && age <= 50) return 14.8;
  if (maleEstimate && age < 19) return 11.3;
  if (!femaleEstimate && !maleEstimate) return 14.8;
  return 8.7;
}
