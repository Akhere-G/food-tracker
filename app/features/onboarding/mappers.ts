import type { NutritionProfile } from "@/db/profile-schema";
import type { OnboardingInput } from "./schemas";

export function profileToOnboardingInput(
  profile: NutritionProfile,
): OnboardingInput {
  return {
    dateOfBirth: profile.dateOfBirth,
    sex: profile.sex as OnboardingInput["sex"],
    genderIdentity: profile.genderIdentity,
    heightCm: Number(profile.heightCm),
    currentWeightKg: Number(profile.currentWeightKg),
    targetWeightKg: Number(profile.targetWeightKg),
    goal: profile.goal as OnboardingInput["goal"],
    activityLevel: profile.activityLevel as OnboardingInput["activityLevel"],
    journeyFeeling: profile.journeyFeeling as OnboardingInput["journeyFeeling"],
    biggestChallenge: profile.biggestChallenge as OnboardingInput["biggestChallenge"],
    previousAttempts: profile.previousAttempts,
    nutritionPriorities: profile.nutritionPriorities as OnboardingInput["nutritionPriorities"],
    requestedWeeklyChangeKg: Number(profile.requestedWeeklyChangeKg),
    timezone: profile.timezone,
  };
}
