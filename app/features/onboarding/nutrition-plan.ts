import { addDays, differenceInYears } from "date-fns";
import type { OnboardingInput } from "./schemas";
import {
  ACTIVITY_MULTIPLIERS,
  NHS_RECOMMENDED_GAIN_CALORIES,
  NHS_RECOMMENDED_MAX_LOSS_KG,
} from "./constants";

const CALORIES_PER_KILOGRAM = 7700;

export type NutritionPlan = {
  dailyCalories: number;
  dailyProteinGrams: number;
  dailyCarbohydrateGrams: number;
  dailyFatGrams: number;
  plannedWeeklyChangeKg: number;
  targetDate: string | null;
  showsPaceWarning: boolean;
};

function metabolicSexAdjustment(sex: OnboardingInput["sex"]) {
  if (sex === "male") return 5;
  if (sex === "female") return -161;
  return -78;
}

function ageOn(dateOfBirth: string, now: Date) {
  return differenceInYears(now, new Date(`${dateOfBirth}T12:00:00`));
}

export function calculateNutritionPlan(
  input: OnboardingInput,
  now = new Date(),
): NutritionPlan {
  const age = ageOn(input.dateOfBirth, now);
  const bmr =
    10 * input.currentWeightKg +
    6.25 * input.heightCm -
    5 * age +
    metabolicSexAdjustment(input.sex);
  const maintenanceCalories = bmr * ACTIVITY_MULTIPLIERS[input.activityLevel];
  const requestedDailyAdjustment =
    (input.requestedWeeklyChangeKg * CALORIES_PER_KILOGRAM) / 7;

  const isLoss = input.goal === "lose";
  const isGain = input.goal === "gain";
  const safeAdjustment = isLoss
    ? Math.min(requestedDailyAdjustment, 1100)
    : isGain
      ? Math.min(requestedDailyAdjustment, NHS_RECOMMENDED_GAIN_CALORIES)
      : 0;
  const calories = isLoss
    ? maintenanceCalories - safeAdjustment
    : maintenanceCalories + safeAdjustment;
  const dailyCalories = Math.max(1200, Math.round(calories / 10) * 10);
  const dailyProteinGrams = Math.round(input.currentWeightKg * 1.6);
  const dailyFatGrams = Math.max(40, Math.round((dailyCalories * 0.25) / 9));
  const dailyCarbohydrateGrams = Math.max(
    0,
    Math.round(
      (dailyCalories - dailyProteinGrams * 4 - dailyFatGrams * 9) / 4,
    ),
  );
  const plannedWeeklyChangeKg =
    input.goal === "maintain"
      ? 0
      : Number(((safeAdjustment * 7) / CALORIES_PER_KILOGRAM).toFixed(2));
  const kilogramsToGoal = Math.abs(
    input.currentWeightKg - input.targetWeightKg,
  );
  const daysToGoal = plannedWeeklyChangeKg
    ? Math.ceil((kilogramsToGoal / plannedWeeklyChangeKg) * 7)
    : 0;

  return {
    dailyCalories,
    dailyProteinGrams,
    dailyCarbohydrateGrams,
    dailyFatGrams,
    plannedWeeklyChangeKg,
    targetDate: daysToGoal
      ? addDays(now, daysToGoal).toISOString().slice(0, 10)
      : null,
    showsPaceWarning:
      input.requestedWeeklyChangeKg > NHS_RECOMMENDED_MAX_LOSS_KG,
  };
}
