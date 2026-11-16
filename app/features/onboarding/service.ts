import { addDays } from "date-fns";
import type { OnboardingInput, PreferencesInput } from "./schemas";
import { calculateNutritionPlan } from "./nutrition-plan";
import * as repository from "./repository";

export async function saveOnboardingProfile(
  userId: string,
  input: OnboardingInput,
) {
  const plan = calculateNutritionPlan(input);
  return repository.upsertNutritionProfile({
    userId,
    ...input,
    heightCm: String(input.heightCm),
    currentWeightKg: String(input.currentWeightKg),
    targetWeightKg: String(input.targetWeightKg),
    requestedWeeklyChangeKg: String(input.requestedWeeklyChangeKg),
    plannedWeeklyChangeKg: String(plan.plannedWeeklyChangeKg),
    dailyCalories: plan.dailyCalories,
    dailyProteinGrams: plan.dailyProteinGrams,
    dailyCarbohydrateGrams: plan.dailyCarbohydrateGrams,
    dailyFatGrams: plan.dailyFatGrams,
    targetDate: plan.targetDate,
  });
}

export async function getOnboardingProfile(userId: string) {
  return repository.findNutritionProfile(userId);
}

export async function getPreferences(userId: string) {
  return repository.findPreferences(userId);
}

export async function savePreferences(
  userId: string,
  input: PreferencesInput,
) {
  return repository.upsertPreferences(userId, input);
}

export async function softDeleteAccount(userId: string, now = new Date()) {
  return repository.scheduleAccountDeletion(userId, now, addDays(now, 30));
}
